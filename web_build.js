/**
 * Created by Vlad on 6/26/2015.
 */


var files =[
    '../maps/vect/path/ModelBuilding.js',
    '../maps/vect/path/Floor.js',
    '../maps/vect/path/Building.js',
    '../destinations/destinationsInit.js',
    '../destinations/DestinationsList.js',
    '../utils/WebTemplate.js',
    '../utils/NovoMap-V3.js',
    '../WebApp.js'
]

var _fs = require('fs');

function concat() {
    var fileList = files;
    var distPath = '../site.js';
    var out = fileList.map(function(filePath){
        return _fs.readFileSync(filePath).toString();
    });
    _fs.writeFileSync(distPath, out.join('\n'));
    console.log(' '+ distPath +' built.');
}

concat();