import React from 'react';
import { cn } from '../lib/utils';

const buttonVariants = {
  variant: {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    destructive: 'bg-red-600 text-white hover:bg-red-500',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-900',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    ghost: 'hover:bg-slate-100 text-slate-900',
    link: 'text-blue-600 underline-offset-4 hover:underline'
  },
  size: {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 py-1.5 text-sm',
    lg: 'h-11 px-8 py-2.5',
    icon: 'h-9 w-9 p-0'
  }
};

const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = buttonVariants.variant[variant] || buttonVariants.variant.default;
  const sizeClasses = buttonVariants.size[size] || buttonVariants.size.default;

  return (
    <button
      className={cn(baseClasses, variantClasses, sizeClasses, className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
