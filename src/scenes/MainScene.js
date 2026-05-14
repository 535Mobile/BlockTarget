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
        // This object could be stored to manipulate it later (move, rotate, tint, etc.)
        // We're NOT storing it here, so we can't interact with this square later
        // To make the grid interactive, we'd need: this.squares[row][col] = this.add.rectangle(...)
        this.add.rectangle(
          x + SQUARE_SIZE / 2, // Center X of the square
          y + SQUARE_SIZE / 2, // Center Y of the square
          SQUARE_SIZE,          // Width
          SQUARE_SIZE,          // Height
          color                 // Fill color
        );
      }
    }
  }

  // LIFECYCLE: update() runs every frame (60 times per second by default)
  // Purpose: Update positions, check input, run game logic, animations, etc.
  // We don't define it here since the grid is static (doesn't need per-frame updates)
  // If defined, Phaser would call it repeatedly after create() completes
  // For example, update() could rotate the squares, animate colors, or respond to clicks
}

// NOTE ON GRID STATE:
// Currently we create rectangles but don't store references to them.
// To make the grid interactive or animatable, we'd store them:
//   this.squares = [];
//   for (let row = 0; row < GRID_ROWS; row++) {
//     this.squares[row] = [];
//     for (let col = 0; col < GRID_COLS; col++) {
//       const rect = this.add.rectangle(...);
//       this.squares[row][col] = rect; // Now we can manipulate it in update()
//     }
//   }
// This allows us to animate, respond to clicks, or change colors dynamically.
