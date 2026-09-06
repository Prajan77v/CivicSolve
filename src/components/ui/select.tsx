import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options?: SelectOption[]
  placeholder?: string
  leftIcon?: React.ReactNode
  containerClassName?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      leftIcon,
      containerClassName,
      id: customId,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const selectId = customId || generatedId

    return (
      <div className={cn('w-full flex flex-col space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-slate-300 select-none flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
              {leftIcon}
            </div>
          )}

          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full appearance-none bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-white transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
              leftIcon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-100',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                ? `${selectId}-helper`
                : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-slate-900 text-slate-500">
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-slate-900 text-white py-1"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute right-3.5 flex items-center justify-center text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="text-xs text-red-400 font-medium">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${selectId}-helper`} className="text-xs text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
