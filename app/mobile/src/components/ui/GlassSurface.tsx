import { BlurView } from 'expo-blur';
import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  intensity?: 'subtle' | 'medium';
  className?: string;
}

const intensityMap = { subtle: 20, medium: 40 };

export function GlassSurface({ intensity = 'subtle', className = '', children, ...props }: Props) {
  return (
    <View className={`rounded-lg overflow-hidden border border-white/35 ${className}`} {...props}>
      <BlurView intensity={intensityMap[intensity]} tint="light" className="absolute inset-0" />
      <View className="bg-white/55 p-4">{children}</View>
    </View>
  );
}