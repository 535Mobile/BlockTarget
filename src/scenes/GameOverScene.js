import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    const finalScore = data.finalScore || 0;

    const bestScore = parseInt(localStorage.getItem('wordfall_reflex_best') || '0', 10);
    const isNewBest = finalScore > bestScore;

    if (isNewBest) {
      localStorage.setItem('wordfall_reflex_best', finalScore.toString());
    }

    // Game Over title
    this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2 - 120,
      'GAME OVER',
      {
        fontSize: '44px',
        fill: '#ff6b6b',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5, 0.5);

    // Final score display
    this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2 - 20,
      `Final Score: ${finalScore}`,
      {
        fontSize: '32px',
        fill: '#ffffff'
      }
    ).setOrigin(0.5, 0.5);

    // New best score indicator
    if (isNewBest) {
      this.add.text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 20,
        '🎉 NEW BEST!',
        {
          fontSize: '24px',
          fill: '#ffff00',
          fontStyle: 'bold'
        }
      ).setOrigin(0.5, 0.5);
    }

    // Play Again button
    const buttonX = this.game.config.width / 2;
    const buttonY = this.game.config.height / 2 + 80;

    const playAgainButton = this.add.rectangle(
      buttonX,
      buttonY,
      150,
      50,
      0x00ff00
    );
    playAgainButton.setInteractive();
    playAgainButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    const playAgainText = this.add.text(
      buttonX,
      buttonY,
      'Play Again',
      {
        fontSize: '20px',
        fill: '#000000'
      }
    ).setOrigin(0.5, 0.5);

    playAgainButton.on('pointerover', () => {
      playAgainButton.setFillStyle(0x00dd00);
      playAgainText.setStyle({ fill: '#000000', fontSize: '22px' });
    });
    playAgainButton.on('pointerout', () => {
      playAgainButton.setFillStyle(0x00ff00);
      playAgainText.setStyle({ fill: '#000000', fontSize: '20px' });
    });

    // Menu button
    const menuButtonX = this.game.config.width / 2;
    const menuButtonY = this.game.config.height / 2 + 150;

    const menuButton = this.add.rectangle(
      menuButtonX,
      menuButtonY,
      120,
      45,
      0x4ecdc4
    );
    menuButton.setInteractive();
    menuButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });

    const menuText = this.add.text(
      menuButtonX,
      menuButtonY,
      'Menu',
      {
        fontSize: '18px',
        fill: '#000000'
      }
    ).setOrigin(0.5, 0.5);

    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0x3ab8a8);
      menuText.setStyle({ fill: '#000000', fontSize: '20px' });
    });
    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0x4ecdc4);
      menuText.setStyle({ fill: '#000000', fontSize: '18px' });
    });
  }
}
