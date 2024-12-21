'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import { useMrgnlendStore } from '@/app/stores';

// @ts-ignore - Safe because context hook checks for null
const MrgnlendContext = React.createContext<>();

export const MrgnlendProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  //   const debounceId = React.useRef<NodeJS.Timeout | null>(null);
  const mrgnlendStore = useMrgnlendStore();
  // const [fetchMrgnlendState, setIsRefreshingStore] = useMrgnlendStore(
  //   (state) => [state.fetchMrgnlendState, state.setIsRefreshingStore],
  // );

  // Periodically refresh state
  React.useMemo(() => {
    const fetchData = () => {
      mrgnlendStore.setIsRefreshingStore(true);
      mrgnlendStore.fetchMrgnlendState().catch(console.error);
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 30_000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <MrgnlendContext.Provider value={{}}>{children}</MrgnlendContext.Provider>
  );
};
