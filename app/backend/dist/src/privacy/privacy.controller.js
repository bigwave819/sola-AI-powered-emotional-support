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
exports.PrivacyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const privacy_service_1 = require("./privacy.service");
let PrivacyController = class PrivacyController {
    privacyService;
    constructor(privacyService) {
        this.privacyService = privacyService;
    }
    export(req) {
        return this.privacyService.exportUserData(req.user.userId);
    }
    deleteAccount(req) {
        return this.privacyService.deleteAccount(req.user.userId);
    }
};
exports.PrivacyController = PrivacyController;
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.Header)('Content-Type', 'application/json'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="sola-export.json"'),
    (0, swagger_1.ApiOperation)({ summary: 'Download a full portable export of the current user\u2019s data (JSON file)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User data export as a downloadable JSON file' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PrivacyController.prototype, "export", null);
__decorate([
    (0, common_1.Delete)('account'),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently delete the current user\u2019s account and all associated data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Account deleted (cascade removes mood, journal, exercises, tokens, safety events)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PrivacyController.prototype, "deleteAccount", null);
exports.PrivacyController = PrivacyController = __decorate([
    (0, swagger_1.ApiTags)('privacy'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('privacy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [privacy_service_1.PrivacyService])
], PrivacyController);
//# sourceMappingURL=privacy.controller.js.map