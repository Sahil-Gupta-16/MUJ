/**
 * src/components/Loading.tsx
 * 
 * Simple loading spinner displayed during lazy load or async data fetching.
 */

import React from 'react';

const Loading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-background dark:bg-background">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default Loading;
