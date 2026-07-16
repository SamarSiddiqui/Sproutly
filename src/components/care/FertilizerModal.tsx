import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, FlaskConical } from 'lucide-react';
import { useFertilizerLogs } from '../../hooks/useFertilizerLogs';

interface FertilizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plantId: string;
  selectedDate: string; // YYYY-MM-DD
  aiRecommendation?: string;
}

export function FertilizerModal({ isOpen, onClose, plantId, selectedDate, aiRecommendation }: FertilizerModalProps) {
  const { logs, addLog } = useFertilizerLogs(plantId);
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDateLogs = logs.filter(l => l.log_date === selectedDate);
  const displayDate = selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type.trim()) return;
    setIsSubmitting(true);
    try {
      await addLog({
        plant_id: plantId,
        log_date: selectedDate,
        fertilizer_type: type,
        notes: notes
      });
      setType('');
      setNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-sproutly-primary/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-sproutly-bg text-sproutly-secondary hover:text-sproutly-primary rounded-full z-10">
          <X size={20} />
        </button>

        {/* Left Side: Form and Logs */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-sproutly-secondary/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-sproutly-warning/20 text-sproutly-warning rounded-xl">
              <FlaskConical size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-sproutly-primary">Fertilizer Log</h2>
              <p className="text-sproutly-secondary font-medium">{displayDate}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div>
              <label className="block text-sm font-bold text-sproutly-primary mb-1.5">Fertilizer Type / Brand</label>
              <input 
                type="text" 
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g. Liquid Kelp, 10-10-10, FoxFarm"
                className="w-full bg-sproutly-bg border border-sproutly-secondary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sproutly-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-sproutly-primary mb-1.5">Notes & Amount</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 1 capful diluted in 1 gallon of water"
                rows={3}
                className="w-full bg-sproutly-bg border border-sproutly-secondary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sproutly-primary transition-colors resize-none"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || !type.trim()}
              className="w-full flex items-center justify-center gap-2 bg-sproutly-primary text-white font-bold py-3.5 rounded-xl hover:bg-sproutly-primary/90 disabled:opacity-50 transition-colors"
            >
              <Plus size={18} />
              {isSubmitting ? 'Saving...' : 'Add Log Entry'}
            </button>
          </form>

          {selectedDateLogs.length > 0 && (
            <div>
              <h3 className="font-bold text-sproutly-primary mb-3">Logs for this date</h3>
              <div className="space-y-3">
                {selectedDateLogs.map((log) => (
                  <div key={log.id} className="bg-sproutly-bg p-4 rounded-xl border border-sproutly-secondary/10">
                    <div className="font-bold text-sproutly-primary">{log.fertilizer_type}</div>
                    {log.notes && <p className="text-sm text-sproutly-secondary mt-1">{log.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: AI Recommendations */}
        <div className="md:w-80 p-6 md:p-8 bg-sproutly-light/5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-sproutly-primary" />
            <h3 className="font-bold text-sproutly-primary text-lg">AI Botanist Advice</h3>
          </div>
          {aiRecommendation ? (
            <div className="bg-white p-5 rounded-2xl border border-sproutly-secondary/10 shadow-sm flex-1">
              <p className="text-sm font-medium leading-relaxed text-sproutly-primary">
                {aiRecommendation}
              </p>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-sproutly-secondary/10 shadow-sm flex-1 flex items-center justify-center text-center">
              <p className="text-sm text-sproutly-secondary font-semibold animate-pulse">Consulting Sproutly AI...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
