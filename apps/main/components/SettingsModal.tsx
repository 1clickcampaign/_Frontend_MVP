import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/components/dialog";
import { Button } from "@ui/components/button";
import { FiSettings, FiDownload, FiLogOut } from "react-icons/fi";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  userEmail: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSignOut, userEmail }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button variant="ghost" className="w-full justify-start">
            <FiSettings className="mr-2" />
            Settings...
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FiDownload className="mr-2" />
            Exports...
          </Button>
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-2">{userEmail}</p>
            <Button variant="ghost" className="w-full justify-start text-red-500" onClick={onSignOut}>
              <FiLogOut className="mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;