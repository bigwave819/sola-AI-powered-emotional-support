import { Text as RNText, TextProps } from 'react-native';

type Variant = 'headline' | 'headlineLight' | 'body' | 'bodyMedium' | 'bodySemiBold' | 'caption';

interface Props extends TextProps {
  variant?: Variant;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  headline: 'font-headline text-2xl text-text-primary',
  headlineLight: 'font-headline-light text-xl text-text-primary',
  body: 'font-body text-base text-text-primary',
  bodyMedium: 'font-body-medium text-base text-text-primary',
  bodySemiBold: 'font-body-semibold text-base text-text-primary',
  caption: 'font-body text-sm text-text-secondary',
};

export function Text({ variant = 'body', className = '', ...props }: Props) {
  return <RNText className={`${variantClasses[variant]} ${className}`} {...props} />;
}