import React from 'react';

const variants = {
  default: 'bg-blue-100 text-blue-700',
  secondary: 'bg-gray-100 text-gray-600',
  destructive: 'bg-red-100 text-red-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  ),
);

Badge.displayName = 'Badge';
