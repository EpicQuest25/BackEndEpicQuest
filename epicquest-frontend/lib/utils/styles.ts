import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class values into a single className string
 * Uses clsx for conditional classes and twMerge to handle Tailwind class conflicts
 * 
 * @param inputs - Class values to be combined
 * @returns A merged className string
 * 
 * @example
 * // Basic usage
 * cn('text-red-500', 'bg-blue-500')
 * // => 'text-red-500 bg-blue-500'
 * 
 * @example
 * // With conditionals
 * cn('text-base', isLarge && 'text-lg')
 * // => 'text-lg' if isLarge is true, 'text-base' otherwise
 * 
 * @example
 * // With Tailwind class conflicts
 * cn('px-2 py-1', 'p-4')
 * // => 'p-4' (twMerge resolves the padding conflict)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a color class based on a variant
 * 
 * @param variant - Color variant
 * @param type - Type of color class (bg, text, border, etc.)
 * @param intensity - Color intensity (default: 500)
 * @returns A Tailwind color class
 */
export function colorClass(
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info',
  type: 'bg' | 'text' | 'border' | 'ring' | 'shadow',
  intensity: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 = 500
): string {
  const colorMap = {
    primary: 'blue',
    secondary: 'gray',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'indigo',
  };

  return `${type}-${colorMap[variant]}-${intensity}`;
}

/**
 * Generates a size class based on a size variant
 * 
 * @param size - Size variant
 * @param type - Type of size class (text, p, m, etc.)
 * @returns A Tailwind size class
 */
export function sizeClass(
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl',
  type: 'text' | 'p' | 'px' | 'py' | 'm' | 'mx' | 'my' | 'gap'
): string {
  const sizeMap = {
    xs: type === 'text' ? 'xs' : '1',
    sm: type === 'text' ? 'sm' : '2',
    md: type === 'text' ? 'base' : '4',
    lg: type === 'text' ? 'lg' : '6',
    xl: type === 'text' ? 'xl' : '8',
    '2xl': type === 'text' ? '2xl' : '10',
  };

  return `${type}-${sizeMap[size]}`;
}

/**
 * Generates a rounded class based on a size variant
 * 
 * @param size - Size variant
 * @returns A Tailwind rounded class
 */
export function roundedClass(
  size: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
): string {
  if (size === 'none') return 'rounded-none';
  if (size === 'full') return 'rounded-full';
  
  const sizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  };

  return `rounded-${sizeMap[size]}`;
}

/**
 * Generates a shadow class based on a size variant
 * 
 * @param size - Size variant
 * @returns A Tailwind shadow class
 */
export function shadowClass(
  size: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
): string {
  if (size === 'none') return 'shadow-none';
  
  const sizeMap = {
    sm: 'sm',
    md: '',
    lg: 'lg',
    xl: 'xl',
    '2xl': '2xl',
  };

  return `shadow${sizeMap[size] ? `-${sizeMap[size]}` : ''}`;
}

/**
 * Generates a transition class based on properties and duration
 * 
 * @param properties - CSS properties to transition
 * @param duration - Transition duration
 * @returns A Tailwind transition class
 */
export function transitionClass(
  properties: ('all' | 'colors' | 'opacity' | 'shadow' | 'transform')[],
  duration: 'fast' | 'normal' | 'slow' = 'normal'
): string {
  const durationMap = {
    fast: 150,
    normal: 300,
    slow: 500,
  };

  const propertiesString = properties.join(' ');
  
  return `transition duration-${durationMap[duration]} ${
    properties.includes('all') ? '' : `transition-[${propertiesString}]`
  }`;
}

/**
 * Generates a grid layout class
 * 
 * @param columns - Number of columns at different breakpoints
 * @param gap - Gap size
 * @returns A Tailwind grid class
 */
export function gridClass(
  columns: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  },
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
): string {
  const gapMap = {
    xs: '2',
    sm: '4',
    md: '6',
    lg: '8',
    xl: '10',
  };

  let classes = `grid gap-${gapMap[gap]}`;

  if (columns.xs) classes += ` grid-cols-${columns.xs}`;
  if (columns.sm) classes += ` sm:grid-cols-${columns.sm}`;
  if (columns.md) classes += ` md:grid-cols-${columns.md}`;
  if (columns.lg) classes += ` lg:grid-cols-${columns.lg}`;
  if (columns.xl) classes += ` xl:grid-cols-${columns.xl}`;
  if (columns['2xl']) classes += ` 2xl:grid-cols-${columns['2xl']}`;

  return classes;
}

/**
 * Generates a flex layout class
 * 
 * @param direction - Flex direction at different breakpoints
 * @param align - Align items
 * @param justify - Justify content
 * @param gap - Gap size
 * @returns A Tailwind flex class
 */
export function flexClass(
  direction: {
    xs?: 'row' | 'col';
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
    xl?: 'row' | 'col';
    '2xl'?: 'row' | 'col';
  },
  align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'start',
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' = 'start',
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
): string {
  const gapMap = {
    xs: '2',
    sm: '4',
    md: '6',
    lg: '8',
    xl: '10',
  };

  let classes = `flex items-${align} justify-${justify} gap-${gapMap[gap]}`;

  if (direction.xs) classes += ` flex-${direction.xs}`;
  if (direction.sm) classes += ` sm:flex-${direction.sm}`;
  if (direction.md) classes += ` md:flex-${direction.md}`;
  if (direction.lg) classes += ` lg:flex-${direction.lg}`;
  if (direction.xl) classes += ` xl:flex-${direction.xl}`;
  if (direction['2xl']) classes += ` 2xl:flex-${direction['2xl']}`;

  return classes;
}