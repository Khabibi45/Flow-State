/* ============================================================
   Ambient Module — Background sounds via Web Audio API
   ============================================================ */

export class AmbientEngine {
  constructor() {
    this.ctx = null;
    this.sounds = {};
    this.active = new Set();
    this.masterVolume = 0.5;
    this.masterGain = null;

    this.presets = [
      { id: 'rain',    icon: '🌧️', label: 'Pluie',     type: 'noise', freq: 800 },
      { id: 'wind',    icon: '💨', label: 'Vent',      type: 'noise', freq: 300 },
      { id: 'waves',   icon: '🌊', label: 'Vagues',    type: 'wave',  freq: 0.15 },
      { id: 'fire',    icon: '🔥', label: 'Feu',       type: 'crackle', freq: 600 },
      { id: 'forest',  icon: '🌲', label: 'Forêt',     type: 'noise', freq: 1200 },
      { id: 'white',   icon: '☁️', label: 'Blanc',     type: 'white' },
      { id: 'brown',   icon: '🟤', label: 'Brun',      type: 'brown' },
      { id: 'cafe',    icon: '☕', label: 'Café',      type: 'noise', freq: 500 },
    ];
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.masterVolume;
    this.masterGain.connect(this.ctx.destination);
  }

  setVolume(v) {
    this.masterVolume = v;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
    }
  }

  toggle(id) {
    this.init();
    if (this.active.has(id)) {
      this.stop(id);
    } else {
      this.play(id);
    }
    return this.active.has(id);
  }

  play(id) {
    const preset = this.presets.find(p => p.id === id);
    if (!preset || this.sounds[id]) return;

    let source, filter, gain;
    gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.masterGain);

    switch (preset.type) {
      case 'noise':
        source = this.createNoise();
        filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = preset.freq;
        filter.Q.value = 1;
        source.connect(filter);
        filter.connect(gain);
        break;

      case 'white':
        source = this.createNoise();
        source.connect(gain);
        break;

      case 'brown':
        source = this.createNoise();
        filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        source.connect(filter);
        filter.connect(gain);
        break;

      case 'wave':
        source = this.createWave(preset.freq, gain);
        break;

      case 'crackle':
        source = this.createCrackle(gain);
        break;

      default:
        source = this.createNoise();
        source.connect(gain);
    }

    // Fade in
    gain.gain.setTargetAtTime(0.6, this.ctx.currentTime, 0.5);

    this.sounds[id] = { source, filter, gain };
    this.active.add(id);
  }

  stop(id) {
    const sound = this.sounds[id];
    if (!sound) return;

    // Fade out
    sound.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);

    setTimeout(() => {
      try {
        if (sound.source.stop) sound.source.stop();
        else if (sound.source.disconnect) sound.source.disconnect();
      } catch {}
      delete this.sounds[id];
    }, 1000);

    this.active.delete(id);
  }

  stopAll() {
    for (const id of [...this.active]) {
      this.stop(id);
    }
  }

  createNoise() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.start();
    return source;
  }

  createWave(freq, gain) {
    // Simulate ocean waves with LFO modulated noise
    const noise = this.createNoise();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = freq;
    lfoGain.gain.value = 0.3;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    noise.connect(filter);
    filter.connect(gain);
    return noise;
  }

  createCrackle(gain) {
    // Simulate fire crackling
    const noise = this.createNoise();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 3;

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'square';
    lfo.frequency.value = 8;
    lfoGain.gain.value = 0.4;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    noise.connect(filter);
    filter.connect(gain);
    return noise;
  }
}
