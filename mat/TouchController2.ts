/**
 * Created by Vlad on 8/28/2015.
 */
    ///<reference path="Test2.ts" />
module ui {
  export  class TouchController2 {


        private startX:number = 0;
        private startY:number = 0;

        private active:boolean;
        private startDist:number;
        private startAng:number;

        dist:number = 0;
        ang:number = 0;

        moveX:number = 0;
        moveY:number = 0;
        centerX:number = 0;
        centerY:number = 0;

        onMove:Function;
        onMoveStart:Function;
        onMoveEnd:Function;

        onGestStop:Function;
        onGestStart:Function;
        onGest:Function

        isMoving:boolean;
        isGestur:boolean;




        onCenterChanged:Function;


      moveDist:number

      prevX:number;
      prevY:number;
      private dx:number;
      private dy:number;


        private handleMove(x:number, y:number):void {
            if (!this.isMoving) {
                if (this.isGestur)this.stopGestures();
                this.isMoving = true;
                this.startX = x;
                this.startY = y;
                this.moveX = 0;
                this.moveY = 0;
                this.prevX=x;
                this.prevY=y;
                if (this.onMoveStart)this.onMoveStart();
            } else {
                this.moveX = x - this.startX;
                this.moveY = y - this.startY;
                var dx = x - this.prevX;
                var dy = y - this.prevY;

                this.prevX=x;
                this.prevY=y;
                this.moveDist =  Math.sqrt(dx * dx + dy * dy);
                this.dx=dx;
                this.dy=dy;

                if (this.onMove)this.onMove(this.moveX, this.moveY);
            }


            //// console.log(this.moveX+'  '+this.moveY);

        }

        private stopMoving():void {
            this.isMoving = false;
            if (this.onMoveEnd)this.onMoveEnd();
        }

        private stopGestures():void {
            this.isGestur = false;
            if (this.onGestStop) this.onGestStop();
        }

        private setCenter(x:number, y:number) {
            // if(Math.abs(this.centerX-x) + Math.abs(this.centerY+y)>10){
            this.centerX = x;
            this.centerY = y;
            //}

        }

        private handleGesture(x1:number, y1:number, x2:number, y2:number):void {

            var dx = x2 - x1;
            var dy = y2 - y1;
            this.setCenter((x2 + x1) / 2, (y1 + y2) / 2);
            var dist = Math.sqrt(dx * dx + dy * dy);
            var ang = Math.atan2(dy, dx) * 57.2957795;

            if (!this.isGestur) {
                if (this.isMoving) {
                    this.stopMoving();
                    return;
                }
                this.startDist = dist;
                this.startAng = ang;
                this.isGestur = true;
                this.ang = 0;
                this.dist = 0;
                if (this.onGestStart)this.onGestStart();
            } else {
                this.dist = dist - this.startDist;
                this.ang = ang - this.startAng;
                if (this.onGest)this.onGest(this.dist, this.ang);
            }


        }

        private onTouchMove(evt) {
            evt.preventDefault();
            if (evt.touches.length == 1)this.handleMove(evt.touches[0].clientX, evt.touches[0].clientY);
            else if (evt.touches.length == 2)this.handleGesture(evt.touches[0].clientX, evt.touches[0].clientY, evt.touches[1].clientX, evt.touches[1].clientY);

        }

      animationFrame():void{

        if(this.isAct) requestAnimationFrame(()=>this.animationFrame());
      }

      start():void{
         if(!this.isAct) requestAnimationFrame(()=>this.animationFrame());
          this.isAct = true;
      }

      private isAct:boolean
      stop():void{
          this.isAct = false

      }


        constructor() {
            document.getElementById('Building').addEventListener('touchstart', (evt)=>this.addListeners(evt));
            document.getElementById('Building').addEventListener('touchstart', (evt)=>this.start());
        }


      setTimedInterval(callback, delay, timeout,onEnd){
          var id=window.setInterval(callback, delay);
          window.setTimeout(function(){
              window.clearInterval(id);
              onEnd()
          }, timeout);
      }


      private interval:number

          private keepMoving(x:number,y:number):void{
            // console.log('keepMoving '+x+'   '+y);
              this.moveX+=x;
              this.moveY+=y;
          }



        private onTouchEnd():void {
            if (this.isMoving){
                console.log(this.moveDist);
                if(this.moveDist>3){
                    var rot:number = Math.atan2(this.moveY,this.moveX);// * 57.2957795;
                    console.log('   angle     '+(rot*57));
                    var endX= (this.moveDist*5) * Math.cos(rot);
                    var endY = (this.moveDist*5) * Math.sin(rot);
                   // console.log('endX  '+ );

                    this.setTimedInterval(()=>this.keepMoving(endX/10,endY/10),100,1000,()=>this.stopMoving());


                }
                else this.stopMoving();
            }
            if (this.isGestur)this.stopGestures();


        }

        private addListeners(evt):void {
            var that = this;
            var onTouchMove = function (evt) {
                that.onTouchMove(evt);
            }

            var onTouchEnd = function (evt) {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                document.removeEventListener('touchcancel', onTouchEnd);
                that.onTouchEnd();
                that.active = false;
            }

            this.active = true;
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
            document.addEventListener('touchcancel', onTouchEnd);
        }
    }
}