// Maps the 1-10 backend scale to human, expressive labels for the UI —
// per the locked decision that raw numbers read clinical.
export const MOOD_SCALE = [
  { score: 1, label: 'Overwhelmed' },
  { score: 2, label: 'Very low' },
  { score: 3, label: 'Low' },
  { score: 4, label: 'Struggling' },
  { score: 5, label: 'Okay' },
  { score: 6, label: 'Fine' },
  { score: 7, label: 'Good' },
  { score: 8, label: 'Great' },
  { score: 9, label: 'Wonderful' },
  { score: 10, label: 'On top of the world' },
] as const;

export const MOOD_TAGS = [
  'work', 'school', 'relationships', 'family',
  'sleep', 'health', 'money', 'social', 'productivity', 'personal',
] as const;