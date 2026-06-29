import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthLayout } from '../components/PreLogin/AuthLayout';
import { supabase } from '../utils/supabaseClient';

interface SignupPageProps {
  onLogin: () => void;
  onNavigate: (state: 'landing' | 'login' | 'signup') => void;
}

export function SignupPage({ onLogin, onNavigate }: SignupPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple password strength calculation
  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };
  const strength = getStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: fullName
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        // If email confirmation is enabled, notify.
        // If not, Supabase will log them in immediately.
        if (data.session === null && data.user) {
          setError('Success! Please check your email inbox to confirm your registration.');
        } else {
          onLogin();
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      type="signup"
      quote="Every great garden starts with a single seed."
      onNavigate={onNavigate}
    >
      <div className="mb-8 text-left">
        <h1 className="text-4xl font-serif text-sproutly-forest mb-3">
          Let's get growing.
        </h1>
        <p className="text-sproutly-forest/70">
          Create your account in under a minute — no green thumb required.
        </p>
      </div>

      {error && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-semibold text-left border ${
          error.startsWith('Success!') 
            ? 'bg-green-50 border-green-200 text-green-600' 
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {error}
        </div>
      )}

      <form className="space-y-4 text-left" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-sproutly-forest mb-1.5"
          >
            Full name
          </label>
          <input
            type="text"
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-sproutly-forest/20 bg-white text-sproutly-forest placeholder-sproutly-forest/40 focus:outline-none focus:ring-2 focus:ring-sproutly-sage focus:border-transparent transition-all"
            placeholder="Jane Doe"
            required
            disabled={isLoading}
          />
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-sproutly-forest/20 bg-white text-sproutly-forest placeholder-sproutly-forest/40 focus:outline-none focus:ring-2 focus:ring-sproutly-sage focus:border-transparent transition-all"
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-sproutly-forest/20 bg-white text-sproutly-forest placeholder-sproutly-forest/40 focus:outline-none focus:ring-2 focus:ring-sproutly-sage focus:border-transparent transition-all pr-12"
              placeholder="••••••••"
              required
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
          {password.length > 0 && (
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
          className="w-full bg-sproutly-forest text-sproutly-cream py-4 rounded-full text-base font-medium hover:bg-sproutly-forest/90 transition-colors shadow-lg shadow-sproutly-forest/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
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

      <div className="my-6 flex items-center gap-4">
        <div className="h-px bg-sproutly-forest/10 flex-grow"></div>
        <span className="text-sm text-sproutly-forest/50">
          or continue with
        </span>
        <div className="h-px bg-sproutly-forest/10 flex-grow"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onLogin}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-sproutly-forest/10 bg-white text-sproutly-forest font-medium hover:bg-sproutly-cream transition-colors"
        >
          <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">
            G
          </div>
          Google
        </button>
        <button
          type="button"
          onClick={onLogin}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-sproutly-forest/10 bg-white text-sproutly-forest font-medium hover:bg-sproutly-cream transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.56.12 2.89.69 3.9 1.62-3.41 2.05-2.83 6.64.55 7.97-1.03 1.54-2.05 2.43-3.03 3.38zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Apple
        </button>
      </div>

      <p className="text-center mt-6 text-sm text-sproutly-forest/70">
        Already have an account?{' '}
        <button
          onClick={() => onNavigate('login')}
          className="font-semibold text-sproutly-forest hover:text-sproutly-sage transition-colors underline underline-offset-4"
        >
          Sign in instead
        </button>
      </p>
    </AuthLayout>
  );
}
