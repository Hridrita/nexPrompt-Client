'use client'; 

import ErrorPage from '@/components/ErrorPage';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <ErrorPage 
      title="Oops! Something went wrong" 
      message={error.message || "An unexpected error occurred in our system."} 
    />
  );
}