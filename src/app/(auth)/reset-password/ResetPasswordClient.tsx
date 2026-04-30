'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import logo from '@/assets/logo.svg';

const ResetPasswordClient = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;
    let timerId: NodeJS.Timeout;

    const checkSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      if (error || errorDescription) {
        toast.error(errorDescription || 'Reset link is invalid or expired');
        router.push('/login');
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        // Remove code from URL so we don't accidentally exchange it again
        if (window.history.replaceState) {
          const newUrl = window.location.pathname;
          window.history.replaceState({ path: newUrl }, '', newUrl);
        }

        if (exchangeError) {
          // In React Strict Mode, the effect might run twice. The first exchange succeeds, 
          // the second fails because the code is consumed. Check if we actually have a session.
          const { data: { session: existingSession } } = await supabase.auth.getSession();
          
          if (!existingSession) {
            toast.error('Failed to validate reset link');
            router.push('/login');
            return;
          }
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!mounted) return;

      if (session) {
        setIsVerifying(false);
      } else {
        // If no session immediately and no code to exchange, it's likely invalid
        if (!code) {
          toast.error('Invalid or expired reset link');
          router.push('/login');
        } else {
          // If we had a code but session still null (rare), wait a bit
          timerId = setTimeout(async () => {
            const { data: { session: finalSession } } = await supabase.auth.getSession();
            if (mounted && !finalSession) {
              toast.error('Session could not be established');
              router.push('/login');
            }
          }, 3000);
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        if (timerId) clearTimeout(timerId);
        setIsVerifying(false);
      } else if (event === 'SIGNED_OUT' && !isSuccess) {
        router.push('/login');
      }
    });

    return () => {
      mounted = false;
      if (timerId) clearTimeout(timerId);
      subscription.unsubscribe();
    };
  }, [router, isSuccess]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      toast.error('Authentication is not available.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success('Password updated successfully!');
      
      // Clear session to force login with new password
      await supabase.auth.signOut();
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <Card className="w-full max-w-[440px] shadow-xl border-border/50 p-12 text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-6" />
          <h1 className="text-xl font-medium mb-2">Verifying reset link...</h1>
          <p className="text-sm text-muted-foreground">
            Please wait while we validate your secure access.
          </p>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <Card className="w-full max-w-[440px] shadow-xl border-border/50 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-2">Password Updated</h1>
          <p className="text-muted-foreground mb-8">
            Your password has been successfully reset. Redirecting you to login...
          </p>
          <Button onClick={() => router.push('/login')} className="w-full h-11">
            Go to Login Now
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-[440px] shadow-xl border-border/50">
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden p-3">
                <img 
                  src={typeof logo === 'string' ? logo : (logo as any).src} 
                  alt="RulCode Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Set New Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your new password below to regain access to your account.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="pl-10 h-11"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-medium mt-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Update Password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
              disabled={isLoading}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResetPasswordClient;
