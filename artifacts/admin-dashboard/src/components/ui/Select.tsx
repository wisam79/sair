import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-xs text-gray-500 font-medium">{label}</label>}
        <select
          ref={ref}
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-white outline-none transition-colors ${
            error
              ? 'border-red-300 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-200 focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
