import { Navigate, useLocation } from "react-router-dom";
import { useFeatureFlags } from "@/contexts/FeatureFlagContext";
import { FeatureFlag } from "@/types/featureFlags";
import { PremiumLoader } from "@/components/PremiumLoader";

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
  const location = useLocation();
  const isEnabled = flags[flag] ?? false;

  if (isLoading) {
    return <PremiumLoader text="Initializing features..." />;
  }

  if (!isEnabled) {
    // Optionally we could show a "Feature Disabled" page instead of redirecting
    // For now, redirect to home
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
