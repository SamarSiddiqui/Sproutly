'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { AuthLayout } from '../../../components/PreLogin/AuthLayout';
import { PasswordStrengthMeter } from '../../../components/PasswordStrengthMeter';
import { supabase } from '../../../utils/supabaseClient';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include at least 1 capital letter (A-Z)')
    .regex(/[a-z]/, 'Must include at least 1 lowercase letter (a-z)')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/, 'Must include at least 1 special character (!@#$)')
    .regex(/[0-9]/, 'Must include at least 1 number (0-9)'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordInputs) => {
    setError('');
    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.replace('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (state: 'landing' | 'login' | 'signup') => {
    if (state === 'landing') {
      router.push('/');
    } else if (state === 'login') {
      router.push('/login');
    } else if (state === 'signup') {
      router.push('/signup');
    }
  };

  if (success) {
    return (
      <AuthLayout
        type="login"
        quote="Pruning back the old leaves makes space for new branches to thrive."
        onNavigate={handleNavigate}
      >
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-sproutly-forest flex items-center justify-center shadow-inner animate-bounce">
            <KeyRound size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-serif text-sproutly-forest">Password Updated</h1>
            <p className="text-xs text-sproutly-forest/60 max-w-xs leading-normal">
              Your credentials have been securely reset. Redirecting you to the login screen now...
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      type="login"
      quote="Pruning back the old leaves makes space for new branches to thrive."
      onNavigate={handleNavigate}
    >
      <div className="mb-6 text-left">
        <h1 className="text-3xl md:text-4xl font-serif text-sproutly-forest mb-2">
          New Password
        </h1>
        <p className="text-sm md:text-base text-sproutly-forest/70">
          Enter your new security password below to restore access.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-600 text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Password field */}
        <div>
          <label className="block text-sm font-medium text-sproutly-forest mb-1.5">New Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-sproutly-forest/10 focus:outline-none focus:border-sproutly-forest/30 focus:ring-1 focus:ring-sproutly-forest/30 transition-all placeholder-sproutly-forest/20 text-sproutly-forest font-medium text-sm pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sproutly-forest/40 hover:text-sproutly-forest/70 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {/* Password Strength Meter */}
        <PasswordStrengthMeter password={password} />

        {/* Confirm Password field */}
        <div>
          <label className="block text-sm font-medium text-sproutly-forest mb-1.5">Confirm New Password</label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-sproutly-forest/10 focus:outline-none focus:border-sproutly-forest/30 focus:ring-1 focus:ring-sproutly-forest/30 transition-all placeholder-sproutly-forest/20 text-sproutly-forest font-medium text-sm pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sproutly-forest/40 hover:text-sproutly-forest/70 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sproutly-forest text-sproutly-cream py-3.5 rounded-full text-base font-medium hover:bg-sproutly-forest/90 transition-colors shadow-lg shadow-sproutly-forest/20 mt-6 flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-sproutly-forest/60">
          Cancel reset?{' '}
          <Link
            href="/login"
            className="font-bold text-sproutly-forest hover:text-sproutly-sage transition-colors underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
