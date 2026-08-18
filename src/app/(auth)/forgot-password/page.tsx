'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { AuthLayout } from '../../../components/PreLogin/AuthLayout';
import { supabase } from '../../../utils/supabaseClient';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
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
        quote="Every new sprout needs a tiny drop of helper water to grow."
        onNavigate={handleNavigate}
      >
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-sproutly-forest flex items-center justify-center shadow-inner">
            <MailCheck size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-serif text-sproutly-forest">Check your email</h1>
            <p className="text-xs text-sproutly-forest/60 max-w-xs leading-normal">
              We've dispatched a recovery link to your inbox. Please click the link to securely update your credentials.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full bg-sproutly-forest text-sproutly-cream py-3 rounded-full text-sm font-semibold hover:bg-sproutly-forest/90 transition-colors shadow-lg shadow-sproutly-forest/20 mt-4 flex items-center justify-center"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      type="login"
      quote="Every new sprout needs a tiny drop of helper water to grow."
      onNavigate={handleNavigate}
    >
      <div className="mb-6 text-left">
        <h1 className="text-3xl md:text-4xl font-serif text-sproutly-forest mb-2">
          Reset Password
        </h1>
        <p className="text-sm md:text-base text-sproutly-forest/70">
          Enter your email address and we'll send you a recovery link.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-600 text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
        <div>
          <label className="block text-sm font-medium text-sproutly-forest mb-1.5">
            Email address
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="e.g. gardener@sproutly.com"
            className="w-full px-4 py-3.5 rounded-xl border border-sproutly-forest/10 focus:outline-none focus:border-sproutly-forest/30 focus:ring-1 focus:ring-sproutly-forest/30 transition-all placeholder-sproutly-forest/20 text-sproutly-forest font-medium text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-semibold mt-1.5">{errors.email.message}</p>
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
              Sending Link...
            </>
          ) : (
            'Send Recovery Link'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-sproutly-forest/60">
          Remembered your password?{' '}
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
