/* ============================================================
   Gamification Module — XP, Levels, Badges, Challenges, Ranks
   ============================================================ */

import { Storage } from './storage.js';

// ── XP Table ──
const LEVEL_XP = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
  4000, 5000, 6200, 7600, 9200, 11000, 13000, 15500, 18500, 22000,
  26000, 30500, 35500, 41000, 47000, 54000, 62000, 71000, 81000, 92000, 100000
];

const RANKS = [
  { level: 1,  title: 'Débutant',      icon: '🌱', color: '#6b7280' },
  { level: 3,  title: 'Apprenti',      icon: '📘', color: '#3b82f6' },
  { level: 5,  title: 'Initié',        icon: '⚡', color: '#8b5cf6' },
  { level: 8,  title: 'Productif',     icon: '🔥', color: '#f59e0b' },
  { level: 12, title: 'Expert',        icon: '💎', color: '#06b6d4' },
  { level: 16, title: 'Maître',        icon: '👑', color: '#eab308' },
  { level: 20, title: 'Grand Maître',  icon: '🏆', color: '#f97316' },
  { level: 25, title: 'Légende',       icon: '⭐', color: '#ec4899' },
  { level: 30, title: 'Mythique',      icon: '🌟', color: '#7c3aed' },
];

const BADGES = [
  // Focus
  { id: 'first_focus',    icon: '🎯', name: 'Premier Focus',       desc: 'Compléter 1 session',              check: g => g.totalSessions >= 1 },
  { id: 'focus_10',       icon: '🔟', name: 'Décathlon',           desc: 'Compléter 10 sessions',             check: g => g.totalSessions >= 10 },
  { id: 'focus_50',       icon: '🏅', name: 'Semi-Marathon',       desc: 'Compléter 50 sessions',             check: g => g.totalSessions >= 50 },
  { id: 'focus_100',      icon: '🏆', name: 'Centurion',           desc: 'Compléter 100 sessions',            check: g => g.totalSessions >= 100 },
  { id: 'focus_500',      icon: '💫', name: 'Demi-Dieu',           desc: 'Compléter 500 sessions',            check: g => g.totalSessions >= 500 },
  { id: 'marathon',       icon: '🏃', name: 'Marathonien',         desc: '4h de focus en un jour',            check: (g, t) => t.focusMinutes >= 240 },
  { id: 'deep_focus',     icon: '🧘', name: 'Deep Focus',          desc: 'Session de 90 min complète',        check: g => g.longestSession >= 90 },

  // Tasks
  { id: 'first_task',     icon: '✅', name: 'Première tâche',      desc: 'Compléter 1 tâche',                 check: g => g.totalTasksDone >= 1 },
  { id: 'task_25',        icon: '📋', name: 'Organisé',            desc: 'Compléter 25 tâches',               check: g => g.totalTasksDone >= 25 },
  { id: 'task_100',       icon: '📦', name: 'Machine',             desc: 'Compléter 100 tâches',              check: g => g.totalTasksDone >= 100 },
  { id: 'task_blitz',     icon: '⚡', name: 'Blitz',               desc: '10 tâches en un jour',              check: (g, t) => t.tasksCompleted >= 10 },

  // Streaks
  { id: 'streak_3',       icon: '🔥', name: 'En feu',              desc: 'Streak de 3 jours',                 check: g => g.bestStreak >= 3 },
  { id: 'streak_7',       icon: '🌋', name: 'Semaine parfaite',    desc: 'Streak de 7 jours',                 check: g => g.bestStreak >= 7 },
  { id: 'streak_14',      icon: '💥', name: 'Inarrêtable',         desc: 'Streak de 14 jours',                check: g => g.bestStreak >= 14 },
  { id: 'streak_30',      icon: '🌟', name: 'Légende vivante',     desc: 'Streak de 30 jours',                check: g => g.bestStreak >= 30 },

  // Notes & Links
  { id: 'note_writer',    icon: '✍️', name: 'Écrivain',            desc: 'Créer 10 notes',                    check: g => g.totalNotes >= 10 },
  { id: 'bookworm',       icon: '📚', name: 'Bibliothécaire',      desc: 'Sauvegarder 20 liens',              check: g => g.totalLinks >= 20 },

  // Special
  { id: 'night_owl',      icon: '🦉', name: 'Noctambule',          desc: 'Session entre minuit et 5h',        check: g => g.nightOwl },
  { id: 'early_bird',     icon: '🐦', name: 'Lève-tôt',            desc: 'Session avant 7h',                  check: g => g.earlyBird },
  { id: 'xp_1000',        icon: '💰', name: 'Millionnaire',        desc: 'Accumuler 1000 XP',                 check: g => g.xp >= 1000 },
  { id: 'xp_10000',       icon: '💎', name: 'Diamant',             desc: 'Accumuler 10 000 XP',               check: g => g.xp >= 10000 },
  { id: 'level_10',       icon: '🎖️', name: 'Vétéran',             desc: 'Atteindre niveau 10',               check: g => g.level >= 10 },
  { id: 'all_sounds',     icon: '🎵', name: 'DJ',                  desc: 'Essayer toutes les ambiances',       check: g => g.soundsTried >= 8 },
];

const DAILY_CHALLENGES = [
  { id: 'dc_focus_2',      desc: '🎯 Compléter 2 sessions de focus',         check: t => t.sessions >= 2, xp: 50 },
  { id: 'dc_focus_4',      desc: '🔥 Compléter 4 sessions de focus',         check: t => t.sessions >= 4, xp: 100 },
  { id: 'dc_tasks_3',      desc: '✅ Terminer 3 tâches',                     check: t => t.tasksCompleted >= 3, xp: 50 },
  { id: 'dc_tasks_5',      desc: '📋 Terminer 5 tâches',                     check: t => t.tasksCompleted >= 5, xp: 80 },
  { id: 'dc_focus_60',     desc: '⏱️ Cumuler 60 min de focus',               check: t => t.focusMinutes >= 60, xp: 60 },
  { id: 'dc_focus_120',    desc: '🏋️ Cumuler 2h de focus',                   check: t => t.focusMinutes >= 120, xp: 120 },
  { id: 'dc_note',         desc: '📝 Écrire une note',                       check: t => t.notesCreated >= 1, xp: 30 },
  { id: 'dc_combo',        desc: '💫 Focus + 3 tâches + 1 note',             check: t => t.sessions >= 1 && t.tasksCompleted >= 3 && t.notesCreated >= 1, xp: 150 },
  { id: 'dc_early',        desc: '🌅 Commencer avant 9h',                    check: t => t.earlyStart, xp: 40 },
  { id: 'dc_marathon',     desc: '🏃 3h de focus total',                     check: t => t.focusMinutes >= 180, xp: 200 },
];

// ── XP Rewards ──
const XP_REWARDS = {
  focusComplete: 25,
  focusComplete90: 50,
  taskComplete: 10,
  taskCompleteHigh: 20,
  noteCreate: 5,
  linkAdd: 3,
  dailyChallengeBase: 50,
  streakBonus: 5, // per day of streak
};

export class Gamification {
  constructor(onUpdate) {
    this.onUpdate = onUpdate || (() => {});
    this.data = Storage.get('gamification', this.defaultData());
    this.checkDailyReset();
  }

  defaultData() {
    return {
      xp: 0,
      level: 1,
      totalSessions: 0,
      totalTasksDone: 0,
      totalNotes: 0,
      totalLinks: 0,
      longestSession: 0,
      bestStreak: 0,
      nightOwl: false,
      earlyBird: false,
      soundsTried: 0,
      soundsTriedSet: [],
      unlockedBadges: [],
      dailyChallenges: [],
      dailyChallengeDate: null,
      history: [], // { date, xp, level, sessions, tasks }
    };
  }

  save() {
    Storage.set('gamification', this.data);
  }

  // ── XP & Level ──

  addXP(amount, reason = '') {
    const streak = Storage.getStreak();
    const multiplier = 1 + Math.min(streak * 0.1, 2); // max 3x at 20-day streak
    const finalXP = Math.round(amount * multiplier);

    const oldLevel = this.data.level;
    this.data.xp += finalXP;
    this.data.level = this.calculateLevel(this.data.xp);

    this.save();
    this.checkBadges();

    const leveledUp = this.data.level > oldLevel;

    this.onUpdate({
      type: 'xp',
      amount: finalXP,
      reason,
      multiplier,
      streak,
      leveledUp,
      newLevel: this.data.level,
      totalXP: this.data.xp,
    });

    if (leveledUp) {
      this.onUpdate({
        type: 'levelup',
        level: this.data.level,
        rank: this.getCurrentRank(),
      });
    }

    return finalXP;
  }

  calculateLevel(xp) {
    for (let i = LEVEL_XP.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_XP[i]) return i + 1;
    }
    return 1;
  }

  getXPForNextLevel() {
    const idx = Math.min(this.data.level, LEVEL_XP.length - 1);
    return LEVEL_XP[idx] || Infinity;
  }

  getXPProgress() {
    const currentLevelXP = LEVEL_XP[this.data.level - 1] || 0;
    const nextLevelXP = this.getXPForNextLevel();
    const progress = (this.data.xp - currentLevelXP) / (nextLevelXP - currentLevelXP);
    return Math.min(Math.max(progress, 0), 1);
  }

  getCurrentRank() {
    let rank = RANKS[0];
    for (const r of RANKS) {
      if (this.data.level >= r.level) rank = r;
    }
    return rank;
  }

  // ── Events ──

  onFocusComplete(durationMinutes) {
    this.data.totalSessions++;
    if (durationMinutes > this.data.longestSession) {
      this.data.longestSession = durationMinutes;
    }

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) this.data.nightOwl = true;
    if (hour >= 4 && hour < 7) this.data.earlyBird = true;

    const xp = durationMinutes >= 90 ? XP_REWARDS.focusComplete90 : XP_REWARDS.focusComplete;
    this.addXP(xp, `Focus ${durationMinutes}min`);

    // Update today stats for daily challenges
    this.checkDailyChallenges();
    this.updateHistory();
  }

  onTaskComplete(priority = 'medium') {
    this.data.totalTasksDone++;
    const xp = priority === 'high' ? XP_REWARDS.taskCompleteHigh : XP_REWARDS.taskComplete;
    this.addXP(xp, 'Tâche complétée');
    this.checkDailyChallenges();
    this.updateHistory();
  }

  onNoteCreate() {
    this.data.totalNotes++;
    this.addXP(XP_REWARDS.noteCreate, 'Note créée');
    this.checkDailyChallenges();
  }

  onLinkAdd() {
    this.data.totalLinks++;
    this.addXP(XP_REWARDS.linkAdd, 'Lien ajouté');
  }

  onSoundTry(soundId) {
    if (!this.data.soundsTriedSet) this.data.soundsTriedSet = [];
    if (!this.data.soundsTriedSet.includes(soundId)) {
      this.data.soundsTriedSet.push(soundId);
      this.data.soundsTried = this.data.soundsTriedSet.length;
      this.save();
      this.checkBadges();
    }
  }

  // ── Badges ──

  checkBadges() {
    const today = Storage.getTodayStats();
    let newBadge = null;

    for (const badge of BADGES) {
      if (this.data.unlockedBadges.includes(badge.id)) continue;
      if (badge.check(this.data, today)) {
        this.data.unlockedBadges.push(badge.id);
        newBadge = badge;
        this.save();
        this.onUpdate({ type: 'badge', badge });
      }
    }

    // Update best streak
    const streak = Storage.getStreak();
    if (streak > this.data.bestStreak) {
      this.data.bestStreak = streak;
      this.save();
    }

    return newBadge;
  }

  getUnlockedBadges() {
    return BADGES.filter(b => this.data.unlockedBadges.includes(b.id));
  }

  getAllBadges() {
    return BADGES.map(b => ({
      ...b,
      unlocked: this.data.unlockedBadges.includes(b.id),
    }));
  }

  // ── Daily Challenges ──

  checkDailyReset() {
    const today = Storage.todayKey();
    if (this.data.dailyChallengeDate !== today) {
      this.generateDailyChallenges();
      this.data.dailyChallengeDate = today;
      this.save();
    }
  }

  generateDailyChallenges() {
    // Pick 3 random challenges
    const shuffled = [...DAILY_CHALLENGES].sort(() => Math.random() - 0.5);
    this.data.dailyChallenges = shuffled.slice(0, 3).map(c => ({
      ...c,
      completed: false,
    }));
  }

  checkDailyChallenges() {
    const today = Storage.getTodayStats();
    let any = false;

    for (const challenge of this.data.dailyChallenges) {
      if (challenge.completed) continue;
      const template = DAILY_CHALLENGES.find(dc => dc.id === challenge.id);
      if (template && template.check(today)) {
        challenge.completed = true;
        any = true;
        this.addXP(challenge.xp, `Défi: ${challenge.desc}`);
        this.onUpdate({ type: 'challenge', challenge });
      }
    }

    if (any) this.save();
  }

  getDailyChallenges() {
    this.checkDailyReset();
    return this.data.dailyChallenges;
  }

  // ── History ──

  updateHistory() {
    const today = Storage.todayKey();
    const todayStats = Storage.getTodayStats();
    const idx = this.data.history.findIndex(h => h.date === today);
    const entry = {
      date: today,
      xp: this.data.xp,
      level: this.data.level,
      sessions: todayStats.sessions || 0,
      tasks: todayStats.tasksCompleted || 0,
      focusMinutes: todayStats.focusMinutes || 0,
    };

    if (idx >= 0) {
      this.data.history[idx] = entry;
    } else {
      this.data.history.push(entry);
      // Keep last 90 days
      if (this.data.history.length > 90) this.data.history.shift();
    }
    this.save();
  }

  getHeatmapData(days = 84) {
    const map = {};
    this.data.history.forEach(h => { map[h.date] = h; });

    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const entry = map[key];
      result.push({
        date: key,
        dayOfWeek: d.getDay(),
        focusMinutes: entry?.focusMinutes || 0,
        sessions: entry?.sessions || 0,
        tasks: entry?.tasks || 0,
        level: this.getActivityLevel(entry?.focusMinutes || 0),
      });
    }
    return result;
  }

  getActivityLevel(minutes) {
    if (minutes === 0) return 0;
    if (minutes < 30) return 1;
    if (minutes < 60) return 2;
    if (minutes < 120) return 3;
    return 4;
  }

  // ── Export for UI ──

  getStats() {
    return {
      ...this.data,
      rank: this.getCurrentRank(),
      xpProgress: this.getXPProgress(),
      xpForNext: this.getXPForNextLevel(),
      currentLevelXP: LEVEL_XP[this.data.level - 1] || 0,
      streakMultiplier: 1 + Math.min(Storage.getStreak() * 0.1, 2),
    };
  }
}

export { BADGES, RANKS, LEVEL_XP, XP_REWARDS };
