import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    this.load.audio('click', 'audio/Audio/click_001.ogg');
    this.load.audio('ding', 'audio/Audio/confirmation_001.ogg');
    this.load.audio('chime', 'audio/Audio/select_001.ogg');
  }

  create() {
    // Load mute preference
    const isMuted = localStorage.getItem('wordfall_muted') === 'true';
    this.sound.mute = isMuted;

    // Mute toggle button (top-right corner)
    const muteButtonX = this.game.config.width - 40;
    const muteButtonY = 40;

    const muteButton = this.add.rectangle(
      muteButtonX,
      muteButtonY,
      60,
      40,
      isMuted ? 0xff6b6b : 0x4ecdc4
    );
    muteButton.setInteractive();

    const muteText = this.add.text(
      muteButtonX,
      muteButtonY,
      isMuted ? '🔇' : '🔊',
      {
        fontSize: '20px'
      }
    ).setOrigin(0.5, 0.5);

    muteButton.on('pointerdown', () => {
      this.sound.mute = !this.sound.mute;
      localStorage.setItem('wordfall_muted', this.sound.mute.toString());
      muteButton.setFillStyle(this.sound.mute ? 0xff6b6b : 0x4ecdc4);
      muteText.setText(this.sound.mute ? '🔇' : '🔊');
    });

    muteButton.on('pointerover', () => {
      muteButton.setFillStyle(this.sound.mute ? 0xff5252 : 0x3ab8a8);
    });
    muteButton.on('pointerout', () => {
      muteButton.setFillStyle(this.sound.mute ? 0xff6b6b : 0x4ecdc4);
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
    playButton.setInteractive();
    playButton.on('pointerdown', () => {
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
