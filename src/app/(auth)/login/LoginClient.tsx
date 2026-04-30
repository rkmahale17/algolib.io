'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { usePostHog } from '@posthog/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import logo from '@/assets/logo.svg';


const LoginClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  const initialMode = searchParams.get('mode');

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Handle mode changes from URL
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') setIsSignUp(true);
    else if (mode === 'login') setIsSignUp(false);
  }, [searchParams]);

  useEffect(() => {
    if (!supabase) return;

    // Check if we are on the login page specifically to avoid redirection loops
    const isLoginPage = window.location.pathname === '/login';

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && isLoginPage) {
        const next = searchParams.get('next') || '/';
        router.push(next);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session && isLoginPage) {
        const next = searchParams.get('next') || '/';
        router.push(next);
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, searchParams]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      toast.error('Authentication is not available.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        posthog?.identify(email, { email, name: fullName });
        posthog?.capture('user_signed_up', { method: 'email' });
        setShowVerificationMessage(true);
        toast.success('Account created! Please check your email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        posthog?.identify(email, { email });
        posthog?.capture('user_logged_in', { method: 'email' });
        
        toast.success('Welcome back!');
        
        const next = searchParams.get('next') || '/';
        router.push(next);
        router.refresh();
      }
    } catch (error: any) {
      if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email address.');
      } else {
        toast.error(error.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) return;

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset email sent!');
      setIsForgotPassword(false);
      setEmail('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!supabase) return;

    setIsLoading(true);
    try {
      const next = searchParams.get('next') || '';
      const redirectTo = `${window.location.origin}${next.startsWith('/') ? next : '/' + next}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo.endsWith('/') ? redirectTo.slice(0, -1) : redirectTo,
        },
      });

      if (error) throw error;
      posthog?.capture('user_logged_in_google');
    } catch (error: any) {
      toast.error(error.message || 'Google sign in failed');
      setIsLoading(false);
    }
  };

  const resetToSignIn = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
    setShowVerificationMessage(false);
    setEmail('');
    setPassword('');
    setFullName('');
  };

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
            <h1 className="text-2xl font-semibold mb-2">
              {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isForgotPassword
                ? 'Enter your email to receive reset instructions'
                : isSignUp
                  ? 'Start your journey to master algorithms'
                  : 'Continue learning algorithms visually'}
            </p>
          </div>

          {showVerificationMessage && (
            <Alert className="mb-6 border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-sm">
                <strong>Verification email sent!</strong> Check your inbox.
              </AlertDescription>
            </Alert>
          )}

          {isForgotPassword ? (
            <>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      autoFocus
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Send Reset Link'}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={resetToSignIn}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-medium border-2 hover:bg-accent transition-all"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground">or continue with email</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4 mt-6">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={isSignUp}
                        disabled={isLoading}
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-xs text-primary hover:underline font-medium"
                        disabled={isLoading}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
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
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {isSignUp ? <>Already have an account? <span className="text-primary font-medium">Sign in</span></>
                    : <>Don't have an account? <span className="text-primary font-medium">Sign up</span></>}
                </button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LoginClient;
