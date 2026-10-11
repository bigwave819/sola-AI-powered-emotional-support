"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const google_login_dto_1 = require("./dto/google-login.dto");
const apple_login_dto_1 = require("./dto/apple-login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const request_otp_dto_1 = require("./dto/request-otp.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    loginWithGoogle(dto) {
        return this.authService.loginWithGoogle(dto.idToken);
    }
    loginWithApple(dto) {
        return this.authService.loginWithApple(dto.identityToken);
    }
    refresh(dto) {
        return this.authService.refresh(dto.refreshToken);
    }
    requestOtp(dto) {
        return this.authService.requestOtp(dto.email);
    }
    verifyOtp(dto) {
        return this.authService.verifyOtp(dto.email, dto.code);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('google'),
    (0, swagger_1.ApiOperation)({ summary: 'Sign in with a Google identity token' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tokens issued' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid Google token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_login_dto_1.GoogleLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginWithGoogle", null);
__decorate([
    (0, common_1.Post)('apple'),
    (0, swagger_1.ApiOperation)({ summary: 'Sign in with an Apple identity token' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tokens issued' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid Apple token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apple_login_dto_1.AppleLoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginWithApple", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Rotate a refresh token into a new access/refresh pair' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'New tokens issued' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('otp/request'),
    (0, swagger_1.ApiOperation)({ summary: 'Email a 6-digit OTP code to the given address' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Code sent' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_otp_dto_1.RequestOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "requestOtp", null);
__decorate([
    (0, common_1.Post)('otp/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a 6-digit OTP code and issue tokens' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tokens issued' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired code' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyOtp", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map