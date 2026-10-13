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
exports.MoodController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const mood_service_1 = require("./mood.service");
const create_mood_dto_1 = require("./dto/create-mood.dto");
let MoodController = class MoodController {
    moodService;
    constructor(moodService) {
        this.moodService = moodService;
    }
    create(req, dto) {
        return this.moodService.create(req.user.userId, dto);
    }
    history(req, limit) {
        const n = Number.parseInt(limit ?? '', 10);
        const safe = Number.isFinite(n) ? Math.min(Math.max(n, 1), 500) : 30;
        return this.moodService.history(req.user.userId, safe);
    }
};
exports.MoodController = MoodController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a mood check-in entry' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mood entry created' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_mood_dto_1.CreateMoodDto]),
    __metadata("design:returntype", void 0)
], MoodController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: "List the current user's mood check-in history (newest first)" }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Max entries to return (1-500, default 30)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of mood entries' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MoodController.prototype, "history", null);
exports.MoodController = MoodController = __decorate([
    (0, swagger_1.ApiTags)('mood'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('mood'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [mood_service_1.MoodService])
], MoodController);
//# sourceMappingURL=mood.controller.js.map