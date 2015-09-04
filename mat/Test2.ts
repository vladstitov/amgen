/**
 * Created by Vlad on 8/18/2015.
 */
    ///<reference path="../libs/typings/jquery.d.ts" />
    ///<reference path="Matrix2D.ts" />
    ///<reference path="Tools.ts" />
    ///<reference path="TouchController.ts" />
    ///<reference path="TouchController2.ts" />

class Test2{
    private prefixedTransform:string;
   // viewPort:HTMLElement;
    posX:number=0;
    posY:number=0;
    tools:ui.Tools;
    touch:ui.TouchController2;
    building: view.DisplayObject;
    dots:view.DisplayObject;
    constructor(){

        this.building = new view.DisplayObject(document.getElementById('Building'),'webkitTransform','webkitTransformOrigin');
        this.building.drawCenter();
        var ar:any[]=[{x:100,y:100},{x:800,y:100},{x:800,y:800},{x:100,y:800}]

        for (var i = 0, n = ar.length; i < n; i++) {
            var p = ar[i];
            $('<dot>').addClass('dot').text('x: '+p.x+' y: '+p.y).css({left:p.x,top:p.y}).appendTo(this.building.$view);

        }

       // this.viewPort = document.getElementById('ViewPort');
        this.dots = new view.DisplayObject(document.getElementById('Dots'),'webkitTransform','webkitTransformOrigin');

      $('#Content').click((evt)=>this.onViewPortClick(evt));
        this.tools = new ui.Tools();
        this.tools.onChange = ()=>this.onToolsChage();
        this.touch = new ui.TouchController2();
        this.touch.onMoveStart=()=>this.onMoveStart();
        this.touch.onMoveEnd = ()=>this.onMoveEnd();
        this.touch.onGestStart =()=>this.onGestStart();
        this.touch.onGestStop =()=>this.onGestStop();
        this.curAng=0;
        this.curScale=1;
        this.setCenter(200,200);
    }

    dot100:JQuery

    onViewPortClick(evt:JQueryEventObject):void{
            var x:number =evt.clientX;
            var y:number =evt.clientY;
        console.log('onViewPortClick x: '+x+'  y: '+y);
        this.setCenter(x,y);
    }

    setCenter(x:number,y:number){
        var p = this.building.globalToLocal(x,y);
        console.log(p);
        this.building.setCenter(x,y).applyReg();
       // this.building.style['webkitTransformOrigin']=  p.x+'px '+p.y+'px';
       // $(this.building).css('transform-origin', p.x+'px '+p.y+'px');
    }

    onToolsChage():void{
        //console.log('change');
        this.curAng= this.tools.angle
        this.curScale = this.tools.scale;
        this.building.setAngle(this.curAng);
        this.building.setScale(this.curScale).applyRS();
       var p = this.building.localToGlobal(500,500);
       // console.log(p);
       // this.dot100.css({left:p.x,top:p.y});
    }

    onGestStop():void{
        this.isRS=false;
    }

    onGestStart():void{
        console.log(' onGestStart ');
        this.startAng = this.curAng;
        this.startScale = this.curScale;
        var cX = this.touch.centerX;
        var cy = this.touch.centerY;
        this.setCenter(cX,cy);

        this.isRS=true;
    }

    onMoveEnd():void{
        this.isPoz=false
    }

    private startX:number=0;
    private startY:number=0;



    private startScale:number=1;
    private startAng:number=0;
    private curScale:number=1;
    private curAng:number=0;

    onMoveStart():void{
        this.startX = this.posX;
        this.startY = this.posY;
        this.isPoz=true;
    }


    private total:number=0;
    private last:number=0;
    private count:number=0;

  cFPS(){
    var now = new Date().getTime();
    var fps = 1000/(now-this.last);
    this.total+=fps;
    this.last=now;
    this.count++
        if(this.count==30){
            this.count=0;
            $('#FPS').text((this.total/30).toFixed())
            this.total=0;

        }
    }


    onAnimationFrame(st:number){
        this.cFPS();
        requestAnimationFrame((st)=>this.onAnimationFrame(st));
        this.render();
    }




    timer:number;
    stopTimer():void{
        clearInterval(this.timer)
    }

   // startTimer():void{
     //   this.timer = setInterval(()=>this.render(),1000);
    //}

    isPoz:boolean;
    isRS:boolean;


    calcZR():void{
        this.curScale = this.startScale +((this.touch.dist*0.005)*this.curScale/5);
        this.curAng = this.startAng + this.touch.ang;
    }


    calcPosition():void{
            var gx =this.startX+this.touch.moveX;
            var gy=this.startY+this.touch.moveY;

            var dx = gx-this.posX;
            this.posX+=dx*0.1;
            var dy = gy-this.posY;
            this.posY+=dy*0.1;


    }


    render():void{
       if(this.isPoz){
           this.calcPosition();
         //  this.viewPort.style[this.prefixedTransform]= 'translate('+this.posX+'px,'+this.posY+'px) rotate(0) scale(1) translateZ(0)';
       }

        if(this.isRS){
            this.calcZR();
           // this.mCache=null;
            //this.building.style[this.prefixedTransform]= 'translate(0,0) rotate('+this.curAng+'deg) scale('+this.curScale+') translateZ(0)';
        }


    }
}






$(document).ready(function(){var test = new Test2();})