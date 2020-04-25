
<script type="text/javascript" src="lib/test-data.js"></script>
         
      var camera1 = this.cameras.add(30, 30, 430, 430).setScroll(-470, 0);
    
    var gui = new dat.GUI();
    gui.addFolder('Camera 1');
    gui.add(camera1, 'x');
    gui.add(camera1, 'y');
    gui.add(camera1, 'width');
    gui.add(camera1, 'height');
    gui.add(camera1, 'centerToSize');
    gui.add(camera1, 'scrollX', -1920, 1920);
    // gui.add(camera1, 'scrollX', -1920, 1920);
    gui.add(camera1, 'scrollY', -989, 989);
    gui.add(camera1, 'zoom', 0.1, 2).step(0.1);
    gui.add(camera1, 'rotation').step(0.01);
    gui.addColor(camera1, 'backgroundColor').onChange(function (value) {
        value.a = 255;
        camera1.setBackgroundColor(value);
    });

      // var particles = this.add.particles('red');

      // var emitter = particles.createEmitter({
      //     speed: 100,
      //     scale: { start: 1, end: 0 },
      //     blendMode: 'ADD'
      // });

      // var logo = this.physics.add.image(400, 100, 'logo');

      // logo.setVelocity(100, 200);
      // logo.setBounce(1, 1);
      // logo.setCollideWorldBounds(true);

      // emitter.startFollow(logo);


      // console.log(reels);
      
      //  Create our map (the 16x16 is the tile size)
      
      // var sprites = map.createFromObjects('symbols', 0, this.make.sprite(0, 0, 'a'));


      // var data = "";
      // wrapper.getReels().forEach(function(reel){
      //   data += (data == '' ? '' : '\n') + reel.join(',')
      // });
      // const map = this.make.tilemap({ data: data, tileWidth: 120, tileHeight: 300 });
      // map.imageCollections.push('a');
      // map.imageCollections.push('b');
      // map.imageCollections.push(this.add.image(10, 0, 'b'));
      // map.imageCollections.push(this.add.image(0, 0, 'c'));
      // map.imageCollections.push(this.add.image(0, 0, 'd'));
      // map.imageCollections.push(this.add.image(0, 0, 'e'));
      // const tiles = map.addTilesetImage("a");
      // const layer = map.createStaticLayer(0, tiles, 0, 0);

      
         
      // var map = this.make.tilemap({
      //     data: wrapper.getReels(),  // [ [], [], ... ]
      //     tileWidth: 140,
      //     tileHeight: 140, // * 20,
      //     width: 140,
      //     height: 140
      // });
      // // map.addTilesetImage('a', 'b', 'c', 'd', 'e');
      // // map.addTilesetImage('a');
      // // map.addTilesetImage('b');
      // // map.addTilesetImage('c');
      // // map.addTilesetImage('d');
      // // map.addTilesetImage('e');
      // var layer = map.createStaticLayer(0, map.addTilesetImage('a'), 0, 0);
      // tilesprite = map
      var data = [[], [], []];
      wrapper.getReels().forEach(function(reel, i){
        reel.forEach(function(value){
          switch(value){
            case 'a': value = 0; break;
            case 'b': value = 1; break;
            case 'c': value = 2; break;
            case 'd': value = 3; break;
            case 'e': value = 4; break;
          }
          data[i].push(value);
        })
      });
      var map = this.make.tilemap({ data: data, tileWidth: 70, tileHeight: 140 });
      // var tileset = map.addTilesetImage('tiles');
      // console.log(tileset);
      var layer = map.createStaticLayer(0, map.addTilesetImage('a'), 50, 0); // layer index, tileset, x, y
      var layer = map.createStaticLayer(1, map.addTilesetImage('b'), 0, 0); // layer index, tileset, x, y


      