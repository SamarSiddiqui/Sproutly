'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Leaf, TreeDeciduous } from 'lucide-react';

export interface PasswordRules {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialChar: boolean;
  hasNumber: boolean;
}

export function evaluatePassword(password: string) {
  const rules: PasswordRules = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const passedCount = Object.values(rules).filter(Boolean).length;

  let stage: 'seed' | 'sprout' | 'growing' | 'flourishing' = 'seed';
  let bgColor = 'bg-red-500';
  let iconColor = 'text-red-500';

  if (!password) {
    return { score: 0, stage: 'seed', bgColor: 'bg-gray-300', iconColor: 'text-gray-400', rules };
  }

  if (passedCount <= 2) {
    stage = 'sprout';
    bgColor = 'bg-red-500';
    iconColor = 'text-red-500';
  } else if (passedCount <= 4) {
    stage = 'growing';
    bgColor = 'bg-amber-500';
    iconColor = 'text-amber-500';
  } else {
    stage = 'flourishing';
    bgColor = 'bg-emerald-500';
    iconColor = 'text-emerald-500';
  }

  return {
    score: (passedCount / 5) * 100,
    stage,
    bgColor,
    iconColor,
    rules,
  };
}

interface PasswordStrengthMeterProps {
  password?: string;
}

export function PasswordStrengthMeter({ password = '' }: PasswordStrengthMeterProps) {
  const { score, stage, bgColor, iconColor } = evaluatePassword(password);

  if (!password) return null;

  return (
    <div className="mt-2.5 flex items-center gap-3 animate-fadeIn select-none">
      {/* Dynamic Animated Progress Bar */}
      <div className="flex-1 h-2 bg-sproutly-forest/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${bgColor} rounded-full transition-all duration-500 ease-out`}
          initial={{ width: '0%' }}
          animate={{ width: `${score}%` }}
        />
      </div>

      {/* Growing Plant Icon (Sprout -> Leaf -> Lush Tree) */}
      <div className="w-7 h-7 flex items-center justify-center shrink-0">
        <AnimatePresence mode="wait">
          {stage === 'sprout' && (
            <motion.div
              key="sprout"
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 0.85, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={iconColor}
              title="Weak password"
            >
              <Sprout size={18} />
            </motion.div>
          )}

          {stage === 'growing' && (
            <motion.div
              key="growing"
              initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={iconColor}
              title="Getting stronger"
            >
              <Leaf size={20} />
            </motion.div>
          )}

          {stage === 'flourishing' && (
            <motion.div
              key="flourishing"
              initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
              animate={{ scale: 1.25, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className={`${iconColor} filter drop-shadow-sm`}
              title="Strong green-thumb password!"
            >
              <TreeDeciduous size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
