'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export interface PasswordRules {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialChar: boolean;
  hasNumber: boolean;
}

export function evaluatePassword(password: string): {
  score: number;
  rules: PasswordRules;
  label: string;
  color: string;
  bgColor: string;
  badgeBg: string;
} {
  const rules: PasswordRules = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const passedCount = Object.values(rules).filter(Boolean).length;

  let label = 'Weak 🌱';
  let color = '#EF4444'; // Red
  let bgColor = 'bg-red-500';
  let badgeBg = 'bg-red-50 text-red-600 border-red-200';

  if (!password) {
    return {
      score: 0,
      rules,
      label: 'Enter password',
      color: '#9CA3AF',
      bgColor: 'bg-gray-300',
      badgeBg: 'bg-gray-50 text-gray-500 border-gray-200',
    };
  }

  if (passedCount <= 2) {
    label = 'Weak 🌱';
    color = '#EF4444';
    bgColor = 'bg-red-500';
    badgeBg = 'bg-red-50 text-red-600 border-red-200';
  } else if (passedCount <= 4) {
    label = 'Getting Stronger 🌿';
    color = '#F59E0B'; // Amber
    bgColor = 'bg-amber-500';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  } else {
    label = 'Invincible Shield 🛡️';
    color = '#10B981'; // Emerald
    bgColor = 'bg-emerald-500';
    badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  return {
    score: (passedCount / 5) * 100,
    rules,
    label,
    color,
    bgColor,
    badgeBg,
  };
}

interface PasswordStrengthMeterProps {
  password?: string;
  showRules?: boolean;
}

export function PasswordStrengthMeter({ password = '', showRules = true }: PasswordStrengthMeterProps) {
  const { score, rules, label, bgColor, badgeBg } = evaluatePassword(password);

  if (!password) return null;

  const ruleItems = [
    { label: '8+ Characters', met: rules.hasMinLength },
    { label: '1 Capital Letter (A-Z)', met: rules.hasUppercase },
    { label: '1 Lowercase Letter (a-z)', met: rules.hasLowercase },
    { label: '1 Special Character (!@#$)', met: rules.hasSpecialChar },
    { label: '1 Number (0-9)', met: rules.hasNumber },
  ];

  return (
    <div className="mt-3 space-y-3 animate-fadeIn select-none">
      {/* Progress Bar & Strength Label Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 h-2 bg-sproutly-forest/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${bgColor} rounded-full transition-all duration-500 ease-out`}
            initial={{ width: '0%' }}
            animate={{ width: `${score}%` }}
          />
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xl transition-colors ${badgeBg}`}
        >
          {label}
        </span>
      </div>

      {/* Rules Checklist Pills */}
      {showRules && (
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {ruleItems.map((rule, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all duration-300 ${
                rule.met
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-700 shadow-sm'
                  : 'bg-sproutly-forest/5 border-sproutly-forest/10 text-sproutly-forest/50'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  rule.met ? 'bg-emerald-500 text-white' : 'bg-sproutly-forest/20 text-transparent'
                }`}
              >
                <Check size={10} strokeWidth={3} />
              </div>
              <span className="truncate">{rule.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
