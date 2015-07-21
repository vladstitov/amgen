/**
 * Created by Vlad on 6/3/2015.
 */

var amgenDispatcher=$({});
var LABELS_READY='LABELS_READY';
$(document).ready(function(){
var ar =window.location.href.split('/');

    AmgenConnector.deviceid=ar[ar.indexOf('x')+1];

    var world = new amgen.Building($('#map-view'));

    var resize = new amgen.Resize();

    var onDataReady = function(data){
      // console.log(data);
        world.setStructure(data);
       var mapid= data.worldmap.mapId;
       // var ar = AmgenModel.getDestinatopnsByMapid(mapid);
        world.setCampuses(AmgenModel.categories);
        world.setWaypoints(AmgenModel.getWaypointsByMapid(mapid));
        $('#preloader').remove();
        checkRoute();

   }

    AmgenModel.getWorldStructure(onDataReady);
    AmgenConnector.getLabels().done(function(res){
        res= _.indexBy(res,'description');

        AmgenModel.setLabels(res);
        $('#logo').attr('src',res['logo'].filePath);
        $('#content').css('background-image','url('+res['bg'].filePath+')');
     // console.log(res['bg'].filePath);

       amgenDispatcher.triggerHandler(LABELS_READY,res);
    })
   // var amg = new Amgen();

    amgenDispatcher.on('DESTINATION_CLICED',function(evt,item){
      //  console.log('DESTINATION_CLICED',item);
       var promise =  AmgenConnector.getDiviceId(item.clientId).done(function(res){
           console.log(res);
       });

    });
    amgenDispatcher.on('CAMPUS_CLICKED',function(evt,item){
      //  console.log(item);
    });




    amgenDispatcher.on('PIN_SELECTED',function(evt,data){
        var ar = data.jids;
        var out=[];
        for(var i= 0,n=ar.length;i<n;i++) out.push( AmgenModel.getDestinatopnByJid(ar[i]) );
        world.showDestinationsAt(out,data);
    });

    amgenDispatcher.on('DESTINATION_CLICKED',function(evt,item){
        console.log(item);
    });


   var  loadPage = function(ar){
            console.log('Page to load   '+ar.join('-'));
    }


    var showCampus = function(jid){
        var camp =  AmgenModel.getDestinatopnByJid(jid);
        if(!camp) {
            console.warn('No destinations with id '+jid);
            return 0;
        }
        var camp = world.showCampus(camp);
        return camp;
    }

    var showBuilding = function(camp,build){
        var campus = showCampus(camp);
       // console.log(campus);
        if(campus) campus.showDestinationByCientId(build);

    }


    var checkRoute = function(){
        var url = document.location.hash;
        var ar = url.split('/');
        var success = false;
        var id=0
        if(ar.length){
            switch(ar[0]){
                case '#campus':
                   success = showCampus(ar[2]);
                    break
                case '#building':
                    if(ar.length>2){
                        success = showBuilding(ar[2],ar[3]);
                    }else if(ar.length==2)showCampus(ar[2]);

                    break;
                case '#world':
                    if(ar.length>1) id = ar[1];
                   world.showRegionById(Number(id));
                    success = true;
                    break;
            }
        }

        //if(!success)window.location.hash='#world';

    }
    var loadWorldMap = function(){

    }
    $(window).on('hashchange', function(){
       checkRoute();

       // if(ar)loadPage(ar);

    })



})