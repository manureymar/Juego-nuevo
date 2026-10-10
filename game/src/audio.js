/** One persistent menu soundtrack; navigation never restarts it. */
export class GameAudio {
  constructor(profile) {
    this.profile = profile;
    this.menu = true;
    this.nativePaused = false;
    this.music = new Audio('assets/audio/menu-theme.mp3');
    this.music.id = 'menu-music';
    this.music.loop = true;
    this.music.preload = 'auto';
    this.music.volume = .34 * .75; // Exactly 25% below the previous mix.
    this.music.setAttribute('aria-hidden', 'true');
    document.body.append(this.music);
    this.taps = Array.from({length: 4}, () => {
      const sound = new Audio('assets/audio/button-tap.wav');
      sound.preload = 'auto'; sound.volume = .6;
      return sound;
    });
    this.nextTap = 0;
    document.addEventListener('pointerdown', () => this.sync(), {passive: true});
    document.addEventListener('visibilitychange', () => this.sync());
    document.addEventListener('robotpulse:pause', () => { this.nativePaused = true; this.sync(); });
    document.addEventListener('robotpulse:resume', () => { this.nativePaused = false; this.sync(); });
    window.addEventListener('pagehide', () => this.music.pause());
  }
  setScreen(screen) { this.menu = screen !== 'game'; this.sync(); }
  sync() {
    if (!this.profile.music || !this.menu || document.hidden || this.nativePaused) {
      this.music.pause();
      return;
    }
    // Desktop browsers can require the first touch. Android explicitly permits autoplay.
    if (this.music.paused) this.music.play().catch(() => {});
  }
  tap() {
    this.sync();
    if (!this.profile.sound) return;
    const sound = this.taps[this.nextTap++ % this.taps.length];
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
}
