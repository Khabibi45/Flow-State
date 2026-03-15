/* ============================================================
   Notifications Module — Push, Sound, Reminders, Idle Detection
   ============================================================ */

import { Storage } from './storage.js';

export class NotificationManager {
  constructor(onEvent) {
    this.onEvent = onEvent || (() => {});
    this.settings = Storage.get('notifSettings', {
      browserNotifs: true,
      sounds: true,
      reminders: true,
      reminderInterval: 30, // minutes
      idleDetection: true,
      idleTimeout: 10, // minutes
      motivationalQuotes: true,
    });
    this.idleTimer = null;
    this.reminderTimer = null;
    this.lastActivity = Date.now();
    this.isIdle = false;
    this.audioCtx = null;
  }

  init() {
    this.requestPermission();
    this.startIdleDetection();
    this.startReminderLoop();
    this.trackActivity();
    this.showWelcomeBack();
  }

  saveSettings() {
    Storage.set('notifSettings', this.settings);
  }

  // ── Browser Notifications ──

  async requestPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  sendBrowserNotif(title, body, icon = '◆', tag = '') {
    if (!this.settings.browserNotifs) return;
    if (Notification.permission !== 'granted') return;

    const notif = new Notification(title, {
      body,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">' + icon + '</text></svg>',
      tag: tag || `flowstate-${Date.now()}`,
      badge: icon,
      requireInteraction: false,
      silent: false,
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    setTimeout(() => notif.close(), 8000);
    return notif;
  }

  // ── Sound Notifications ──

  playSound(type = 'complete') {
    if (!this.settings.sounds) return;

    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = this.audioCtx;

      switch (type) {
        case 'complete': this._playComplete(ctx); break;
        case 'levelup': this._playLevelUp(ctx); break;
        case 'badge': this._playBadge(ctx); break;
        case 'xp': this._playXP(ctx); break;
        case 'reminder': this._playReminder(ctx); break;
        case 'break': this._playBreak(ctx); break;
        case 'challenge': this._playChallenge(ctx); break;
        default: this._playComplete(ctx);
      }
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }

  _playNote(ctx, freq, start, duration, volume = 0.2) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime + start);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration);
  }

  _playComplete(ctx) {
    // Ascending triad — satisfying completion sound
    this._playNote(ctx, 523, 0, 0.3, 0.2);     // C5
    this._playNote(ctx, 659, 0.1, 0.3, 0.2);   // E5
    this._playNote(ctx, 784, 0.2, 0.5, 0.25);   // G5
  }

  _playLevelUp(ctx) {
    // Fanfare — exciting level up
    [523, 587, 659, 784, 880, 1047].forEach((f, i) => {
      this._playNote(ctx, f, i * 0.08, 0.4, 0.2);
    });
  }

  _playBadge(ctx) {
    // Sparkle — magical badge unlock
    [880, 1109, 1319, 1568, 1760].forEach((f, i) => {
      this._playNote(ctx, f, i * 0.06, 0.5, 0.15);
    });
  }

  _playXP(ctx) {
    // Quick coin-like sound
    this._playNote(ctx, 988, 0, 0.15, 0.15);
    this._playNote(ctx, 1319, 0.08, 0.2, 0.15);
  }

  _playReminder(ctx) {
    // Gentle double tap
    this._playNote(ctx, 440, 0, 0.2, 0.1);
    this._playNote(ctx, 440, 0.25, 0.2, 0.1);
  }

  _playBreak(ctx) {
    // Soft descending — relax time
    this._playNote(ctx, 659, 0, 0.4, 0.15);
    this._playNote(ctx, 523, 0.15, 0.5, 0.15);
  }

  _playChallenge(ctx) {
    // Triumphant
    this._playNote(ctx, 523, 0, 0.2, 0.2);
    this._playNote(ctx, 659, 0.15, 0.2, 0.2);
    this._playNote(ctx, 784, 0.3, 0.2, 0.2);
    this._playNote(ctx, 1047, 0.45, 0.6, 0.25);
  }

  // ── Idle Detection ──

  trackActivity() {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(evt => {
      document.addEventListener(evt, () => {
        this.lastActivity = Date.now();
        if (this.isIdle) {
          this.isIdle = false;
          this.onEvent({ type: 'active_again' });
        }
      }, { passive: true });
    });
  }

  startIdleDetection() {
    if (!this.settings.idleDetection) return;

    setInterval(() => {
      const idleMinutes = (Date.now() - this.lastActivity) / 60000;
      if (idleMinutes >= this.settings.idleTimeout && !this.isIdle) {
        this.isIdle = true;
        this.onEvent({ type: 'idle', minutes: Math.round(idleMinutes) });
        this.sendBrowserNotif(
          'Tu es encore là ? 👋',
          'Lance une session focus pour rester productif !',
          '⏰'
        );
      }
    }, 30000); // Check every 30s
  }

  // ── Reminders ──

  startReminderLoop() {
    if (!this.settings.reminders) return;

    // Remind after interval of no focus sessions
    this.reminderTimer = setInterval(() => {
      const today = Storage.getTodayStats();
      const lastSession = Storage.get('lastSessionEnd', 0);
      const minutesSince = (Date.now() - lastSession) / 60000;

      if (minutesSince >= this.settings.reminderInterval && today.sessions < 8) {
        this.onEvent({ type: 'reminder', minutesSince: Math.round(minutesSince) });
      }
    }, this.settings.reminderInterval * 60000);
  }

  // ── Welcome Back ──

  showWelcomeBack() {
    const lastVisit = Storage.get('lastVisit', null);
    const now = Date.now();
    Storage.set('lastVisit', now);

    if (!lastVisit) {
      this.onEvent({ type: 'first_visit' });
      return;
    }

    const hoursSince = (now - lastVisit) / 3600000;
    if (hoursSince >= 1) {
      this.onEvent({
        type: 'welcome_back',
        hoursSince: Math.round(hoursSince),
        daysSince: Math.round(hoursSince / 24),
      });
    }
  }

  // ── Timer Notifications ──

  notifyTimerComplete(isBreak) {
    this.playSound(isBreak ? 'break' : 'complete');
    this.sendBrowserNotif(
      isBreak ? 'Pause terminée ! 💪' : 'Session terminée ! 🎉',
      isBreak ? 'C\'est reparti pour une session de focus !' : 'Bravo ! Prends une pause bien méritée.',
      isBreak ? '▶️' : '✅',
      'timer-complete'
    );
    Storage.set('lastSessionEnd', Date.now());
  }

  notifyLevelUp(level, rank) {
    this.playSound('levelup');
    this.sendBrowserNotif(
      `Niveau ${level} ! ${rank.icon}`,
      `Tu es maintenant ${rank.title} !`,
      rank.icon,
      'level-up'
    );
  }

  notifyBadge(badge) {
    this.playSound('badge');
    this.sendBrowserNotif(
      `Badge débloqué ! ${badge.icon}`,
      `${badge.name} — ${badge.desc}`,
      badge.icon,
      'badge-unlock'
    );
  }

  notifyChallenge(challenge) {
    this.playSound('challenge');
    this.sendBrowserNotif(
      'Défi complété ! 🏆',
      challenge.desc,
      '🏆',
      'challenge-complete'
    );
  }

  notifyXP(amount, reason) {
    this.playSound('xp');
  }

  // ── Motivational Quotes ──

  getRandomQuote() {
    const quotes = [
      { text: "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme.", author: "Churchill" },
      { text: "La discipline est le pont entre les objectifs et l'accomplissement.", author: "Jim Rohn" },
      { text: "Le secret pour avancer, c'est de commencer.", author: "Mark Twain" },
      { text: "Concentre-toi sur le voyage, pas sur la destination.", author: "Ralph Waldo Emerson" },
      { text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.", author: "Steve Jobs" },
      { text: "Il n'y a pas de raccourci pour un endroit qui vaut la peine d'y aller.", author: "Beverly Sills" },
      { text: "Le talent gagne des matchs, mais le travail d'équipe gagne des championnats.", author: "Michael Jordan" },
      { text: "Le futur appartient à ceux qui croient en la beauté de leurs rêves.", author: "Eleanor Roosevelt" },
      { text: "Le meilleur moment pour planter un arbre, c'était il y a 20 ans. Le second meilleur moment, c'est maintenant.", author: "Proverbe chinois" },
      { text: "La productivité n'est jamais un accident. C'est le résultat d'un engagement envers l'excellence.", author: "Paul J. Meyer" },
      { text: "Ce n'est pas le temps qui manque, c'est la volonté.", author: "Sénèque" },
      { text: "L'action est la clé fondamentale de tout succès.", author: "Pablo Picasso" },
      { text: "Rome ne s'est pas faite en un jour, mais ils posaient des briques chaque heure.", author: "John Heywood" },
      { text: "Chaque expert a d'abord été un débutant.", author: "Helen Hayes" },
      { text: "Focus is the new IQ.", author: "Cal Newport" },
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}
