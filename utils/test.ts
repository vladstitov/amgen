/**
 * Created by Vlad on 7/15/2015.
 */
    ///<reference path="../libs/typings/jquery.d.ts" />
    ///<reference path="../libs/typings/svgjs.d.ts" />
    ///<reference path="../libs/typings/greensock.d.ts" />
    class Test{
        c:Building;

        chkAll:JQuery

        private onFloorClick(evt:JQueryEventObject):void{
            console.log(evt);
           // this.c.setDelta(evt.offsetX,evt.offsetY);
            this.c.refreshDots();
        }

        private showDots(isAll:boolean):void{
           // var ar =this.
          //  for (var i = 0, n = ar.length; i < n; i++) {
            //    var vo = ar[i];

           // }
        }
        private onCheckAllChange():void{
           // console.log(this.chkAll.prop('checked'));
            this.c.checkForCollision();
            this.showDots(this.chkAll.prop('checked'));
        }

        constructor(){
            var tools= $('#tools');
            this.chkAll = $('#chkAll').on('change',()=>this.onCheckAllChange())
            var c = new Building($('#Building'));

            c.addAxis( new Axis($('#Axis')));
            c.addAxis( new Axis($('#Axis2')));
            this.c=c;
            var b:Axis = this.c.getAxis(1);
            var dots:Dot[]=[];
          //  var dot = new Dot(' dot 100x100',new Point(100,100));
           // dot.offset(-200,-300);
           // b.getFloor().on('click',(evt)=>this.onFloorClick(evt));

           // dot.setPos(b.transformPoint(dot.p));
            var pozs=[{"x":215.17145447432995,"y":212.76172678917646},{"x":56.142378225922585,"y":265.20573887974024},{"x":730.9521438553929,"y":608.140772394836},{"x":782.8789498656988,"y":177.1478684619069},{"x":381.6274179145694,"y":589.02433142066},{"x":21.496057510375977,"y":325.3415632992983},{"x":98.4149869531393,"y":77.45092883706093},{"x":295.6329019740224,"y":628.1002461910248},{"x":514.7975726053119,"y":325.2354299649596},{"x":73.39946758002043,"y":87.24315669387579},{"x":3.154577501118183,"y":7.934784330427647},{"x":661.1742189154029,"y":87.06492688506842},{"x":283.5581509396434,"y":558.9896366000175},{"x":166.29401128739119,"y":657.5469741597772},{"x":363.0776338279247,"y":0.2620251849293709},{"x":721.845443174243,"y":346.03761434555054},{"x":768.4383545070887,"y":535.2868840098381},{"x":79.52180933207273,"y":231.59336410462856},{"x":421.9799358397722,"y":230.70451095700264},{"x":449.42026175558567,"y":599.0188645198941},{"x":296.1183352395892,"y":775.3022788092494},{"x":213.69051281362772,"y":137.29318529367447},{"x":242.2224096953869,"y":718.5798559337854},{"x":47.82835468649864,"y":121.1811589077115},{"x":74.13299195468426,"y":436.66759207844734},{"x":158.99365041404963,"y":208.4112834185362},{"x":87.66234237700701,"y":543.5546413064003},{"x":95.03505080938339,"y":771.7841187492013},{"x":771.6460132971406,"y":136.81608345359564},{"x":392.01107304543257,"y":676.8729563802481}];


            for (var i = 0, n = 300; i < n; i++) {
                var x= Math.random()*800;
              //  var x= pozs[i].x;//Math.random()*800;
                var y = Math.random()*800;
              // var y = pozs[i].y;// Math.random()*800;
              //  pozs.push({x:x,y:y});
                dots.push(new Dot(i,'D'+i+' x:'+x+' y:'+y,new Point(x,y)));
            }

           // dots.push(new Dot(' dot 100x100',new Point(100,100)));
           // dots.push(new Dot('dot 800x800',new Point(800,800)));
            //dots.push(new Dot('dot 100x800',new Point(100,800)));
            //dots.push(new Dot('dot 800x100',new Point(800,100)));
           // dots.push(new Dot('dot000 2',b.transformPoint(new Point(100-200,100-300))));
            //dots.push(new Dot('dot000 3',b.transformPoint(new Point(100-200,800-300))));
           // dots.push(new Dot('dot000 4',b.transformPoint(new Point(800-200,100-300))));

            var ar =dots
            for (var i = 0, n = ar.length; i < n; i++){
                ar[i].setMatrix(b.m);
            }

            c.setDots(dots);
          // c.setOffset(500,500);
           // c.setDelta(0,100,0);
            c.setDelta(0,0,0);
            c.screenx=450;
            c.screeny=450;
           c.setCenter(450,450);
            c.setDotsCenter(450,450);

           // c.setCenter(200,200);
            c.refreshDots();
            var that=this;

            var rotate= tools.find('[data-id=rotate]:first').on('change',function(){
                var v = ((rotate.val()-50)/50);
                c.rotate(v);

            })

            var scale =  tools.find('[data-id=scale]:first').on('change',function(){
              //  console.log( scale.val());
                var v =  ((scale.val())/10);
                if(v<0.2) v=0.2;
                c.scale(v);
               // that.refreshDots();
            })

            var skew = tools.find('[data-id=lay]:first').on('change',function(){
               var v= (skew.val()-50)/50;

    //console.log(v);
                c.setDelta(0,v*200,0);
               c.skew(v);
               // c.refreshDots();
            })
            console.log(rotate);
        }
    }

    class Building{
        b:Axis;
        axs:Axis[]=[];
        dots:Dot[];
        c_x:number=0;
        c_y:number=0;
        screenx:number=0;
        screeny:number=0;

        refreshDots(){
          //  var m=this.b.m;
            var ar =this.dots
            for (var i = 0, n = ar.length; i < n; i++)    ar[i].refresh();
            this.checkForCollision();
                //dot.setPos(m.transformPoint(dot.p.x,dot.p.y));

        }

        checkForCollision():void{
            var ar =this.dots
            for (var i = 0, n = ar.length; i < n; i++)    ar[i].checkCollision();

        }

        rotate(v:number){
           // this.b.rotate(v);
            var ar =this.axs
            for (var i = 0, n = ar.length; i < n; i++)   ar[i].rotate(v);
            this.refreshDots();
        }

        scale(v:number):void{
            var ar =this.axs
            for (var i = 0, n = ar.length; i < n; i++)   ar[i].scale(v);
            //this.b.scale(v);
            this.refreshDots();
        }

        skew(v:number):void{
            var ar =this.axs
            for (var i = 0, n = ar.length; i < n; i++)   ar[i].skew(v);
           // this.b.skew(v);
            this.refreshDots();
        }

        addAxis(b:Axis):void{
            this.b=b;
            this.axs.push(b);
        }

        getAxis(i:number):Axis{
            return this.axs[i];
        }

        setDelta(x:number,y:number,i:number):void{
            this.axs[i].setDelta(x,y);
        }


        setCenter(x:number,y:number):void{

          //  this.view.css('left',x+'px').css('top',y+'px');
            this.view.css('left',x+'px').css('top',y+'px');
           // this.viewport.css('left',this.screenx-x+'px').css('top',this.screeny-y+'px');
            this.c_x=x;
            this.c_y=y;
           // this.b.setCenter(0-x,0-y);
            var ar =this.axs;
            for (var i = 0, n = ar.length; i < n; i++)  ar[i].setCenter(0-x,0-y);

        }

        setDotsCenter(x:number,y:number):void{
            var ar:Dot[] = this.dots;
            for (var i = 0, n = ar.length; i < n; i++)   ar[i].setCenter(0-x,0-y);
        }

        setDots(d:Dot[]):void{
            this.dots=d;
            var ar =d;
            var cont = $('#overlay');

           var svg:JQuery = $('<div>').attr('id','Draw').appendTo(cont);
            var dots:JQuery = $('<div>').attr('id','Dots').appendTo(cont);
            var draw = SVG('Draw').size(800, 800);
            for (var i = 0, n = ar.length; i < n; i++) {
                ar[i].setDraw(draw);
                ar[i].addTo(dots);
                if(i<n-1)ar[i].setOthers(ar.slice(i+1));
            }
            var draw = SVG('Draw').size(800, 800);

        }

        private viewport:JQuery

        scaleRange:number[];
        isScale:boolean=false;
        constructor(public view:JQuery){
          ///  console.log(view);
            var sc:number[]=[]
            for(var i=1;i<100;i++){
                sc.push(i/10);
            }


            this.scaleRange=sc;

            this.scalePoz=9;
           // console.log(sc);
            this.viewport=view.parent();
            //this.parent.on('tap')
        }

        addListeners():void{
            this.viewport.on('mousedown',(evt)=>this.onMouseDown(evt));
            this.viewport.on('mouseup',(evt)=>this.onMouseUp(evt));
            this.viewport.on('touchstart',(evt)=>this.onTouchStart(evt));
            this.viewport.on('touchmove',(evt)=>this.onTouchMove(evt));
            document.removeEventListener('touchend', (evt)=>this.onTouchEnd(evt));
        }
        private onTouchEnd(evt:any){
            this.isGesture = false;
        }

        private startx:number;
        private starty:number;
        private prevx:number;
        private prevy:number;

        private onTouchStart(evt):void{
            evt.preventDefault();
            var touch = evt.originalEvent.touches[0];
            this.onPointerDown(touch);
            //this.v_x = this.viewport.offset().left;
           // this.v_y = this.viewport.offset().top;

           // this.startx = touch.clientX;
           // this.starty = touch.clientY;
           // console.log(this.v_x,this.v_y);
         //   TweenMax.to(document.getElementById('ViewPort'),1,{x:touch.clientX,y:touch.clientY});
//console.log(evt);
           // this.onMouseDown();
        }

        private v_x:number;
        private v_y:number;

        private new_x:number=0;
        private new_y:number=0;
      //  private old_x:number=0;
       // private old_y:number=0;
        private cur_x:number=0;
        private cur_y:number=0;
        private d_x:number=0;
        private d_y:number=0;

        private newPos(x:number,y:number):void{
            this.new_x=x;
            this.new_y=y;
        }


        private moveToCur():void{

           this.viewport.css('transform','translate('+this.cur_x+'px, '+this.cur_y+'px)');

        }
        private interv:number=0;
        private moveToNew():void{
            if(Math.abs(this.new_x-this.cur_x)<5){
                clearInterval(this.interv);
                console.log('moveToNew clearInterval');
                this.interv=0;
            }
            console.log('moveToNew  this.cur_x '+this.cur_x);
            this.cur_x+=this.d_x;
            this.cur_y+=this.d_y;
            this.moveToCur();

        }

        private moveTo(){
            if(Math.abs(this.prevx-this.new_x)+ Math.abs(this.prevy-this.new_y)<10)  return;
            this.prevx = this.new_x;
            this.prevy = this.new_y;
            TweenMax.to(this.viewport,0.3,{x:this.new_x,y:this.new_y});
        }

        private isGesture:boolean=false;
        private touchStartDistance:number=0;
        private touchStartAngle:number=0;
        private startScale:number=0;
        private startAngle:number=0;
        private currentScale:number=1;
        private currentRotation:number=0;
        private minScale:number=0.2;
        private maxScale:number=20;

        private handleGestureStart(x1:number, y1:number, x2:number, y2:number){
            this.isGesture = true;
            var dx = x2 - x1;
            var dy = y2 - y1;
            this.touchStartDistance=Math.sqrt(dx*dx+dy*dy);
            this.touchStartAngle=Math.atan2(dy,dx);
            this.startScale=this.currentScale;
            this.startAngle=this.currentRotation;
         }

       private  prevDist:number=0;
       private  scaleDelta:number=0;
        private scalePoz:number = 9;
        private curScalePos:number = 9;

        private timer:number=0;


        private prevScale:number;
        private setPositions():void{
            if(this.isScale){

                if(this.currentScale<this.minScale) this.currentScale=this.minScale;
                if(this.currentScale>this.maxScale) this.currentScale=this.maxScale;
                if(Math.abs(this.prevScale=this.currentScale)>0.1){
                    this.scale(this.currentScale);
                    this.prevScale=this.currentScale;
                }

                this.isScale=false;
            }

        }
        private startTimer():void{
            if(this.timer===0)this.timer = setInterval(()=>this.setPositions(),1000);
        }
        private handleGesture(x1:number,y1:number,x2:number,y2:number):void{
            if(!this.isGesture){
                this.handleGestureStart(x1,y1,x2,y2);
                return;
            }
            var dx = x2 - x1;
            var dy = y2 - y1;

            var touchDistance=Math.sqrt(dx*dx+dy*dy);
            var scalePixelChange = touchDistance-this.touchStartDistance;

           // console.log(scalePixelChange);
           this.currentScale=this.startScale + scalePixelChange*0.01;
            this.isScale=true;
            this.startTimer();
            console.log('currentScale '+this.currentScale);
            this.scaleDelta=Math.round(touchDistance-this.prevDist);
            //console.log(this.scalePoz);
           // if(this.scaleDelta !==0){
             //   this.scalePoz += Math.round(this.scaleDelta/10);
              //  if(!this.isScale){
                //    this.isScale=true;
                //    this.onAnimationFrame(0);
              //  }
           // }
           // this.prevDist=touchDistance;
           /// console.log('this.scalePoz '+this.scalePoz);
            var touchAngle=Math.atan2(dy,dx);
           //
           // var angleChange = touchAngle - this.touchStartAngle;
           // console.log(this.scaleDelta);


            //calculate how much this should affect the actual object
          //

           // this.currentRotation=this.startAngle+(angleChange*180/Math.PI);
           // if(this.currentScale<this.minScale) this.currentScale=this.minScale;
          //  if(this.currentScale>this.maxScale) this.currentScale=this.maxScale;
            //this.scale(this.currentScale);
        }

        pStamp:number=0;
        alTime:number;
        count:number=11;


        private onAnimationFrame(stamp) {

            this.count++;
            if(this.count>10){
                this.count=0;
                var total= (stamp - this.pStamp)/10;
                if(total>10)total=1000/total;
                console.log('total  '+total);
                this.pStamp=stamp;
            }


           // console.log('stamp '+stamp);
            if(this.scalePoz<0)this.scalePoz = 0;
            if(this.scalePoz>=this.scaleRange.length) this.scalePoz = this.scaleRange.length-1;

            if(this.curScalePos > this.scalePoz)this.curScalePos--;
            else if(this.curScalePos < this.scalePoz)this.curScalePos++;
            else this.isScale =  false;

          //  console.log('onAnimationFrame  '+this.isScale+' this.curScalePos  '+this.curScalePos+'  this.scalePoz '+this.scalePoz);
            if(this.isScale){
                var scv:number=this.scaleRange[this.curScalePos];
              //  console.log(scv);
                    this.scale(scv);
                    requestAnimationFrame(this.onAnimationFrame.bind(this));

            }


        }
        private onTouchMove(evt):void{
            evt.preventDefault();

            var ts = evt.originalEvent.touches;
            if(ts.length>1)this.handleGesture(ts[0].clientX,ts[0].clientY,ts[1].clientX,ts[1].clientY);
            return;
            if(ts.length===0) return;
            if(ts.length ===1 )   this.onPointerMove(ts[0]);
            else this.handleGesture(ts[0].clientX,ts[0].clientY,ts[1].clientX,ts[1].clientY);

        }


        private onPointerMove(evt):void{
            var dx:number= evt.clientX-this.startx;
            var dy:number= evt.clientY-this.starty;
            this.new_x= this.startcx+dx;
            this.new_y=this.startcy+dy;
            this.moveTo();
        }

        private startcx:number=0;
        private startcy:number=0;
        private mouseDeltaX:number;
        private mouseDeltaY:number;


        private onMouseDown(evt:JQueryEventObject):void {
            this.view.on('mousemove', (evt)=>this.onPointerMove(evt));
            this.onPointerDown(evt);
        }
        private onPointerDown(evt:JQueryEventObject):void{
            this.startx = evt.clientX;
            this.starty = evt.clientY;
            this.startcx = this.new_x;
            this.startcy = this.new_y;
        }

        private c_s_x:number;
       private c_s_y:number;



        private deltaOffset(dx:number,dy:number):void{
            this.setCenter(this.c_s_x+dx, this.c_s_y+dy);
            this.setDotsCenter(this.c_x,this.c_y);
           this.refreshDots();
        }
        private addOffset(x:number,y:number):void{
            //console.log('add offset '+x+' '+y);
            this.setCenter(this.c_x+x, this.c_y+y);
            this.setDotsCenter(this.c_x,this.c_y);
            this.refreshDots();

        }





        private onMouseUp(evt):void{
            this.view.off('mousemove');
        }
       // private onClick(evt:JQueryEventObject):void{
        //    console.log(evt);
       // }

        setPos(x:number,y:number):void{

        }
    }


class Dot{
    view:JQuery;
    m:Matrix;
    c_x:number;
    c_y:number;
    x:number;
    y:number;
    px:number;
    py:number;
    lx:number;
    ly:number;
    h:number;
    w:number
    l_dx:number;
    l_dy:number;
    isCollided:boolean;
    rect:svgjs.Element
    others:Dot[];
    text:JQuery;
    id:number;

    constructor(id,label:string,public p:Point){
        this.id=id
        this.text= $('<div>').text(label)
        this.view=$('<div>').addClass('dot').append(this.text);
        this.setPos(p);

    }

    setDraw(svg:svgjs.Element):void{
       // this.rect = svg.rect(10,10);
    }

    setOthers(ar:Dot[]):void{
        this.others=ar;

    }

    setHit(id:number):void{
        if(!this.isCollided) {
            this.isCollided = true;
            this.view.addClass('colide');
            this.text.text(' D ' + this.id + ' hitted by  ' + id + ' ' + this.x.toFixed() + ' ' + this.y.toFixed() + ' ' + this.w.toFixed() + ' ' + this.h.toFixed());
        }
    }

    resetHit():void{
        if(this.isCollided){
            this.text.text(' D '+this.id+' no collision '+this.x.toFixed()+' '+this.y.toFixed()+' '+this.w.toFixed()+' '+this.h.toFixed());
            this.view.removeClass('colide');
            this.isCollided = false;
        }
    }

    addTo(cont:JQuery):void{
        cont.append(this.view);
      //  console.log(this.x+'  '+this.y);
        var rec =this.view.children()[0].getBoundingClientRect();
        this.h = rec.height;
        this.w = rec.width;
        this.l_dx=(-this.w/2);
        this.l_dy=(-this.h-5);
        this.text.width(this.w);
        this.text.text(' D '+this.id+' - '+this.x.toFixed()+' '+this.y.toFixed()+' '+this.w.toFixed()+' '+this.h.toFixed());
        this.text.css('transform','translate('+this.l_dx+'px,'+this.l_dy+'px)');
        //this.view.width(this.w);
        //this.view.height(this.h);

       // this.rect.attr({'width':this.w,'height':this.h,'fill':'#fff'});



       // console.log(this.view.children()[0].getBoundingClientRect());

    }

    checkCollision(){
        if(!this.others) return;
        var ar = this.others
        for (var i = 0, n = ar.length; i < n; i++) {
            if(ar[i].isCollided) continue;
            if(this.isCollide(ar[i])){
                ar[i].setHit(this.id);
                this.text.text(' D'+this.id+' colided with D'+ar[i].id+' '+this.x.toFixed()+' '+this.y.toFixed()+' '+this.w.toFixed()+' '+this.h.toFixed());
                this.view.addClass('colide');
                this.isCollided = true;
                break
            }

        }
        //if(i==n && this.isCollide) {


      //  }
    }
    isCollide(dot:Dot):boolean{
        return (this.x<dot.x+dot.w && this.x+this.w>dot.x && this.y<dot.y+dot.h && this.h+this.y>dot.y)
    }
    refresh(){
        this.resetHit();
        this.setPos(this.m.transformPoint((this.p.x+this.c_x),(this.p.y+this.c_y)));
    }
    setMatrix(m:Matrix):void{
        this.m=m;
    }

    setCenter(x:number,y:number):void{
       // this.p.x+=x;
       // this.p.y+=y;
        this.c_x=x;
        this.c_y=y;
    }

    setPos(p:Point):void{
        this.lx = p.x+this.l_dx;
        this.ly = p.y+this.l_dy;
        this.px = p.x;
        this.py = p.y;
        this.x = p.x; //-(this.w/2);
        this.y = p.y; //-(this.h);

       // if(this.rect){
          //  this.rect.attr('x', this.x);
           // this.rect.attr('y', this.y);
       // }

   // this.view.css({left:p.x,top:p.y});
        this.view.css('transform','translate('+this.x+'px,'+this.y+'px)');
    }
}


class Axis{
    m:Matrix
    r:number=0;
    s:number=1;
    floor:JQuery;
    //offsetx:number;
    //offsety:number;


    getFloor():JQuery{
        return this.floor;
    }
    constructor(private view:JQuery){
        $('<div>').addClass('zero').appendTo(view);
        this.m= new Matrix(1,0,0,1,0,0);
       this.apply();
        this.floor = view.find('.floor:first');
    }

    setCenter(x:number,y:number){
        //this.offsetx=x;
       // this.offsety=y;
       this.floor.css('left',x+'px').css('top',y+'px');
    }
    cloneM():Matrix{
        return this.m.clone();
    }
   transformPoint(p:Point):Point {
      return this.m.transformPoint(p.x,p.y);
    }

    addDelta(x:number,y:number):void{
        var m:Matrix= this.m;
        m.tx+=x;
        m.ty+=y;
        this.apply();
    }

    setDelta(x:number,y:number):void{
        var m:Matrix= this.m;
        m.tx=x;
        m.ty=y;
        this.apply();
    }
    skew(v):void{
        var sx:number =   -v
        var m:Matrix= this.m;
        console.log(sx);
       var sc = (1-Math.abs(v));
        console.log(sc);
        m.c=sx;
        m.d=sc;
        this.apply();
    }

    rotate(ang:number){
       // console.log('rotate '+(ang)+ ' now '+ this.r);
        var d = ang-this.r;
      ///  console.log('rotate '+(d));

        var m:Matrix= this.m;
        var a= d*Math.PI;
        var cos:number = Math.cos(a);
        var sin:number = Math.sin(a);
        var a1 = m.a;
        var b1 = m.b;
        m.a = a1*cos+m.c*sin;
        m.b = b1*cos+m.d*sin;
        m.c = -a1*sin+m.c*cos;
        m.d = -b1*sin+m.d*cos;
        this.m=m;
        this.r=ang;
        this.apply();
    }

    scale(v:number):void{
//console.log('scale '+v);

        var x=v/this.s;
        var y=v/this.s;
        var m:Matrix= this.m;//new Matrix()

            m.a *= x;
            m.b *= x;
            m.c *= y;
            m.d *= y;
           // m.tx *= x;
          // m.ty *= y;
        this.s=v;
        this.m=m;
        this.apply();

    }

    apply():void{
        var ar  = this.m.get();
      //  console.log(ar);
        this.view.css('transform','matrix('+ar+')');
    }
}

class Point{
    constructor(public x:number,public y:number){

    }

}

 class Matrix{
     constructor(public a,public b,public c, public d:number,public tx:number,public ty:number){
     }

    get():number[]{return [this.a,this.b,this.c,this.d,this.tx,this.ty]}


     clone = function():Matrix {
        return new Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
    }

     transformPoint(x:number,y:number):Point {
         var  pt:Point =  new Point(0,0);
         var m:Matrix= this;
         pt.x = x * m.a + y * m.c + m.tx;
         pt.y = (x * m.b + y * m.d + m.ty);
         return pt;
     }

     append (a, b, c, d, tx, ty):Matrix {
         var a1 = this.a;
         var b1 = this.b;
         var c1 = this.c;
         var d1 = this.d;
         if (a != 1 || b != 0 || c != 0 || d != 1) {
             this.a  = a1*a+c1*b;
             this.b  = b1*a+d1*b;
             this.c  = a1*c+c1*d;
             this.d  = b1*c+d1*d;
         }
         this.tx = a1*tx+c1*ty+this.tx;
         this.ty = b1*tx+d1*ty+this.ty;
         return this;
     }

     setReg(regX,regY):Matrix{
         this.tx -= regX*this.a+regY*this.c;
         this.ty -= regX*this.b+regY*this.d;
         return this;
     }

     prepend (a, b, c, d, tx, ty) {
         var a1 = this.a;
         var c1 = this.c;
         var tx1 = this.tx;

         this.a  = a*a1+c*this.b;
         this.b  = b*a1+d*this.b;
         this.c  = a*c1+c*this.d;
         this.d  = b*c1+d*this.d;
         this.tx = a*tx1+c*this.ty+tx;
         this.ty = b*tx1+d*this.ty+ty;
         return this;
     }
}
declare var initDragZoom:any
$(document).ready(function(){
    var test=new Test();
    initDragZoom();
})
