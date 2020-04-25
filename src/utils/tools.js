import Phaser from 'phaser'

// export default class ScrollingBackground {
//   constructor (scene, key, velocityY) {
//     this.scene = scene
//     this.key = key
//     this.velocityY = velocityY

//     this.layers = this.scene.add.group()

//     this.createLayers()
//   }

//   createLayers () {
//     for (let i = 0; i < 2; i++) {
//       // creating two backgrounds will allow a continuous flow giving the illusion that they are moving.
//       const layer = this.scene.add.sprite(0, 0, this.key)
//       layer.y = layer.displayHeight * i
//       const flipX = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1
//       const flipY = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1
//       layer.setScale(flipX * 2, flipY * 2)
//       layer.setDepth(-5 - (i - 1))
//       this.scene.physics.world.enableBody(layer, 0)
//       layer.body.velocity.y = this.velocityY

//       this.layers.add(layer)
//     }
//   }

//   update () {
//     if (this.layers.getChildren()[0].y > 0) {
//       for (let i = 0; i < this.layers.getChildren().length; i++) {
//         const layer = this.layers.getChildren()[i]
//         layer.y = -layer.displayHeight + layer.displayHeight * i
//       }
//     }
//   }
// }

// export const centerGameObjects = (objects) => {
//   objects.forEach(function (object) {
//     object.anchor.setTo(0.5)
//   })
// }


const storeKey = 'FP-SLOTS-GLOBAL_STATE'

export const checkStates = () => {
  const globalState = localStorage.getItem(storeKey)
  const initialState = globalState ? JSON.parse(globalState) : {} //undefined

  return initialState
}
export const saveState = state => {
  // delete state.misc; // do not preserve misc data
  let newState = Object.assign({}, checkStates(), state);
  localStorage.setItem(storeKey, JSON.stringify(newState));
}

export const dateAsString = date => {
  if(typeof date === 'string'){
    date = new Date(date);
  }
  return `${date.getFullYear().toString().substring(2,4)}/${pad(date.getMonth())}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export const pad = value => value.toString().padStart(2, 0);
// export const savePoints = points => {
  
// }

export const drawFrame = (graphics, x, y, w, h) => {
  let cx = x, cy = y-9, cw = w, ch = h+14;

  graphics.lineStyle(2, 0xffffff, 1);
  let xo = 6, limit = 46;
  for(let i = 0; i < limit; i++){
    if(i < 2 || i > limit - 3){
      graphics.beginPath();
      graphics.moveTo(cx + xo, cy + 14);
      graphics.lineTo(cx + xo, cy + ch + 22);
      graphics.strokePath();
    }else {
      graphics.beginPath();
      graphics.moveTo(cx + xo, cy + 14);
      graphics.lineTo(cx + xo, cy + 26);
      graphics.strokePath();
      graphics.beginPath();
      graphics.lineTo(cx + xo, cy + ch + 10);
      graphics.lineTo(cx + xo, cy + ch + 22);
      graphics.strokePath();
    }
    xo += 10;
  }

  graphics.fillStyle(0x333333, 0.6);
  graphics.fillRect(cx+20, cy+26, cw-20, ch-20);

  graphics.lineStyle(8, 0xffff00);
  graphics.beginPath();
  graphics.moveTo(cx, cy);
  graphics.lineTo(cx + cw, cy);
  graphics.lineTo(cx + cw, cy + ch);
  graphics.lineTo(cx, cy + ch);
  graphics.closePath();
  graphics.strokePath();

  // inner rect - brown
  cx+=6, cy+=6, cw-=10, ch-=10;
  graphics.lineStyle(5, 0xB35103);
  graphics.beginPath();
  graphics.moveTo(cx, cy + ch);
  graphics.lineTo(cx, cy);
  graphics.lineTo(cx + cw, cy);
  graphics.lineTo(cx + cw, cy + ch);
  graphics.strokePath();

  // bottom line - brown
  cx-=10, cy+=8, cw+=17;
  graphics.beginPath();
  graphics.moveTo(cx, cy + ch);
  graphics.lineTo(cx + cw, cy + ch);
  graphics.strokePath();
}


export const addButton = (scope, graphics, x, y, w, h, buttonInfo) => {
  let cx = x, cy = y-9, cw = w, ch = h+14;

  graphics.fillStyle(0xffff00, 1);
  graphics.fillRect(cx, cy, cw, ch);

  // inner rect - brown
  cx+=4, cy+=4, cw-=8, ch-=8;
  graphics.lineStyle(2, 0xB35103);
  graphics.beginPath();
  graphics.moveTo(cx, cy + ch);
  graphics.lineTo(cx, cy);
  graphics.lineTo(cx + cw, cy);
  graphics.lineTo(cx + cw, cy + ch);
  graphics.strokePath();

  // bottom line - brown
  cx-=4, cy+=4, cw+=8;
  graphics.beginPath();
  graphics.moveTo(cx, cy + ch);
  graphics.lineTo(cx + cw, cy + ch);
  graphics.strokePath();

  if(buttonInfo){
    scope.add.text(x + w/2, y + h/2, buttonInfo.text, {
      fill: '#000000',
      fontFamily: 'Arial',
      fontSize: '28px',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(.5);
    scope.add.image(x, y-10, 'spin')
      .setOrigin(0)
      .setAlpha(.01)
      .setInteractive()
        .on('pointerup', () => {
          if(buttonInfo.execCondition()){
            buttonInfo.callback()
          }
        });
  }
  
  // function setButtonStyle(button){
  //   button
  //     .setInteractive()
  //     .on('pointerover', function () { graphics.tint = 0xffffff; })
  //     .on('pointerout', function () { graphics.tint = 0xeeeeee; })
  //     .on('pointerdown', () => { 
  //       if (!buttonInfo.execCondition()) return;
  //       graphics.tint = 0x888888; })
  //     .on('pointerup', () => { 
  //       if (!buttonInfo.execCondition()) return;
  //       graphics.tint = 0xffffff; });
  //   return button;
  // }
}