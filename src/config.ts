import Phaser from 'phaser'

export const windowWidth = window.innerWidth;
export const windowHeight = window.innerHeight;
export const gameWidth = 490;
export const gameHeight = windowHeight;

export default {
  type: Phaser.AUTO,
  parent: 'content',
  // backgroundColor: 'black',
  width: windowWidth,
  height: gameHeight,
  // input: {
  //     gamepad: true
  // },
  // localStorageName: 'phaseres6webpack'
  // scale: {
  //   width: 800,
  //   height: 600,
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH
  // }
}