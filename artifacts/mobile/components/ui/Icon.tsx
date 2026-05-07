import React from 'react';
import { useColors } from '../../hooks/useColors';

interface IconProps {
  name: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name: IconComponent, size = 24, color }) => {
  const colors = useColors();
  return <IconComponent size={size} color={color || colors.text} strokeWidth={2} />;
};
