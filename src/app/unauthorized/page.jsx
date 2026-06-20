import React from 'react';
import Link from 'next/link';
import { Lock } from '@gravity-ui/icons'; 
const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f7fb] p-6">
      <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
        
        <div className="flex justify-center mb-6">
          <div className="bg-red-400/10 p-4 rounded-full text-red-500">
            <Lock size={48} />
          </div>
        </div>

        
        <h1 className="text-4xl font-extrabold text-red-500 mb-2">401</h1>
        <h2 className="text-xl font-semibold text-red-500 mb-4">Unauthorized Access</h2>
        <p className="text-gray-500 mb-8">
         Sorry, you do not have the necessary permission to view this page. Please log in with the correct credentials.
        </p>

       
        <div className="flex flex-col gap-3">
          <Link 
            href="/auth/sign-in" 
            className="w-full bg-linear-to-r from-[#066a9b] to-[#0a9fd4] text-white py-3 px-6 rounded-xl font-medium hover:shadow-[#066a9b]/40 transition-all duration-200 shadow-md"
          >
            Sign In Again
          </Link>
          <Link 
            href="/" 
            className="w-full text-gray-500 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;