/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonHoverAccent = 'btn-hover-accent'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent text-sm font-medium transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: cn('bg-primary text-on-primary', buttonHoverAccent),
        outline: cn(
          'border-outline-variant/40 bg-background text-on-surface',
          buttonHoverAccent
        ),
        secondary:
          'bg-surface-container-low text-on-surface hover:bg-surface-container-high',
        ghost: 'text-on-surface-variant hover:bg-primary/10 hover:text-primary',
        destructive: 'bg-error-container text-on-error-container hover:bg-error-container/85',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 px-2.5',
        xs: 'h-6 rounded-md px-2 text-xs',
        sm: 'h-7 rounded-md px-2.5 text-[0.8rem]',
        lg: 'h-9 px-2.5',
        icon: 'size-8',
        'icon-xs': 'size-6 rounded-md',
        'icon-sm': 'size-7 rounded-md',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants, buttonHoverAccent }
