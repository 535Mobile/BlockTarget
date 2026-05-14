# Phaser Concepts Explained Simply

Core game development concepts explained in plain language.

## Game Loop

The game loop is like the heartbeat of a game. About 60 times per second, the engine checks: Did the player press a button? Should the character move? Did anything collide? Then it redraws everything on screen with the new positions. It's a constant cycle of "check what changed, update everything, draw the new picture." Without the game loop, the game would be frozen.

## Sprite

A sprite is a picture or character you see on screen. It can be anything—a player, an enemy, a rock, a bullet. Each sprite has a position (where it is), a size (how big it is), and a direction it's facing. You can move sprites, rotate them, make them bigger or smaller, and even make them fade away. A sprite is basically a picture that the game can control and manipulate.

## Scene

A scene is like a level or screen in a game. Your game might have a "main menu" scene, a "level 1" scene, a "game over" scene, and a "settings" scene. Each scene is its own little world with its own sprites, rules, and logic. When you finish a level, the game switches from the level scene to the next level scene. You can even have two scenes running at the same time, like a pause menu on top of gameplay.

## Physics Body vs Visual Sprite

The physics body is the invisible collision shape (usually a rectangle or circle) that the game uses to detect when things bump into each other. The visual sprite is the actual picture you see on screen. They're separate because you might want a character drawn as a circle for looks, but have the collision shape be a rectangle for better gameplay. The physics body doesn't have to match the picture perfectly—whatever works best for the game.

## Collision: Overlap vs Collide

**Overlap** means two objects are touching each other but they pass right through—like a ghost. You might use overlap to detect when a player walks over a coin (the coin disappears but the player keeps moving). **Collide** means two objects physically bump each other and stop—like two solid blocks pushing against each other. With collide, objects can't walk through each other; they bounce back or block the way.

## Game State

Game state is all the information about the current game—things like the score, how many lives the player has, what level they're on, how much health the player has. Whenever this information changes, the game might look different (the score updates, the screen changes, etc.). The game reads this information constantly to know what to display and what's allowed to happen.

## Input Handlers

Input handlers are how the game listens for what the player does—pressing keys, clicking the mouse, or touching the screen. Think of them like ears: they're always listening for player actions. When something happens (you press the left arrow key), the game hears it and does something in response (the character moves left). Different actions trigger different responses.

## Tweens

A tween is a smooth animation that happens automatically. Instead of saying "move the sprite one pixel at a time," you say "smoothly move this sprite from here to there over two seconds," and the game figures out all the in-between steps. Tweens can move things, fade them out, make them spin, or grow bigger. It's a way to animate without having to manually control every single frame.

## Spritesheet

A spritesheet is one large image file that contains many small pictures arranged in a grid. For example, a character's walking animation might have 8 frames of the character in different poses—all stitched together in one image. Instead of loading 8 separate image files, the game loads one big sheet and uses the different parts of it for different frames. This is much faster and more efficient.

## Asset Preloading

Before the game can use an image or sound, it has to download it and get it ready. Asset preloading means loading everything ahead of time, usually while showing a loading bar. You don't want the game to freeze when you suddenly need a sound or image, so the game loads them all before you start playing. Once loaded, they're ready to use instantly whenever the game needs them.

## Grid Puzzle Game Concepts

### Grid Coordinates vs Pixel Coordinates

Think of a grid like a chess board with numbered rows and columns. If a piece is at "row 3, column 2," that's a grid coordinate—it tells you which square it's on. Pixel coordinates are the exact x and y position on the screen (like "523 pixels from the left, 410 pixels from the top"). Games use both: grid coordinates to track what piece is where logically, and pixel coordinates to draw the piece on screen. When you drag a tile on a grid, the game tracks which grid square your finger is over, not the exact pixel position.

### Snapping

Snapping is when a piece automatically aligns to the nearest grid square, like magnetism. When you drag a word tile across the board, it doesn't slide smoothly—it jumps from one square to the next, staying perfectly aligned. This makes the game feel clean and organized instead of loose and messy. Without snapping, pieces might land halfway between squares, which would be confusing.

### Tile State

Each square on the grid has a "state"—information about what's there and what's happening. For example, a tile might be "empty," "has a blue letter," "has a red letter," "is locked," or "is glowing." The game reads this state constantly to know what to display and what rules apply. When you place a tile, you change its state from empty to filled. When a tile breaks, its state changes to empty again.

### Neighbor Lookup (4-way vs 8-way)

Neighbor lookup means checking the squares around a tile. **4-way** checks only the squares directly next to it (up, down, left, right)—like a plus sign. **8-way** checks all surrounding squares, including the diagonal corners—like a filled square around it. For a word game, you might use 4-way to check if tiles connect in straight lines. For a game where diagonal connections matter, you'd use 8-way. The choice depends on the game's rules.

### Drag Paths

A drag path is the trail you create when dragging your finger across the board. Instead of clicking individual tiles, you might swipe across multiple tiles to spell a word. The game tracks which tiles you've touched in order as you drag. This makes the game feel smooth and intuitive—you're "drawing" your move on the board rather than clicking each tile separately.

### Cascade/Gravity Logic

Cascade is a chain reaction that happens when tiles are removed or cleared. Imagine blocks stacked like a tower: when you remove ones at the bottom, the ones above fall down to fill the gap (gravity). This might trigger another match below, which clears more blocks, and so on. The game keeps checking and updating until everything settles and no more matches are possible. It's like dominoes—one action causes a series of reactions.

### Dictionary Lookup

The game needs to check if the words you make are real words. This requires looking them up in a dictionary very quickly. The game stores all valid words in a special format so it can find them instantly. When you make a word, the game checks: "Is this a real word?" in a fraction of a second. A **trie** is like an organized filing system where words are stored by their letters in a branching pattern—very fast to search. A **set** is like a simple list of all valid words—also fast but organized differently. Both work, just with different tradeoffs.
