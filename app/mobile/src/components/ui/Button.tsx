import { Pressable } from 'react-native';
import { Text } from './Text';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', className = '', disabled }: Props) {
  const base = 'py-3 px-6 rounded-full items-center justify-center';
  const variantClass =
    variant === 'primary' ? 'bg-accent' : 'bg-transparent border border-border';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${base} ${variantClass} ${disabled ? 'opacity-40' : ''} ${className}`}
    >
      <Text
        variant="bodySemiBold"
        className={variant === 'primary' ? 'text-surface-elevated' : 'text-text-primary'}
      >
        {label}
      </Text>
    </Pressable>
  );
}