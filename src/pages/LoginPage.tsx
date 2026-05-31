import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../components/PreLogin/AuthLayout';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate: (state: 'landing' | 'login' | 'signup') => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <AuthLayout
      type="login"
      quote="Welcome back to your quiet little corner of the garden."
      onNavigate={onNavigate}
    >
      <div className="mb-10 text-left">
        <h1 className="text-4xl font-serif text-sproutly-forest mb-3">
          Welcome back.
        </h1>
        <p className="text-sproutly-forest/70">
          Your plants missed you. Sign in to keep them thriving.
        </p>
      </div>

      <form className="space-y-5 text-left" onSubmit={handleSubmit}>
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
            className="w-full px-4 py-3.5 rounded-xl border border-sproutly-forest/20 bg-white text-sproutly-forest placeholder-sproutly-forest/40 focus:outline-none focus:ring-2 focus:ring-sproutly-sage focus:border-transparent transition-all"
            placeholder="you@example.com"
            required
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
              className="w-full px-4 py-3.5 rounded-xl border border-sproutly-forest/20 bg-white text-sproutly-forest placeholder-sproutly-forest/40 focus:outline-none focus:ring-2 focus:ring-sproutly-sage focus:border-transparent transition-all pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sproutly-forest/40 hover:text-sproutly-forest transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
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
          className="w-full bg-sproutly-forest text-sproutly-cream py-4 rounded-full text-base font-medium hover:bg-sproutly-forest/90 transition-colors shadow-lg shadow-sproutly-forest/20 mt-4"
        >
          Sign in
        </button>
      </form>

      <div className="my-8 flex items-center gap-4">
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

      <p className="text-center mt-8 text-sm text-sproutly-forest/70">
        New to Sproutly?{' '}
        <button
          onClick={() => onNavigate('signup')}
          className="font-semibold text-sproutly-forest hover:text-sproutly-sage transition-colors underline underline-offset-4"
        >
          Create an account →
        </button>
      </p>
    </AuthLayout>
  );
}
