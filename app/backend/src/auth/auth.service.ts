import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';
import { Resend } from 'resend';
import { db } from '../db/client';
import { users, magicLinkTokens, refreshTokens } from '../db/schema/users';
import { eq, and, isNull, gt } from 'drizzle-orm';
import * as crypto from 'crypto';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const resend = new Resend(process.env.RESEND_API_KEY);

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  // ---------- MAGIC LINK ----------

  async requestMagicLink(email: string) {
    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await db.insert(magicLinkTokens).values({ email, token, expiresAt });

    const link = `${process.env.MAGIC_LINK_BASE_URL}?token=${token}`;

    await resend.emails.send({
      from: process.env.MAGIC_LINK_FROM_EMAIL!,
      to: email,
      subject: 'Your Sola sign-in link',
      html: `<p>Tap below to sign in. This link expires in 15 minutes.</p><p><a href="${link}">Sign in to Sola</a></p>`,
    });

    return { sent: true };
  }

  async verifyMagicLink(token: string) {
    const [record] = await db
      .select()
      .from(magicLinkTokens)
      .where(
        and(
          eq(magicLinkTokens.token, token),
          isNull(magicLinkTokens.usedAt),
          gt(magicLinkTokens.expiresAt, new Date()),
        ),
      );

    if (!record) throw new UnauthorizedException('Invalid or expired link');

    await db
      .update(magicLinkTokens)
      .set({ usedAt: new Date() })
      .where(eq(magicLinkTokens.id, record.id));

    const { user, isNewUser } = await this.findOrCreateUser(record.email, 'email');
    return this.issueTokens(user.id, isNewUser);
  }

  // ---------- GOOGLE ----------

  async loginWithGoogle(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new UnauthorizedException('Invalid Google token');

    const { user, isNewUser } = await this.findOrCreateUser(payload.email, 'google');
    return this.issueTokens(user.id, isNewUser);
  }

  // ---------- APPLE ----------

  async loginWithApple(identityToken: string) {
    const payload = await appleSignin.verifyIdToken(identityToken, {
      audience: process.env.APPLE_CLIENT_ID,
    });
    if (!payload?.email) throw new UnauthorizedException('Invalid Apple token');

    const { user, isNewUser } = await this.findOrCreateUser(payload.email, 'apple');
    return this.issueTokens(user.id, isNewUser);
  }

  // ---------- SHARED ----------

  private async findOrCreateUser(email: string, provider: string) {
    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing) return { user: existing, isNewUser: false };

    const [created] = await db
      .insert(users)
      .values({ email, authProvider: provider })
      .returning();
    return { user: created, isNewUser: true };
  }

  private async issueTokens(userId: string, isNewUser: boolean) {
    const accessToken = this.jwt.sign(
      { sub: userId },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_EXPIRES_IN } as JwtSignOptions,
    );

    const rawRefreshToken = nanoid(64);
    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({ userId, tokenHash, expiresAt });

    return { accessToken, refreshToken: rawRefreshToken, userId, isNewUser };
  }

  async refresh(rawRefreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    const [record] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.tokenHash, tokenHash),
          isNull(refreshTokens.revokedAt),
          gt(refreshTokens.expiresAt, new Date()),
        ),
      );

    if (!record) throw new UnauthorizedException('Invalid refresh token');

    // rotate: revoke old, issue new
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, record.id));

    return this.issueTokens(record.userId, false);
  }
}