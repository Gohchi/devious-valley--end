import Phaser from 'phaser'

import BootScene from './scenes/Boot'
// import SplashScene from './scenes/Splash'
// import GameOverScene from './scenes/GameOver'
import MainMenu from './scenes/MainMenu'
import LoadGameScene from './scenes/Load-Game'
// import GameScene from './scenes/Game'

import config from './config'

const gameConfig = Object.assign(config, {
  scene: [MainMenu, BootScene, LoadGameScene], //GameScene, SplashScene, GameOverScene 
  pixelArt: false,
  input: {
      gamepad: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }
    },
    pixelArt: false
  }
})

class Game extends Phaser.Game {
  constructor () {
    super(gameConfig)
  }
}

window.game = new Game()
