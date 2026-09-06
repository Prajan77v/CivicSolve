import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:bg-blue-700',
        secondary:
          'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:bg-slate-750',
        ghost:
          'hover:bg-slate-800 text-slate-300 hover:text-white active:bg-slate-800/80',
        danger:
          'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 active:bg-red-700',
        outline:
          'border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 active:bg-blue-500/20',
        glass:
          'backdrop-blur-md bg-white/5 hover:bg-white/10 text-white border border-white/10 active:bg-white/15',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
        md: 'h-10 px-4 py-2 text-sm rounded-lg gap-2',
        lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
        icon: 'h-10 w-10 p-0 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || isLoading

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-current" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
