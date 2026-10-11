export type Mapper = (n: number) => number;
export type PathFn = (x: Mapper, y: Mapper) => string;

export interface Shape {
  clip: PathFn;
  outline?: PathFn;
}

export const SHAPES = {
  // Slide 2: organic blob bleeding off the right edge, with a thin outline curve
  blob: {
    clip: (x, y) =>
      [
        `M ${x(0.05)} ${y(0.45)}`,
        `C ${x(0.03)} ${y(0.3)}, ${x(0.1)} ${y(0.18)}, ${x(0.25)} ${y(0.1)}`,
        `C ${x(0.38)} ${y(0.03)}, ${x(0.52)} ${y(0)}, ${x(0.65)} ${y(0.01)}`,
        `L ${x(1)} ${y(0.035)} L ${x(1)} ${y(0.9)}`,
        `C ${x(0.85)} ${y(0.97)}, ${x(0.65)} ${y(1)}, ${x(0.5)} ${y(0.98)}`,
        `C ${x(0.28)} ${y(0.95)}, ${x(0.07)} ${y(0.7)}, ${x(0.05)} ${y(0.45)} Z`,
      ].join(' '),
    outline: (x, y) =>
      [
        `M ${x(0.62)} ${y(-0.05)}`,
        `C ${x(0.4)} ${y(-0.055)}, ${x(0.13)} ${y(0.03)}, ${x(0.02)} ${y(0.3)}`,
        `C ${x(0.005)} ${y(0.6)}, ${x(0.1)} ${y(0.9)}, ${x(0.32)} ${y(1.03)}`,
        `C ${x(0.42)} ${y(1.05)}, ${x(0.55)} ${y(1.045)}, ${x(0.66)} ${y(1.02)}`,
      ].join(' '),
  },

  // Slide 3: diagonal top edge rising to the right, full bleed below
  diagonal: {
    clip: (x, y) =>
      `M ${x(0)} ${y(0.12)} L ${x(0.8)} ${y(0)} L ${x(1)} ${y(0)} L ${x(1)} ${y(1)} L ${x(0)} ${y(1)} Z`,
  },

  // Slide 4: rounded blob with a scooped bottom-left, bleeding off the right
  blob2: {
    clip: (x, y) =>
      [
        `M ${x(0.1)} ${y(0.92)}`,
        `C ${x(0)} ${y(0.78)}, ${x(0)} ${y(0.36)}, ${x(0.14)} ${y(0.14)}`,
        `C ${x(0.26)} ${y(0)}, ${x(0.6)} ${y(0)}, ${x(1)} ${y(0.02)}`,
        `L ${x(1)} ${y(0.96)}`,
        `C ${x(0.7)} ${y(1)}, ${x(0.3)} ${y(1)}, ${x(0.1)} ${y(0.92)} Z`,
      ].join(' '),
  },

  // Slide 5: gentle swoop at the top, full bleed below
  swoop: {
    clip: (x, y) =>
      `M ${x(0)} ${y(0.12)} C ${x(0.3)} ${y(0.08)}, ${x(0.65)} ${y(0)}, ${x(1)} ${y(0.04)} L ${x(1)} ${y(1)} L ${x(0)} ${y(1)} Z`,
  },

  // Slide 6 (full-screen region): curve rising to the top-right.
  // It stays low on the left so the baked-in headline in the photo is cut away.
  curve: {
    clip: (x, y) =>
      [
        `M ${x(0)} ${y(0.42)}`,
        `C ${x(0.2)} ${y(0.41)}, ${x(0.45)} ${y(0.36)}, ${x(0.62)} ${y(0.29)}`,
        `C ${x(0.78)} ${y(0.22)}, ${x(0.92)} ${y(0.09)}, ${x(1)} ${y(0)}`,
        `L ${x(1)} ${y(1)} L ${x(0)} ${y(1)} Z`,
      ].join(' '),
  },
} satisfies Record<string, Shape>;

export type ShapeName = keyof typeof SHAPES;