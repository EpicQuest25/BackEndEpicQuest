import { useEffect, useState } from 'react';

// Breakpoint sizes (in pixels)
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof typeof breakpoints;

/**
 * Custom hook to detect current breakpoint based on window width
 * @returns Current breakpoint (xs, sm, md, lg, xl, 2xl)
 */
export function useBreakpoint(): Breakpoint {
  // Default to 'xs' for SSR
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs');
  
  useEffect(() => {
    // Function to determine the current breakpoint
    const determineBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints['2xl']) {
        setBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };

    // Set initial breakpoint
    determineBreakpoint();
    
    // Add event listener for window resize
    window.addEventListener('resize', determineBreakpoint);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', determineBreakpoint);
    };
  }, []);
  
  return breakpoint;
}

/**
 * Custom hook to check if the current breakpoint is at least the specified size
 * @param size Minimum breakpoint size to check for
 * @returns Boolean indicating if current breakpoint is at least the specified size
 */
export function useBreakpointAtLeast(size: Breakpoint): boolean {
  const currentBreakpoint = useBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  return breakpointOrder.indexOf(currentBreakpoint) >= breakpointOrder.indexOf(size);
}

/**
 * Custom hook to check if the current breakpoint is at most the specified size
 * @param size Maximum breakpoint size to check for
 * @returns Boolean indicating if current breakpoint is at most the specified size
 */
export function useBreakpointAtMost(size: Breakpoint): boolean {
  const currentBreakpoint = useBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  return breakpointOrder.indexOf(currentBreakpoint) <= breakpointOrder.indexOf(size);
}

/**
 * Custom hook to check if the current breakpoint is between the specified sizes (inclusive)
 * @param minSize Minimum breakpoint size
 * @param maxSize Maximum breakpoint size
 * @returns Boolean indicating if current breakpoint is between the specified sizes
 */
export function useBreakpointBetween(minSize: Breakpoint, maxSize: Breakpoint): boolean {
  const currentBreakpoint = useBreakpoint();
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  
  return (
    breakpointOrder.indexOf(currentBreakpoint) >= breakpointOrder.indexOf(minSize) &&
    breakpointOrder.indexOf(currentBreakpoint) <= breakpointOrder.indexOf(maxSize)
  );
}

/**
 * Custom hook to detect if the device is mobile
 * @returns Boolean indicating if the device is mobile
 */
export function useMobile(): boolean {
  return useBreakpointAtMost('md');
}

/**
 * Custom hook to detect if the device is a tablet
 * @returns Boolean indicating if the device is a tablet
 */
export function useTablet(): boolean {
  return useBreakpointBetween('md', 'lg');
}

/**
 * Custom hook to detect if the device is desktop
 * @returns Boolean indicating if the device is desktop
 */
export function useDesktop(): boolean {
  return useBreakpointAtLeast('lg');
}

/**
 * Helper function to conditionally apply classes based on breakpoint
 * @param breakpointClasses Object with breakpoint keys and class values
 * @returns String of classes to apply
 */
export function responsiveClasses(breakpointClasses: Partial<Record<Breakpoint, string>>): string {
  // This function is meant to be used with Tailwind's built-in responsive classes
  // It's a utility for documentation purposes to show which classes apply at which breakpoints
  return Object.entries(breakpointClasses)
    .map(([breakpoint, classes]) => {
      if (breakpoint === 'xs') {
        return classes;
      }
      return `${breakpoint}:${classes}`;
    })
    .join(' ');
}