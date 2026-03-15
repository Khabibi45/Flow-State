/* ============================================================
   Storage Module — Persistent state via localStorage
   ============================================================ */

const PREFIX = 'flowstate_';

export const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage full or unavailable:', e);
    }
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },

  // Get today's date key for daily stats
  todayKey() {
    return new Date().toISOString().split('T')[0];
  },

  // Stats helpers
  getStats() {
    return this.get('stats', {});
  },

  getTodayStats() {
    const stats = this.getStats();
    const key = this.todayKey();
    if (!stats[key]) {
      stats[key] = { focusMinutes: 0, tasksCompleted: 0, sessions: 0 };
      this.set('stats', stats);
    }
    return stats[key];
  },

  updateTodayStats(updates) {
    const stats = this.getStats();
    const key = this.todayKey();
    stats[key] = { ...this.getTodayStats(), ...updates };
    this.set('stats', stats);
    return stats[key];
  },

  incrementTodayStat(field, amount = 1) {
    const today = this.getTodayStats();
    today[field] = (today[field] || 0) + amount;
    return this.updateTodayStats(today);
  },

  // Get weekly stats for chart
  getWeekStats() {
    const stats = this.getStats();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days.push({ date: key, ...(stats[key] || { focusMinutes: 0, tasksCompleted: 0, sessions: 0 }) });
    }
    return days;
  },

  // Streak calculation
  getStreak() {
    const stats = this.getStats();
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().split('T')[0];
      const day = stats[key];
      if (day && (day.focusMinutes > 0 || day.tasksCompleted > 0)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }
};
