"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../db/client");
const exercises_1 = require("../db/schema/exercises");
const exercise_library_1 = require("./exercise-library");
let ExercisesService = class ExercisesService {
    list() {
        return exercise_library_1.EXERCISE_LIBRARY;
    }
    getOne(id) {
        const exercise = exercise_library_1.EXERCISE_LIBRARY.find((e) => e.id === id);
        if (!exercise)
            throw new common_1.NotFoundException('Exercise not found');
        return exercise;
    }
    async complete(userId, exerciseId, durationSeconds) {
        this.getOne(exerciseId);
        const [session] = await client_1.db
            .insert(exercises_1.exerciseSessions)
            .values({ userId, exerciseId, durationSeconds })
            .returning();
        return session;
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)()
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map