export declare class ExercisesService {
    list(): import("./exercise-library").ExerciseDefinition[];
    getOne(id: string): import("./exercise-library").ExerciseDefinition;
    complete(userId: string, exerciseId: string, durationSeconds: number): Promise<{
        id: string;
        userId: string;
        exerciseId: string;
        durationSeconds: number;
        completedAt: Date;
    }>;
}
