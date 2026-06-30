"use client";

import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { ReactNode, useEffect, useState } from "react";

interface FeatureGuardProps {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const FeatureGuard = ({ flag, children, fallback = null }: FeatureGuardProps) => {
  const isEnabled = useFeatureFlag(flag);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial hydration, always return fallback to prevent mismatches
  // (Feature flags are often client-hydrated or influenced by local state)
  if (!mounted || !isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
