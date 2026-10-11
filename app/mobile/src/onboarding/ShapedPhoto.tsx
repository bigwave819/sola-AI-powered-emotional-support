import { View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import Svg, { ClipPath, Defs, Image as SvgImage, Path } from 'react-native-svg';
import { SHAPES, type Shape, type ShapeName } from './shapes';

const ALIGN = {
  top: 'xMidYMin slice',
  center: 'xMidYMid slice',
  bottom: 'xMidYMax slice',
} as const;

interface Props {
  source: ImageSourcePropType;
  shape: ShapeName;
  top: number; // where the shape region starts, as a fraction of screen height
  height: number; // how tall the region is, as a fraction of screen height
  focus?: 'top' | 'center' | 'bottom'; // which part of the photo stays visible when cropped
  clipId: string;
}

export function ShapedPhoto({ source, shape, top, height, focus = 'center', clipId }: Props) {
  const { width, height: screenH } = useWindowDimensions();
  const def: Shape = SHAPES[shape];
  const pad = def.outline ? 28 : 0; // room for the outline to sit outside the shape
  const h = height * screenH;
  const x = (n: number) => n * width;
  const y = (n: number) => n * h + pad;

  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: top * screenH - pad }}>
      <Svg width={width} height={h + pad * 2}>
        <Defs>
          <ClipPath id={clipId}>
            <Path d={def.clip(x, y)} />
          </ClipPath>
        </Defs>
        <SvgImage
          href={source}
          x={0}
          y={pad}
          width={width}
          height={h}
          preserveAspectRatio={ALIGN[focus]}
          clipPath={`url(#${clipId})`}
        />
        {def.outline ? (
          <Path
            d={def.outline(x, y)}
            stroke="#2B2C24"
            strokeOpacity={0.45}
            strokeWidth={1}
            fill="none"
          />
        ) : null}
      </Svg>
    </View>
  );
}