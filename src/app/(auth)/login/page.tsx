'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthLayout } from '../../../components/PreLogin/AuthLayout';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (!loading && session) {
      router.replace('/botanical-base');
    }
  }, [session, loading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInputs) => {
    setError('');
    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/botanical-base');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during Google sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (state: 'landing' | 'login' | 'signup') => {
    if (state === 'landing') {
      router.push('/');
    } else if (state === 'signup') {
      router.push('/signup');
    }
  };

  return (
    <AuthLayout
      type="login"
      quote="Welcome back to your quiet little corner of the garden."
      onNavigate={handleNavigate}
    >
      <div className="mb-6 text-left">
        <h1 className="text-3xl md:text-4xl font-serif text-sproutly-forest mb-2">
          Welcome back.
        </h1>
        <p className="text-sm md:text-base text-sproutly-forest/70">
          Your plants missed you. Sign in to keep them thriving.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-600 text-left">
          {error}
        </div>
      )}

      <form className="space-y-5 text-left" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-sproutly-forest mb-1.5"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`w-full px-4 py-3.5 rounded-xl border ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-sproutly-forest/20 focus:ring-sproutly-sage'
            } bg-white text-sproutly-forest placeholder-sproutly-forest/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            placeholder="you@example.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-semibold mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-sproutly-forest mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password')}
              className={`w-full px-4 py-3.5 rounded-xl border ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-sproutly-forest/20 focus:ring-sproutly-sage'
              } bg-white text-sproutly-forest placeholder-sproutly-forest/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all pr-12`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sproutly-forest/40 hover:text-sproutly-forest transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs font-semibold mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-sproutly-forest/20 text-sproutly-sage focus:ring-sproutly-sage cursor-pointer"
            />
            <span className="text-sm text-sproutly-forest/70 group-hover:text-sproutly-forest transition-colors">
              Remember me
            </span>
          </label>
          <button
            type="button"
            className="text-sm font-medium text-sproutly-forest hover:text-sproutly-sage transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sproutly-forest text-sproutly-cream py-3.5 rounded-full text-base font-medium hover:bg-sproutly-forest/90 transition-colors shadow-lg shadow-sproutly-forest/20 mt-3 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-4">
        <div className="h-px bg-sproutly-forest/10 flex-grow"></div>
        <span className="text-xs text-sproutly-forest/50">
          or continue with
        </span>
        <div className="h-px bg-sproutly-forest/10 flex-grow"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-sproutly-forest/15 bg-white text-sproutly-forest font-medium hover:bg-sproutly-cream/80 hover:border-sproutly-forest/30 transition-all shadow-sm disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Sign in with Google
      </button>

      <p className="text-center mt-6 text-sm text-sproutly-forest/70">
        New to Sproutly?{' '}
        <button
          onClick={() => handleNavigate('signup')}
          className="font-semibold text-sproutly-forest hover:text-sproutly-sage transition-colors underline underline-offset-4"
        >
          Create an account →
        </button>
      </p>
    </AuthLayout>
  );
}
