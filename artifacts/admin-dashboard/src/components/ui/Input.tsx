import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dir?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, dir: dirProp, ...props }, ref) => {
    const isRTL =
      dirProp === 'rtl' || (!dirProp && props.type !== 'email' && props.type !== 'password');
    const inputDir = dirProp || (isRTL ? 'rtl' : 'ltr');

    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <input
          ref={ref}
          dir={inputDir}
          className={`w-full px-4 py-2.5 rounded-xl border transition-colors outline-none text-sm ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20'
          } ${inputDir === 'ltr' ? 'text-left' : 'text-right'} ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
