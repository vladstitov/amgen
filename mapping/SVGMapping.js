/**
 * Created by Vlad on 6/18/2015.
 */
///<reference path="../typings/jquery.d.ts" />
///<reference path="../typings/svgjs.d.ts" />
///<reference path="../typings/underscore.d.ts" />
///<reference path="MappingBuilding.ts" />
$(document).ready(function () {
    var device = document.location.hash.substr(1);
    if (!device || isNaN(device))
        return;
    // var p1 = conn.getHierarchy();
    //   var p1 =  $.get('/rest/web/destination/all/'+device+'/en')
    var p1 = $.get('/rest/web/maps/all/' + device);
    var p2 = $.get('/rest/web/maps/mapbuilderdata/' + device);
    var self = this;
    // $.when(p1,p2,p3,p4,p5).then(function(v1,v2,v3,v4,v5){
    $.when(p1, p2).then(function (v1, v2) {
        var building = new mapping.Building($('#map-view'));
        building.setData(v1[0], v2[0]);
    });
});
//# sourceMappingURL=SVGMapping.js.map