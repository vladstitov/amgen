/**
 * Created by Vlad on 6/23/2015.
 */

var fs = require('fs');
var shell = require('shelljs');


var files= ['../maps/vect/path/ModelBuilding.js',
    '../maps/vect/path/Floor.js',
  '../maps/vect/path/Building.js',
    '../destinations/destinationsInit.js',
    '../destinations/DestinationsList.js',
	'novomap/WebTemplate.js',
	'novomap/NovoMap-V3.js',
	'../WebApp.js'];
	

//cat(files).to('../site.min.js');

function concat(opts) {
    var fileList = opts.src;
    var distPath = opts.dest;
    var out = fileList.map(function(filePath){
            return fs.readFileSync(filePath).toString();
        });
    fs.writeFileSync(distPath, out.join('\n'));
    console.log(' '+ distPath +' built.');
}
 
concat({
    src : files,
    dest : '../site.js'
});

var UglifyJS = require('uglify-js');

fs.writeFileSync('../site.min.js', UglifyJS.minify(['../site.js'],{}).code);

/*


var result = UglifyJS.minify([
    '../maps/vect/path/ModelBuilding.js',
    '../maps/vect/path/Floor.js',
  '../maps/vect/path/Building.js',
    '../destinations/destinationsInit.js',
    '../destinations/DestinationsList.js',
	'novomap/WebTemplate.js',
	'novomap/NovoMap-V3.js',
	'../WebApp.js'
], {
   // mangle: true,
   // compress: {
      //  sequences: true,
      //  dead_code: true,
      //  conditionals: true,
      //  booleans: true,
       // unused: true,
       // if_return: true,
       // join_vars: true,
        //drop_console: true
   // }
});
*/
//fs.writeFileSync('../site.min.js', result.code);
console.log('DONE');



