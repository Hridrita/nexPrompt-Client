'use client';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

const SessionRefresher = ({ redirectTo = '/all-prompt' }) => {
  const { refetch: refetchSession, data: session } = authClient.useSession(); // ✅ top-level

  useEffect(() => {
    const refresh = async () => {
      await refetchSession();
      // session state auto-update হবে refetch-এর পরে
    };
    refresh();
  }, []);

  useEffect(() => {
    if (session?.user?.plan === 'premium') {
      console.log('✅ Session updated to premium!');
      setTimeout(() => {
        window.location.href =  redirectTo; ;
      }, 1000);
    }
  }, [session?.user?.plan]); // plan বদলালে redirect

  return null;
};

export default SessionRefresher;