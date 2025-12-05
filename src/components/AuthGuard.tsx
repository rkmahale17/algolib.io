import React, { useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface AuthGuardProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

/**
 * AuthGuard wraps components that should only be accessible to signed-in users.
 * Shows a sign-in prompt for unauthenticated users.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallbackTitle = "Sign in required",
  fallbackDescription = "Please sign in to access this feature.",
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="h-full flex flex-col items-center justify-center bg-muted/20 border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-lg">{fallbackTitle}</CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            {fallbackDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/auth">
            <Button className="gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
