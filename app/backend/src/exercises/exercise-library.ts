export interface ExerciseDefinition {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  category: 'breathing' | 'grounding';
}

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  {
    id: 'breathing-basic',
    title: 'A quiet breath',
    description: 'A simple guided breathing pattern to settle your nervous system.',
    durationMin: 3,
    category: 'breathing',
  },
  {
    id: 'grounding-54321',
    title: 'Come back to now',
    description: 'A grounding exercise using your five senses to settle an overwhelmed mind.',
    durationMin: 4,
    category: 'grounding',
  },
];