/**
 * Created by Vlad on 6/23/2015.
 */

var fs = require('fs');
var UglifyJS = require('uglify-js');
var result = UglifyJS.minify([
    'Connector.js',
    'AmgenList.js',
  'AmgenBuilding.js',
    'AmgenFloors.js',
    'Resize.js',
    'amgen.js'
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

fs.writeFileSync('site.min.js', result.code);
console.log(result);



