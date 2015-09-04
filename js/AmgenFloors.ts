/**
 * Created by Vlad on 6/17/2015.
 */
///<reference path="AmgenApp.ts" />

module amgen{
declare var AmgenConnector:any

    export class FloorCampus{
        model:any
        view:JQuery;
        image:JQuery;
        list:ListNano
        isVisible;
        waypoints:any[];

        mapid:number
        destinations:any[];
        svgImg:JQuery
        width:number;
        height:number;
        jid:string;
        idView:string;
        header:JQuery;

        dest:any;

        constructor(vo:any,dest:any){
            // console.log('FloorCampus   ',vo);
            this.model=vo;
            this.dest = dest;
            this.jid = dest.clientId;
          //  this.worldVo=dest;
            this.mapid = vo.mapId;
            this.idView = 'floor-map-'+vo.mapId;


            this.list = new ListNano();
            this.list.parent = this.jid;
            this.list.setId(this.mapid);
            this.list.setData(AmgenModel.getDestinatopnsByMapid(this.mapid));
            var that= this;
            this.list.onSelected = function(item){
                if(item.wp)   that.selectPolygonByWp(item.wp.id)

            }

            this.view=$('<section>').addClass('floor-map');
            var image = $('<img>').attr('src',vo.uri).appendTo(this.view);

            var self= this;
            image.load(function(evt){
                var img:any = evt.currentTarget;
                self.setDemetions(img.clientWidth,img.clientHeight);

            })
            this.image = image;

            this.header = $('<h2>').text(dest.name).appendTo(this.view);

        }

        private parseSVG(res){
            if(typeof res ==='string') res=JSON.parse(res);
            this.drawSvg(res)
           // console.log(res);
        }


        private building:any;

        setBuilding(building){
            this.building = building;
        }

        remove():void{
            var that= this;
            this.view.fadeOut(function(){   that.view.remove();});
            this.list.hide();
        }

        getList():JQuery{
            return this.list.getView();
        }
        renderList():void{
           // console.log(this.mapid);
            this.list.render();
        }

        private trycount=0;

        selectPolygonByWp(wpid:number){
            if(Polygon.selected) Polygon.selected.hide();
            var ar =this.polygons
            if(!ar)      return;
            var vo
            for (var i = 0, n = ar.length; i < n; i++) {
               vo = ar[i];
                if(vo.wpid===wpid){
                    vo.show();
                    break
                }
                vo=null
            }
            Polygon.selected=vo;
        }

       // private selected:Polygon;
        private polygons:Polygon[];

        private drawSvg(ar:any[]){
            var polygons:Polygon[]=[];
            var view:JQuery = this.view;
            var svg:any = SVG(this.idView).size(this.width,this.height);

            for (var i = 0, n = ar.length; i < n; i++) {
                var poly = new Polygon(svg,ar[i],view);
                poly.parent = this.jid;

                poly.setDestinations(this.list.getDestinationsAt(poly.wpid));
                polygons.push(poly);
            }

            var list=this.list;
            var that=this;
            Polygon.dispatcher.on(Polygon.OVER,function(evt,poly:Polygon){
                        poly = poly.show();
                if(Polygon.selected)Polygon.selected.hide();
                       if(poly) {
                           Polygon.selected = poly;
                           list.selectDestinationsAt(poly.wpid);
                       }
            })
            Polygon.dispatcher.on(Polygon.OUT,function(evt,poly:Polygon){
                poly.hide();
                Polygon.selected=null;
            })

            Polygon.dispatcher.on(Polygon.CLICK,function(evt,poly:Polygon){
                //console.log(poly.getUrl());
                var ar = poly.getClientIds();
                if(ar && ar.length)list.followclientId(ar[0]);


            })
            this.polygons=polygons;
        }

        setDemetions(w:number,h:number):void{
            this.width=w;
            this.height=h;
            this.svgImg = $('<div>').addClass('svg-map').attr('id',this.idView).appendTo(this.view);
            var that=this;
            AmgenConnector.getFile('svg_'+this.mapid+'.json').done(function(res){
                that.parseSVG(res);
            })
            //  console.log(w,h);
            this.svgImg.width(w);
            this.svgImg.height(h);
        }

        show():FloorCampus{
            this.view.fadeIn();
            return this;
        }

        private currentClientId:string;

        showDestinationByCientId(clientid:string):void{
            var that=this;
            if(!this.polygons){
                setTimeout(function(){
                    that.showDestinationByCientId(clientid);
                },1000);
                return;
            }
            this.currentClientId = clientid;
               var vo =  this.list.getDestinationByClientId(clientid);
            if(vo){
                if(vo.wp){
                    this.selectPolygonByWp(vo.wp.id);
                    this.list.selectDestinationsAt(vo.wp.id);
                }

            }
        }
    }
    class Polygon{
        wpid:number;
        points:string;
        polygon:any;
        dests:any[];
        view:JQuery;
        parent:string='';

        private bubble:BubbleFloor;

        static OVER:string='OVER';
        static OUT:string='OUT';
        static CLICK:string='CLICK';
        static dispatcher:JQuery=$({})
        static selected:Polygon;




        constructor(svg:any,vo:any,view:JQuery){
            this.view=view;
            this.wpid=vo.wp
            var polygon = svg.polygon(vo.points).opacity(0.01);
            var that = this;
            polygon.on('mouseover',function(){
                Polygon.dispatcher.triggerHandler(Polygon.OVER,that)
            })
            polygon.on('mouseout',function(){
                Polygon.dispatcher.triggerHandler(Polygon.OUT,that)
            })
            polygon.on('click',function(){
                Polygon.dispatcher.triggerHandler(Polygon.CLICK,that)
            })

            this.polygon = polygon;
        }

        getUrl(){
            return this.bubble.getUrl();
        }
        getClientIds():string[]{
            return this.bubble.clientIds;
        }
        setDestinations(ar:any[]){
           this.dests=ar;
            if(ar.length){
                //console.log(this.polygon);
                this.bubble = new BubbleFloor();
                this.bubble.parent= this.parent;
                this.bubble.setData(ar);

                this.view.append(this.bubble.view);
            }
        }
        show():Polygon{
            if(this.dests.length===0) return null;
            if( this.bubble){
                this.bubble.view.stop();
                this.bubble.view.fadeIn();
            }
            this.polygon.opacity(0.85);
            return this;
        }
        hide():void{
            this.polygon.opacity(0.01);
            if( this.bubble){
                this.bubble.view.stop();
                this.bubble.view.fadeOut();
            }
        }
    }


    export class FloorWorld{
        model:any;
        data:any[];
        view:JQuery;
        image:JQuery;
        isVisible;
        waypoints:any[];
       // selectdPin:Pin;
        bubble:Bubble;
        destination:any;
        mapid:number;
        list:ListCategory;

        constructor(vo:any){
            this.model=vo;
            this.view=$('<section>').addClass('floor-map');
            this.image=$('<img>').attr('src',vo.uri).appendTo(this.view);
            this.list = new ListCategory($('#list-world-view'));

            var self= this;
            this.list.onSelected=function(item){
                self.onListSelected(item)
            }
        }

        private onListSelected(item):void{
            if(Pin.selected) Pin.selected.hideBubble();
            Pin.selected =null;
           if(item.wp)this.showPinByWpId(item.wp.id)
        }

        private showPinByWpId(id:number):void{
            var ar =this.pins
            for (var i = 0, n = ar.length; i < n; i++) {
                if(ar[i].id==id){
                    Pin.selected = ar[i];
                    Pin.selected.showBubble();
                    break;
                }


            }
        }

        selectCampus(id:number){
            this.list.selectItemById(id);
        }

        showRegion(id:number){
           // console.log('showRegion  '+id);
            if(isNaN(id)) return;
            var dests = this.list.showRegion(id);
            this.showPinsOfRegion(id);
           // console.log(dests);
        }

        showPinsAll(){
            var ar:Pin[] = this.pins
            for (var i = 0, n = ar.length; i < n; i++) ar[i].show();
        }

        showPinsOfRegion(id):void {
            id=Number(id);
            if (!id) this.showPinsAll();
            else {
                var ar:Pin[] = this.pins
                for (var i = 0, n = ar.length; i < n; i++) {
                    var vo = ar[i];

                    if (vo.region === id)vo.show();
                    else vo.hide();
                }
            }

        }
        show(){

        }

        private getPin(item){
            return this.pinsIndex[item.id];
        }
       // showDestinationsAt(ar:any[],item:any):void{

            //if(item){
               // if(!this.bubble) this.bubble = new Bubble();
                //this.view.append(this.bubble.view);

               // this.bubble.setData(ar,item);
            //}else console.log('EERRROOORRR WorldFloor showDestinationsAt item null ');
            //  console.log(item,ar)

            //var pin:any = this.getPin(item);
            //   pin.showDestinations(ar);
            //console.log(pin);
       // }
       // showDestination(item:any):void{

       // }
        pins:Pin[];
        pinsIndex={};

        setWaypoints(ar:any[]):void{
            // console.log('set waypoints ',ar);
            this.waypoints = ar;
            var out=[];
            var obj={};
            var self=this;
            for(var i=0,n=ar.length;i<n;i++){
                var item=ar[i];
                if(item.jids){

                    var pin = new Pin(item)
                    out.push(pin);
                    obj[item.id] = pin;
                    this.view.append(pin.view);
                }
            }

            var list = this.list
            Pin.dispatcher.on(Pin.OVER,function(evt,pin){
                if(Pin.selected)Pin.selected.hideBubble()
                list.deselect();
                Pin.selected =pin;
                pin.showBubble();
            })
            Pin.dispatcher.on(Pin.OUT,function(evt,pin){
                if(Pin.selected)Pin.selected.hideBubble()
                Pin.selected = null;


            })
            this.pinsIndex = obj;
            this.pins=out;
        }

    }

    class Pin{
        model:any;
        view:JQuery
        jids:number[];
        destinations:JQuery;
        data:any[];
        id:number
        region:number
        static dispatcher:JQuery=$({});
        static OVER:string='OVER';
        static OUT:string='OUT';
        static  CLICK:string='CLICK';
        private bubble:Bubble;
        static selected:Pin;

        constructor(data:any){
            this.model=data;
            if(data.dests.length){
               this.region = data.dests[0].categoryId[0];
            }

            this.bubble = new Bubble();
            this.bubble.setData(data.dests,{x:0,y:15});

            this.bubble.id= data.id;
          //  console.log(this.region);
            this.id=data.id;
            //console.log(data);
            //this.region = data.
            this.jids= data.jids;
            this.view=$('<div>').addClass('pin');
            this.view.css('top',data.y);
            this.view.css('left',data.x);
            this.view.append(this.bubble.view);
           // console.log(this.id)
           // this.bubble.view.hide();

            this.bubble.hide(1);
            var that= this;
            this.view.on('mouseover',function(evt){Pin.dispatcher.triggerHandler(Pin.OVER,that)})
            this.view.on('mouseout',function(evt){Pin.dispatcher.triggerHandler(Pin.OUT,that)})


            //this.view.on('click','li',function(evt){self.onClick($(evt.currentTarget))})
            // this.view.text('Pin');
        }
        private onPinOver(el:JQuery):void{
            amgenDispatcher.triggerHandler('PIN_SELECTED',this.model,this);
        }
        private onPinOut(el:JQuery){
            // if(this.destinations) this.destinations.hide();
        }

        showBubble():void{
            this.view.addClass('selected')
            this.bubble.show();
        }
        hideBubble():void{
            this.view.removeClass('selected')
            this.bubble.hide();
        }

        show():void{
            this.view.stop();
            this.view.fadeIn();
        }
        hide():void{
            this.view.stop();
            this.view.fadeOut();
        }
        private onClick(el:JQuery):void{
            var i = el.data('i');
            var item = this.data[i];
            amgenDispatcher.triggerHandler('PIN_CLICKED',item,this);
        }
        renderItem(item:any,i):string{
            return '<li data-i="'+i+'" >'+item.name+'</li>'
        }
        showDestinations(ar:any[]):void{
            if(this.destinations) this.destinations.show()
            else{
                this.data=ar;
                var out=''
                for(var i=0,n=ar.length;i<n;i++){
                    out+=this.renderItem(ar[i],i);
                }
                this.destinations=$('<ul>').html(out).appendTo(this.view);
            }



        }
        hideDestinations(){
            this.destinations.hide()
        }
    }

    class Point{
        x:number;
        y:number;
    }

    class WP extends Point{
        id:number;
    }
    class Dest{
        id:number;
        clientId:string;
        name:string;
        wp:WP
    }
    export class BubbleFloor{
        view:JQuery;
        list:JQuery;
        data:any[];
        wp:WP
        parent:string='';
        polygonY:number;
        onClick:Function;
        clientIds:string[];
        constructor(){
            //this.view = ${'<div>').addClass('bubble');

            this.view = $('<div>').addClass('bubble');
            this.list =$('<ul>').appendTo(this.view);
            var self = this;

            this.view.on('click','li',function(evt){ self.onMouseClick($(evt.currentTarget))})
            this.view.hide();
           // this.view.on('mouseleave',function(evt){
                //  console.log('on-mouseleave');
                self.view.hide('fast');
           // })

        }
        getUrl():string{
            return this.list.find('a').attr('href');
        }
        onMouseClick(el:JQuery):void{
            var i = el.data('i');
            if(isNaN(i)) return
            var item = this.data[i];
            if(this.onClick) this.onClick(item);
        }

        renderItem(item:any,i:number,parent):string{
            return '<li data-i="'+i+'" ><a href="#'+parent+'/'+item.id+'/'+item.clientId+'/'+item.name.replace(' ','-')+'" >'+item.name+'</a></li>'
        }

        setData(ar:Dest[]):void{
            this.data=ar;
            var ids:string[]=[];
            var out=''
            var parent = this.parent;
            var wp={x:0,y:0};
            for(var i=0,n=ar.length;i<n;i++){
                if(ar[i].wp) wp=ar[i].wp;
                ids.push(ar[i].clientId);
                out+=this.renderItem(ar[i],i,parent);
            }

            this.clientIds = ids;
            this.list.html(out);
            this.view.css('left',wp.x-20).css('top',wp.y-40);
        }

    }

}