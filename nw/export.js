let NwBuilder = require('nw-builder');
let nw = new NwBuilder({
  files: [
    './nw/package.json', 
    'dist/**/**'
  ],
  platforms: ['win64'],
	main: "dist/index.html",
  version: '0.45.4',
  appName: "Devious Valley --end",
  buildType: 'versioned',
  cacheDir: 'nw/cache',
  buildDir: 'nw/build',
  winIco: 'assets/favicon.ico'
});

// Log stuff you want
nw.on('log',  console.log);

nw.build().then(function () {
  console.log('all done!');
}).catch(function (error) {
  console.error(error);
});