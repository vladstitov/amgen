/**
 * Created by Vlad on 7/15/2015.
 */
    ///<reference path="../libs/typings/jquery.d.ts" />
class Test{
    c:Container;


    private onFloorClick(evt:JQueryEventObject):void{
        console.log(evt);
        this.c.setDelta(evt.offsetX,evt.offsetY);
        this.c.refreshDots();
    }
    constructor(){
        var tools= $('#tools');

        var c = new Container($('#building_c'));
        c.setAxis( new Axis($('#Axis')));
        this.c=c;

        var b:Axis = this.c.getAxis();

        var dots:Dot[]=[]
      //  var dot = new Dot(' dot 100x100',new Point(100,100));

       // dot.offset(-200,-300);

        b.getFloor().on('click',(evt)=>this.onFloorClick(evt));

       // dot.setPos(b.transformPoint(dot.p));
        dots.push(new Dot(' dot 100x100',new Point(100,100)));
        dots.push(new Dot('dot 800x800',new Point(800,800)));
        dots.push(new Dot('dot 100x800',new Point(100,800)));
        dots.push(new Dot('dot 800x100',new Point(800,100)));
       // dots.push(new Dot('dot000 2',b.transformPoint(new Point(100-200,100-300))));
        //dots.push(new Dot('dot000 3',b.transformPoint(new Point(100-200,800-300))));
       // dots.push(new Dot('dot000 4',b.transformPoint(new Point(800-200,100-300))));

        var ar =dots
        for (var i = 0, n = ar.length; i < n; i++) ar[i].setMatrix(b.m);
        c.setDots(dots);
      // c.setOffset(500,500);
        c.setCenter(500,500);
        c.refreshDots();
        var that=this;

        var rotate= tools.find('[data-id=rotate]:first').on('input',function(){
            var v = ((rotate.val()-50)/50);
            c.rotate(v);

        })

        var scale =  tools.find('[data-id=scale]:first').on('input',function(){
          //  console.log( scale.val());
            var v =  ((scale.val())/50);
            if(v<0.2) v=0.2;
            c.scale(v);
           // that.refreshDots();
        })

        var skew = tools.find('[data-id=lay]:first').on('input',function(){
           var v= (skew.val()-50)/50;
           c.skew(v);
           // c.refreshDots();
        })
        console.log(rotate);
    }
}

class Container{
    b:Axis;
    dots:Dot[];
    offsetx:number=0;
    offsety:number=0;

    refreshDots(){
      //  var m=this.b.m;
        var ar =this.dots
        for (var i = 0, n = ar.length; i < n; i++) {
             ar[i].refresh();
            //dot.setPos(m.transformPoint(dot.p.x,dot.p.y));
        }
    }
    rotate(v:number){
        this.b.rotate(v);
        this.refreshDots();
    }
    scale(v:number):void{
        this.b.scale(v);
        this.refreshDots();
    }
    skew(v:number):void{
        this.b.skew(v);
        this.refreshDots();
    }
    setAxis(b:Axis):void{
        this.b=b;
    }

    getAxis():Axis{
        return this.b;
    }

    setDelta(x:number,y:number):void{
        this.b.setDelta(x,y);
    }
    setCenter(x:number,y:number):void{
        var ar:Dot[] = this.dots;
      //  this.view.css('left',x+'px').css('top',y+'px');
        this.view.css('left',x+'px').css('top',y+'px');
        this.offsetx=x;
        this.offsety=y;
        this.b.setCenter(0-x,0-y);
        for (var i = 0, n = ar.length; i < n; i++)  ar[i].setCenter(0-x,0-y);
    }

    setDots(d:Dot[]):void{
        this.dots=d;
        var ar =d;
        for (var i = 0, n = ar.length; i < n; i++)  $('#overlay').append(ar[i].view);

    }
    constructor(public view:JQuery){

           // view.on('click',(evt)=>this.onClick(evt));

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

    constructor(label:string,public p:Point){
        this.view=$('<div>').html(label).addClass('dot');
        this.setPos(p);
    }
    refresh(){
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
    this.view.css({left:p.x,top:p.y});
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

$(document).ready(function(){
    var test=new Test();
})
