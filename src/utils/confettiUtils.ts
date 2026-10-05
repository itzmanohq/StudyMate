// src/utils/confettiUtils.ts - Celebration animations
import confetti from 'canvas-confetti';

export function fireStreakConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#f59e0b', '#ef4444', '#6366f1', '#10b981'],
    });
    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#f59e0b', '#ef4444', '#6366f1', '#10b981'],
    });
  } catch {
    // Ignore in unsupported environments
  }
}

export function fireAchievementConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#818cf8', '#34d399'],
    });
  } catch {
    // Ignore
  }
}
