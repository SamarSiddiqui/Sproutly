'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, ShieldCheck } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-sproutly-primary/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-sproutly-secondary/10 overflow-hidden text-center z-10"
        >
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-sproutly-secondary hover:text-sproutly-primary hover:bg-sproutly-bg rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          {/* Icon Badge */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-sproutly-urgent/10 text-sproutly-urgent flex items-center justify-center mb-5 border border-sproutly-urgent/20 shadow-inner">
            <LogOut size={28} className="translate-x-0.5" />
          </div>

          {/* Content */}
          <h3 className="text-2xl font-bold font-serif text-sproutly-primary mb-2">
            Leaving your garden?
          </h3>
          <p className="text-sm text-sproutly-secondary mb-6 leading-relaxed">
            Are you sure you want to log out? Don’t worry, your plant care schedules and growth logs will be safely stored for your return.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sproutly-primary/70 bg-sproutly-bg py-2.5 px-4 rounded-xl mb-6 border border-sproutly-secondary/10">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <span>All garden progress auto-saved</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-sproutly-secondary/20 text-sproutly-primary font-bold text-sm hover:bg-sproutly-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onConfirm();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-sproutly-urgent text-white font-bold text-sm hover:bg-red-600 shadow-md shadow-sproutly-urgent/20 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
