import Phaser from 'phaser';

const PALETTE = [
  0xff5e78,
  0xff9500,
  0xffce4d,
  0x52d9a8,
  0x7c3aed
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

    // Add drop shadow beneath the grid
    const shadowGraphics = this.add.graphics();
    shadowGraphics.fillStyle(0x000000, 0.15);
    shadowGraphics.fillRoundedRect(
      startX - 5,
      startY + gridHeight + 8,
      gridWidth + 10,
      12,
      4
    );
    shadowGraphics.setDepth(1);

    const CORNER_RADIUS = 8;
    this.tileDataMap = new Map();
    this.hitAreas = [];

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const x = startX + col * SQUARE_SIZE;
        const y = startY + row * SQUARE_SIZE;
        const centerX = x + SQUARE_SIZE / 2;
        const centerY = y + SQUARE_SIZE / 2;

        const color = Phaser.Utils.Array.GetRandom(PALETTE);

        // Create graphics object for rounded rectangle tile
        const tileGraphics = this.add.graphics();
        this.drawTile(tileGraphics, x, y, color, CORNER_RADIUS);
        tileGraphics.setDepth(2);

        // Create invisible rectangle for interaction hit area
        const hitArea = this.add.rectangle(centerX, centerY, SQUARE_SIZE, SQUARE_SIZE);
        hitArea.setFillStyle(0xffffff, 0.001);
        hitArea.setStrokeStyle(0, 0);
        hitArea.setDepth(50);
        hitArea.setInteractive({ useHandCursor: true });

        // Store tile data structure
        const tileData = {
          row,
          col,
          cleared: false,
          graphics: tileGraphics,
          x,
          y,
          color
        };

        this.tiles.push(tileData);
        this.hitAreas.push(hitArea);
        this.tileDataMap.set(hitArea, tileData);

        hitArea.on('pointerdown', () => {
          if (this.gameOver) {
            return;
          }

          const tile = this.tileDataMap.get(hitArea);
          if (tile.cleared) {
            return;
          }

          this.sound.play('click', { volume: 0.3 });

          console.log(`Tile clicked: row ${tile.row}, col ${tile.col}`);

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

            const clearedTiles = this.tiles.filter(t => t.cleared);
            clearedTiles.forEach(t => {
              this.drawTile(t.graphics, t.x, t.y, 0x000000, CORNER_RADIUS);
              this.time.delayedCall(250, () => {
                if (!t.cleared) return;
                this.drawTile(t.graphics, t.x, t.y, 0x404040, CORNER_RADIUS);
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

          tile.cleared = true;
          this.drawTile(tile.graphics, tile.x, tile.y, 0x404040, CORNER_RADIUS);
          hitArea.disableInteractive();

          this.tweens.add({
            targets: hitArea,
            scale: 1.15,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeInOut',
            onStart: () => hitArea.setDepth(1000),
            onComplete: () => hitArea.setDepth(0)
          });

          if (isTarget) {
            this.setRandomTarget();
          }
        });
      }
    }

    this.setRandomTarget();
  }

  drawTile(graphics, x, y, color, radius) {
    graphics.clear();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(x, y, 60, 60, radius);
  }

  setRandomTarget() {
    const availableTiles = this.tiles.filter(t => !t.cleared);

    if (availableTiles.length === 0) {
      return;
    }

    const newTarget = Phaser.Utils.Array.GetRandom(availableTiles);
    this.targetTile = newTarget;
    this.drawTile(newTarget.graphics, newTarget.x, newTarget.y, 0x00ff00, 8);
  }

  update(time, delta) {
    if (!this.gameOver) {
      this.timeRemaining -= delta / 1000;

      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.gameOver = true;
        this.hitAreas.forEach(hitArea => {
          hitArea.disableInteractive();
        });
        this.scene.start('GameOverScene', { finalScore: this.score });
      }

      this.timerText.setText(`Time: ${Math.ceil(this.timeRemaining)}`);
    }
  }
}
