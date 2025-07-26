import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn, colorClass, sizeClass, roundedClass, transitionClass } from '@/lib/utils/styles';

// Simple spinner component for loading state
const Spinner = ({ size, className }: { size: number; className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Icon to display before the button text
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Whether the button takes up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether the button has rounded corners
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Primary UI component for user interaction
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = 'md',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles that apply to all buttons
    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      roundedClass(rounded),
      transitionClass(['colors', 'opacity', 'shadow'], 'normal'),
      fullWidth ? 'w-full' : ''
    );

    // Size-specific styles
    const sizeStyles = {
      xs: cn(sizeClass('xs', 'text'), sizeClass('xs', 'px'), sizeClass('xs', 'py'), 'h-8'),
      sm: cn(sizeClass('sm', 'text'), sizeClass('sm', 'px'), sizeClass('sm', 'py'), 'h-9'),
      md: cn(sizeClass('md', 'text'), sizeClass('md', 'px'), sizeClass('md', 'py'), 'h-10'),
      lg: cn(sizeClass('lg', 'text'), sizeClass('lg', 'px'), sizeClass('lg', 'py'), 'h-11'),
      xl: cn(sizeClass('xl', 'text'), sizeClass('xl', 'px'), sizeClass('xl', 'py'), 'h-12'),
    };

    // Variant-specific styles
    const variantStyles = {
      primary: cn(
        colorClass('primary', 'bg'),
        'text-white hover:bg-blue-600 focus-visible:ring-blue-500'
      ),
      secondary: cn(
        colorClass('secondary', 'bg'),
        'text-white hover:bg-gray-600 focus-visible:ring-gray-500'
      ),
      outline: cn(
        'border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500'
      ),
      ghost: cn(
        'bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500'
      ),
      link: cn(
        'bg-transparent underline-offset-4 hover:underline text-blue-500 hover:text-blue-600 p-0 h-auto focus-visible:ring-blue-500'
      ),
      danger: cn(
        colorClass('error', 'bg'),
        'text-white hover:bg-red-600 focus-visible:ring-red-500'
      ),
    };

    // Combine all styles
    const buttonStyles = cn(
      baseStyles,
      sizeStyles[size],
      variantStyles[variant],
      className
    );

    // Determine the appropriate spacing for icons
    const iconSpacing = {
      xs: 'mr-1',
      sm: 'mr-1.5',
      md: 'mr-2',
      lg: 'mr-2.5',
      xl: 'mr-3',
    };

    // Determine the appropriate size for the loading spinner
    const spinnerSize = {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 20,
      xl: 22,
    };

    return (
      <button
        className={buttonStyles}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <Spinner className={iconSpacing[size]} size={spinnerSize[size]} />
        ) : leftIcon ? (
          <span className={iconSpacing[size]}>{leftIcon}</span>
        ) : null}
        
        {children}
        
        {!isLoading && rightIcon ? (
          <span className={cn('ml-2')}>{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };