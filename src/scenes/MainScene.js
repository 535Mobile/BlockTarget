import Phaser from 'phaser';

// Color palette used for the grid squares (stored as hex values)
const PALETTE = [
  0xff6b6b, // red
  0x4ecdc4, // teal
  0xffe66d, // yellow
  0xa8e6cf, // mint
  0xff8b94  // pink
];

export default class MainScene extends Phaser.Scene {
  constructor() {
    // Call parent Scene constructor with a unique scene key ('MainScene')
    // This key is used to reference this scene elsewhere in the game
    super('MainScene');
  }

  // LIFECYCLE: preload() runs first (called automatically by Phaser)
  // Purpose: Load external assets like images, sounds, fonts
  // We don't need it here since we're drawing rectangles procedurally
  // If defined, Phaser would call it before create()

  // LIFECYCLE: create() runs after preload() and after the scene is initialized
  // Purpose: Set up game objects, sprites, physics bodies, input listeners, etc.
  // Called once when the scene starts
  create() {
    const GRID_COLS = 5;    // Number of columns in the grid
    const GRID_ROWS = 5;    // Number of rows in the grid
    const SQUARE_SIZE = 60; // Width and height of each square in pixels

    // Initialize tiles array to store all tile references
    // We need this to be able to pick random tiles for the target
    this.tiles = [];

    // Calculate total dimensions of the entire grid
    // 5 cols × 60px = 300px wide, 5 rows × 60px = 300px tall
    const gridWidth = GRID_COLS * SQUARE_SIZE;
    const gridHeight = GRID_ROWS * SQUARE_SIZE;

    // Center the grid horizontally on the 360px canvas
    // (360 - 300) / 2 = 30px from left edge
    const startX = (this.game.config.width - gridWidth) / 2;

    // Position grid in upper-middle of the 640px canvas
    // (640 - 300) / 2 = 170px from top, minus 60px offset = 110px from top
    const startY = (this.game.config.height - gridHeight) / 2 - 60;

    // Nested loops: iterate through each row and column
    // This creates a 5×5 grid of squares
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        // Calculate the top-left corner of this square
        const x = startX + col * SQUARE_SIZE;
        const y = startY + row * SQUARE_SIZE;

        // Pick a random color from PALETTE for this square
        // GetRandom() returns one element from the array
        const color = Phaser.Utils.Array.GetRandom(PALETTE);

        // this.add.rectangle() creates a rectangle game object and adds it to the scene
        // Arguments: (centerX, centerY, width, height, fillColor, fillAlpha)
        // Note: centerX/centerY are the CENTER of the rectangle, not top-left
        // So we add SQUARE_SIZE/2 to get the center point
        // RETURNS: a Phaser.GameObjects.Rectangle instance
        const tile = this.add.rectangle(
          x + SQUARE_SIZE / 2, // Center X of the square
          y + SQUARE_SIZE / 2, // Center Y of the square
          SQUARE_SIZE,         // Width
          SQUARE_SIZE,         // Height
          color                // Fill color
        );

        // Add this tile to the tiles array so we can reference it later
        this.tiles.push(tile);

        // setInteractive() makes this rectangle respond to pointer (mouse/touch) events
        // Without this, the tile won't detect clicks or taps
        tile.setInteractive();

        // setData() stores custom key-value pairs on the game object
        // This is useful for storing metadata we need in event handlers
        // We store 'row' and 'col' so we can access them when the tile is clicked
        // We also store 'cleared' to track if this tile has been tapped
        tile.setData('row', row);
        tile.setData('col', col);
        tile.setData('cleared', false);  // Track whether this tile is cleared

        // on() registers an event listener on this object
        // 'pointerdown' fires when the user clicks (desktop) or taps (mobile)
        // We use an arrow function to capture 'tile' in a closure
        // This way, 'tile' is available inside the callback, and 'this' refers to the scene
        tile.on('pointerdown', () => {
          // Check if this tile is already cleared - if so, ignore the tap
          if (tile.getData('cleared')) {
            return;
          }

          const tileRow = tile.getData('row');
          const tileCol = tile.getData('col');
          console.log(`Tile clicked: row ${tileRow}, col ${tileCol}`);

          // Check if this is the target tile
          const isTarget = (tile === this.targetTile);
          if (isTarget) {
            console.log('Hit!');
          }

          // Mark this tile as cleared
          tile.setData('cleared', true);

          // Change tile color to dark gray (cleared state)
          // setFillStyle() changes the fill color of the rectangle
          tile.setFillStyle(0x333333);  // Dark gray color

          // Disable further interactions on this cleared tile
          tile.disableInteractive();

          // Create a tween animation on the tile
          this.tweens.add({
            targets: tile,              // The object to animate
            scale: 1.15,                // Animate to 1.15× scale
            duration: 100,              // First phase: 100ms to scale up
            yoyo: true,                 // Return to original value (yoyo effect)
            ease: 'Quad.easeInOut',     // Easing function for smooth motion
            onStart: () => tile.setDepth(1000),  // Bring tile to front during animation
            onComplete: () => tile.setDepth(0)   // Send back to normal depth when done
          });
          // Result: scales 1.0 → 1.15 → 1.0 over 200ms total (100ms up + 100ms down)
          // The tile renders on top of neighbors during the scale so it doesn't clip behind them

          // If this was the target, pick a new random target
          if (isTarget) {
            this.setRandomTarget();
          }
        });
      }
    }

    // After building the grid, pick the first random target tile
    this.setRandomTarget();
  }

  // Pick a random non-cleared tile and make it the target (bright green)
  setRandomTarget() {
    // Filter tiles array to find all non-cleared tiles
    const availableTiles = this.tiles.filter(t => !t.getData('cleared'));

    // If no tiles available, do nothing (all tiles cleared - game over!)
    if (availableTiles.length === 0) {
      return;
    }

    // Pick a random tile from the available tiles
    const newTarget = Phaser.Utils.Array.GetRandom(availableTiles);

    // Store reference to current target so we can check it on tap
    this.targetTile = newTarget;

    // Color it bright green to indicate it's the target
    // setFillStyle() changes the fill color of the rectangle
    newTarget.setFillStyle(0x00ff00);  // Bright green
  }

  // LIFECYCLE: update() runs every frame (60 times per second by default)
  // Purpose: Update positions, check input, run game logic, animations, etc.
  // We don't define it here since animations are handled by Phaser's tween system
  // If defined, Phaser would call it repeatedly after create() completes
}

// NOTE ON TARGET MECHANIC:
// - setRandomTarget() filters tiles to find non-cleared ones
// - Picks a random available tile and colors it green
// - Stores reference in this.targetTile so tap handler can check it
// - When target is tapped, 'Hit!' is logged and a new target is picked
// - If all tiles are cleared, game ends (no more targets available)
