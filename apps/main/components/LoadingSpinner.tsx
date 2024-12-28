import React from 'react';
import { Spinner } from "@ui/components/spinner";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="h-8 w-8 text-green-600" />
    </div>
  );
};

export default LoadingSpinner;