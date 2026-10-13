import { Text, type TextProps } from 'react-native';

// Text that can't blow up the layout when the phone's font size is cranked up
export function T(props: TextProps) {
  return <Text maxFontSizeMultiplier={1.2} {...props} />;
}