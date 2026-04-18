'use client';

import { PremiumLoader } from "@/components/PremiumLoader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

  useEffect(() => {
    if (!supabase) {
      console.warn("Supabase client is not initialized. Preventing access to protected route.");
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        router.push('/login');
      } else if (!adminId || session.user.id !== adminId) {
        router.push('/');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.push('/login');
      } else if (!adminId || session.user.id !== adminId) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, adminId]);

  if (loading) {
    return <PremiumLoader />;
  }

  if (!session || !adminId || session.user.id !== adminId) {
    return null; // Redirection handled by useEffect
  }

  return <>{children}</>;
};
