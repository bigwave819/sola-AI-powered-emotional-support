import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';
import { Resend } from 'resend';
import { db } from '../db/client';
import { users, refreshTokens } from '../db/schema/users';
import { otpCodes } from '../db/schema/otp';
import { eq, and, isNull, gt, desc } from 'drizzle-orm';
import * as crypto from 'crypto';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

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

  // ---------- OTP ----------

  async requestOtp(email: string) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured — OTP emails cannot be sent.');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await db.insert(otpCodes).values({ email, codeHash, expiresAt });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.MAGIC_LINK_FROM_EMAIL!,
      to: email,
      subject: 'Your Sola verification code',
      html: `<p>Your Sola verification code is:</p><h2 style="letter-spacing: 4px;">${code}</h2><p>This code expires in 10 minutes.</p>`,
    });

    return { sent: true };
  }

  async verifyOtp(email: string, code: string) {
    const [record] = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          isNull(otpCodes.usedAt),
          gt(otpCodes.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);

    if (!record) {
      throw new UnauthorizedException('Code expired or not found. Request a new one.');
    }

    if (record.attempts >= 5) {
      throw new UnauthorizedException('Too many attempts. Request a new code.');
    }

    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    if (codeHash !== record.codeHash) {
      await db.update(otpCodes).set({ attempts: record.attempts + 1 }).where(eq(otpCodes.id, record.id));
      throw new UnauthorizedException('Incorrect code.');
    }

    await db.update(otpCodes).set({ usedAt: new Date() }).where(eq(otpCodes.id, record.id));

    const { user, isNewUser } = await this.findOrCreateUser(email, 'email');
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