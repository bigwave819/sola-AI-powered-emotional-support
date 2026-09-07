import { Text as RNText, TextProps } from 'react-native';
import { theme } from '@/src/theme';

type Variant = 'headline' | 'headlineLight' | 'body' | 'bodyMedium' | 'bodySemiBold' | 'caption';

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
}

const variantStyles: Record<Variant, { fontFamily: string; fontSize: number }> = {
  headline: { fontFamily: theme.font.headline, fontSize: theme.fontSize['2xl'] },
  headlineLight: { fontFamily: theme.font.headlineLight, fontSize: theme.fontSize.xl },
  body: { fontFamily: theme.font.body, fontSize: theme.fontSize.base },
  bodyMedium: { fontFamily: theme.font.bodyMedium, fontSize: theme.fontSize.base },
  bodySemiBold: { fontFamily: theme.font.bodySemiBold, fontSize: theme.fontSize.base },
  caption: { fontFamily: theme.font.body, fontSize: theme.fontSize.sm },
};

export function Text({ variant = 'body', color, style, ...props }: Props) {
  return (
    <RNText
      style={[
        variantStyles[variant],
        { color: color ?? theme.color.textPrimary },
        style,
      ]}
      {...props}
    />
  );
}