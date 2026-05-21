/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-primary/50',
  {
    variants: {
      variant: {
        default: 'border-primary/20 bg-primary text-on-primary',
        secondary: 'border-outline-variant/30 bg-surface-container-high text-on-surface',
        destructive: 'border-error-container/20 bg-error-container text-on-error-container',
        outline: 'border-outline-variant/40 bg-transparent text-on-surface',
        ghost: 'border-transparent text-on-surface-variant hover:bg-primary/10 hover:text-primary',
        link: 'border-transparent text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
