export interface ExerciseDefinition {
    id: string;
    title: string;
    description: string;
    durationMin: number;
    category: 'breathing' | 'grounding';
}
export declare const EXERCISE_LIBRARY: ExerciseDefinition[];
