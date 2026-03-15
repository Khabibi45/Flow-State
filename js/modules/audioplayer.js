/* ============================================================
   AudioPlayer Module — Spotify + MP3 Drag & Drop Player
   ============================================================ */

import { Storage } from './storage.js';

export class AudioPlayer {
  constructor(onEvent) {
    this.onEvent = onEvent || (() => {});
    this.tracks = Storage.get('audio_tracks', []);
    this.currentTrack = null;
    this.currentIndex = -1;
    this.audio = new Audio();
    this.isPlaying = false;
    this.volume = Storage.get('audio_volume', 0.7);
    this.repeat = false;
    this.shuffle = false;
    this.spotifyToken = null;
    this.spotifyPlayer = null;
    this.spotifyDeviceId = null;
    this.mode = 'local'; // 'local' or 'spotify'

    this.audio.volume = this.volume;

    // Audio events
    this.audio.addEventListener('ended', () => {
      if (this.repeat) {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.next();
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      this.onEvent({ type: 'timeupdate', current: this.audio.currentTime, duration: this.audio.duration });
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.onEvent({ type: 'loaded', duration: this.audio.duration });
    });
  }

  // ── Local MP3 Management ──

  addTrack(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const track = {
        id: Date.now() + Math.random(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        size: file.size,
        type: 'local',
        url: url,
        added: new Date().toISOString(),
      };

      // Try to read ID3 tags from the file
      this.readDuration(url).then(duration => {
        track.duration = duration;
        this.tracks.push(track);
        this.saveTracks();
        this.onEvent({ type: 'trackAdded', track });
        resolve(track);
      });
    });
  }

  readDuration(url) {
    return new Promise(resolve => {
      const a = new Audio(url);
      a.addEventListener('loadedmetadata', () => resolve(a.duration));
      a.addEventListener('error', () => resolve(0));
    });
  }

  removeTrack(id) {
    const idx = this.tracks.findIndex(t => t.id === id);
    if (idx >= 0) {
      if (this.tracks[idx].url?.startsWith('blob:')) {
        URL.revokeObjectURL(this.tracks[idx].url);
      }
      this.tracks.splice(idx, 1);
      this.saveTracks();
      this.onEvent({ type: 'trackRemoved', id });
    }
  }

  saveTracks() {
    // Save metadata only (not blob URLs which are session-only)
    const meta = this.tracks.map(t => ({
      ...t,
      url: t.type === 'spotify' ? t.url : null, // Don't persist blob URLs
    }));
    Storage.set('audio_tracks', meta);
  }

  // ── Playback Controls ──

  play(index) {
    if (index !== undefined && index >= 0 && index < this.tracks.length) {
      this.currentIndex = index;
      this.currentTrack = this.tracks[index];

      if (this.currentTrack.type === 'spotify' && this.spotifyPlayer) {
        this.playSpotify(this.currentTrack.spotifyUri);
        return;
      }

      if (this.currentTrack.url) {
        this.audio.src = this.currentTrack.url;
        this.audio.play().catch(() => {});
        this.isPlaying = true;
        this.mode = 'local';
        this.onEvent({ type: 'play', track: this.currentTrack, index });
      }
    } else if (this.currentTrack?.url) {
      this.audio.play().catch(() => {});
      this.isPlaying = true;
      this.onEvent({ type: 'play', track: this.currentTrack, index: this.currentIndex });
    }
  }

  pause() {
    if (this.mode === 'spotify' && this.spotifyPlayer) {
      this.spotifyPlayer.pause();
    } else {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.onEvent({ type: 'pause' });
  }

  toggle() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  next() {
    if (this.tracks.length === 0) return;
    let next = this.currentIndex + 1;
    if (this.shuffle) next = Math.floor(Math.random() * this.tracks.length);
    if (next >= this.tracks.length) next = 0;
    this.play(next);
  }

  prev() {
    if (this.tracks.length === 0) return;
    // If more than 3 seconds in, restart current track
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    let prev = this.currentIndex - 1;
    if (prev < 0) prev = this.tracks.length - 1;
    this.play(prev);
  }

  seek(percent) {
    if (this.audio.duration) {
      this.audio.currentTime = this.audio.duration * percent;
    }
  }

  setVolume(v) {
    this.volume = v;
    this.audio.volume = v;
    Storage.set('audio_volume', v);
    if (this.spotifyPlayer) {
      this.spotifyPlayer.setVolume(v);
    }
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
    return this.repeat;
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
    return this.shuffle;
  }

  // ── Spotify Integration ──

  /*
    SPOTIFY SETUP:
    1. Go to https://developer.spotify.com/dashboard
    2. Create an app
    3. Set redirect URI to: http://localhost/projets/productivity-hub/callback.html
    4. Copy Client ID below
    5. User needs Spotify Premium for Web Playback SDK
  */

  static SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace with real client ID
  static SPOTIFY_REDIRECT = window.location.origin + '/projets/productivity-hub/callback.html';
  static SPOTIFY_SCOPES = 'streaming user-read-email user-read-private user-library-read user-read-playback-state user-modify-playback-state';

  initiateSpotifyAuth() {
    const params = new URLSearchParams({
      client_id: AudioPlayer.SPOTIFY_CLIENT_ID,
      response_type: 'token',
      redirect_uri: AudioPlayer.SPOTIFY_REDIRECT,
      scope: AudioPlayer.SPOTIFY_SCOPES,
      show_dialog: true,
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params}`;
  }

  setSpotifyToken(token) {
    this.spotifyToken = token;
    Storage.set('spotify_token', token);
    this.initSpotifyPlayer();
  }

  checkSpotifyToken() {
    const token = Storage.get('spotify_token');
    if (token) {
      this.spotifyToken = token;
      this.initSpotifyPlayer();
      return true;
    }
    return false;
  }

  initSpotifyPlayer() {
    if (!this.spotifyToken || !window.Spotify) return;

    this.spotifyPlayer = new Spotify.Player({
      name: 'FlowState',
      getOAuthToken: cb => cb(this.spotifyToken),
      volume: this.volume,
    });

    this.spotifyPlayer.addListener('ready', ({ device_id }) => {
      this.spotifyDeviceId = device_id;
      this.onEvent({ type: 'spotifyReady', deviceId: device_id });
    });

    this.spotifyPlayer.addListener('player_state_changed', state => {
      if (!state) return;
      this.onEvent({ type: 'spotifyState', state });
    });

    this.spotifyPlayer.addListener('initialization_error', ({ message }) => {
      this.onEvent({ type: 'spotifyError', message });
    });

    this.spotifyPlayer.connect();
  }

  async playSpotify(uri) {
    if (!this.spotifyToken || !this.spotifyDeviceId) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.spotifyDeviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.spotifyToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: [uri] }),
      });
      this.isPlaying = true;
      this.mode = 'spotify';
    } catch (e) {
      this.onEvent({ type: 'spotifyError', message: e.message });
    }
  }

  async searchSpotify(query) {
    if (!this.spotifyToken) return [];

    try {
      const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
        headers: { 'Authorization': `Bearer ${this.spotifyToken}` },
      });
      const data = await res.json();
      return data.tracks?.items?.map(t => ({
        id: t.id,
        name: t.name,
        artist: t.artists.map(a => a.name).join(', '),
        album: t.album.name,
        cover: t.album.images[0]?.url,
        duration: t.duration_ms / 1000,
        spotifyUri: t.uri,
        type: 'spotify',
      })) || [];
    } catch {
      return [];
    }
  }

  async getSpotifyPlaylists() {
    if (!this.spotifyToken) return [];
    try {
      const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
        headers: { 'Authorization': `Bearer ${this.spotifyToken}` },
      });
      const data = await res.json();
      return data.items || [];
    } catch { return []; }
  }

  disconnectSpotify() {
    if (this.spotifyPlayer) {
      this.spotifyPlayer.disconnect();
      this.spotifyPlayer = null;
    }
    this.spotifyToken = null;
    this.spotifyDeviceId = null;
    Storage.remove('spotify_token');
    this.onEvent({ type: 'spotifyDisconnected' });
  }

  // ── Utils ──

  formatTime(seconds) {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      currentIndex: this.currentIndex,
      tracks: this.tracks,
      volume: this.volume,
      repeat: this.repeat,
      shuffle: this.shuffle,
      mode: this.mode,
      spotifyConnected: !!this.spotifyToken,
    };
  }
}
