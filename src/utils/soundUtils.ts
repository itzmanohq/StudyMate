// src/utils/soundUtils.ts - Web Audio API synthesizer for reminders, alarms and achievements

class SoundSynthesizer {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  // Pleasant double chime for reminder / alert
  public playChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Tone 1: E5
    this.playTone(ctx, 659.25, now, 0.15, 'sine');
    // Tone 2: G#5
    this.playTone(ctx, 830.61, now + 0.12, 0.25, 'sine');
  }

  // Calming gentle bell
  public playGentle() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    this.playTone(ctx, 523.25, now, 0.4, 'triangle'); // C5
    this.playTone(ctx, 659.25, now + 0.2, 0.5, 'triangle'); // E5
  }

  // Radar style rhythmic beep
  public playRadar() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    this.playTone(ctx, 880, now, 0.08, 'sawtooth');
    this.playTone(ctx, 880, now + 0.15, 0.08, 'sawtooth');
  }

  // Zen singing bowl harmonic
  public playZen() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    this.playTone(ctx, 432, now, 0.8, 'sine');
    this.playTone(ctx, 864, now + 0.1, 0.6, 'sine');
  }

  // Completion Ding (Celebration)
  public playSuccess() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    this.playTone(ctx, 523.25, now, 0.1, 'sine'); // C5
    this.playTone(ctx, 659.25, now + 0.08, 0.1, 'sine'); // E5
    this.playTone(ctx, 783.99, now + 0.16, 0.1, 'sine'); // G5
    this.playTone(ctx, 1046.50, now + 0.24, 0.35, 'sine'); // C6
  }

  private playTone(ctx: AudioContext, frequency: number, startTime: number, duration: number, type: OscillatorType) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio context error or blocked
    }
  }
}

export const soundManager = new SoundSynthesizer();
