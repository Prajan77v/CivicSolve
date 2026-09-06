import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      containerClassName,
      id: customId,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const textareaId = customId || generatedId

    return (
      <div className={cn('w-full flex flex-col space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-slate-300 select-none flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            'w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[80px]',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-100 placeholder-red-300/40',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          {...props}
        />

        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-red-400 font-medium">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${textareaId}-helper`} className="text-xs text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
