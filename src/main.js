import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  parent: 'game-container',
  backgroundColor: '#1a1a1a',
  scene: [MenuScene, GameScene, GameOverScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
