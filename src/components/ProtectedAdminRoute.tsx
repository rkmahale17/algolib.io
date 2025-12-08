import { Navigate } from "react-router-dom";
import { PremiumLoader } from "@/components/PremiumLoader";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const adminId = import.meta.env.VITE_ADMIN_USER_ID;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <PremiumLoader />;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Deny access if admin ID is not configured or if user is not the admin
  if (!adminId || session.user.id !== adminId) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
