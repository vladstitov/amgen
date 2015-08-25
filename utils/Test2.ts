/**
 * Created by Vlad on 8/18/2015.
 */
    ///<reference path="../libs/typings/jquery.d.ts" />
class Test2{
    private prefixedTransform:string;
    viewPort:HTMLElement;
    building:HTMLElement;
    posX:number=0;
    posY:number=0;
  ////  currentRotation:number=0;
   // currentScale:number=1;

    tools:Tools;
    touch:TouchController;

    style:CSSStyleDeclaration;
    constructor(){
        if('transform' in document.body.style){
            this.prefixedTransform='transform';
        }else if('webkitTransform' in document.body.style){
            this.prefixedTransform='webkitTransform';
        }
        this.building = document.getElementById('Building')
        this.viewPort = document.getElementById('ViewPort');

        this.style = window.getComputedStyle(this.building,null);
           // this.startTimer();
        this.tools = new Tools();
        this.tools.onChange = ()=>this.onToolsChage();
        this.touch = new TouchController();
        this.touch.onMoveStart=()=>this.onMoveStart();
        this.touch.onMoveEnd = ()=>this.onMoveEnd();
        this.touch.onGestStart =()=>this.onGestStart();
        this.touch.onGestStop =()=>this.onGestStop();
       // this.touch.onMove=(dx,dy)=>this.
       this.onAnimationFrame(0);

    }

    oncenterChaged(x:number,y:number){
        $(this.building).css('transform-origin',  x+'px '+y+'px');
    }
    onToolsChage():void{
        console.log('change');
        this.oncenterChaged(50,50);
        this.curAng= this.tools.angle
        this.curScale = this.tools.scale;
        this.building.style[this.prefixedTransform]= 'translate(0,0) rotate('+this.curAng+'deg) scale('+this.curScale+') translateZ(0)';
    }

    onGestStop():void{
        this.isRS=false;
    }

    onGestStart():void{
        console.log(' onGestStart ');
        this.startAng = this.curAng;
        this.startScale = this.curScale;
        this.isRS=true;
    }

    onMoveEnd():void{
        this.isPoz=false;
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



    private matrixToArray(str:string):string[] {
        return str.split('(')[1].split(')')[0].split(',');
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
           this.viewPort.style[this.prefixedTransform]= 'translate('+this.posX+'px,'+this.posY+'px) rotate(0) scale(1) translateZ(0)';
       }

        if(this.isRS){
            this.calcZR();
            this.building.style[this.prefixedTransform]= 'translate(0,0) rotate('+this.curAng+'deg) scale('+this.curScale+') translateZ(0)';
        }

      // var ar= this.matrixToArray(this.style.getPropertyValue(this.prefixedTransform));
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

    private handleGesture(x1:number,y1:number,x2:number,y2:number):void{

        var dx = x2 - x1;
        var dy = y2 - y1;
        this.centerX=(x2+x1)/2;
        this.centerY = (y1+y2)/2;
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