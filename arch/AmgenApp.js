/**
 * Created by Vlad on 6/3/2015.
 */
var AmgenController = function(){
    this.breadcrumbs = new amgen.BredCrombs($('#breadcrumbs'));


   // this.listhead = $('#list-view h2');

   // this.listview =  new amgen.List($('#the-list'));

    //his.listview.setBredCrumbs(this.breadcrumbs);

    this.mapview = $('#map-view');
    this.logoview =$('#logo-view');


    this.setData = function(data){
       // this.listview.setData(data);
       // var regions = this.listview.getRegions();
       // this.breadcrumbs.setData(regions)
       // this.breadcrumbs.render();
        //this.listview.render();

    }

    this.setRegions = function(ar){
        this.regionsAr = ar;
    }

    this.setCampuses = function(ar){
        this.campusAr = ar;
        //console.log(this.regionsAr);
    }

    this.showRegions= function(){

    }
   var  showCampuses = function(){

    }
    var showBuildings  = function(){

    }

    var that=this;

    return that;
    /*
    {
        setRegions:setRegions,
        setCampuses:setCampuses,
        showRegions:showRegions,
        showCampuses:showCampuses

    };
    */

}




