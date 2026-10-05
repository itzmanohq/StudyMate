// src/components/common/PatternLockDialog.tsx
import React, { useState } from 'react';
import { Lock, RefreshCw, Check, ShieldAlert } from 'lucide-react';
import { Button } from './Button';

interface PatternLockProps {
  isOpen: boolean;
  mode?: 'unlock' | 'setup';
  onUnlock?: (pattern: number[]) => Promise<boolean> | boolean;
  onPatternSet?: (pattern: number[]) => Promise<void> | void;
  onClose?: () => void;
}

export const PatternLockDialog: React.FC<PatternLockProps> = ({
  isOpen,
  mode = 'unlock',
  onUnlock,
  onPatternSet,
  onClose,
}) => {
  const [selectedDots, setSelectedDots] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [firstPattern, setFirstPattern] = useState<number[] | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDotClick = (index: number) => {
    if (selectedDots.includes(index)) return;
    setSelectedDots((prev) => [...prev, index]);
    setErrorMessage('');
  };

  const handleReset = () => {
    setSelectedDots([]);
    setErrorMessage('');
  };

  const handleConfirm = async () => {
    if (selectedDots.length < 4) {
      setErrorMessage('Connect at least 4 dots');
      return;
    }

    setIsVerifying(true);
    try {
      if (mode === 'unlock' && onUnlock) {
        const success = await onUnlock(selectedDots);
        if (!success) {
          setErrorMessage('Incorrect pattern, try again');
          setSelectedDots([]);
        }
      } else if (mode === 'setup' && onPatternSet) {
        if (!firstPattern) {
          setFirstPattern(selectedDots);
          setSelectedDots([]);
        } else {
          // Verify confirmation match
          const match =
            firstPattern.length === selectedDots.length &&
            firstPattern.every((v, i) => v === selectedDots[i]);
          if (match) {
            await onPatternSet(selectedDots);
            setSelectedDots([]);
            setFirstPattern(null);
          } else {
            setErrorMessage('Patterns did not match. Draw pattern again.');
            setSelectedDots([]);
            setFirstPattern(null);
          }
        }
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          {mode === 'unlock' ? 'StudyMate Locked' : firstPattern ? 'Confirm Pattern' : 'Draw New Pattern'}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {mode === 'unlock'
            ? 'Connect your 4+ dot security pattern'
            : firstPattern
            ? 'Draw the pattern again to confirm'
            : 'Select at least 4 dots to secure your study records'}
        </p>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-5 p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-6">
          {Array.from({ length: 9 }).map((_, i) => {
            const isSelected = selectedDots.includes(i);
            const order = selectedDots.indexOf(i) + 1;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDotClick(i)}
                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-150 active:scale-90 ${
                  isSelected
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/40 shadow-glow'
                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                }`}
                aria-label={`Dot ${i + 1}`}
              >
                {isSelected ? order : '•'}
              </button>
            );
          })}
        </div>

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 mb-4 animate-shake">
            <ShieldAlert className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isVerifying}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Clear
          </Button>

          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={handleConfirm}
            isLoading={isVerifying}
            disabled={selectedDots.length < 4 || isVerifying}
            leftIcon={<Check className="w-4 h-4" />}
          >
            {mode === 'unlock' ? 'Unlock' : firstPattern ? 'Confirm' : 'Continue'}
          </Button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 text-xs text-slate-500 hover:text-slate-400"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
