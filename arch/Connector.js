/**
 * Created by Vlad on 6/3/2015.
 */
var AmgenConnector = {
    cache:{},
    save:function(data,filename,success){
        return $.ajax({
            url:'/rest/web/customfile/'+filename,
            type:'PUT',
            success:success,
            data:data
        })
    },
    getFile:function(filename){
        return $.get('/rest/web/customfile/'+filename);
    },
    getDiviceId:function(clientId){
        return $.get('/v3/location/switch/'+clientId);
    },

    getCategories:function(){
        return $.get('/rest/web/category/all/1188/en');
    },
    getDestinations:function(){
        return $.get('/rest/web/destination/all/1188/en');
    },
    getStructure:function(){
        return $.get('/rest/web/maps/all/1188');
    },
    getMapData:function(){
        return $.get('/rest/web/maps/mapbuilderdata/1188');
    },
    getAllLocations:function(type){
      //  flat = _.flatten(_.map(data, _.values));
       return $.getJSON('/v3/location/type/'+type);
    },
    getLocationsChildren:function(defer){
        $.getJSON('/v3/location/childrentype/4/parent/1').done(function(res){defer.resolve(res)});
    },
    getHierarchy:function(callBack){
        return   $.getJSON('/v3/location/1/hierarchy');
    },
    getLabels:function(){
    return $.get('/rest/web/labels/1188/en');
}
}
/*

 var cache = {};
 function loadSong(id, callback) {
 if(!cache[id]) {
 cache[id] = $.post('/songs', { 'id': id }).promise();
 }
 cache[id].done(callback);
 }

 */

var AmgenModel = {

    destinations:null,
    worldNames:null,
    worldIndex:null,
    destinationsIndex:null,
    destinationsClient:null,
    waypoints:null,
    categoriesIndex:null,
    categories:null,
    labels:null,
    setLabels:function(labels){
       this.labels = labels;
    },
    getLabel:function(id){
        return this.labels[id];
    },
    getDestinatopnByJid:function(jid) {
     return  this.destinationsClient[jid];
    },
    getDestinatopnsByMapid:function(mapid){
        var ar = this.destinations;
        var out=[];
        for(var i= 0,n=ar.length;i<n;i++){
            var dest= ar[i];
            if(dest.wp && dest.wp.mapid==mapid) out.push(dest);
        }
        return out;
    },
    getWaypointsByMapid:function(mapid){
        var ar = this.waypoints;
        var out=[];
        for(var i= 0,n=ar.length;i<n;i++){
            var item= ar[i];
            if(item.mapid==mapid) out.push(item);
        }
        return out;
    },
    getWorldStructure:function(callBack){
        var conn = AmgenConnector;
       // var p1 = conn.getHierarchy();
        var p2 = conn.getDestinations();
        var p3 = conn.getMapData();
        var p4 = conn.getStructure();
        var p5 = conn.getCategories();

        var self= this;

       // $.when(p1,p2,p3,p4,p5).then(function(v1,v2,v3,v4,v5){
            $.when(p2,p3,p4,p5).then(function(v2,v3,v4,v5){

           // console.log(v1[0]);
          // console.log(v2[0]);
           // console.log(v3[0]);
           // console.log(v4[0]);
           // console.log(v5[0]);

          //  self.worldNames = _.indexBy(v1[0],'name');
          //  self.worldIndex = _.indexBy(v1[0],'id');

            self.destinations= v2[0];
            self.destinationsIndex =  _.indexBy(v2[0], 'id');
            self.destinationsClient = _.indexBy(v2[0], 'clientId');
            self.categoriesIndex = _.indexBy(v5[0],'id');
            self.categories= v5[0];
            var floors = v4[0];

            var worldmap;

            for(var i= floors.length-1;i>=0;i--) if(floors[i].floorSequence==0) worldmap = floors.splice(i,1)[0];
            var wps = v3[0].waypoints;

            self.waypoints = wps;
            parseWaypoint(wps,self.destinationsClient);
           // parseWordMap(self.destinations,worldmap.mapId,self.worldNames,self.worldIndex);
            parseWorldMap2(self.destinations, self.categoriesIndex)
           // console.log(self.destinations);
            callBack({building:floors,worldmap: worldmap})

        })


        var parseWorldMap2 = function(destinations,categories){
            var ar =destinations
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                if(vo.categoryId.length) {
                    var cat = categories[vo.categoryId[0]];
                    if(!cat.dests) cat.dests=[];
                    cat.dests.push(vo);
                }

            }

        }

        var parseWordMap = function(ar,mapid,world,world2){
            //var world = this.worldNames;

            var getRegion = function(camp,world){
                var region = world[camp._parentId];
               // console.log('region',region);
                if(!region) return null;
                if(region.typeId!=7) region =  getRegion(region,world);
              return region;
            }

            for(var i= 0,n=ar.length;i<n;i++){
                var dest = ar[i];
              // console.log(dest);
                if(dest.wp && dest.wp.mapid == mapid ) {
                    dest.isCampus=1;
                    var camp = world[dest.clientId];
                    if(camp){
                        dest.world=camp;
                        dest.region = getRegion(camp,world2);
                    }

                   //console.log(dest);

                }
            }
        }



        var parseWaypoint = function(ar,dests){
           // console.log(dests)
            var assignDestination = function(wp,dests){
                var ar = wp.jids;
                wp.dests =[];
                if(!ar)return;
               // console.log(ar,wp);
                for(var i= 0,n=ar.length;i<n;i++){
                    var dest = dests[ar[i]];
                    if(dest) {
                       wp.dests.push(dest);
                        dest.wp=wp;
                    }
                }
            }

            for(var i= 0,n=ar.length;i<n;i++){
               assignDestination(ar[i],dests);
            }
        }

        var parseWorld = function(res){
            var out={};
            var indexed = {}
            out.list=res;
            var structure =[]
            var ar = res;

            for(var i= 0,n=ar.length;i<n;i++) {
                ar[i].children=[];
                indexed[ar[i].id] =ar[i];

            }
            out.indexed=indexed;
            i=0;
            for(;i<n;i++) {
                var item =  ar[i];
                var par = indexed[item._parentId];
                if(par)par.children.push(item);
                else structure.push(item);
            }
            out.structure = structure;
            return out;
        }


    }

}