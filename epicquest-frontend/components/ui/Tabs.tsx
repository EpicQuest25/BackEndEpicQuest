import React, { useState, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils/styles';
import { useBreakpoint } from '@/lib/utils/responsive';

// Context for managing tab state
type TabsContextType = {
  selectedTab: string;
  setSelectedTab: (id: string) => void;
  orientation: 'horizontal' | 'vertical';
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a TabsProvider');
  }
  return context;
};

export interface TabsProps {
  /**
   * Default selected tab ID
   */
  defaultTab: string;
  
  /**
   * Callback when tab changes
   */
  onChange?: (id: string) => void;
  
  /**
   * Orientation of the tabs
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Children components
   */
  children: React.ReactNode;
  
  /**
   * Additional class names
   */
  className?: string;
}

export const Tabs = ({
  defaultTab,
  onChange,
  orientation = 'horizontal',
  children,
  className,
}: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const breakpoint = useBreakpoint();
  
  // Determine if we should use vertical layout on small screens
  const effectiveOrientation = 
    orientation === 'vertical' || breakpoint === 'xs' || breakpoint === 'sm'
      ? 'vertical'
      : 'horizontal';

  // Handle tab change
  const handleTabChange = (id: string) => {
    setSelectedTab(id);
    onChange?.(id);
  };

  // Update selected tab if defaultTab changes
  useEffect(() => {
    setSelectedTab(defaultTab);
  }, [defaultTab]);

  return (
    <TabsContext.Provider
      value={{
        selectedTab,
        setSelectedTab: handleTabChange,
        orientation: effectiveOrientation,
      }}
    >
      <div
        className={cn(
          'w-full',
          effectiveOrientation === 'vertical' ? 'flex flex-col' : '',
          className
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabListProps {
  /**
   * Children components (TabItem)
   */
  children: React.ReactNode;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Whether to center the tabs
   * @default false
   */
  centered?: boolean;
  
  /**
   * Whether to make the tabs full width
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether to add a bottom border
   * @default true
   */
  bordered?: boolean;
}

export const TabList = ({
  children,
  className,
  centered = false,
  fullWidth = false,
  bordered = true,
}: TabListProps) => {
  const { orientation } = useTabs();

  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        bordered && orientation === 'horizontal' ? 'border-b border-gray-200' : '',
        bordered && orientation === 'vertical' ? 'border-r border-gray-200' : '',
        centered && orientation === 'horizontal' ? 'justify-center' : '',
        fullWidth && orientation === 'horizontal' ? 'w-full' : '',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
};

export interface TabItemProps {
  /**
   * Unique ID for the tab
   */
  id: string;
  
  /**
   * Tab label
   */
  children: React.ReactNode;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Icon to display before the label
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;
}

export const TabItem = ({
  id,
  children,
  className,
  icon,
  disabled = false,
}: TabItemProps) => {
  const { selectedTab, setSelectedTab, orientation } = useTabs();
  const isSelected = selectedTab === id;

  return (
    <button
      role="tab"
      aria-selected={isSelected}
      aria-controls={`tabpanel-${id}`}
      id={`tab-${id}`}
      tabIndex={isSelected ? 0 : -1}
      className={cn(
        'flex items-center px-4 py-2 text-sm font-medium transition-colors',
        orientation === 'horizontal' ? 'border-b-2 -mb-px' : '',
        orientation === 'vertical' ? 'border-l-2 -ml-px' : '',
        isSelected
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={() => {
        if (!disabled) {
          setSelectedTab(id);
        }
      }}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export interface TabPanelsProps {
  /**
   * Children components (TabPanel)
   */
  children: React.ReactNode;
  
  /**
   * Additional class names
   */
  className?: string;
}

export const TabPanels = ({ children, className }: TabPanelsProps) => {
  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  );
};

export interface TabPanelProps {
  /**
   * Unique ID for the panel (should match a tab ID)
   */
  id: string;
  
  /**
   * Panel content
   */
  children: React.ReactNode;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Whether to keep the panel in the DOM when not active
   * @default false
   */
  keepAlive?: boolean;
}

export const TabPanel = ({
  id,
  children,
  className,
  keepAlive = false,
}: TabPanelProps) => {
  const { selectedTab } = useTabs();
  const isSelected = selectedTab === id;

  if (!isSelected && !keepAlive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!isSelected}
      className={cn(
        'focus:outline-none',
        isSelected ? 'animate-fadeIn' : '',
        className
      )}
      tabIndex={0}
    >
      {children}
    </div>
  );
};