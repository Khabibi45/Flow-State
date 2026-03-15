/* ============================================================
   Timer Module — Pomodoro focus timer
   ============================================================ */

import { Storage } from './storage.js';

export class Timer {
  constructor({ onTick, onComplete, onStateChange }) {
    this.duration = 25 * 60; // seconds
    this.remaining = this.duration;
    this.running = false;
    this.interval = null;
    this.session = 1;
    this.maxSessions = 4;
    this.isBreak = false;
    this.breakDuration = 5 * 60;
    this.longBreakDuration = 15 * 60;

    this.onTick = onTick || (() => {});
    this.onComplete = onComplete || (() => {});
    this.onStateChange = onStateChange || (() => {});
  }

  setDuration(minutes) {
    if (this.running) return;
    this.duration = minutes * 60;
    this.remaining = this.duration;
    this.onTick(this.remaining, this.duration);
  }

  toggle() {
    if (this.running) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.onStateChange('running');
    this.interval = setInterval(() => {
      this.remaining--;
      this.onTick(this.remaining, this.duration);
      if (this.remaining <= 0) {
        this.complete();
      }
    }, 1000);
  }

  pause() {
    this.running = false;
    clearInterval(this.interval);
    this.onStateChange('paused');
  }

  reset() {
    this.pause();
    this.remaining = this.duration;
    this.onTick(this.remaining, this.duration);
    this.onStateChange('ready');
  }

  complete() {
    this.pause();

    if (!this.isBreak) {
      // Completed a focus session
      Storage.incrementTodayStat('sessions');
      Storage.incrementTodayStat('focusMinutes', Math.round(this.duration / 60));

      this.session++;
      if (this.session > this.maxSessions) {
        this.session = 1;
      }

      // Switch to break
      this.isBreak = true;
      const isLong = (this.session - 1) % 4 === 0 && this.session > 1;
      this.duration = isLong ? this.longBreakDuration : this.breakDuration;
    } else {
      // Break over, back to focus
      this.isBreak = false;
      this.duration = this.focusDuration || 25 * 60;
    }

    this.remaining = this.duration;
    this.onComplete(this.isBreak, this.session);
    this.onTick(this.remaining, this.duration);
  }

  skip() {
    this.remaining = 0;
    this.complete();
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  getProgress() {
    return 1 - (this.remaining / this.duration);
  }
}
