```
 ███████╗██╗      ██████╗ ██╗    ██╗███████╗████████╗ █████╗ ████████╗███████╗
 ██╔════╝██║     ██╔═══██╗██║    ██║██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
 █████╗  ██║     ██║   ██║██║ █╗ ██║███████╗   ██║   ███████║   ██║   █████╗
 ██╔══╝  ██║     ██║   ██║██║███╗██║╚════██║   ██║   ██╔══██║   ██║   ██╔══╝
 ██║     ███████╗╚██████╔╝╚███╔███╔╝███████║   ██║   ██║  ██║   ██║   ███████╗
 ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
```

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Docker-nginx%3Aalpine-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

<p align="center">
  <strong>Dashboard de productivite gamifie — Focus Timer, Tasks, Notes, XP & Badges</strong>
</p>

---

![FlowState Dashboard](screenshots/dashboard.png)

## Features

### Productivite

- **Focus Timer** — Pomodoro timer with configurable work/break intervals and session tracking
- **Kanban Tasks** — Task management with To Do / In Progress / Done columns
- **Rich Notes** — Markdown-compatible notes with auto-save
- **Quick Links** — Customizable grid for frequently visited sites
- **Ambient Sounds** — Background soundscapes (rain, forest, cafe) via Web Audio API

### Gamification

- **XP & 30 Niveaux** — Earn experience points for every productive action
- **22 Badges** — Unlockable achievements for productivity milestones
- **Daily Challenges** — Fresh challenges every day to maintain motivation
- **Streak Multiplier** — Consecutive daily usage multiplies XP gains
- **Activity Heatmap** — GitHub-style contribution heatmap for tracking productivity

### Notifications

- **Browser Push** — Native push notifications for timers and reminders
- **Custom Sounds** — Configurable notification sounds via Web Audio API
- **Idle Detection** — Automatic pause when user is inactive
- **Welcome Back** — Personalized greeting after absence with stats summary
- **Rappels** — Smart reminders for breaks and pending tasks

### Design

- **Glassmorphism** — Frosted glass UI with backdrop-filter and subtle gradients
- **Dark / Light Theme** — Toggle with system preference detection
- **Motion Design** — Smooth transitions, micro-interactions, confetti celebrations
- **Responsive** — Full mobile, tablet, and desktop support
- **Command Palette** — `Ctrl+K` quick action launcher for power users

## Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic markup, accessibility (ARIA) |
| **CSS3** | Custom Properties, Grid, Flexbox, Backdrop-filter, Animations |
| **JavaScript ES Modules** | Modular architecture, no frameworks, no dependencies |
| **Web Audio API** | Ambient sounds, notification sounds, procedural audio |
| **Notifications API** | Browser push notifications |
| **localStorage** | Persistent data storage (tasks, notes, XP, settings) |
| **Docker** | `nginx:alpine` container for deployment |

## Quick Start

### Option 1: XAMPP

1. Copy the `productivity-hub` folder to your XAMPP `htdocs/` directory
2. Start Apache in XAMPP Control Panel
3. Open [http://localhost/projets/productivity-hub/](http://localhost/projets/productivity-hub/)

### Option 2: Docker

```bash
docker-compose up -d
```

Open [http://localhost:3333](http://localhost:3333)

### Option 3: Any Static Server

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8080
```

## Project Structure

```
productivity-hub/
├── index.html              # Main dashboard entry point
├── landing.html            # Public landing page
├── pricing.html            # Pricing tiers page
├── privacy.html            # Privacy policy page
├── css/
│   ├── style.css           # Core styles, glassmorphism, layout
│   ├── themes.css          # Dark/Light theme variables
│   ├── animations.css      # Keyframes, transitions, motion
│   ├── landing.css         # Landing page styles
│   └── responsive.css      # Media queries, mobile adaptation
├── js/
│   ├── app.js              # Main application bootstrap
│   ├── timer.js            # Focus Timer (Pomodoro) module
│   ├── tasks.js            # Kanban task management
│   ├── notes.js            # Rich notes with auto-save
│   ├── links.js            # Quick links manager
│   ├── sounds.js           # Ambient sounds (Web Audio API)
│   ├── xp.js               # XP, levels, rank system
│   ├── badges.js           # Badge definitions and unlocking
│   ├── challenges.js       # Daily challenge generator
│   ├── heatmap.js          # Activity heatmap renderer
│   ├── notifications.js    # Push notifications & sounds
│   ├── theme.js            # Theme toggling & persistence
│   ├── palette.js          # Command Palette (Ctrl+K)
│   ├── confetti.js         # Celebration animations
│   └── storage.js          # localStorage wrapper & migrations
├── assets/
│   ├── icons/              # App icons, favicons
│   ├── sounds/             # Notification & ambient audio files
│   └── images/             # UI images, backgrounds
├── screenshots/            # Project screenshots
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf              # Nginx configuration
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
├── README.md               # This file
├── CONTRIBUTING.md         # Contribution guidelines
├── CHANGELOG.md            # Version history
└── SECURITY.md             # Security policy
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `1` | Switch to Dashboard view |
| `2` | Switch to Timer view |
| `3` | Switch to Tasks view |
| `4` | Switch to Notes view |
| `5` | Switch to Links view |
| `Space` | Start / Pause timer |
| `Ctrl + K` | Open Command Palette |
| `Escape` | Close modal / palette |

## Gamification System

### XP Table

| Action | XP Earned |
|---|---|
| Complete a Pomodoro session | +50 XP |
| Finish a task | +30 XP |
| Create a note | +10 XP |
| Complete a daily challenge | +100 XP |
| Unlock a badge | +75 XP |
| 7-day streak bonus | +200 XP |

### Ranks (30 Levels)

| Level | Rank | XP Required |
|---|---|---|
| 1-5 | Novice | 0 - 500 |
| 6-10 | Apprentice | 501 - 2,000 |
| 11-15 | Practitioner | 2,001 - 5,000 |
| 16-20 | Expert | 5,001 - 12,000 |
| 21-25 | Master | 12,001 - 25,000 |
| 26-30 | Grandmaster | 25,001 - 50,000 |

### Badges (22 Total)

| Badge | Condition |
|---|---|
| First Focus | Complete your first Pomodoro |
| Task Starter | Create your first task |
| Note Taker | Write your first note |
| Early Bird | Use the app before 7 AM |
| Night Owl | Use the app after 11 PM |
| Streak 7 | 7-day usage streak |
| Streak 30 | 30-day usage streak |
| Centurion | Complete 100 Pomodoros |
| Task Master | Finish 50 tasks |
| Scribe | Write 25 notes |
| Speed Demon | Complete 5 Pomodoros in one day |
| Zen Master | Listen to ambient sounds for 1 hour |
| Challenger | Complete 10 daily challenges |
| Level 10 | Reach level 10 |
| Level 20 | Reach level 20 |
| Level 30 | Reach max level |
| Explorer | Use all 5 views |
| Customizer | Change theme 5 times |
| Commander | Use Command Palette 20 times |
| Marathoner | 4-hour total focus time |
| Ironman | 10-hour total focus time |
| Perfectionist | Complete all daily challenges in a week |

## Customization

### Adding Quick Links

1. Navigate to the **Links** view (press `5`)
2. Click **Add Link**
3. Enter the title, URL, and choose an icon
4. Links are saved in `localStorage` and persist across sessions

### Changing Theme

- Click the theme toggle button in the sidebar
- Or use the Command Palette (`Ctrl+K`) and type "theme"
- The app respects your system's `prefers-color-scheme` by default

### Timer Configuration

- Default: 25 min work / 5 min break / 15 min long break
- Customizable in the Timer settings panel
- Long break triggers after every 4 work sessions

## Roadmap

- [ ] PWA offline support with Service Worker
- [ ] Drag & drop task reordering
- [ ] Pomodoro statistics export (CSV/JSON)
- [ ] Spotify integration for ambient music
- [ ] Collaborative mode (shared boards)
- [ ] Mobile app (Capacitor/PWA)
- [ ] Calendar view integration
- [ ] Plugin system for extensibility
- [ ] i18n (English, French, Spanish)
- [ ] Cloud sync (optional, privacy-first)

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on the process, code guidelines, and how to get started.

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## Author

Made with focus by the **FlowState Team**.

---

<p align="center">
  <sub>Stay focused. Level up. Ship more.</sub>
</p>
