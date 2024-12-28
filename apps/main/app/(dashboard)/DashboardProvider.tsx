"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAtom } from 'jotai';
import { userAtom, listsAtom } from '@/atoms/userAtoms';
import { User, List } from '@/types/database';

interface DashboardContextType {
  user: User | null;
  lists: List[];
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useAtom(userAtom);
  const [lists, setLists] = useAtom(listsAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndLists() {
      setIsLoading(true);
      const userResponse = await fetch('/api/user');
      const listsResponse = await fetch('/api/lists');

      if (userResponse.ok) {
        const userData: User = await userResponse.json();
        setUser(userData);
      }

      if (listsResponse.ok) {
        const listsData: List[] = await listsResponse.json();
        setLists(listsData);
      }

      setIsLoading(false);
    }

    fetchUserAndLists();
  }, [setUser, setLists]);

  return (
    <DashboardContext.Provider value={{ user, lists, isLoading }}>
      {children}
    </DashboardContext.Provider>
  );
}
