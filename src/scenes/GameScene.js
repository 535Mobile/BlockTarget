import Phaser from 'phaser';

const PALETTE = [
  0xff6b6b,
  0x4ecdc4,
  0xffe66d,
  0xa8e6cf,
  0xff8b94
];

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  shutdown() {
    this.tiles = [];
    this.targetTile = null;
  }

  create() {
    const GRID_COLS = 5;
    const GRID_ROWS = 5;
    const SQUARE_SIZE = 60;

    this.tiles = [];
    this.score = 0;
    this.gameOver = false;
    this.timeRemaining = 30;
    this.lastHitTime = 0;

    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      fill: '#ffffff'
    });
    this.scoreText.setOrigin(0, 0);
    this.scoreText.setDepth(100);

    this.timerText = this.add.text(
      this.game.config.width - 20,
      20,
      'Time: 30',
      {
        fontSize: '24px',
        fill: '#ffffff'
      }
    );
    this.timerText.setOrigin(1, 0);
    this.timerText.setDepth(100);

    const gridWidth = GRID_COLS * SQUARE_SIZE;
    const gridHeight = GRID_ROWS * SQUARE_SIZE;

    const startX = (this.game.config.width - gridWidth) / 2;
    const startY = (this.game.config.height - gridHeight) / 2 - 60;

    this.flashOverlay = this.add.rectangle(
      startX + gridWidth / 2,
      startY + gridHeight / 2,
      gridWidth,
      gridHeight,
      0xffffff,
      0.2
    );
    this.flashOverlay.setDepth(10000);

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const x = startX + col * SQUARE_SIZE;
        const y = startY + row * SQUARE_SIZE;

        const color = Phaser.Utils.Array.GetRandom(PALETTE);

        const tile = this.add.rectangle(
          x + SQUARE_SIZE / 2,
          y + SQUARE_SIZE / 2,
          SQUARE_SIZE,
          SQUARE_SIZE,
          color
        );

        this.tiles.push(tile);
        tile.setInteractive();

        tile.setData('row', row);
        tile.setData('col', col);
        tile.setData('cleared', false);

        tile.on('pointerdown', () => {
          if (this.gameOver) {
            return;
          }

          if (tile.getData('cleared')) {
            return;
          }

          this.sound.play('click', { volume: 0.3 });

          const tileRow = tile.getData('row');
          const tileCol = tile.getData('col');
          console.log(`Tile clicked: row ${tileRow}, col ${tileCol}`);

          const isTarget = (tile === this.targetTile);
          if (isTarget) {
            const now = this.time.now;
            const timeSinceLastHit = now - this.lastHitTime;
            const isCombo = timeSinceLastHit < 1000;

            if (isCombo) {
              this.score += 2;
            } else {
              this.score += 1;
            }

            this.scoreText.setText(`Score: ${this.score}`);
            this.sound.play('ding', { volume: 0.6 });
            console.log('Hit!');

            if (isCombo) {
              const comboText = this.add.text(
                this.scoreText.x + 80,
                this.scoreText.y + 40,
                '+2 COMBO',
                {
                  fontSize: '18px',
                  fill: '#ffff00'
                }
              );
              comboText.setOrigin(0.5, 0.5);
              comboText.setDepth(100);

              this.tweens.add({
                targets: comboText,
                y: comboText.y - 30,
                alpha: 0,
                duration: 1000,
                ease: 'Quad.easeOut',
                onComplete: () => comboText.destroy()
              });
            }

            this.lastHitTime = now;

            this.tweens.add({
              targets: this.flashOverlay,
              alpha: 0.8,
              duration: 50,
              ease: 'Linear',
              onComplete: () => {
                this.tweens.add({
                  targets: this.flashOverlay,
                  alpha: 0.2,
                  duration: 200,
                  ease: 'Quad.easeOut'
                });
              }
            });

            const clearedTiles = this.tiles.filter(t => t.getData('cleared'));
            clearedTiles.forEach(t => {
              t.setFillStyle(0x000000);
              this.time.delayedCall(250, () => {
                if (t.active) {
                  t.setFillStyle(0x333333);
                }
              });
            });

            this.scoreText.setScale(1.3);
            this.tweens.add({
              targets: this.scoreText,
              scale: 1.0,
              duration: 200,
              ease: 'Back.easeOut'
            });
          }

          tile.setData('cleared', true);
          tile.setFillStyle(0x333333);
          tile.disableInteractive();

          this.tweens.add({
            targets: tile,
            scale: 1.15,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeInOut',
            onStart: () => tile.setDepth(1000),
            onComplete: () => tile.setDepth(0)
          });

          if (isTarget) {
            this.setRandomTarget();
          }
        });
      }
    }

    this.setRandomTarget();
  }

  setRandomTarget() {
    const availableTiles = this.tiles.filter(t => !t.getData('cleared'));

    if (availableTiles.length === 0) {
      return;
    }

    const newTarget = Phaser.Utils.Array.GetRandom(availableTiles);
    this.targetTile = newTarget;
    newTarget.setFillStyle(0x00ff00);
  }

  update(time, delta) {
    if (!this.gameOver) {
      this.timeRemaining -= delta / 1000;

      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.gameOver = true;
        this.tiles.forEach(tile => {
          if (tile.input) {
            tile.disableInteractive();
          }
        });
        this.scene.start('GameOverScene', { finalScore: this.score });
      }

      this.timerText.setText(`Time: ${Math.ceil(this.timeRemaining)}`);
    }
  }
}
