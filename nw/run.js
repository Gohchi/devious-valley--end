let NwBuilder = require('nw-builder');
let nw = new NwBuilder({
    files: './**/**', // use the glob format
    platforms: ['win64'],
    version: '0.45.4',
    buildType: 'versioned',
    cacheDir: 'nw/cache',
    buildDir: 'nw/build',
    zip: false
});

// Log stuff you want
nw.on('log',  console.log);

nw.run().then(function () {
  console.log('all done!');
}).catch(function (error) {
  console.error(error);
});