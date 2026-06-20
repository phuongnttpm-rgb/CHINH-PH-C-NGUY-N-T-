/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private musicInterval: any = null;
  private masterGain: GainNode | null = null;
  public isMuted: boolean = true;

  constructor() {
    // Audio Context is initialized lazily to satisfy browser autoplay security policies
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.4, this.ctx.currentTime, 0.1);
      if (!muted && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
  }

  public toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public playCorrect() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    
    // Play dual high bells (C6 and G6)
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o1.type = "sine";
    o1.frequency.setValueAtTime(1046.5, t); // C6
    o2.type = "triangle";
    o2.frequency.setValueAtTime(1568.0, t); // G6

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.25, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    o1.connect(g);
    o2.connect(g);
    if (this.masterGain) g.connect(this.masterGain);

    o1.start(t);
    o2.start(t);
    o1.stop(t + 0.8);
    o2.stop(t + 0.8);
  }

  public playIncorrect() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    
    // Play a harsh, buzzy detuned chord
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o1.type = "sawtooth";
    o1.frequency.setValueAtTime(120, t); 
    o2.type = "sawtooth";
    o2.frequency.setValueAtTime(123, t); // Detuned

    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.2, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    // Apply lowpass filter to make it less grating and more polished
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, t);

    o1.connect(filter);
    o2.connect(filter);
    filter.connect(g);
    if (this.masterGain) g.connect(this.masterGain);

    o1.start(t);
    o2.start(t);
    o1.stop(t + 0.4);
    o2.stop(t + 0.4);
  }

  public playPull() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // A rapid sweeping whoosh
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o.type = "triangle";
    o.frequency.setValueAtTime(200, t);
    o.frequency.exponentialRampToValueAtTime(800, t + 0.25);

    g.gain.setValueAtTime(0.01, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.1);
    g.gain.linearRampToValueAtTime(0.001, t + 0.3);

    o.connect(g);
    if (this.masterGain) g.connect(this.masterGain);

    o.start(t);
    o.stop(t + 0.3);
  }

  public playWarp() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Epic ascending frequency scale representing portal entry
    const duration = 2.5;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(2500, t + duration);

    g.gain.setValueAtTime(0.01, t);
    g.gain.linearRampToValueAtTime(0.3, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(2000, t + duration);

    osc.connect(filter);
    filter.connect(g);
    if (this.masterGain) g.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  public playTing() {
    this.playCorrect();
  }

  public playWhoosh() {
    this.playPull();
  }

  public playStageComplete() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    
    // Play major triad arpeggio (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();

      o.type = "triangle";
      o.frequency.setValueAtTime(freq, t + idx * 0.15);

      g.gain.setValueAtTime(0, t + idx * 0.15);
      g.gain.linearRampToValueAtTime(0.15, t + idx * 0.15 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.15 + 0.6);

      o.connect(g);
      if (this.masterGain) g.connect(this.masterGain);

      o.start(t + idx * 0.15);
      o.stop(t + idx * 0.15 + 0.6);
    });
  }

  public startMusic() {
    this.init();
    if (!this.ctx || this.musicOscs.length > 0) return;

    // Start playing background cosmic ambient pads
    const playChord = () => {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;

      // Clean up previous oscs if any
      this.musicOscs = this.musicOscs.filter(item => {
        try {
          item.osc.stop();
        } catch(e) {}
        return false;
      });

      // Ambient Cyber Minor9 chord (C3, G3, Bb3, D4, Eb4) values
      const freqs = [130.81, 196.00, 233.08, 293.66, 311.13];
      
      freqs.forEach(freq => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);
        // Add subtle vibrato
        osc.frequency.linearRampToValueAtTime(freq + Math.random() * 2 - 1, t + 4);

        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.05, t + 2); // Soft volume
        g.gain.exponentialRampToValueAtTime(0.001, t + 7.5);

        const lp = this.ctx!.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(500, t);

        osc.connect(lp);
        lp.connect(g);
        g.connect(this.masterGain!);

        osc.start(t);
        osc.stop(t + 8);

        this.musicOscs.push({ osc, gain: g });
      });
    };

    playChord();
    this.musicInterval = setInterval(playChord, 8000);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.musicOscs.forEach(item => {
      try {
        item.gain.gain.setValueAtTime(0, this.ctx ? this.ctx.currentTime : 0);
        item.osc.stop();
      } catch (e) {}
    });
    this.musicOscs = [];
  }
}

export const soundEngine = new SoundEngine();
