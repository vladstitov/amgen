/**
 * Created by Vlad on 6/4/2015.
 */
///<reference path="../../test/typings/jquery.d.ts" />
///<reference path="../../test/typings/svgjs.d.ts" />
///<reference path="../../test/typings/underscore.d.ts" />



module mapping{
   export class Building{
       view:JQuery
       btnSave:JQuery
       chkAuto:JQuery
       name:JQuery
       tools:JQuery
       btnNext:JQuery
       floors:any[];
       waypoints:any;
       private auto:boolean
       private currentFloor:Floor;
       private timeout:number=0;
       constructor(cont:JQuery){
           this.view=$('<section>').addClass('building').appendTo(cont);

           var that = this;
           this.tools=$('.tools:first');
           this.btnSave  = $('.tools [data-id=save]:first').on('click',function(){
               that.onSaveClicked();
           })
           this.chkAuto = $('.tools [data-id=auto]:first').on('click',function(){
               that.onAutoClicked();
           })
           this.btnNext = $('.tools [data-id=next]:first').on('click',function(){
               that.goNext();
           })
           this.name= $('.tools [data-id=name]:first');
            Floor.dispatcher.on('COMPLETE',function(evt,fl){
                if(that.auto) that.timeout = setTimeout(function(){ that.saveCurrentFloor();},7000)
            })
       }

       onSaveClicked(){
           this.saveCurrentFloor();

       }

       onAutoClicked(){

           if(this.chkAuto.prop('checked')){
               this.auto=true;
           }else{
               clearTimeout(this.timeout);
           }

       }
       private onFileSaved(res,url:string,mapid:number):void{
            console.log('saved  '+res);

           this.tools.append('<br/><a href="'+url+'"  target="_blank" >'+mapid+'</a>')
            this.goNext();

       }
       private saveCurrentFloor(){
           var svg = this.currentFloor.getNewSVG();
          // console.log(svg);

           var that=this;
           var mapid= this.currentFloor.mapid;
           var filename:string = 'svg_'+mapid+'.json';
           $.ajax({
               url:'/rest/web/customfile/'+filename,
               type:'PUT',
               contentType:'text/plain',
               success:function(res){that.onFileSaved(res,'/rest/web/customfile/'+filename,mapid)},
               data:JSON.stringify(svg)
           })


       }
       private goNext():void{
           this.current++;
           if(this.current>=this.floors.length){
               this.view.empty();
               $('<h1>').text('DONE').appendTo(this.view);
               return
           }
           var fl:Floor = new Floor(this.floors[this.current]);
           this.name.text(fl.name);
           fl.setWaypoints( this.waypoints[fl.mapid]);
           this.view.empty();
           this.view.append(fl.view);
           this.currentFloor =fl;
       }

       private current:number=-1;

       setData(floors,waypoints):void {
           this.floors = floors;
           //   console.log(floors);
           //  console.log(waypoints);
           this.waypoints = _.groupBy(waypoints.waypoints, 'mapid');
           this.goNext();
       }

    }

    export class Floor{
        private model:any
        view:JQuery;
        name:string;
        private image:JQuery;
       private  isVisible;
       private  waypoints:any[];
        mapid:number
        private svgImg:JQuery
        private width:number;
        private height:number;
        private svgID:string;
        static dispatcher:any =$({});

        constructor(vo:any){
            this.model=vo;
            this.name = vo.name;
            //console.log(vo);
            this.mapid = vo.mapId;
            this.svgID = 'svg-id-'+vo.mapid;
            this.view=$('<section>').addClass('floor-map');//.hide();
            var image = $('<img>').attr('src',vo.uri).appendTo(this.view);
            var self= this;
            image.load(function(evt){
                var img:any = evt.currentTarget;
                self.setDemetions(img.clientWidth,img.clientHeight);
            })
            this.image = image;
            this.svgImg = $('<div>').addClass('svg-map').attr('id',this.svgID).appendTo(this.view).load(vo.svgMap,function(evt){
               self.onSvgLoaded();
            });
        }


        hilitePolygon(wpid:number){
            var item = this.svgIndexed[wpid];
            if(item)this.onPolygonOver(item.wp,item.polygon);
            else this.onPolygonOver(null,null);
        }
        private onPolygonOver(data:number,polygon:any){
            if(this.selectedSVG) this.selectedSVG.opacity(0.5);
            this.selectedSVG=null;
            if(data){
                polygon.opacity(0.85);
                this.selectedSVG = polygon;
            }


           // console.log(data);
        }

        private createPolygon(svg,vo,callBack){
            var polygon = svg.polygon(vo.points).opacity(0.35);
           // vo.polygon = polygon;
            polygon.on('mouseover',function(){
                callBack(vo.wp,polygon);
            })
            polygon.on('mouseout',function(){
                callBack(null,null);
            })
        }
        private svgsAr:any[]
       private svgIndexed:{}
        private selectedSVG:any
        private drawSvg(ar:any[]){
            this.svgsAr =ar;
            this.svgIndexed = _.indexBy(ar,'wp');

            var svg:any = SVG(this.svgID).size(this.width,this.height);
            //console.log(svg);
            var callBack  = this.onPolygonOver;
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                this.createPolygon(svg,vo,callBack)


            }

        }

        private mapDestination(vo):string{
            var X= vo.x;
            var Y = vo.y;
            // console.log(vo.wp);
            var el:Element =  document.elementFromPoint(X, Y);
           // console.log(el);
            var H = el.getBoundingClientRect().height;
            var W = el.getBoundingClientRect().width;
           // console.log(H+'  '+W);
            if((H+W) >1000) return null
            return el.getAttribute('points');
            //$('<div>').addClass('test-dot').css('top',Y).css('left',X).appendTo(this.view);

        }
        private svgdata:any;
        private onSvgLoaded():void{
            var out=[];
          //  this.view.show();
            console.log('svg loaded     ');
            var ar = this.waypoints;
           // console.log(ar);
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                var points=this.mapDestination(vo)
                if(points)out.push({wp:vo.id,mapid:this.mapid,points:points})
            }

            this.svgdata=out;


           // console.log(out);
           // this.view.hide();

           this.svgImg.empty();
            this.drawSvg(out);
            Floor.dispatcher.triggerHandler('COMPLETE',this);
        }
        getNewSVG():any{
            return this.svgdata
        }
        drawNewSVG(){
           this.drawSvg(this.svgdata);
        }
        private setDemetions(w:number,h:number):void{
            this.width=w;
            this.height=h;
            //  console.log(w,h);
            this.svgImg.width(w);
            this.svgImg.height(h);
        }
        setWaypoints(ar:any[]):void{
            this.waypoints = ar;
        }



    }



}