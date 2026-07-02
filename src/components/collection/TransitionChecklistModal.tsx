'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { usePlants } from '../../hooks/usePlants';

interface TransitionChecklistModalProps {
  plantId: string;
  onClose: () => void;
}

export function TransitionChecklistModal({ plantId, onClose }: TransitionChecklistModalProps) {
  const router = useRouter();
  const { updatePlant } = usePlants();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const items = [
    {
      id: 'soil',
      label: 'Soil Mix Ready?',
      guide: 'soil-mixing'
    },
    {
      id: 'roots',
      label: 'Root Health Checked?',
      guide: 'root-health'
    },
    {
      id: 'drainage',
      label: 'Drainage Holes Confirmed?',
      guide: 'drainage'
    },
    {
      id: 'pot',
      label: 'Pot Size Appropriate?',
      guide: 'pot-sizing'
    }
  ];

  const allChecked = items.every((item) => checked[item.id]);

  const handleComplete = async () => {
    await updatePlant(plantId, {
      pottingStatus: 'own'
    });
    onClose();
  };

  const goToGuide = (_guideId: string) => {
    router.push('/knowledge');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-sproutly-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-sproutly-primary mb-2">
          Nursery Transition
        </h2>
        <p className="text-sproutly-secondary mb-8">
          Complete these checks before repotting your new plant.
        </p>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-sproutly-bg"
            >
              <label className="flex items-center gap-4 cursor-pointer flex-1">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    checked[item.id] ? 'bg-sproutly-primary border-sproutly-primary' : 'border-sproutly-secondary/30'
                  }`}
                >
                  {checked[item.id] && <CheckCircle2 size={16} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={!!checked[item.id]}
                  onChange={() =>
                    setChecked((prev) => ({
                      ...prev,
                      [item.id]: !prev[item.id]
                    }))
                  }
                />
                <span
                  className={`font-semibold ${
                    checked[item.id] ? 'text-sproutly-secondary line-through' : 'text-sproutly-primary'
                  }`}
                >
                  {item.label}
                </span>
              </label>
              <button
                type="button"
                onClick={() => goToGuide(item.guide)}
                className="text-sm text-sproutly-light font-bold hover:text-sproutly-primary px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
              >
                Guide
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 rounded-xl font-bold text-sproutly-secondary bg-sproutly-bg hover:bg-sproutly-secondary/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleComplete}
            disabled={!allChecked}
            className={`flex-1 py-4 rounded-xl font-bold text-white transition-colors ${
              allChecked ? 'bg-sproutly-primary hover:bg-sproutly-secondary' : 'bg-sproutly-secondary/30 cursor-not-allowed'
            }`}
          >
            Complete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
