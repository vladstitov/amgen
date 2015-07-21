var globalDispatcher = {};

var settings = {};


settings.languageCode = "en";

// var SERVER_URL = "";

var orgHtml = "";
var retryCounter = 0;
var RESTENDPOINT = '/rest/web';
var MODULE_READY = "ModuleInitComplete";


window.onload = function(){
   // debugDevice = {deviceId:"986",languageCode:"en"};
    try{
        global.networkCache.clear();
    }catch(e){
        ////console.log("Global cache clearing not supported");
    }

    addExtraHTMLJQUERYFuncs();

    $(globalDispatcher).on("DataLoaded", loadModule);
    $(globalDispatcher).on("ModulesReady", initAll);
    $(globalDispatcher).on(MODULE_READY, onModuleInit);
    $(globalDispatcher).on("ModulesInit", initTemplate);


    orgHtml = $("#container").html();
    
    getRequiredServerData();
};

function addExtraHTMLJQUERYFuncs(){

    //Prepend
    if(!Element.prototype.prependChild)Element.prototype.prependChild = function(child) { this.insertBefore(child, this.firstChild); };


    // Add Jquery html callback
    var htmlOriginal = $.fn.html;

    $.fn.html = function(html,callback){
      var ret = htmlOriginal.apply(this, arguments);
      if(typeof callback == "function"){callback();}
      return ret;
    };
}

window.addEventListener('orientationchange', doOnOrientationChange);

function doOnOrientationChange(){
    $(globalDispatcher).trigger("orientationchange", [window.orientation]);
}

/***************************************************************/
/********************** Get server data ************************/
/***************************************************************/

var bootStrapCounter = 0;
var modulesLoaded = 0;
var modCheck = 0;
var laces;



function getRequiredServerData(){
    //Get and assign settings 
    if(debugDevice !== undefined){
        settings.device = debugDevice;
        getUrlParams();
    } else settings.device = getUrlParams();


    //temp
    settings.modules = modules;


    laces = [{name:"deviceDetails", url:RESTENDPOINT + "/device/getDetails/" + settings.device.deviceId}, {name:"deviceParams", url:RESTENDPOINT + "/parameters/all/" + settings.device.deviceId}];

    ////console.log(laces);
    tieLaces();
}


function retry(){
    retryCounter++;
    if(retryCounter >= 5){
        ////console.log("Tried 5 times, something else is wrong.");
        alert("This application had a hic up, it will restart.");
        if(navigator.app && navigator.app.exitApp)navigator.app.exitApp();
        //else restart();
        return;
    }
    
    ////console.log("Trying again", retryCounter);
    $("#container").html(orgHtml);
    
    modulesLoaded = 0;
    iLoad = 0;

    loadModule();
}

function tieLaces(){
    $.ajax({
        type:"GET",
        url:laces[bootStrapCounter].url,
        // data:JSON.parse(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        dataType: "json",
        success: function(data){
            settings[laces[bootStrapCounter].name] = data;
            //////console.log(settings[laces[bootStrapCounter].name]);
            checkBoots();
        },
        error: function(data) {
            alert("Error loading initial data : " + laces[bootStrapCounter].name/*JSON.stringify(data)*/);
        }
    });
}

function checkBoots(){
    bootStrapCounter++;
    if(bootStrapCounter < laces.length){
        tieLaces();
    }else{

        NovoMap.getDestinations(function(res){
            destinations=res;
            NovoMap.indexDestinations();

            var mapPoints = function(wp){
                var ar = wp.jids;
                for(var i= 0,n=ar.length;i<n;i++){
                    var dest = NovoMap.getDestinationByClientId(ar[i]);
                    if(dest)dest.wp=wp;//    console.log(ar[i]);
                    else console.log(' error no destination with id '+ar[i]);
                }


            }

           NovoMap.getMapData(function(mapdata){
            var wps = mapdata.waypoints;
               for(var i= 0,n=wps.length;i<n;i++){
                   if(wps[i].jids)mapPoints(wps[i]);
               }

               $(globalDispatcher).trigger("DataLoaded");

         });
        });
    }
}



function getUrlParams(){
     var url = document.location.toString();
    settings.url = url;
    var brokenUrl = url.split("/");
    var xInt = brokenUrl.indexOf("x");
    var dev = {deviceId: brokenUrl[xInt + 1], languageCode: brokenUrl[xInt + 2]};



    var h = url.indexOf('#');
    
    //Just get params
    if (h > -1)url = url.substr(0, h);
    var q = url.indexOf('?');
    var params = {};
    if (q > -1) {
        var qv = url.substr(q + 1).split('&');
        for (var i = 0, n = qv.length; i < n; i++) {
            var ar = qv[i].split('=');
            params[ar[0]] = ar[1];
        }
    }
    settings.params = params;

    
    

    
    //no extra param in langCode!!
    var lang= brokenUrl[xInt + 2].split("?")
    
    var dev = {deviceId: brokenUrl[xInt + 1], languageCode:lang[0]};

    brokenUrl.pop();//languageCode
    brokenUrl.pop();//device id

    settings.urlnoparams = brokenUrl.join("/");

    return dev;
}

/***************************************************************/
/********************** Module methods *************************/
/***************************************************************/


var iLoad = 0;

function loadModule(mod){
    // //console.log(mod.isTrigger);

    var date = new Date();
    // for(var i = 0; i < settings.modules.length; i++){
        
    if(mod === undefined || (mod !== undefined && mod.isTrigger))mod = settings.modules[iLoad];
    
    ////console.log("Loading " + mod.name);
    // var prepend = mod.prepend === "true"?true:false;
    /*Custom for template need to move this some were*/
    if(mod.parent === undefined){
        var element = document.createElement("div");
        $(element).attr("id", mod.name);
        $(element).load(mod.url + "?ts=" + date.getTime(), null, checkModLoaded);
        if(mod.prepend) $("#container").prepend(element);
        else $("#container").append(element);
    }else{
        if(mod.parent === "page"){
            var str = '<div id="'+ mod.name +'" class="page"></div>';
            $("#content").append(str);
            $("#" + mod.name).load(mod.url + "?ts=" + date.getTime());
        }else{
            var element2 = document.createElement("div");
            $(element2).attr("id", mod.name);
            $(element2).load(mod.url + "?ts=" + date.getTime(), null, checkModLoaded);
            if(mod.prepend) $(mod.parent).prepend(element2);
            else $(mod.parent).append(element2);
        }
    }
}

function checkModLoaded(reponseText, textStatus){
    //console.log("-----------------------------");
    //console.log(textStatus, settings.modules[iLoad]);
    if(settings.modules[iLoad].childrenMods && settings.modules[iLoad].childrenMods.length > 0){
        //console.log("MODULE HAS CHILDREN!");
        if(settings.modules[iLoad].headCount === undefined)settings.modules[iLoad].headCount = 0;
        else settings.modules[iLoad].headCount++;

        //console.log(settings.modules[iLoad].headCount);
        if(settings.modules[iLoad].headCount < settings.modules[iLoad].childrenMods.length){
            //console.log("Loading Child module ", settings.modules[iLoad].childrenMods[settings.modules[iLoad].headCount]);
            loadModule(settings.modules[iLoad].childrenMods[settings.modules[iLoad].headCount]);
            return;
        }
    }

        iLoad++;
        if(iLoad >= settings.modules.length){
            $(globalDispatcher).trigger("ModulesReady");
            //console.log("All Mods Loaded");
        }else{
            loadModule(/*settings.modules[iLoad]*/);
        }
    
}

function onModuleInit(evt, from) {
    //console.log("Module Complete: ", from, modulesLoaded, settings.modules[modulesLoaded]);
    initNextModule();
}


function initNextModule(){

    if(settings.modules[modulesLoaded].childrenMods && settings.modules[modulesLoaded].childrenMods.length > 0){
        if(settings.modules[modulesLoaded].initHeadCount === undefined)settings.modules[modulesLoaded].initHeadCount = 0;
        else settings.modules[modulesLoaded].initHeadCount++;
        //console.log(settings.modules[modulesLoaded].initHeadCount);
        if(settings.modules[modulesLoaded].initHeadCount < settings.modules[modulesLoaded].childrenMods.length){
            //console.log("Initializing child module -- ", settings.modules[modulesLoaded].childrenMods[settings.modules[modulesLoaded].initHeadCount]);
            initModule(settings.modules[modulesLoaded].initHeadCount, settings.modules[modulesLoaded].childrenMods);
            return;
        }
    }


    modulesLoaded++;
    if(modulesLoaded < settings.modules.length) {
        initModule(modulesLoaded, settings.modules);
    } else {
        $(globalDispatcher).trigger("ModulesInit");
    }
}

function initModule(arrayInt, modArray) {
    var mod = modArray[arrayInt];
    // console.log("Sending INIT - " + mod.name);
    var f = window[mod.init];
    if(f !== undefined && typeof f == "function")f(mod.params);
    else {
        console.log("No init function for " + mod.name + "    -- Retrying");
        retry();
    }
}


function initAll(){
    initModule(0, settings.modules);
}