import React from 'react';
import { cn } from '@/lib/utils/styles';
import Header from './Header';
import Footer from './Footer';

export interface MainLayoutProps {
  /**
   * Page content
   */
  children: React.ReactNode;
  
  /**
   * Whether to show the header
   * @default true
   */
  showHeader?: boolean;
  
  /**
   * Whether to show the footer
   * @default true
   */
  showFooter?: boolean;
  
  /**
   * Whether to constrain the content width
   * @default true
   */
  constrained?: boolean;
  
  /**
   * Additional class names for the main content area
   */
  className?: string;
  
  /**
   * Additional class names for the container
   */
  containerClassName?: string;
}

/**
 * Main layout component for the application
 * Includes responsive header, footer, and content area
 */
export default function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
  constrained = true,
  className,
  containerClassName,
}: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {showHeader && <Header />}
      
      <main className={cn('flex-grow', className)}>
        <div
          className={cn(
            'px-4 py-6 md:py-8 lg:py-12',
            constrained && 'container mx-auto max-w-7xl',
            containerClassName
          )}
        >
          {children}
        </div>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}

/**
 * Section component for dividing content into logical sections
 */
export interface SectionProps {
  /**
   * Section content
   */
  children: React.ReactNode;
  
  /**
   * Section title
   */
  title?: string;
  
  /**
   * Section description
   */
  description?: string;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Additional class names for the title
   */
  titleClassName?: string;
  
  /**
   * Additional class names for the description
   */
  descriptionClassName?: string;
  
  /**
   * Additional class names for the content
   */
  contentClassName?: string;
  
  /**
   * Whether to add padding to the section
   * @default true
   */
  padded?: boolean;
  
  /**
   * Whether to add a divider above the section
   * @default false
   */
  divider?: boolean;
}

export function Section({
  children,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  contentClassName,
  padded = true,
  divider = false,
}: SectionProps) {
  return (
    <section
      className={cn(
        'w-full',
        padded && 'py-6 md:py-8',
        divider && 'border-t border-gray-200',
        className
      )}
    >
      {title && (
        <h2
          className={cn(
            'text-2xl font-bold text-gray-900 mb-2',
            titleClassName
          )}
        >
          {title}
        </h2>
      )}
      
      {description && (
        <p
          className={cn(
            'text-gray-500 mb-6',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
      
      <div className={contentClassName}>{children}</div>
    </section>
  );
}

/**
 * Container component for constraining content width
 */
export interface ContainerProps {
  /**
   * Container content
   */
  children: React.ReactNode;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Container size
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
}

export function Container({
  children,
  className,
  size = 'default',
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto px-4',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Grid component for responsive grid layouts
 */
export interface GridProps {
  /**
   * Grid items
   */
  children: React.ReactNode;
  
  /**
   * Number of columns at different breakpoints
   */
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  
  /**
   * Gap between grid items
   * @default 'md'
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Additional class names
   */
  className?: string;
}

export function Grid({
  children,
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },
  gap = 'md',
  className,
}: GridProps) {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };

  return (
    <div
      className={cn(
        'grid',
        gapClasses[gap],
        columns.xs && `grid-cols-${columns.xs}`,
        columns.sm && `sm:grid-cols-${columns.sm}`,
        columns.md && `md:grid-cols-${columns.md}`,
        columns.lg && `lg:grid-cols-${columns.lg}`,
        columns.xl && `xl:grid-cols-${columns.xl}`,
        columns['2xl'] && `2xl:grid-cols-${columns['2xl']}`,
        className
      )}
    >
      {children}
    </div>
  );
}