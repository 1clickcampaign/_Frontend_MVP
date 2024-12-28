'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';


export default function ClientRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const publicRoutes = ['/login', '/signup', '/auth/callback', '/auth/confirm'];
      const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

      if (!user && !isPublicRoute) {
        router.replace('/login');
      } else if (user && isPublicRoute) {
        router.replace('/home');
      }

      setIsLoading(false);
    };

    checkSession();
  }, [pathname, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
}
