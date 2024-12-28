import React from 'react';
import { Button } from "@ui/components/button";
import { FiFileText, FiMoreVertical } from "react-icons/fi";
import { List } from '@/types/database';
import { Skeleton } from "@ui/components/skeleton";

interface DataSheetListProps {
  lists: List[];
  isLoading: boolean;
  onListClick: (listId: string) => void;
}

const DataSheetList: React.FC<DataSheetListProps> = ({ lists, isLoading, onListClick }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {lists.map((list) => (
        <div key={list.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50" onClick={() => onListClick(list.id)}>
          <div className="flex items-center space-x-3">
            <FiFileText className="h-5 w-5 text-gray-400" />
            <span>{list.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{new Date(list.created_at).toLocaleDateString()}</span>
            <Button variant="ghost" size="icon">
              <FiMoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataSheetList;