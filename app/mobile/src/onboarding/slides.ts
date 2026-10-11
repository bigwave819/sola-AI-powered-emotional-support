import type { ImageSourcePropType } from 'react-native';
import type { ShapeName } from './shapes';

export type SlideKind = 'fullbleed' | 'shaped' | 'fade' | 'final';

export interface SlideData {
  id: string;
  kind: SlideKind;
  tone: 'light' | 'dark';
  title: string;
  subtitle?: string;
  image: ImageSourcePropType;
  // for kind 'shaped' / 'fade':
  shape?: ShapeName;
  top?: number; // region start, fraction of screen height
  regionHeight?: number; // region height, fraction of screen height
  focus?: 'top' | 'center' | 'bottom'; // which part of the photo to keep when cropping
}

export const SLIDES: SlideData[] = [
  {
    id: 'loud',
    kind: 'fullbleed',
    tone: 'dark',
    title: 'Your mind\ngets loud.',
    subtitle: 'You don’t always have to\nfigure it out alone.',
    image: require('../../assets/onboarding/slide1-bg.png'),
  },
  {
    id: 'place',
    kind: 'shaped',
    tone: 'light',
    title: 'Sometimes,\nyou just need\na place to put it.',
    image: require('../../assets/onboarding/slide2-photo.png'),
    shape: 'blob',
    top: 0.317,
    regionHeight: 0.54,
    focus: 'bottom', // keeps the table scene, drops the baked-in headline area
  },
  {
    id: 'write',
    kind: 'shaped',
    tone: 'light',
    title: 'Write what\nyou’re carrying.',
    subtitle: 'No judgment. No perfect\nwords required.',
    image: require('../../assets/onboarding/slide3-art.png'),
    shape: 'diagonal',
    top: 0.34,
    regionHeight: 0.66,
    focus: 'center',
  },
  {
    id: 'reflect',
    kind: 'shaped',
    tone: 'light',
    title: 'Then, let Sola\nreflect with you.',
    subtitle: 'A little perspective can change\nthe way you see the moment.',
    image: require('../../assets/onboarding/slide4-art.png'),
    shape: 'blob2',
    top: 0.34,
    regionHeight: 0.66,
    focus: 'center',
  },
  {
    id: 'patterns',
    kind: 'shaped',
    tone: 'light',
    title: 'Notice the patterns.',
    subtitle: 'Understand what keeps\nshowing up.',
    image: require('../../assets/onboarding/slide5-art.png'),
    shape: 'swoop',
    top: 0.3,
    regionHeight: 0.7,
    focus: 'center',
  },
  {
    id: 'habit',
    kind: 'shaped',
    tone: 'light',
    title: 'A few minutes\ncan become a habit.',
    subtitle: 'Check in. Reflect. Keep going.',
    image: require('../../assets/onboarding/slide6-photo.png'),
    shape: 'curve',
    top: 0,
    regionHeight: 1,
    focus: 'center',
  },
  {
    id: 'privacy',
    kind: 'fade',
    tone: 'dark',
    title: 'Your thoughts\ndeserve privacy.',
    subtitle: 'Your reflections are yours.',
    image: require('../../assets/onboarding/slide7-photo.png'),
    regionHeight: 0.66,
  },
  {
    id: 'final',
    kind: 'final',
    tone: 'light',
    title: 'A quieter place\nfor your thoughts.',
    image: require('../../assets/onboarding/slide8-bg.png'),
  },
];