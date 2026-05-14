import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
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
