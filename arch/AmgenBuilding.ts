/**
 * Created by Vlad on 6/4/2015.
 */
///<reference path="../../../../test/typings/jquery.d.ts" />
///<reference path="../../../../test/typings/svgjs.d.ts" />
///<reference path="../../../../test/typings/underscore.d.ts" />
///<reference path="AmgenList.ts" />
///<reference path="AmgenFloors.ts" />

    declare var amgenDispatcher:JQuery
    declare var AmgenModel:any;
module amgen{
   export class Building{

       view:JQuery
       homemap:FloorWorld;
       campuses:any[];
       floors:FloorCampus[];
       listCampusView:JQuery;
       listCampus:JQuery;
       constructor(cont:JQuery){
           this.view=$('<section>').addClass('building').appendTo(cont);
           var self= this;
           this.listCampus = $('#list-campus-view .list-container:first');
           this.listCampusView=$('#list-campus-view').hide();


          // amgenDispatcher.on('CAMPUS_SELECTED',function(evt,item){ self.onCampusSelected(item);});
          // amgenDispatcher.on('CAMPUS_CLICKED',function(evt,item){ self.onCampusClicked(item); })

       }
       setStructure(data:any):void{
           this.homemap = new FloorWorld(data.worldmap);
           this.view.append(this.homemap.view);

           this.homemap.show();
           this.campuses=data.building;
       }

       setCampuses(data){
           this.homemap.list.setData(data);
           this.homemap.list.renderAll();
       }
      // setSelected(item):void{
         //  this.homemap.showDestinationsAt([item],item.wp);
           //console.log(item);

      // }
       showDestinationsAt(ar,owner:any){
         //  this.homemap.showDestinationsAt(ar,owner);
       }

       setWaypoints(ar:any[]):void{
           this.homemap.setWaypoints(ar);
       }

       showRegionById(id:number){
                this.showHome();
                this.homemap.showRegion(id);
       }

       private getCampusFloor(dest:any):FloorCampus{
           var fl:FloorCampus
           var ar =this.campuses;
           var jid = dest.clientId;
           for (var i = 0, n = ar.length; i < n; i++) {
               var vo = ar[i];
              // console.log(vo.name+' '+jid);
               if(vo.name==jid) {
                   if(!vo.floor) vo.floor=new FloorCampus(vo,dest);
                   return vo.floor;
               }

           }
           return fl;
       }

       selectCampus(id:number){
            this.showHome();
           this.homemap.selectCampus(id);
       }

       showHome():void{
           if( this.currentCampus){
               var campus:FloorCampus = this.currentCampus;
               this.currentCampus.remove();
               this.currentCampus=null;
               this.homemap.list.show('fast')
               this.homemap.view.fadeIn()
               this.listCampusView.hide('fast');
           }
         //  this.homemap.showRegion(id);
       }
       private currentCampus:FloorCampus;

       showCampus(camp:any):FloorCampus{
        // console.log('showCampus',camp);
            if(this.currentCampus && this.currentCampus.jid == camp.clientId){
                return this.currentCampus;
            }
         //  console.log(' new   Campus');
           var floor:FloorCampus = this.getCampusFloor(camp);
           if(floor){
               //floor.setBuilding(building)
               this.currentCampus = floor;
               this.homemap.view.fadeOut();
               this.homemap.list.hide('fast');

               this.view.prepend(floor.show().view);
               this.listCampus.empty();
               this.listCampusView.show();
               this.listCampus.append(floor.getList());

               return floor;

           }else{
               this.showHome();
               console.warn(' NO campus for '+camp.name);
           }


           return null;
       }
      // private onCampusSelected(item):void {
               // console.log('onCampusSelected',item);
       ///}
    }

   export class Bubble{
        view:JQuery;
        list:JQuery;
        data:any[];
        wp:any
        id:number;

        constructor(){
                //this.view = ${'<div>').addClass('bubble');

            this.view = $('<div>').addClass('bubble');
            this.list =$('<div>').addClass('list').appendTo(this.view);
            var self = this;
            this.view.on('click','a',function(evt){ self.onClick($(evt.currentTarget))})
            this.view.on('mouseleave',function(evt){
              self.hide();

                })

            }

       show():void{
           this.view.stop();
           this.view.show('fast');
       }
       hide(s?):void{
           if(s)this.view.hide()
           else{
               this.view.stop();
               this.view.hide('fast');
           }

       }
        onClick(el:JQuery):void{
            var i = el.data('i');
            if(isNaN(i)) return
            var item = this.data[i]

           // amgenDispatcher.triggerHandler('DESTINATION_CLICKED',item);
        }
        renderItem(item:any,i):string{
            return '<a href="#campus/'+item.id+'/'+item.clientId+'/'+item.name+'" >'+item.name+'</a>'
        }
        setData(ar:any[],wp):void{
            this.wp=wp;
            this.data=ar;
            var out=''
            for(var i=0,n=ar.length;i<n;i++){
                out+=this.renderItem(ar[i],i);
            }

            this.list.html(out);
           // this.view.css('left',wp.x).css('bottom',wp.y);
            this.view.show();

        }

    }



}