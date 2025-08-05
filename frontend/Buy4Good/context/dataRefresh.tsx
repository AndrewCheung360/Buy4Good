import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

interface DataRefreshContextType {
  // Global refresh state
  isRefreshing: boolean;
  lastRefreshTime: number;

  // Data change tracking
  lastDataChangeTime: number;

  // Refresh functions
  refreshAll: () => void;
  markDataChanged: () => void;

  // Check if data needs refresh
  shouldRefresh: (lastUpdateTime: number) => boolean;

  // Global refresh trigger
  triggerRefresh: () => void;
}

const DataRefreshContext = createContext<DataRefreshContextType | undefined>(
  undefined
);

export const DataRefreshProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const [lastDataChangeTime, setLastDataChangeTime] = useState(Date.now());

  // Track when data was last changed (e.g., new donation, settings update)
  const markDataChanged = useCallback(() => {
    setLastDataChangeTime(Date.now());
  }, []);

  // Check if data should be refreshed (if data changed since last update)
  const shouldRefresh = useCallback(
    (lastUpdateTime: number) => {
      return lastDataChangeTime > lastUpdateTime;
    },
    [lastDataChangeTime]
  );

  // Trigger a refresh (for manual refresh)
  const triggerRefresh = useCallback(() => {
    setLastRefreshTime(Date.now());
  }, []);

  // Refresh all components
  const refreshAll = useCallback(() => {
    setIsRefreshing(true);
    setLastRefreshTime(Date.now());

    // Reset refreshing state after a short delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const value: DataRefreshContextType = {
    isRefreshing,
    lastRefreshTime,
    lastDataChangeTime,
    refreshAll,
    markDataChanged,
    shouldRefresh,
    triggerRefresh,
  };

  return (
    <DataRefreshContext.Provider value={value}>
      {children}
    </DataRefreshContext.Provider>
  );
};

export const useDataRefresh = () => {
  const context = useContext(DataRefreshContext);
  if (context === undefined) {
    throw new Error("useDataRefresh must be used within a DataRefreshProvider");
  }
  return context;
};
