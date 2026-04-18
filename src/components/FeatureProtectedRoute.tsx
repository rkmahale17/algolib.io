'use client';

import { useRouter } from "next/navigation";
import { useFeatureFlags } from "@/contexts/FeatureFlagContext";
import { PremiumLoader } from "@/components/PremiumLoader";
import { useEffect } from "react";

interface FeatureProtectedRouteProps {
  children: React.ReactNode;
  flag: string; // We use string instead of keyof FeatureFlag to be flexible with dynamic flags
  redirectTo?: string;
}

export const FeatureProtectedRoute = ({ 
  children, 
  flag, 
  redirectTo = "/" 
}: FeatureProtectedRouteProps) => {
  const { flags, isLoading } = useFeatureFlags();
  const router = useRouter();
  const isEnabled = flags[flag] ?? false;

  useEffect(() => {
    if (!isLoading && !isEnabled) {
      router.replace(redirectTo);
    }
  }, [isLoading, isEnabled, redirectTo, router]);

  if (isLoading) {
    return <PremiumLoader text="Initializing features..." />;
  }

  if (!isEnabled) {
    return null; // Redirection handled by useEffect
  }

  return <>{children}</>;
};
