import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { ReactNode } from "react";

interface FeatureGuardProps {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const FeatureGuard = ({ flag, children, fallback = null }: FeatureGuardProps) => {
  const isEnabled = useFeatureFlag(flag);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
