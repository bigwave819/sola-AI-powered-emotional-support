import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  className?: string;
}

export function Card({ className = '', ...props }: Props) {
  return (
    <View
      className={`bg-surface rounded-md p-4 border border-border ${className}`}
      {...props}
    />
  );
}