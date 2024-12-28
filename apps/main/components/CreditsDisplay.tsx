import React from 'react';
import { FiCreditCard } from "react-icons/fi";
import { Skeleton } from "@ui/components/skeleton";

interface CreditsDisplayProps {
  credits: number;
  isLoading: boolean;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({ credits, isLoading }) => {

  if (isLoading) {
    return <Skeleton className="h-6 w-24" />;
  }

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <FiCreditCard className="h-4 w-4" />
      <span>Credits: {credits}</span>
    </div>
  );
};

export default CreditsDisplay;
