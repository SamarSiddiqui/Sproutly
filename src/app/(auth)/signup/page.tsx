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

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupInputs = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (!loading && session) {
      router.replace('/dashboard');
    }
  }, [session, loading, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const password = watch('password');

  const getStrength = () => {
    if (!password || password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };
  const strength = getStrength();

  const onSubmit = async (data: SignupInputs) => {
    setError('');
    setIsLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        if (signUpData.session === null && signUpData.user) {
          setError('Success! Please check your email inbox to confirm your registration.');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (state: 'landing' | 'login' | 'signup') => {
    if (state === 'landing') {
      router.push('/');
    } else if (state === 'login') {
      router.push('/login');
    }
  };

  return (
    <AuthLayout
      type="signup"
      quote="Every great garden starts with a single seed."
      onNavigate={handleNavigate}
    >
      <div className="mb-5 text-left">
        <h1 className="text-3xl md:text-4xl font-serif text-sproutly-forest mb-1.5">
          Start your indoor jungle.
        </h1>
        <p className="text-sm md:text-base text-sproutly-forest/70">
          Create an account to track your plant collection for free.
        </p>
      </div>

      {error && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-semibold text-left border ${
            error.startsWith('Success!')
              ? 'bg-green-50 border-green-200 text-green-600'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}
        >
          {error}
        </div>
      )}

      <form className="space-y-4 text-left" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-sproutly-forest mb-1.5"
          >
            Full name
          </label>
          <input
            type="text"
            id="fullName"
            {...register('fullName')}
            className={`w-full px-4 py-3.5 rounded-xl border ${
              errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-sproutly-forest/20 focus:ring-sproutly-sage'
            } bg-white text-sproutly-forest placeholder-sproutly-forest/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            placeholder="Jane Doe"
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs font-semibold mt-1">{errors.fullName.message}</p>
          )}
        </div>

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

          {password && password.length > 0 && (
            <div className="mt-2.5">
              <div className="flex gap-1.5 h-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-grow rounded-full transition-colors ${
                      i < strength
                        ? strength === 1
                          ? 'bg-red-500'
                          : strength === 2
                          ? 'bg-yellow-500'
                          : 'bg-green-600'
                        : 'bg-sproutly-forest/10'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-sproutly-forest/50 mt-1.5 block">
                {strength === 1 && 'Weak password'}
                {strength === 2 && 'Good password'}
                {strength === 3 && 'Strong green-thumb password!'}
              </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sproutly-forest text-sproutly-cream py-3.5 rounded-full text-base font-medium hover:bg-sproutly-forest/90 transition-colors shadow-lg shadow-sproutly-forest/20 mt-3 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <div className="my-4 flex items-center gap-4">
        <div className="h-px bg-sproutly-forest/10 flex-grow"></div>
        <span className="text-xs text-sproutly-forest/50">
          or continue with
        </span>
        <div className="h-px bg-sproutly-forest/10 flex-grow"></div>
      </div>

      <button
        type="button"
        onClick={() => router.push('/dashboard')}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-sproutly-forest/15 bg-white text-sproutly-forest font-medium hover:bg-sproutly-cream/80 hover:border-sproutly-forest/30 transition-all shadow-sm"
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
        Sign up with Google
      </button>

      <p className="text-center mt-5 text-sm text-sproutly-forest/70">
        Already have an account?{' '}
        <button
          onClick={() => handleNavigate('login')}
          className="font-semibold text-sproutly-forest hover:text-sproutly-sage transition-colors underline underline-offset-4"
        >
          Sign in instead
        </button>
      </p>
    </AuthLayout>
  );
}
