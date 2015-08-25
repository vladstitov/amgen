/**
 * Created by Vlad on 8/12/2015.
 */
    ///<reference path="../libs/typings/jquery.d.ts" />
    ///<reference path="../libs/typings/svgjs.d.ts" />
    ///<reference path="../libs/typings/greensock.d.ts" />

    module test{
            export class Izlog{

                constructor(){
                    var dots:Dot[]=[];
                    for (var i = 0, n = 300; i < n; i++) {
                        var x= Math.random()*800;
                        var y = Math.random()*800;
                        dots.push(new Dot(i,'D'+i+' x:'+x+' y:'+y,new Point(x,y)));
                    }

                    var over:JQuery = $('#overlay');
                    var ar:Dot[] = dots
                    for (var i = 0, n = ar.length; i < n; i++){
                        //ar[i].addTo(over);
                        //ar[i].setMatrix(b.m);
                    }
                }

            }
            class Point{
                constructor(public x:number,public y:number){

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
       // rect:svgjs.Element
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

}