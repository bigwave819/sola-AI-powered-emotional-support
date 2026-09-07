import { color, font, fontSize, space, radius, elevation, blur } from './tokens';

export const theme = {
  color, font, fontSize, space, radius, elevation, blur,
} as const;

export type Theme = typeof theme;