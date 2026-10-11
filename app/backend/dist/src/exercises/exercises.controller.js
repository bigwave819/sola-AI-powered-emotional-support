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
exports.ExercisesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const exercises_service_1 = require("./exercises.service");
const complete_exercise_dto_1 = require("./dto/complete-exercise.dto");
let ExercisesController = class ExercisesController {
    exercisesService;
    constructor(exercisesService) {
        this.exercisesService = exercisesService;
    }
    list() {
        return this.exercisesService.list();
    }
    getOne(id) {
        return this.exercisesService.getOne(id);
    }
    complete(req, id, dto) {
        return this.exercisesService.complete(req.user.userId, id, dto.durationSeconds);
    }
};
exports.ExercisesController = ExercisesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all exercises in the library' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of exercises' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExercisesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single exercise by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exercise id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The exercise' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exercise not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExercisesController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Record a completed exercise session for the current user' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exercise id' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Session recorded' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exercise not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complete_exercise_dto_1.CompleteExerciseDto]),
    __metadata("design:returntype", void 0)
], ExercisesController.prototype, "complete", null);
exports.ExercisesController = ExercisesController = __decorate([
    (0, swagger_1.ApiTags)('exercises'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('exercises'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [exercises_service_1.ExercisesService])
], ExercisesController);
//# sourceMappingURL=exercises.controller.js.map