'use client';

import { PremiumLoader } from "@/components/PremiumLoader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, isAuthLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.push('/login');
      } else if (profile && profile.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, profile, isAuthLoading, router]);

  if (isAuthLoading) {
    return <PremiumLoader />;
  }

  if (!user || !profile || profile.role !== 'admin') {
    return null; // Redirection handled by useEffect
  }

  return <>{children}</>;
};
