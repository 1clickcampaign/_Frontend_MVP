import React from 'react';
import Image from 'next/image';
import { Button } from "@ui/components/button";
import { Skeleton } from "@ui/components/skeleton";
import { User } from '@/types/database';
import SettingsModal from '@/components/SettingsModal';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtoms';

interface UserProfileSectionProps {
  user: User | null;
  isLoading: boolean;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (isOpen: boolean) => void;
  handleSignOut: () => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  user,
  isLoading,
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  handleSignOut
}) => {
  const [currentUser] = useAtom(userAtom);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16 mt-1" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center space-x-2"
        onClick={() => setIsSettingsModalOpen(true)}
      >
        <Image 
          src={user.profile_picture || '/default-avatar.png'}
          alt="Profile" 
          width={32} 
          height={32} 
          className="rounded-full"
        />
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-gray-500">Free Plan</span>
        </div>
      </Button>
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSignOut={handleSignOut}
        userEmail={user.email}
      />
    </div>
  );
};

export default UserProfileSection;
