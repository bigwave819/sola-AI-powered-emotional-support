"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const nanoid_1 = require("nanoid");
const google_auth_library_1 = require("google-auth-library");
const apple_signin_auth_1 = __importDefault(require("apple-signin-auth"));
const resend_1 = require("resend");
const client_1 = require("../db/client");
const users_1 = require("../db/schema/users");
const drizzle_orm_1 = require("drizzle-orm");
const crypto = __importStar(require("crypto"));
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
let AuthService = class AuthService {
    jwt;
    constructor(jwt) {
        this.jwt = jwt;
    }
    async requestMagicLink(email) {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY is not configured — magic link emails cannot be sent.');
        }
        const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
        const token = (0, nanoid_1.nanoid)(32);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await client_1.db.insert(users_1.magicLinkTokens).values({ email, token, expiresAt });
        const link = `${process.env.MAGIC_LINK_BASE_URL}?token=${token}`;
        await resend.emails.send({
            from: process.env.MAGIC_LINK_FROM_EMAIL,
            to: email,
            subject: 'Your Sola sign-in link',
            html: `<p>Tap below to sign in. This link expires in 15 minutes.</p><p><a href="${link}">Sign in to Sola</a></p>`,
        });
        return { sent: true };
    }
    async verifyMagicLink(token) {
        const [record] = await client_1.db
            .select()
            .from(users_1.magicLinkTokens)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(users_1.magicLinkTokens.token, token), (0, drizzle_orm_1.isNull)(users_1.magicLinkTokens.usedAt), (0, drizzle_orm_1.gt)(users_1.magicLinkTokens.expiresAt, new Date())));
        if (!record)
            throw new common_1.UnauthorizedException('Invalid or expired link');
        await client_1.db
            .update(users_1.magicLinkTokens)
            .set({ usedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(users_1.magicLinkTokens.id, record.id));
        const { user, isNewUser } = await this.findOrCreateUser(record.email, 'email');
        return this.issueTokens(user.id, isNewUser);
    }
    async loginWithGoogle(idToken) {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.email)
            throw new common_1.UnauthorizedException('Invalid Google token');
        const { user, isNewUser } = await this.findOrCreateUser(payload.email, 'google');
        return this.issueTokens(user.id, isNewUser);
    }
    async loginWithApple(identityToken) {
        const payload = await apple_signin_auth_1.default.verifyIdToken(identityToken, {
            audience: process.env.APPLE_CLIENT_ID,
        });
        if (!payload?.email)
            throw new common_1.UnauthorizedException('Invalid Apple token');
        const { user, isNewUser } = await this.findOrCreateUser(payload.email, 'apple');
        return this.issueTokens(user.id, isNewUser);
    }
    async findOrCreateUser(email, provider) {
        const [existing] = await client_1.db.select().from(users_1.users).where((0, drizzle_orm_1.eq)(users_1.users.email, email));
        if (existing)
            return { user: existing, isNewUser: false };
        const [created] = await client_1.db
            .insert(users_1.users)
            .values({ email, authProvider: provider })
            .returning();
        return { user: created, isNewUser: true };
    }
    async issueTokens(userId, isNewUser) {
        const accessToken = this.jwt.sign({ sub: userId }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
        const rawRefreshToken = (0, nanoid_1.nanoid)(64);
        const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await client_1.db.insert(users_1.refreshTokens).values({ userId, tokenHash, expiresAt });
        return { accessToken, refreshToken: rawRefreshToken, userId, isNewUser };
    }
    async refresh(rawRefreshToken) {
        const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
        const [record] = await client_1.db
            .select()
            .from(users_1.refreshTokens)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(users_1.refreshTokens.tokenHash, tokenHash), (0, drizzle_orm_1.isNull)(users_1.refreshTokens.revokedAt), (0, drizzle_orm_1.gt)(users_1.refreshTokens.expiresAt, new Date())));
        if (!record)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        await client_1.db
            .update(users_1.refreshTokens)
            .set({ revokedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(users_1.refreshTokens.id, record.id));
        return this.issueTokens(record.userId, false);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map