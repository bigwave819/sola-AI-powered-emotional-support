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
exports.InsightsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const insights_service_1 = require("./insights.service");
let InsightsController = class InsightsController {
    insightsService;
    constructor(insightsService) {
        this.insightsService = insightsService;
    }
    weekly(req) {
        return this.insightsService.weekly(req.user.userId);
    }
    suggestedReminderHour(req) {
        return this.insightsService.suggestedReminderHour(req.user.userId);
    }
};
exports.InsightsController = InsightsController;
__decorate([
    (0, common_1.Get)('weekly'),
    (0, swagger_1.ApiOperation)({ summary: 'Get weekly mood/journal insights for the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Weekly insight summary' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InsightsController.prototype, "weekly", null);
__decorate([
    (0, common_1.Get)('suggested-reminder-hour'),
    (0, swagger_1.ApiOperation)({ summary: 'Suggest an hour of day for check-in reminders, based on the user\u2019s history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Suggested reminder hour' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InsightsController.prototype, "suggestedReminderHour", null);
exports.InsightsController = InsightsController = __decorate([
    (0, swagger_1.ApiTags)('insights'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('insights'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [insights_service_1.InsightsService])
], InsightsController);
//# sourceMappingURL=insights.controller.js.map