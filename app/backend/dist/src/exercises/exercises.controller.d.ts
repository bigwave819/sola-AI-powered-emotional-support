import { ExercisesService } from './exercises.service';
import { CompleteExerciseDto } from './dto/complete-exercise.dto';
export declare class ExercisesController {
    private exercisesService;
    constructor(exercisesService: ExercisesService);
    list(): import("./exercise-library").ExerciseDefinition[];
    getOne(id: string): import("./exercise-library").ExerciseDefinition;
    complete(req: any, id: string, dto: CompleteExerciseDto): Promise<{
        id: string;
        userId: string;
        exerciseId: string;
        durationSeconds: number;
        completedAt: Date;
    }>;
}
