import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    const basePath = import.meta.env.BASE_URL;
    this.load.audio('click', basePath + 'audio/Audio/click_001.ogg');
    this.load.audio('ding', basePath + 'audio/Audio/confirmation_001.ogg');
    this.load.audio('chime', basePath + 'audio/Audio/select_001.ogg');

    this.load.on('loaderror', (file) => {
      console.warn(`Failed to load audio: ${file.key}`);
    });
  }

  create() {
    // Ensure input is enabled for this scene
    this.input.enabled = true;

    // Load mute preference and apply to sound manager
    const isMuted = localStorage.getItem('wordfall_muted') === 'true';
    this.sound.mute = isMuted;
    this.isMuted = isMuted;  // Store as scene property for reliable state

    // Mute toggle button (top-right corner)
    const muteButtonX = this.game.config.width - 45;
    const muteButtonY = 35;

    const muteButton = this.add.rectangle(
      muteButtonX,
      muteButtonY,
      70,
      50,
      this.isMuted ? 0xff6b6b : 0x4ecdc4
    );
    muteButton.setDepth(100);
    muteButton.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Rectangle(-35, -25, 70, 50)
    });

    const muteText = this.add.text(
      muteButtonX,
      muteButtonY,
      this.isMuted ? '🔇' : '🔊',
      {
        fontSize: '24px'
      }
    ).setOrigin(0.5, 0.5).setDepth(101);

    const updateMuteUI = () => {
      const isMuted = this.isMuted;
      muteButton.setFillStyle(isMuted ? 0xff6b6b : 0x4ecdc4);
      muteText.setText(isMuted ? '🔇' : '🔊');
    };

    muteButton.on('pointerdown', () => {
      this.isMuted = !this.isMuted;
      this.sound.mute = this.isMuted;
      localStorage.setItem('wordfall_muted', this.isMuted.toString());
      updateMuteUI();
    });

    muteButton.on('pointerover', () => {
      muteButton.setFillStyle(this.isMuted ? 0xff5252 : 0x3ab8a8);
    });

    muteButton.on('pointerout', () => {
      updateMuteUI();
    });

    // Cleanup when scene shuts down
    this.events.on('shutdown', () => {
      this.input.enabled = false;
    });

    // Title text
    this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2 - 100,
      'WORDFALL',
      {
        fontSize: '48px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5, 0.5);

    // Best score display
    const bestScore = parseInt(localStorage.getItem('wordfall_reflex_best') || '0', 10);
    this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2 - 30,
      `Best: ${bestScore}`,
      {
        fontSize: '24px',
        fill: '#a8e6cf'
      }
    ).setOrigin(0.5, 0.5);

    // Play button
    const buttonX = this.game.config.width / 2;
    const buttonY = this.game.config.height / 2 + 50;

    const playButton = this.add.rectangle(
      buttonX,
      buttonY,
      150,
      50,
      0x00ff00
    );
    playButton.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Rectangle(-75, -25, 150, 50)
    });
    playButton.on('pointerdown', () => {
      this.sound.context.resume();
      this.scene.start('GameScene');
    });

    const playText = this.add.text(
      buttonX,
      buttonY,
      'Tap to Play',
      {
        fontSize: '20px',
        fill: '#000000'
      }
    ).setOrigin(0.5, 0.5);

    // Add hover effects
    playButton.on('pointerover', () => {
      playButton.setFillStyle(0x00dd00);
      playText.setStyle({ fill: '#000000', fontSize: '22px' });
    });
    playButton.on('pointerout', () => {
      playButton.setFillStyle(0x00ff00);
      playText.setStyle({ fill: '#000000', fontSize: '20px' });
    });
  }
}
