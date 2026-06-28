'use client';

import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const SessionRefresher = () => {
  const router = useRouter();
  const { refetch: refetchSession } = authClient.useSession();

  useEffect(() => {
    const refresh = async () => {
      try {
        console.log('🔄 Refreshing session...');
        
        
        await refetchSession();
        
        
        const { data: session } = authClient.useSession();
        
        if (session?.user?.plan === 'premium') {
          console.log('✅ Session updated to premium!');
          
          //dashboard redirect
          setTimeout(() => {
            window.location.href = '/dashboard/user/my-profile';
          }, 1000);
        } else {
          console.log('⏳ Waiting for session update...');
          
         
          setTimeout(async () => {
            await refetchSession();
            const { data: newSession } = authClient.useSession();
            if (newSession?.user?.plan === 'premium') {
              window.location.href = '/dashboard/user/my-profile';
            }
          }, 2000);
        }
      } catch (error) {
        console.error('❌ Error refreshing session:', error);
      }
    };

    refresh();
  }, []);

  return null;
};

export default SessionRefresher;