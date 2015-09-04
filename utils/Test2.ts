/**
 * Created by Vlad on 8/18/2015.
 */
    ///<reference path="../libs/typings/jquery.d.ts" />
    ///<reference path="Matrix2D.ts" />
class Test2{
    private prefixedTransform:string;
   // viewPort:HTMLElement;
    posX:number=0;
    posY:number=0;
    tools:Tools;
    touch:TouchController;
    building: view.DisplayObject;
    dots:view.DisplayObject;
    constructor(){

        this.building = new view.DisplayObject(document.getElementById('Building'),'webkitTransform','webkitTransformOrigin');


       // this.viewPort = document.getElementById('ViewPort');
        this.dots = new view.DisplayObject(document.getElementById('Dots'),'webkitTransform','webkitTransformOrigin');

      //  $(this.viewPort).click((evt)=>this.onViewPortClick(evt));
        this.tools = new Tools();
        this.tools.onChange = ()=>this.onToolsChage();
        this.touch = new TouchController();
        this.touch.onMoveStart=()=>this.onMoveStart();
        this.touch.onMoveEnd = ()=>this.onMoveEnd();
        this.touch.onGestStart =()=>this.onGestStart();
        this.touch.onGestStop =()=>this.onGestStop();
        this.curAng=0;
        this.curScale=1;
       // this.touch.onMove=(dx,dy)=>this.
        this.setCenter(200,200);
      //  this.dots.$view.offset({top:800,left:800});
     //  $('#Dots').offset({top:800,left:800})
        this.dot100 = $('<div>').addClass('dot').text('100x100').offset({left:100,top:100}).appendTo(this.dots.$view);

        var p = this.building.localToGlobal(100,100);
        console.log(p);

        this.dot100.css({top:p.y,left:p.x})


    }
    dot100:JQuery

    onViewPortClick(evt:JQueryEventObject):void{
            var x:number =evt.clientX;
            var y:number =evt.clientY;

     //  var  dot=$('<div>').addClass('dot').offset({left:p.x,top:p.y});

    // $(this.building).append(dot);
    }

    setCenter(x:number,y:number){
        x = x-this.posX;
        y = y-this.posY;

      //  var p={x:x,y:y};
     //   var m = this.invert(this.getMatrix());
     //   var p = this.transformPoint(x,y,m);
      //  console.log(m);
        this.building.setCenter(x,y).applyReg();
       // this.building.style['webkitTransformOrigin']=  p.x+'px '+p.y+'px';
       // $(this.building).css('transform-origin', p.x+'px '+p.y+'px');
    }

    onToolsChage():void{
        console.log('change');
        this.curAng= this.tools.angle
        this.curScale = this.tools.scale;
        this.building.setAngle(this.curAng);
        this.building.setScale(this.curScale).applyRS();
       var p = this.building.localToGlobal(500,500);
        console.log(p);
        this.dot100.css({left:p.x,top:p.y});
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

class TouchController{


    private startX:number=0;
    private startY:number=0;

    private active:boolean;
    private startDist:number;
    private startAng:number;

    dist:number=0;
    ang:number=0;

    moveX:number=0;
    moveY:number=0;
    centerX:number=0;
    centerY:number=0;

    onMove:Function;
    onMoveStart:Function;
    onMoveEnd:Function;

    onGestStop:Function;
    onGestStart:Function;
    onGest:Function

    isMoving:boolean;
    isGestur:boolean;



    onCenterChanged:Function;


    private handleMove(x:number,y:number):void{
        if(!this.isMoving){
            if(this.isGestur)this.stopGestures();
            this.isMoving=true;
            this.startX=x;
            this.startY=y;
            this.moveX=0;
            this.moveY=0;
            if(this.onMoveStart)this.onMoveStart();
        }else{
            this.moveX = x-this.startX;
            this.moveY = y-this.startY;
            if(this.onMove)this.onMove(this.moveX,this.moveY);
        }


       //// console.log(this.moveX+'  '+this.moveY);

    }

    private stopMoving():void{
        this.isMoving = false;
        if(this.onMoveEnd)this.onMoveEnd();
    }

    private stopGestures():void{
        this.isGestur= false;
        if(this.onGestStop) this.onGestStop();
    }

    private setCenter(x:number,y:number){
       // if(Math.abs(this.centerX-x) + Math.abs(this.centerY+y)>10){
            this.centerX=x;
            this.centerY=y;
        //}

    }
    private handleGesture(x1:number,y1:number,x2:number,y2:number):void{

        var dx = x2 - x1;
        var dy = y2 - y1;
        this.setCenter((x2+x1)/2,(y1+y2)/2);
        var dist = Math.sqrt(dx*dx+dy*dy);
        var ang = Math.atan2(dy,dx)*57.2957795;

       if(!this.isGestur){
           if(this.isMoving) {
               this.stopMoving();
               return;
           }
           this.startDist=dist;
           this.startAng = ang;
           this.isGestur=true;
           this.ang=0;
           this.dist=0;
           if(this.onGestStart)this.onGestStart();
       }else{
           this.dist = dist-this.startDist;
           this.ang = ang-this.startAng;
           if(this.onGest)this.onGest(this.dist,this.ang);
       }


    }

    private onTouchMove(evt){
        evt.preventDefault();
        if(evt.touches.length==1)this.handleMove(evt.touches[0].clientX,evt.touches[0].clientY);
        else if(evt.touches.length==2)this.handleGesture(evt.touches[0].clientX,evt.touches[0].clientY,evt.touches[1].clientX,evt.touches[1].clientY);

    }


    constructor(){
        document.getElementById('Building').addEventListener('touchstart', (evt)=>this.addListeners(evt));
    }

    private onTouchEnd():void{
        if(this.isMoving)this.stopMoving();
        if(this.isGestur)this.stopGestures();
    }
    private addListeners(evt):void{
        var that = this;
        var  onTouchMove = function(evt){
            that.onTouchMove(evt);
        }

        var onTouchEnd = function(evt){
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            document.removeEventListener('touchcancel', onTouchEnd);
            that.onTouchEnd();
            that.active=false;
        }

        this.active=true;
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
        document.addEventListener('touchcancel', onTouchEnd);
    }
}

class Tools {

    angle:number=0;
    scale:number=1;
    skew:number=0;
    onChange:Function;
    private $rotate:JQuery
    private $scale:JQuery;
    private $skew:JQuery;

    constructor(){
        var tools= $('#tools');


       this.$rotate = tools.find('[data-id=rotate]:first').on('change',()=>{
           this.angle=(((this.$rotate.val()-50)/50)*360);
           if(this.onChange)this.onChange();
        })

        this.$scale  =  tools.find('[data-id=scale]:first').on('change',()=>{
            var v =  ((this.$scale.val())/50);
            if(v<0.2) v=0.2;
            this.scale=v;
            if(this.onChange)this.onChange();
        })

        this.$skew = tools.find('[data-id=lay]:first').on('change',()=>{
            var v= (this.$skew.val()-50)/50;
           this.skew=v;
            if(this.onChange)this.onChange();
        })
    }


}



$(document).ready(function(){var test = new Test2();})