/**
 * Created by Vlad on 6/4/2015.
 */
    ///<reference path="AmgenBuilding.ts" />


declare var amgenDispatcher:JQuery

interface  JQuery{
    nanoScroller(data?:any):JQuery
}
module amgen{
    declare var AmgenConnector:any;
    export class ListNano{
        nano:JQuery
        list:JQuery
        onSelected:Function;
        onItemClick:Function;
        private selectedEl:JQuery;
        data:any[];
        current:any[];
        private id:number
        parent:string;
        constructor(){
            this.nano=$('<div>').addClass('nano');
            this.list = $('<ul>').addClass('nano-content').appendTo(this.nano);
            // console.log(this.list)


        }

        private addListeners():void{
            var that = this;
            this.list.on('click','li',function(evt){
                that.onClick($(evt.currentTarget));
            })
            this.list.on('mouseover','li',function(evt){
                that.onMouseover($(evt.currentTarget));
            })
        }
        private selectElement(el:JQuery):void{
            if(this.selectedEl) this.selectedEl.removeClass('selected')
            if(el)  el.addClass('selected');
            this.selectedEl=el

        }

        private onClick(el:JQuery){
            var i = el.data('i');
            if(isNaN(i)) return;
            var item= this.data[i];
            if(item){
                this.selectElement(el);
                this.destinationClicked(item);
                if(this.onItemClick) this.onItemClick(item);
            }

        }

        private destinationClicked(dest){
            if(dest) this.followclientId(dest.clientId);
        }


        private onMouseover(el:JQuery){
            var i = el.data('i');
            if(isNaN(i))  return;
            var item= this.data[i]
            if(item){
                this.selectElement(el);
                if(this.onSelected) this.onSelected(item);
            }
        }
        private renderItem(item,i:number,parent:string):string{
            return '<li class="item" data-i="'+i+'" data-id="'+item.id+'"><a href="#building/'+item.id+'/'+parent+'/'+item.clientId+'/'+item.name.replace(' ','-').replace(',','')+'" >'+item.name+'</a></li>';
        }

        hide(){
            this.nano.nanoScroller({ destroy: true });
           // this.nano.hide('fast');
        }

        getDestinationByClientId(clientid:string):any{
            var ar =this.data
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                if(vo.clientId==clientid) return vo;

            }
            return null;
        }

        selectDestination(dest):JQuery{
            var id= dest.id;
            var el=this.list.children('[data-id='+id+']');
            if(el.length){
                this.selectElement(el);
                return el;

            }
            else console.log(' ERROR cant find  in list'+id);
        }

        followclientId(clientId){
            if(clientId) {
                AmgenConnector.getDiviceId(clientId).done(function (res) {
                    if(res!=0) window.location.href='/rest/web/x/'+res+'/en';
                });
                //console.log('destination clicked   ',dest);
            }


        }
        selectDestinationsAt(wpid:number){
            var dests:any[] = this.getDestinationsAt(wpid)
            if(dests.length===0) return;
          var el =  this.selectDestination(dests[0])

          this.nano.nanoScroller({scrollTo:el});


        }
        getDestinationsAt(wpid:number):any{
            var ar =this.data;
            var out=[];
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                if(vo.wp && vo.wp.id==wpid) out.push(vo)

            }
            return out;
        }
        setId(id:number){
            this.id=id;
            this.nano.data('id',id);
        }

        setData(ar:any[]):void {
            this.data = ar;
            this.current = ar;
        }
        getData():any[]{
            return this.data;
        }
        setCurrent(ar:any[]):void{
            this.current = ar;
        }
        private isRendered:boolean=false;

        getView():JQuery{
            if(!this.isRendered){
                var that=this;
                setTimeout(function(){
                    that.render();
                },50);
            }

            this.addListeners();
            var nano = this.nano;
            console.log('rendering nano  on getView ');
            setTimeout(function(){nano.nanoScroller()},50);
            return this.nano;
        }

        render():void{
            if(this.isRendered) return;
            this.isRendered = true
           // console.log('render');
            var ar = this.current;
            var parent = this.parent
            var out=''
            for (var i = 0, n = ar.length; i < n; i++) {
               out+=this.renderItem(ar[i],i,parent);
            }
            this.list.html(out);
            var nano = this.nano;
           setTimeout(function(){nano.nanoScroller()},50);

        }
    }

    export class ListCategory{
        private current:any[];
       // private indexed:any;
        private structure:any[];

        private allmaps:any;
      //  private regins:any[];

        private breadcrumb:BredCrombs;
        view:JQuery
        onSelected:Function;
        list:JQuery;
        nano:JQuery
        constructor(view:JQuery){

            this.breadcrumb = new BredCrombs($('#head-port .breadcrumbs:first'));
            this.view = view;
            var container = this.view.find('.list-container:first');

           this.nano=$('<div>').addClass('nano').appendTo(container);
            this.list = $('<ul>').addClass('nano-content').appendTo(this.nano);
           // console.log(container)
            var that = this;
            this.list.on('click','li',function(evt){
                that.onClick(evt);
            })
            this.list.on('mouseover','li',function(evt){
                that.onMouseover(evt);
            })

        }

        private selectElement(el:JQuery) {
            this.deselect();

            var i = el.data('i');
            var j = el.data('j');

            if (isNaN(i))  return;
            var item = this.data[j].dests[i];
            if (item.isCampus) {
                this.selectedItem = item;
                el.addClass('selected');
                this.selectedEl = el;
            }
        }
        hide(speed):void{
            this.view.hide(speed);
            this.breadcrumb.hide(speed)
        }
        show(speed):void{
            this.view.show(speed);
            this.breadcrumb.show(speed)
        }
        selectedItem:any;
        selectItemById(id){
            var el=this.list.children('[data-id='+id+']:first');
            if(el){
                this.selectElement(el);
            }

        }
        deselect(){
            if(this.selectedEl) this.selectedEl.removeClass('selected');
            this.selectedItem=null
        }
        private selectedEl:JQuery

        private onMouseover(evt):void{
            var el = $(evt.currentTarget);
            this.selectElement(el);
          if(this.selectedItem){
               if(this.onSelected) this.onSelected(this.selectedItem)
                amgenDispatcher.triggerHandler('CAMPUS_SELECTED',this.selectedItem);
           }
            //console.log(item);
        }
       // private getItemById(id:number):any{
         //   return this.indexed[id];
        //}
        private onClick(evt):void{
            var el = $(evt.currentTarget);
            var i = el.data('i');
            var j = el.data('j');
            if(isNaN(i)) return;
            var item= this.data[j].dests[i];
            if(item.isCampus){
                amgenDispatcher.triggerHandler('CAMPUS_CLICKED',item);
            }
           // if(item.typeId==4)
           // console.log(item);


        }
        private getChildrenType2(type,obj,out){
            // console.log(obj.name);

            var ar = obj.children;
            if(!ar || ar.length===0) return null;
            for(var i=0,n=ar.length;i<n;i++) {
                var child = ar[i];
                if (child.typeId == type) out.push(child)
                else this.getChildrenType2(type, child, out);
            }

        }
        private getChildrenType(type,obj){
           // console.log(obj.name);
            var ar = obj.children;
            if(!ar || ar.length===0) return null;
            if(ar[0].typeId==type) return ar
            else for(var i=0,n=ar.length;i<n;i++){
                var child = ar[i];
                return this.getChildrenType(type,child);
            }
        }
        private renderItem(item,i:number,j:number):string{
            item.isCampus=true;
            return '<li class="item" data-j="'+j+'" data-i="'+i+'" data-id="'+item.id+'"><a href="#campus/'+item.id+'/'+item.clientId+'/'+item.name.replace(' ','-').replace(',','')+'" >'+item.name+'</a></li>';
        }
        private renderRegion(item,j:number):string{
            var out:string=''
            var ar =item.dests
         // console.log(item);
          if(ar) for (var i = 0, n = ar.length; i < n; i++)   out+=this.renderItem(ar[i],i,j);
            return '<ul class="region" data-j="'+j+'" data-id="' +item.id+ '"><h3>'+item.name+'</h3>'+out+'</ul>';
        }
       // private renderCampuses(ar,num:number):string{

           // var out='';
            //for(var i=0,n=ar.length;i<n;i++) out+= this.renderItem(ar[i],i,num);
            //return out;
        //}
        /*
        private renderRegions(ar):void{
            var out='';
           for(var i=0,n=ar.length;i<n;i++)out+=this.renderRegion(ar[i],i)

            this.list.html(out);

            this.nano.nanoScroller();

        }
*/
        //private getRegionById(id):void{

       // }
        showAll(){
            this.list.children('.region').each(function(index,e){
                $(e).show('fast');
            });

        }
        showRegion(id:number){
            var nano = this.nano;
            if(!id) {
                this.showAll();
            }else{
                var regions:JQuery = this.list.children('.region');
                regions.each(function(indes,e){
                    var  el:JQuery = $(e);
                    if(el.data('id')==id){
                        el.show('fast');
                    }else el.hide('fast');
                })
            }

            this.breadcrumb.selectItem(id);
            setTimeout(function(){nano.nanoScroller()},500);
            return this.dataIndexed[id];
            //this.current =this.
        }
        private isRendered:boolean
        render():void{
            if(this.isRendered){
                this.showAll();
                return;
            }

            var ar = this.current;
          //  console.log(ar);
            var out='';
            for(var i=0,n=ar.length;i<n;i++)out+=this.renderRegion(ar[i],i)
            this.list.html(out);
            this.nano.nanoScroller();
            this.isRendered = true;
        }
        renderAll():void{
            this.current = this.data;
            this.render();
        }
        //setBredCrumbs(brd:BredCrombs):void{
          //  this.breadcrumb = brd;
       // }
       // getRegions():any[]{
          //  return this.regins
        //}


        private data:any[]

        private dataIndexed:any;



        setData(data){
            this.data= data;
            this.dataIndexed =_.indexBy(data,'id');
            this.breadcrumb.setData(data);
            this.breadcrumb.render();

           // this.renderRegions(data);
            //this.list = data.list;
            //this.indexed = data.indexed;
            //this.structure = data.structure;


           /*
            var ar = this.getChildrenType(7,this.structure[0]);

            console.log(this.structure);
            var out =[];

            for(var i= 0,n=ar.length;i<n;i++){
                var reg = ar[i];

                var cams =[];
                this.getChildrenType2(4,reg,cams)
                reg.campuses=cams;
                if(reg.id==1087){
                    this.allmaps = reg;
                    continue;
                }
                if(ar[i].campuses){
                  //  var str = this.renderRegion(ar[i],out.length)+ this.renderCampuses(ar[i].campuses,out.length);
                   // ar[i].view=$('<ul>').html(str);
                }
                //if(reg.campuses)
                    out.push(reg);
            }

            //console.log(out);
            this.regins = out;
            this.current = out;
            */

        }
    }

    export class BredCrombs{
        private current:any[]
        data:any[];
        constructor(private view:JQuery){
            view.hide();
        }
        show(speed):void{
            this.view.show(speed);
        }
        hide(speed):void{
            this.view.hide(speed);
        }
        setData(data:any[]):void{
            this.data=data;
            this.current=data;
        }
        selectItem(id:number){
            if(!id) id=0;
                this.view.find('.selected').removeClass('selected');
                this.view.find('[data-id='+id+']').addClass('selected');
        }
        private renderItem(obj:any,i:number):string{
           // var out='';
            return '<a href="#world/'+obj.id+'/'+obj.name+'" class="item" data-id="'+obj.id+'" >'+ obj.name +'</a>';
        }
        render(){
            var ar=this.current;
            var out='<a href="#world" class="item selected" data-id="0" >ALL</a>'
            for(var i=0,n=ar.length;i<n;i++) out+=this.renderItem(ar[i],i);
           this.view.html(out);
            this.view.fadeIn();

        }
    }

}