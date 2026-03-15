/* ============================================================
   FlowState — Main Application Controller v2
   Gamification, Notifications, Tracking intégrés
   ============================================================ */

import { Storage } from './modules/storage.js';
import { Timer } from './modules/timer.js';
import { AudioPlayer } from './modules/audioplayer.js';
import { Gamification } from './modules/gamification.js';
import { NotificationManager } from './modules/notifications.js';

// ── Lucide Inline SVG Icons ──
function lucideIcon(name) {
  const icons = {
    'bar-chart-3': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',
    'target': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    'check-square': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    'file-text': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
    'link': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    'plus-circle': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    'file-plus': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>',
    'play-circle': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',
    'rotate-ccw': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>',
    'moon': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    'volume-x': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
    'maximize': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
  };
  return icons[name] || name;
}

// ── Global App State ──
const App = {
  currentView: 'dashboard',
  timer: null,
  audioPlayer: null,
  gamification: null,
  notifications: null,
  tasks: [],
  notes: [],
  links: [],
  activeNoteId: null,
};

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  initGamification();
  initNotifications();
  initClock();
  initTimer();
  initAudioPlayer();
  initNavigation();
  initTheme();
  initTasks();
  initNotes();
  initLinks();
  initCommandPalette();
  initKeyboardShortcuts();
  initFullscreen();
  updateDashboardStats();
  renderWeekChart();
  renderQuickTasks();
  renderQuickLinks();
  renderChallenges();
  renderBadges();
  renderHeatmap();
  updateXPBar();
  animateEntrance();
});

// ── Gamification ──
function initGamification() {
  App.gamification = new Gamification((event) => {
    switch (event.type) {
      case 'xp':
        showXPPopup(event.amount, event.multiplier, event.reason);
        updateXPBar();
        break;
      case 'levelup':
        showLevelUpOverlay(event.level, event.rank);
        App.notifications.notifyLevelUp(event.level, event.rank);
        break;
      case 'badge':
        showBadgeUnlock(event.badge);
        App.notifications.notifyBadge(event.badge);
        renderBadges();
        break;
      case 'challenge':
        App.notifications.notifyChallenge(event.challenge);
        renderChallenges();
        toast(`Défi complété ! +${event.challenge.xp} XP`, 'success');
        spawnConfetti();
        break;
    }
  });
}

function updateXPBar() {
  const stats = App.gamification.getStats();
  const rank = stats.rank;

  document.getElementById('xpRankIcon').textContent = rank.icon;
  document.getElementById('xpLevelBadge').textContent = stats.level;
  document.getElementById('xpRankTitle').textContent = rank.title;
  document.getElementById('xpCurrent').textContent = stats.xp;
  document.getElementById('xpNext').textContent = stats.xpForNext;
  document.getElementById('xpLevel').textContent = stats.level;
  document.getElementById('xpProgressFill').style.width = `${stats.xpProgress * 100}%`;

  const mult = stats.streakMultiplier;
  const multEl = document.getElementById('xpMultiplier');
  multEl.textContent = `x${mult.toFixed(1)}`;
  multEl.classList.toggle('active', mult > 1);

  // Update avatar border color based on rank
  document.getElementById('xpAvatar').style.borderColor = rank.color;
}

function showXPPopup(amount, multiplier, reason) {
  const popup = document.createElement('div');
  popup.className = 'xp-popup';
  popup.innerHTML = `+${amount} XP ${multiplier > 1 ? `<span style="font-size:0.7em;opacity:0.7">(x${multiplier.toFixed(1)})</span>` : ''}`;
  document.getElementById('dynamicOverlays').appendChild(popup);
  setTimeout(() => popup.remove(), 2500);
}

function showLevelUpOverlay(level, rank) {
  spawnConfetti();
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `
    <div class="levelup-card">
      <div class="levelup-icon">${rank.icon}</div>
      <div class="levelup-title">Niveau ${level} !</div>
      <div class="levelup-rank">Tu es maintenant <strong style="color:${rank.color}">${rank.title}</strong></div>
      <button class="levelup-close">Continuer</button>
    </div>
  `;
  document.getElementById('dynamicOverlays').appendChild(overlay);
  overlay.querySelector('.levelup-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function showBadgeUnlock(badge) {
  toast(`Badge débloqué : ${badge.icon} ${badge.name}`, 'success');
}

function renderChallenges() {
  const challenges = App.gamification.getDailyChallenges();
  const list = document.getElementById('challengeList');
  list.innerHTML = '';

  const done = challenges.filter(c => c.completed).length;
  document.getElementById('challengeProgress').textContent = `${done}/3`;

  challenges.forEach(ch => {
    const item = document.createElement('div');
    item.className = `challenge-item ${ch.completed ? 'completed' : ''}`;
    item.innerHTML = `
      <div class="challenge-check">${ch.completed ? '✓' : ''}</div>
      <span class="challenge-text">${ch.desc}</span>
      <span class="challenge-xp">+${ch.xp} XP</span>
    `;
    list.appendChild(item);
  });
}

function renderBadges() {
  const all = App.gamification.getAllBadges();
  const grid = document.getElementById('badgesGrid');
  grid.innerHTML = '';

  const unlocked = all.filter(b => b.unlocked).length;
  document.getElementById('badgeCount').textContent = `${unlocked} / ${all.length}`;

  all.forEach(badge => {
    const item = document.createElement('div');
    item.className = `badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`;
    item.innerHTML = `
      <div class="badge-icon">${badge.icon}</div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-tooltip">
        <div class="badge-tooltip-title">${badge.icon} ${badge.name}</div>
        <div class="badge-tooltip-desc">${badge.desc}</div>
      </div>
    `;
    grid.appendChild(item);
  });
}

function renderHeatmap() {
  const data = App.gamification.getHeatmapData(84); // 12 weeks
  const grid = document.getElementById('heatmapGrid');
  grid.innerHTML = '';

  data.forEach(day => {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.dataset.level = day.level;
    cell.title = `${day.date}: ${day.focusMinutes}min focus, ${day.tasks} tâches`;
    grid.appendChild(cell);
  });
}

// ── Confetti ──
function spawnConfetti() {
  const container = document.getElementById('confettiContainer');
  const colors = ['#7c3aed', '#a78bfa', '#ec4899', '#f59e0b', '#22c55e', '#6366f1', '#06b6d4'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${6 + Math.random() * 8}px`;
    piece.style.height = `${6 + Math.random() * 8}px`;
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration = `${1.5 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    container.appendChild(piece);
  }

  setTimeout(() => { container.innerHTML = ''; }, 4000);
}

// ── Notifications ──
function initNotifications() {
  App.notifications = new NotificationManager((event) => {
    switch (event.type) {
      case 'idle':
        showIdleBanner(event.minutes);
        break;
      case 'reminder':
        showReminderBanner(event.minutesSince);
        break;
      case 'welcome_back':
        showWelcomeBack(event.hoursSince);
        break;
      case 'first_visit':
        toast('Bienvenue sur FlowState !', 'success');
        break;
      case 'active_again':
        removeIdleBanner();
        break;
    }
  });
  App.notifications.init();
}

function showIdleBanner(minutes) {
  removeIdleBanner();
  const banner = document.createElement('div');
  banner.className = 'idle-banner';
  banner.id = 'idleBanner';
  banner.innerHTML = `
    <span class="idle-banner-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
    <div class="idle-banner-text">
      <strong>Inactif depuis ${minutes} min</strong>
      Lance une session focus pour rester productif !
    </div>
    <div class="idle-banner-actions">
      <button class="btn btn-sm btn-primary" id="idleStartFocus">Démarrer Focus</button>
      <button class="btn btn-sm btn-ghost" id="idleDismiss">✕</button>
    </div>
  `;
  document.body.appendChild(banner);
  banner.querySelector('#idleStartFocus').addEventListener('click', () => {
    switchView('focus');
    App.timer.start();
    updateFocusUI();
    removeIdleBanner();
  });
  banner.querySelector('#idleDismiss').addEventListener('click', removeIdleBanner);
}

function removeIdleBanner() {
  document.getElementById('idleBanner')?.remove();
}

function showReminderBanner(minutes) {
  App.notifications.sendBrowserNotif(
    'FlowState attend !',
    `Pas de session depuis ${minutes} min. Reviens en focus !`,
    '◆'
  );
  App.notifications.playSound('reminder');
}

function showWelcomeBack(hours) {
  const stats = App.gamification.getStats();
  const today = Storage.getTodayStats();
  const quote = App.notifications.getRandomQuote();

  const overlay = document.createElement('div');
  overlay.className = 'welcome-overlay';
  overlay.innerHTML = `
    <div class="welcome-card">
      <div class="welcome-emoji"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg></div>
      <div class="welcome-title">Bon retour !</div>
      <div class="welcome-subtitle">
        ${hours >= 24 ? `Ça fait ${Math.round(hours / 24)} jour(s) !` : `Absent ${hours}h`} — ton streak t'attend
      </div>
      <div class="welcome-quote">
        "${quote.text}"
        <span class="welcome-quote-author">— ${quote.author}</span>
      </div>
      <div class="welcome-stats">
        <div class="welcome-stat">
          <span class="welcome-stat-value">${stats.level}</span>
          <span class="welcome-stat-label">Niveau</span>
        </div>
        <div class="welcome-stat">
          <span class="welcome-stat-value">${stats.bestStreak}</span>
          <span class="welcome-stat-label">Best Streak</span>
        </div>
        <div class="welcome-stat">
          <span class="welcome-stat-value">${stats.totalSessions}</span>
          <span class="welcome-stat-label">Sessions</span>
        </div>
      </div>
      <button class="welcome-cta" id="welcomeStart">C'est parti !</button>
    </div>
  `;
  document.getElementById('dynamicOverlays').appendChild(overlay);
  overlay.querySelector('#welcomeStart').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ── Clock ──
function initClock() {
  function update() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clockTime').textContent = `${h}:${m}`;

    const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('clockDate').textContent = now.toLocaleDateString('fr-FR', opts);

    const hour = now.getHours();
    let greeting = '';
    if (hour < 6) greeting = 'Bonne nuit';
    else if (hour < 12) greeting = 'Bon matin';
    else if (hour < 18) greeting = 'Bon après-midi';
    else greeting = 'Bonsoir';
    document.getElementById('clockGreeting').textContent = greeting;
  }
  update();
  setInterval(update, 1000);
}

// ── Navigation ──
function initNavigation() {
  document.querySelectorAll('.nav-pill').forEach(pill => {
    pill.addEventListener('click', () => switchView(pill.dataset.view));
  });
}

function switchView(viewId) {
  App.currentView = viewId;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-pill').forEach(p => p.classList.remove('active'));

  const view = document.getElementById(`view-${viewId}`);
  const pill = document.querySelector(`[data-view="${viewId}"]`);
  if (view) {
    view.classList.add('active');
    view.style.animation = 'none';
    view.offsetHeight;
    view.style.animation = '';
  }
  if (pill) pill.classList.add('active');
}

window.FlowState = {
  views: {
    tasks: { show: () => switchView('tasks') },
    links: { show: () => switchView('links') },
  }
};

// ── Theme ──
function initTheme() {
  const saved = Storage.get('theme', 'dark');
  document.documentElement.dataset.theme = saved;

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    Storage.set('theme', next);
    toast(next === 'dark' ? 'Mode sombre activé' : 'Mode clair activé', 'info');
  });
}

// ── Timer ──
function initTimer() {
  App.timer = new Timer({
    onTick: (remaining, total) => {
      const text = App.timer.formatTime(remaining);
      const progress = App.timer.getProgress();
      const circumference = 2 * Math.PI * 130;

      document.getElementById('focusTimeDisplay').textContent = text;
      document.getElementById('focusRing').style.strokeDashoffset = circumference * (1 - progress);

      document.getElementById('miniTimerText').textContent = text;
      const miniCirc = 2 * Math.PI * 52;
      document.getElementById('miniTimerRing').style.strokeDashoffset = miniCirc * (1 - progress);

      document.title = `${text} — FlowState`;
    },
    onComplete: (isBreak, session) => {
      updateFocusUI();

      // Gamification
      if (!isBreak) {
        const mins = Math.round((App.timer.focusDuration || 25 * 60) / 60);
        App.gamification.onFocusComplete(mins);
        // Also update today stat for notes created in storage
        renderChallenges();
        renderHeatmap();
      }

      // Notifications
      App.notifications.notifyTimerComplete(!isBreak);
      updateDashboardStats();

      if (!isBreak) {
        spawnConfetti();
        toast('Session terminée ! Pause bien méritée', 'success');
        document.getElementById('focusLabel').textContent = 'Pause';
      } else {
        toast('Pause terminée ! C\'est reparti', 'info');
        document.getElementById('focusLabel').textContent = 'Focus';
      }
    },
    onStateChange: () => updateFocusUI(),
  });

  document.getElementById('focusToggle').addEventListener('click', () => App.timer.toggle());
  document.getElementById('focusReset').addEventListener('click', () => {
    App.timer.reset();
    document.getElementById('focusLabel').textContent = 'Prêt';
  });
  document.getElementById('focusSkip').addEventListener('click', () => App.timer.skip());

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      App.timer.focusDuration = parseInt(btn.dataset.minutes) * 60;
      App.timer.setDuration(parseInt(btn.dataset.minutes));
    });
  });

  document.getElementById('miniTimerToggle').addEventListener('click', () => App.timer.toggle());
  document.getElementById('miniTimerReset').addEventListener('click', () => {
    App.timer.reset();
    document.getElementById('focusLabel').textContent = 'Prêt';
  });

  updateFocusUI();
}

function updateFocusUI() {
  const toggleBtn = document.getElementById('focusToggle');
  const miniToggle = document.getElementById('miniTimerToggle');
  const label = document.getElementById('focusLabel');

  if (App.timer.running) {
    toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pause</span>';
    miniToggle.textContent = 'Pause';
    if (label.textContent === 'Prêt') label.textContent = App.timer.isBreak ? 'Pause' : 'Focus';
  } else {
    toggleBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Démarrer</span>';
    miniToggle.textContent = 'Start';
  }

  const dots = document.querySelectorAll('.session-dots .dot');
  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i < App.timer.session - 1) dot.classList.add('done');
    if (i === App.timer.session - 1) dot.classList.add('active');
  });

  document.getElementById('focusSessionInfo').textContent = `Session ${App.timer.session} / ${App.timer.maxSessions}`;
  document.getElementById('sessionCount').textContent = `${Storage.getTodayStats().sessions || 0} sessions`;
}

// ── Audio Player ──
function initAudioPlayer() {
  App.audioPlayer = new AudioPlayer((event) => {
    switch (event.type) {
      case 'play':
        updatePlayerUI(true);
        document.getElementById('audioTrackName').textContent = event.track.name || '—';
        document.getElementById('audioTrackArtist').textContent = event.track.artist || '';
        document.getElementById('audioPlayer').style.display = 'block';
        highlightTrack(event.index);
        break;
      case 'pause':
        updatePlayerUI(false);
        break;
      case 'timeupdate':
        if (event.duration) {
          document.getElementById('audioTimeCurrent').textContent = App.audioPlayer.formatTime(event.current);
          document.getElementById('audioTimeDuration').textContent = App.audioPlayer.formatTime(event.duration);
          document.getElementById('audioProgressFill').style.width = `${(event.current / event.duration) * 100}%`;
        }
        break;
      case 'trackAdded':
      case 'trackRemoved':
        renderTracklist();
        break;
      case 'spotifyReady':
        document.getElementById('spotifySearch').style.display = 'block';
        document.getElementById('spotifyConnectBtn').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954"><circle cx="12" cy="12" r="10"/></svg>';
        toast('Spotify connecté', 'success');
        break;
      case 'spotifyError':
        toast('Erreur Spotify: ' + event.message, 'error');
        break;
    }
  });

  // Check for Spotify token from callback
  const spotifyToken = JSON.parse(localStorage.getItem('flowstate_spotify_token') || 'null');
  if (spotifyToken) {
    localStorage.removeItem('flowstate_spotify_token');
    App.audioPlayer.setSpotifyToken(spotifyToken);
  } else {
    App.audioPlayer.checkSpotifyToken();
  }

  // Drop zone
  const dropzone = document.getElementById('audioDropzone');
  const fileInput = document.getElementById('audioFileInput');

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

  async function handleFiles(files) {
    for (const file of files) {
      if (file.type.startsWith('audio/')) {
        await App.audioPlayer.addTrack(file);
        toast(`${file.name} ajouté`, 'success');
      }
    }
    renderTracklist();
  }

  // Player controls
  document.getElementById('audioPlayPause').addEventListener('click', () => {
    if (App.audioPlayer.tracks.length === 0) return;
    if (App.audioPlayer.currentIndex < 0) App.audioPlayer.play(0);
    else App.audioPlayer.toggle();
  });

  document.getElementById('audioPrev').addEventListener('click', () => App.audioPlayer.prev());
  document.getElementById('audioNext').addEventListener('click', () => App.audioPlayer.next());

  document.getElementById('audioShuffle').addEventListener('click', () => {
    const on = App.audioPlayer.toggleShuffle();
    document.getElementById('audioShuffle').classList.toggle('active', on);
  });

  document.getElementById('audioRepeat').addEventListener('click', () => {
    const on = App.audioPlayer.toggleRepeat();
    document.getElementById('audioRepeat').classList.toggle('active', on);
  });

  document.getElementById('audioVolume').addEventListener('input', (e) => {
    App.audioPlayer.setVolume(e.target.value / 100);
  });

  // Progress bar seek
  document.getElementById('audioProgressBar').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    App.audioPlayer.seek(percent);
  });

  // Spotify
  document.getElementById('spotifyConnectBtn').addEventListener('click', () => {
    if (App.audioPlayer.spotifyToken) {
      App.audioPlayer.disconnectSpotify();
      document.getElementById('spotifySearch').style.display = 'none';
      document.getElementById('spotifyConnectBtn').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>';
      toast('Spotify déconnecté', 'info');
    } else {
      App.audioPlayer.initiateSpotifyAuth();
    }
  });

  document.getElementById('spotifySearchBtn')?.addEventListener('click', async () => {
    const query = document.getElementById('spotifySearchInput').value.trim();
    if (!query) return;
    const results = await App.audioPlayer.searchSpotify(query);
    renderSpotifyResults(results);
  });

  document.getElementById('spotifySearchInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('spotifySearchBtn').click();
  });

  // Ambient toggle button in topbar now controls audio player
  document.getElementById('ambientToggle').addEventListener('click', () => {
    if (App.audioPlayer.isPlaying) {
      App.audioPlayer.pause();
      toast('Musique en pause', 'info');
    } else if (App.audioPlayer.tracks.length > 0) {
      if (App.audioPlayer.currentIndex < 0) App.audioPlayer.play(0);
      else App.audioPlayer.play();
      toast('Lecture reprise', 'info');
    } else {
      toast('Ajoute des pistes pour commencer', 'info');
    }
  });

  renderTracklist();
}

function renderTracklist() {
  const list = document.getElementById('audioTracklist');
  const tracks = App.audioPlayer.tracks;
  list.innerHTML = '';
  document.getElementById('audioTrackCount').textContent = `${tracks.length} piste${tracks.length !== 1 ? 's' : ''}`;

  tracks.forEach((track, i) => {
    const item = document.createElement('div');
    item.className = `audio-track-item ${i === App.audioPlayer.currentIndex ? 'playing' : ''}`;
    item.innerHTML = `
      <span class="track-num">${i === App.audioPlayer.currentIndex && App.audioPlayer.isPlaying ? '\u25B6' : i + 1}</span>
      <div class="track-info">
        <span class="track-name">${escapeHtml(track.name)}</span>
        <span class="track-meta">${track.artist || (track.type === 'spotify' ? 'Spotify' : 'Fichier local')} \u00B7 ${App.audioPlayer.formatTime(track.duration)}</span>
      </div>
      <button class="track-remove" title="Retirer">\u2715</button>
    `;
    item.addEventListener('click', (e) => {
      if (e.target.closest('.track-remove')) return;
      App.audioPlayer.play(i);
    });
    item.querySelector('.track-remove').addEventListener('click', () => {
      App.audioPlayer.removeTrack(track.id);
    });
    list.appendChild(item);
  });
}

function highlightTrack(index) {
  document.querySelectorAll('.audio-track-item').forEach((el, i) => {
    el.classList.toggle('playing', i === index);
    el.querySelector('.track-num').textContent = i === index && App.audioPlayer.isPlaying ? '\u25B6' : i + 1;
  });
}

function updatePlayerUI(playing) {
  const btn = document.getElementById('audioPlayPause');
  btn.innerHTML = playing
    ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
    : '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  highlightTrack(App.audioPlayer.currentIndex);
}

function renderSpotifyResults(results) {
  const container = document.getElementById('spotifyResults');
  container.innerHTML = '';
  results.forEach(track => {
    const item = document.createElement('div');
    item.className = 'spotify-result-item';
    item.innerHTML = `
      ${track.cover ? `<img class="spotify-result-cover" src="${track.cover}" alt="">` : ''}
      <div class="spotify-result-info">
        <div class="spotify-result-name">${escapeHtml(track.name)}</div>
        <div class="spotify-result-artist">${escapeHtml(track.artist)}</div>
      </div>
      <button class="spotify-result-add">+ Ajouter</button>
    `;
    item.querySelector('.spotify-result-add').addEventListener('click', () => {
      App.audioPlayer.tracks.push({ ...track, id: Date.now() + Math.random() });
      App.audioPlayer.saveTracks();
      renderTracklist();
      toast(`${track.name} ajouté`, 'success');
    });
    container.appendChild(item);
  });
}

// ── Tasks ──
function initTasks() {
  App.tasks = Storage.get('tasks', getDefaultTasks());
  renderTasks();
  renderQuickTasks();

  document.getElementById('addTaskBtn').addEventListener('click', () => openTaskModal());
  document.getElementById('closeTaskModal').addEventListener('click', () => closeTaskModal());
  document.getElementById('cancelTask').addEventListener('click', () => closeTaskModal());
  document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveTask();
  });

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderTasks(pill.dataset.filter);
    });
  });
}

function getDefaultTasks() {
  return [
    { id: Date.now(), title: 'Bienvenue sur FlowState !', desc: 'Complète ta première session focus pour gagner de l\'XP', priority: 'medium', category: 'Onboarding', status: 'todo', created: new Date().toISOString() },
  ];
}

function openTaskModal(task = null) {
  document.getElementById('taskModal').classList.add('show');
  document.getElementById('taskModalTitle').textContent = task ? 'Modifier la tâche' : 'Nouvelle tâche';
  if (task) {
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDesc').value = task.desc || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskCategory').value = task.category || '';
    document.getElementById('taskForm').dataset.editId = task.id;
  } else {
    document.getElementById('taskForm').reset();
    delete document.getElementById('taskForm').dataset.editId;
  }
  document.getElementById('taskTitle').focus();
}

function closeTaskModal() {
  document.getElementById('taskModal').classList.remove('show');
}

function saveTask() {
  const form = document.getElementById('taskForm');
  const editId = form.dataset.editId;
  const taskData = {
    title: document.getElementById('taskTitle').value.trim(),
    desc: document.getElementById('taskDesc').value.trim(),
    priority: document.getElementById('taskPriority').value,
    category: document.getElementById('taskCategory').value.trim(),
  };

  if (editId) {
    const idx = App.tasks.findIndex(t => t.id === parseInt(editId));
    if (idx >= 0) App.tasks[idx] = { ...App.tasks[idx], ...taskData };
    delete form.dataset.editId;
  } else {
    App.tasks.push({ id: Date.now(), ...taskData, status: 'todo', created: new Date().toISOString() });
  }

  Storage.set('tasks', App.tasks);
  renderTasks();
  renderQuickTasks();
  closeTaskModal();
  toast(editId ? 'Tâche modifiée' : 'Tâche créée', 'success');
}

function renderTasks(filter = 'all') {
  const columns = { todo: [], progress: [], done: [] };

  App.tasks.forEach(task => {
    if (filter !== 'all' && filter !== 'done' && task.priority !== filter) return;
    if (filter === 'done' && task.status !== 'done') return;
    if (columns[task.status]) columns[task.status].push(task);
  });

  ['todo', 'progress', 'done'].forEach(status => {
    const list = document.getElementById(`list${status.charAt(0).toUpperCase() + status.slice(1)}`);
    const count = document.getElementById(`count${status.charAt(0).toUpperCase() + status.slice(1)}`);
    list.innerHTML = '';
    count.textContent = columns[status].length;

    columns[status].forEach((task, i) => {
      const card = document.createElement('div');
      card.className = 'task-card';
      card.style.animationDelay = `${i * 0.05}s`;
      card.innerHTML = `
        <div class="task-card-header">
          <span class="task-card-title">${escapeHtml(task.title)}</span>
          <span class="task-priority priority-${task.priority}"></span>
        </div>
        ${task.desc ? `<div class="task-card-desc">${escapeHtml(task.desc)}</div>` : ''}
        <div class="task-card-footer">
          <span class="task-card-category">${escapeHtml(task.category || 'Général')}</span>
          <div class="task-card-actions">
            ${status !== 'todo' ? `<button class="task-action-btn" data-action="prev" title="Reculer">◀</button>` : ''}
            ${status !== 'done' ? `<button class="task-action-btn" data-action="next" title="Avancer">▶</button>` : ''}
            <button class="task-action-btn" data-action="edit" title="Modifier">✎</button>
            <button class="task-action-btn" data-action="delete" title="Supprimer">✕</button>
          </div>
        </div>
      `;
      card.querySelectorAll('.task-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleTaskAction(task.id, btn.dataset.action);
        });
      });
      list.appendChild(card);
    });
  });
}

function handleTaskAction(id, action) {
  const idx = App.tasks.findIndex(t => t.id === id);
  if (idx < 0) return;
  const statusOrder = ['todo', 'progress', 'done'];
  const task = App.tasks[idx];

  switch (action) {
    case 'next': {
      const si = statusOrder.indexOf(task.status);
      if (si < statusOrder.length - 1) {
        task.status = statusOrder[si + 1];
        if (task.status === 'done') {
          Storage.incrementTodayStat('tasksCompleted');
          App.gamification.onTaskComplete(task.priority);
          updateDashboardStats();
          renderChallenges();
        }
      }
      break;
    }
    case 'prev': {
      const si = statusOrder.indexOf(task.status);
      if (si > 0) task.status = statusOrder[si - 1];
      break;
    }
    case 'edit': openTaskModal(task); return;
    case 'delete':
      App.tasks.splice(idx, 1);
      toast('Tâche supprimée', 'info');
      break;
  }

  Storage.set('tasks', App.tasks);
  renderTasks();
  renderQuickTasks();
}

function renderQuickTasks() {
  const list = document.getElementById('quickTaskList');
  list.innerHTML = '';

  const active = App.tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] || 1) - ({ high: 0, medium: 1, low: 2 }[b.priority] || 1))
    .slice(0, 5);

  if (active.length === 0) {
    list.innerHTML = '<li style="color:var(--text-muted);padding:12px;font-size:0.85rem;text-align:center">Aucune tâche en cours</li>';
    return;
  }

  active.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'quick-task-item';
    li.style.animationDelay = `${i * 0.05}s`;
    li.innerHTML = `
      <div class="task-checkbox" data-id="${task.id}"></div>
      <span class="task-text">${escapeHtml(task.title)}</span>
      <span class="task-priority priority-${task.priority}"></span>
    `;
    li.querySelector('.task-checkbox').addEventListener('click', (e) => {
      e.stopPropagation();
      const t = App.tasks.find(t => t.id === task.id);
      if (t) {
        t.status = 'done';
        Storage.incrementTodayStat('tasksCompleted');
        App.gamification.onTaskComplete(t.priority);
        Storage.set('tasks', App.tasks);
        updateDashboardStats();
        renderQuickTasks();
        renderTasks();
        renderChallenges();
      }
    });
    list.appendChild(li);
  });
}

// ── Notes ──
function initNotes() {
  App.notes = Storage.get('notes', []);
  if (App.notes.length === 0) {
    App.notes.push({
      id: Date.now(), title: 'Bienvenue', content: '<p>Bienvenue dans FlowState Notes !</p>', updated: new Date().toISOString()
    });
    Storage.set('notes', App.notes);
  }

  renderNotesList();
  selectNote(App.notes[0]?.id);

  document.getElementById('addNoteBtn').addEventListener('click', () => {
    const note = { id: Date.now(), title: 'Nouvelle note', content: '', updated: new Date().toISOString() };
    App.notes.unshift(note);
    Storage.set('notes', App.notes);
    App.gamification.onNoteCreate();
    Storage.incrementTodayStat('notesCreated');
    renderNotesList();
    selectNote(note.id);
    document.getElementById('noteTitleInput').focus();
    toast('Note créée +5 XP', 'success');
    renderChallenges();
  });

  let saveTimeout;
  document.getElementById('noteContent').addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCurrentNote, 500);
  });
  document.getElementById('noteTitleInput').addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCurrentNote, 500);
  });

  document.getElementById('noteSearch').addEventListener('input', (e) => {
    renderNotesList(e.target.value.toLowerCase());
  });

  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      if (cmd.startsWith('formatBlock:')) {
        document.execCommand('formatBlock', false, cmd.split(':')[1]);
      } else if (cmd === 'code') {
        const sel = window.getSelection();
        if (sel.rangeCount) {
          const range = sel.getRangeAt(0);
          const code = document.createElement('code');
          code.style.cssText = 'background:var(--bg-card);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.85em';
          range.surroundContents(code);
        }
      } else {
        document.execCommand(cmd, false, null);
      }
    });
  });
}

function renderNotesList(filter = '') {
  const list = document.getElementById('notesList');
  list.innerHTML = '';

  App.notes.filter(n =>
    !filter || n.title.toLowerCase().includes(filter) || (n.content || '').toLowerCase().includes(filter)
  ).forEach(note => {
    const item = document.createElement('div');
    item.className = `note-item ${note.id === App.activeNoteId ? 'active' : ''}`;
    const preview = (note.content || '').replace(/<[^>]+>/g, '').substring(0, 60);
    const date = new Date(note.updated).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    item.innerHTML = `
      <div class="note-item-title">${escapeHtml(note.title)}</div>
      <div class="note-item-preview">${escapeHtml(preview) || 'Note vide'}</div>
      <div class="note-item-date">${date}</div>
    `;
    item.addEventListener('click', () => selectNote(note.id));
    item.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (confirm(`Supprimer "${note.title}" ?`)) {
        App.notes = App.notes.filter(n => n.id !== note.id);
        Storage.set('notes', App.notes);
        renderNotesList();
        if (App.notes.length > 0) selectNote(App.notes[0].id);
        toast('Note supprimée', 'info');
      }
    });
    list.appendChild(item);
  });
}

function selectNote(id) {
  App.activeNoteId = id;
  const note = App.notes.find(n => n.id === id);
  if (!note) return;
  document.getElementById('noteTitleInput').value = note.title;
  document.getElementById('noteContent').innerHTML = note.content || '';
  document.getElementById('noteMeta').textContent = `Modifié le ${new Date(note.updated).toLocaleString('fr-FR')}`;
  renderNotesList();
}

function saveCurrentNote() {
  const note = App.notes.find(n => n.id === App.activeNoteId);
  if (!note) return;
  note.title = document.getElementById('noteTitleInput').value || 'Sans titre';
  note.content = document.getElementById('noteContent').innerHTML;
  note.updated = new Date().toISOString();
  Storage.set('notes', App.notes);
  renderNotesList();
  updateDashboardStats();
}

// ── Links (with real favicons) ──
function initLinks() {
  App.links = Storage.get('links', getDefaultLinks());
  renderLinks();
  renderQuickLinks();

  document.getElementById('addLinkBtn').addEventListener('click', () => openLinkModal());
  document.getElementById('closeLinkModal').addEventListener('click', () => closeLinkModal());
  document.getElementById('cancelLink').addEventListener('click', () => closeLinkModal());
  document.getElementById('linkForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveLink();
  });
}

function getDefaultLinks() {
  return [
    { id: 1,  title: 'GitHub',          url: 'https://github.com',              category: 'Dev' },
    { id: 2,  title: 'Stack Overflow',   url: 'https://stackoverflow.com',       category: 'Dev' },
    { id: 3,  title: 'ChatGPT',         url: 'https://chat.openai.com',         category: 'AI' },
    { id: 4,  title: 'Claude',          url: 'https://claude.ai',               category: 'AI' },
    { id: 5,  title: 'Figma',           url: 'https://figma.com',               category: 'Design' },
    { id: 6,  title: 'Notion',          url: 'https://notion.so',               category: 'Productivité' },
    { id: 7,  title: 'YouTube',         url: 'https://youtube.com',             category: 'Media' },
    { id: 8,  title: 'MDN Docs',        url: 'https://developer.mozilla.org',   category: 'Dev' },
    { id: 9,  title: 'Google Drive',    url: 'https://drive.google.com',        category: 'Productivité' },
    { id: 10, title: 'VS Code Web',     url: 'https://vscode.dev',              category: 'Dev' },
  ];
}

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    // Google's high-res favicon service
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
}

function openLinkModal() {
  document.getElementById('linkModal').classList.add('show');
  document.getElementById('linkTitle').focus();
}

function closeLinkModal() {
  document.getElementById('linkModal').classList.remove('show');
  document.getElementById('linkForm').reset();
}

function saveLink() {
  const link = {
    id: Date.now(),
    title: document.getElementById('linkTitle').value.trim(),
    url: document.getElementById('linkUrl').value.trim(),
    category: document.getElementById('linkCategory').value.trim() || 'Général',
  };
  App.links.push(link);
  Storage.set('links', App.links);
  App.gamification.onLinkAdd();
  renderLinks();
  renderQuickLinks();
  closeLinkModal();
  toast('Lien ajouté +3 XP', 'success');
}

function renderLinks(filterCat = null) {
  const cats = [...new Set(App.links.map(l => l.category))];
  const catsContainer = document.getElementById('linksCategories');
  catsContainer.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = `filter-pill ${!filterCat ? 'active' : ''}`;
  allBtn.textContent = 'Toutes';
  allBtn.addEventListener('click', () => renderLinks(null));
  catsContainer.appendChild(allBtn);

  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-pill ${filterCat === cat ? 'active' : ''}`;
    btn.textContent = cat;
    btn.addEventListener('click', () => renderLinks(cat));
    catsContainer.appendChild(btn);
  });

  const grid = document.getElementById('linksGrid');
  grid.innerHTML = '';
  const filtered = filterCat ? App.links.filter(l => l.category === filterCat) : App.links;

  filtered.forEach(link => {
    let domain = '';
    try { domain = new URL(link.url).hostname; } catch {}

    const card = document.createElement('a');
    card.className = 'link-card';
    card.href = link.url;
    card.target = '_blank';
    card.rel = 'noopener';
    card.innerHTML = `
      <div class="link-favicon">
        <img src="${getFaviconUrl(link.url)}" alt="${escapeHtml(link.title)}" width="28" height="28"
             onerror="this.style.display='none';this.parentElement.innerHTML='<svg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><path d=\\'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\\'/><path d=\\'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\\'/></svg>'">
      </div>
      <div class="link-info">
        <div class="link-info-title">${escapeHtml(link.title)}</div>
        <div class="link-info-url">${escapeHtml(domain)}</div>
      </div>
      <button class="link-delete" title="Supprimer">✕</button>
    `;
    card.querySelector('.link-delete').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      App.links = App.links.filter(l => l.id !== link.id);
      Storage.set('links', App.links);
      renderLinks(filterCat);
      renderQuickLinks();
      toast('Lien supprimé', 'info');
    });
    grid.appendChild(card);
  });
}

function renderQuickLinks() {
  const grid = document.getElementById('quickLinksGrid');
  grid.innerHTML = '';

  App.links.slice(0, 6).forEach(link => {
    const a = document.createElement('a');
    a.className = 'quick-link';
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `
      <div class="quick-link-icon">
        <img src="${getFaviconUrl(link.url)}" alt="" width="20" height="20"
             style="border-radius:4px"
             onerror="this.style.display='none';this.parentElement.innerHTML='<svg width=\\'16\\' height=\\'16\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><path d=\\'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\\'/><path d=\\'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\\'/></svg>'">
      </div>
      <span>${escapeHtml(link.title)}</span>
    `;
    grid.appendChild(a);
  });
}

// ── Dashboard Stats ──
function updateDashboardStats() {
  const today = Storage.getTodayStats();
  const hours = Math.floor((today.focusMinutes || 0) / 60);
  const mins = (today.focusMinutes || 0) % 60;

  document.getElementById('statFocusTime').textContent = hours > 0 ? `${hours}h${mins}` : `${mins}m`;
  document.getElementById('statTasksDone').textContent = today.tasksCompleted || 0;
  document.getElementById('statStreak').textContent = Storage.getStreak();
  document.getElementById('statNotes').textContent = App.notes?.length || 0;
  updateXPBar();
}

function renderWeekChart() {
  const chart = document.getElementById('weekChart');
  const week = Storage.getWeekStats();
  const maxMin = Math.max(...week.map(d => d.focusMinutes), 1);

  chart.innerHTML = '';
  week.forEach((day, i) => {
    const bar = document.createElement('div');
    bar.className = `chart-bar ${i === 6 ? 'today' : ''}`;
    bar.style.height = `${Math.max(4, (day.focusMinutes / maxMin) * 56)}px`;
    bar.title = `${day.date}: ${day.focusMinutes}min focus`;
    chart.appendChild(bar);
  });
}

// ── Command Palette ──
function initCommandPalette() {
  const overlay = document.getElementById('commandPalette');
  const input = document.getElementById('commandInput');
  const list = document.getElementById('commandList');

  const commands = [
    { icon: lucideIcon('bar-chart-3'), label: 'Dashboard', action: () => switchView('dashboard'), shortcut: '1' },
    { icon: lucideIcon('target'), label: 'Focus Timer', action: () => switchView('focus'), shortcut: '2' },
    { icon: lucideIcon('check-square'), label: 'Tâches', action: () => switchView('tasks'), shortcut: '3' },
    { icon: lucideIcon('file-text'), label: 'Notes', action: () => switchView('notes'), shortcut: '4' },
    { icon: lucideIcon('link'), label: 'Liens', action: () => switchView('links'), shortcut: '5' },
    { icon: lucideIcon('plus-circle'), label: 'Nouvelle tâche', action: () => { switchView('tasks'); setTimeout(() => openTaskModal(), 100); } },
    { icon: lucideIcon('file-plus'), label: 'Nouvelle note', action: () => { switchView('notes'); document.getElementById('addNoteBtn').click(); } },
    { icon: lucideIcon('play-circle'), label: 'Timer Start/Pause', action: () => App.timer.toggle(), shortcut: 'Space' },
    { icon: lucideIcon('rotate-ccw'), label: 'Timer Reset', action: () => App.timer.reset() },
    { icon: lucideIcon('moon'), label: 'Toggle Theme', action: () => document.getElementById('themeToggle').click() },
    { icon: lucideIcon('volume-x'), label: 'Stop Musique', action: () => { App.audioPlayer.pause(); } },
    { icon: lucideIcon('maximize'), label: 'Fullscreen', action: () => document.getElementById('fullscreenToggle').click() },
  ];

  function render(filter = '') {
    list.innerHTML = '';
    commands.filter(c => c.label.toLowerCase().includes(filter.toLowerCase())).forEach((cmd, i) => {
      const item = document.createElement('div');
      item.className = `command-item ${i === 0 ? 'selected' : ''}`;
      item.innerHTML = `<span class="command-item-icon">${cmd.icon}</span><span>${cmd.label}</span>${cmd.shortcut ? `<span class="command-item-shortcut">${cmd.shortcut}</span>` : ''}`;
      item.addEventListener('click', () => { cmd.action(); close(); });
      list.appendChild(item);
    });
  }

  function open() { overlay.classList.add('show'); input.value = ''; render(); input.focus(); }
  function close() { overlay.classList.remove('show'); }

  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', (e) => {
    const items = list.querySelectorAll('.command-item');
    const selected = list.querySelector('.command-item.selected');
    const idx = Array.from(items).indexOf(selected);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[idx]?.classList.remove('selected'); items[(idx + 1) % items.length]?.classList.add('selected'); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[idx]?.classList.remove('selected'); items[(idx - 1 + items.length) % items.length]?.classList.add('selected'); }
    else if (e.key === 'Enter') { e.preventDefault(); selected?.click(); }
    else if (e.key === 'Escape') { close(); }
  });

  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  window._commandPalette = { open, close, toggle: () => overlay.classList.contains('show') ? close() : open() };
}

// ── Keyboard Shortcuts ──
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); window._commandPalette?.toggle(); return; }
    if (isInput) return;
    switch (e.key) {
      case '1': switchView('dashboard'); break;
      case '2': switchView('focus'); break;
      case '3': switchView('tasks'); break;
      case '4': switchView('notes'); break;
      case '5': switchView('links'); break;
      case ' ': e.preventDefault(); App.timer.toggle(); updateFocusUI(); break;
    }
  });
}

// ── Fullscreen ──
function initFullscreen() {
  document.getElementById('fullscreenToggle').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  });
}

// ── Toast ──
function toast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  const icons = {
    success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  el.className = `toast toast-${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span> ${escapeHtml(message)}`;
  container.appendChild(el);
  setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 300); }, 3000);
}

// ── Entrance Animation ──
function animateEntrance() {
  // XP bar
  const xpBar = document.getElementById('xpBar');
  xpBar.style.opacity = '0';
  xpBar.style.transform = 'translateY(12px)';
  setTimeout(() => {
    xpBar.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    xpBar.style.opacity = '1';
    xpBar.style.transform = 'translateY(0)';
  }, 50);

  // Cards
  document.querySelectorAll('.dashboard-grid .card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 150 + i * 80);
  });
}

// ── Utilities ──
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('show'); });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
});
