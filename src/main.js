import Phaser from 'phaser'

import BootScene from './scenes/Boot'
// import SplashScene from './scenes/Splash'
// import GameOverScene from './scenes/GameOver'
import MainMenu from './scenes/MainMenu'
import LoadGameScene from './scenes/Load-Game'
import GameScene from './scenes/Game'
import Game2Scene from './scenes/Game2'

import config from './config'

const arcade = {
  default: 'arcade',
  arcade: {
    gravity: { y: 300 },
    debug: true 
  },
  pixelArt: false
};

const matter = {
  default: 'matter',
  matter: {
      // debug: true
  }
};

const gameConfig = Object.assign(config, {
  scene: [
    MainMenu,
    Game2Scene,
    GameScene,
    BootScene,
    LoadGameScene
  ], //SplashScene, GameOverScene 
  pixelArt: false,
  input: {
      gamepad: true
  },
  // physics: arcade
  physics: matter
})

class Game extends Phaser.Game {
  constructor () {
    super(gameConfig)
  }
}

window.game = new Game()
