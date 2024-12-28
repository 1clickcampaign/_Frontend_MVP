"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@ui/components/button";
import { FiArrowLeft, FiGrid, FiPlus } from "react-icons/fi";
import CreditsDisplay from '@/components/CreditsDisplay';
import UserProfileSection from '@/components/UserProfileSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { DashboardProvider, useDashboard } from './DashboardProvider';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/home';
  const { user, lists, isLoading } = useDashboard();

  const currentList = lists.find(list => `/sheet/${list.id}` === pathname);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center space-x-4">
          {isHomePage ? (
            <div className="flex items-center space-x-2">
              <FiPlus className="h-8 w-8 text-green-600" />
              <span className="text-xl font-medium">DataPull</span>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
                <FiArrowLeft className="h-6 w-6" />
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Workspace</span>
                <span className="text-sm">/</span>
                <span className="text-sm font-medium">{currentList?.name || 'Table'}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <CreditsDisplay credits={user?.credits} isLoading={!user} />
          <Button variant="ghost" size="icon">
            <FiGrid className="h-6 w-6" />
          </Button>
          <UserProfileSection
            user={user}
            isLoading={!user}
            isSettingsModalOpen={false}
            setIsSettingsModalOpen={() => {}}
            handleSignOut={() => {}}
          />
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardContent>{children}</DashboardContent>
    </DashboardProvider>
  );
}
