import React, { HTMLAttributes, forwardRef } from 'react';
import { cn, shadowClass, roundedClass } from '@/lib/utils/styles';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the card has a border
   * @default true
   */
  bordered?: boolean;
  
  /**
   * Whether the card has a shadow
   * @default 'md'
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /**
   * Whether the card has rounded corners
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Whether the card is interactive (has hover effects)
   * @default false
   */
  interactive?: boolean;
  
  /**
   * Whether the card is compact (less padding)
   * @default false
   */
  compact?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      bordered = true,
      shadow = 'md',
      rounded = 'md',
      interactive = false,
      compact = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          'bg-white',
          bordered && 'border border-gray-200',
          shadowClass(shadow),
          roundedClass(rounded),
          interactive && 'transition-all duration-200 hover:shadow-lg',
          compact ? 'p-3' : 'p-5',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('mb-3', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * The HTML tag to use for the title
   * @default 'h3'
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', children, ...props }, ref) => {
    return (
      <Component
        className={cn('font-semibold text-lg text-gray-900', className)}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn('text-sm text-gray-500', className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('mt-4 flex items-center', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Whether the image is at the top of the card
   * @default true
   */
  top?: boolean;
  
  /**
   * Whether the image is at the bottom of the card
   * @default false
   */
  bottom?: boolean;
  
  /**
   * Whether the image fills the width of the card
   * @default true
   */
  fullWidth?: boolean;
}

const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  (
    {
      className,
      top = true,
      bottom = false,
      fullWidth = true,
      alt = '',
      ...props
    },
    ref
  ) => {
    return (
      <img
        className={cn(
          'object-cover',
          top && 'rounded-t-md -mt-5 -mx-5 mb-5',
          bottom && 'rounded-b-md -mb-5 -mx-5 mt-5',
          fullWidth && 'w-full',
          className
        )}
        alt={alt}
        ref={ref}
        {...props}
      />
    );
  }
);

CardImage.displayName = 'CardImage';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
};