/**
 * Created by Vlad on 7/7/2015.
 *
 */
    ///<reference path="../libs/typings/jquery.d.ts" />
  module view {

     export class Point{
                x:number;
                y:number;
    }



    export class DisplayObject0{
        parent:DisplayObject0;
        x:number=0;
        y:number=0;
        scaleX:number=1;
        scaleY:number=1;
        rotation:number=0
        angle:number
        skewX:number=0;
        skewY:number=0;
        regX:number=0;
        regY:number=0;

        DEG_TO_RAD = Math.PI / 180;

        matrix:Matrix2D;
        transformMatrix:Matrix2D;
        style:CSSStyleDeclaration;

        view:HTMLElement;
        $view:JQuery
        transform:string;
        origin:string

        constructor(view:HTMLElement,transform:string,origin:string){
            this.view = view;
            this.$view = $(view);
            this.transform = transform;
            this.origin = origin;
            this.style = window.getComputedStyle(view,null);
        }


        setCenter(x:number,y:number):DisplayObject0{
            this.regX = x;
            this.regY = y;
            return this;
        }


        setAngle(ang:number):DisplayObject0{
            this.rotation= ang/this.DEG_TO_RAD;
            this.angle=ang;
            return this
        }

        setScale(x:number):DisplayObject0{
            this.scaleX = x;
            return this;
        }
        applyReg():DisplayObject0{
            this.view.style[this.origin]=this.regX+'px '+this.regY+'px ';
            return this;
        }
        applyMatrix():DisplayObject0{
            return this;
        }
        applyRS():DisplayObject0{
            this.view.style[this.transform]= 'translate(0,0) rotate('+this.angle+'deg) scale('+this.scaleX+') translateZ(0)';
            return this;
        }

        private matrixToArray(str:string):string[] {
            return str.split('(')[1].split(')')[0].split(',');
        }
        private mCache:number[]

        readMatrixVO():MatrixVO{
            var vo=new MatrixVO();
            var ar=this.readMatrixAr();
            vo.a = ar[0];
            vo.b = ar[1];
            vo.c = ar[2];
            vo.d = ar[3];
            vo.tx = ar[4];
            vo.ty = ar[5];
            return vo
        }
       readMatrixAr():number[]{
            if(!this.mCache) this.mCache  = this.matrixToArray(this.style.getPropertyValue(this.transform)).map(Number);
           return this.mCache

       }


        localToGlobal(x:number, y:number, pt?:Point) {
        return this.getConcatenatedMatrix().transformPoint(x,y,pt);
        }
        localToGlobalMatr(x:number, y:number):Point{
            return this.matrix.transformPoint(x,y);
        }

        getConcatenatedMatrix = function():Matrix2D {
            var o:DisplayObject0 = this;
            var mtx:Matrix2D = this.getMatrix();
            while (o = o.parent) {
                mtx.prependMatrix(o.getMatrix());
            }
            return mtx;
        }

        getMatrix() {
            var o:DisplayObject0 = this;
            var mtx:Matrix2D =  new Matrix2D();
            return mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        }
/*
        getMatrix(matrix:Matrix2D) {
            var o:DisplayObject0 = this;
            var mtx:Matrix2D = matrix && matrix.identity() || new Matrix2D(1,0,0,1,0,0);
            return o.transformMatrix ?  mtx.copy(o.transformMatrix) : mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        }
*/




    }


    export class MatrixVO{
        a:number=1;
        b:number=0;
        c:number=0;
        d:number=1;
        tx:number=0;
        ty:number=0;
    }

    export class Matrix2D {

        DEG_TO_RAD = Math.PI / 180;
        static identity:Matrix2D;
        vo:MatrixVO;
        constructor() {
            this.vo=new MatrixVO()
           // this.setValues(a, b, c, d, tx, ty);
           // this.identity = new Matrix2D(1,0,0,1,0,0);
        }

        setAr(ar:number[]):Matrix2D{
            var vo:MatrixVO = this.vo
            vo.a = ar[0];
            vo.b = ar[1];
            vo.c = ar[2];
            vo.d = ar[3];
            vo.tx = ar[4];
            vo.ty = ar[5];
            return this;
        }

        append (a:number, b:number, c:number, d:number, tx:number, ty:number):Matrix2D  {
            var vo:MatrixVO= this.vo
            var a1 = vo.a;
            var b1 = vo.b;
            var c1 = vo.c;
            var d1 = vo.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                vo.a  = a1*a+c1*b;
                vo.b  = b1*a+d1*b;
                vo.c  = a1*c+c1*d;
                vo.d  = b1*c+d1*d;
            }
            vo.tx = a1*tx+c1*ty+vo.tx;
            vo.ty = b1*tx+d1*ty+vo.ty;
            return this;
        }

        prepend(a:number, b:number, c:number, d:number, tx:number, ty:number):Matrix2D {
            var vo:MatrixVO = this.vo
            var a1 = vo.a;
            var c1 = vo.c;
            var tx1 = vo.tx;

            vo.a  = a*a1+c*vo.b;
            vo.b  = b*a1+d*vo.b;
            vo.c  = a*c1+c*vo.d;
            vo.d  = b*c1+d*vo.d;
            vo.tx = a*tx1+c*vo.ty+tx;
            vo.ty = b*tx1+d*vo.ty+ty;
            return this;
         }
        appendMatrix (matrix:Matrix2D):Matrix2D {
            var vo:MatrixVO = matrix.vo;
            return this.append(vo.a, vo.b,vo.c, vo.d, vo.tx, vo.ty);
        }
        prependMatrix (matrix):Matrix2D {
            var vo:MatrixVO = matrix.vo;
            return this.prepend(vo.a, vo.b, vo.c, vo.d, vo.tx, vo.ty);
        }



        appendTransform(x:number, y:number, scaleX:number, scaleY:number, rotation:number, skewX?:number, skewY?:number, regX?:number, regY?:number):Matrix2D {
            var vo:MatrixVO = this.vo;
            if (rotation%360) {
                var r = rotation*this.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }

            if (skewX || skewY) {
                // TODO: can this be combined into a single append operation?
                skewX *= this.DEG_TO_RAD;
                skewY *= this.DEG_TO_RAD;
                this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
            } else {
                this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
            }

            if (regX || regY) {
                // append the registration offset:
                vo.tx -= regX*vo.a+regY*vo.c;
                vo.ty -= regX*vo.b+regY*vo.d;
            }
        return this;
        }



        rotate(angle:number):Matrix2D {
            var vo:MatrixVO = this.vo;
            angle = angle*this.DEG_TO_RAD;
            var cos:number = Math.cos(angle);
            var sin:number = Math.sin(angle);

            var a1 = vo.a;
            var b1 = vo.b;

            vo.a = a1*cos+vo.c*sin;
            vo.b = b1*cos+vo.d*sin;
            vo.c = -a1*sin+vo.c*cos;
            vo.d = -b1*sin+vo.d*cos;
        return this;
        }

        skew(skewX:number, skewY:number):Matrix2D {
            skewX = skewX*this.DEG_TO_RAD;
            skewY = skewY*this.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
            return this;
        }

        scale(x:number, y:number):Matrix2D {
            var vo:MatrixVO= this.vo
            vo.a *= x;
            vo.b *= x;
            vo.c *= y;
            vo.d *= y;
            //this.tx *= x;
            //this.ty *= y;
            return this;
        }

        copy (matrix:Matrix2D):Matrix2D {
            var vo:MatrixVO= this.vo
            vo.a = matrix.vo.a;
            vo.b = matrix.vo.b;
            vo.c = matrix.vo.c;
            vo.d = matrix.vo.d;
            vo.tx = matrix.vo.tx;
            vo.ty = matrix.vo.ty;
            return this;
        }

        translate(x:number, y:number):Matrix2D {
            var vo:MatrixVO = this.vo
            vo.tx += vo.a*x + vo.c*y;
            vo.ty += vo.b*x + vo.d*y;
            return this;
        }

        identity():Matrix2D{
            this.vo = new MatrixVO();
            return this;
        }

        invert ():Matrix2D {
            var vo:MatrixVO = this.vo
            var a1 = vo.a;
                var b1 = vo.b;
                var c1 = vo.c;
                var d1 = vo.d;
                var tx1 = vo.tx;
                var n = a1*d1-b1*c1;

                vo.a = d1/n;
                vo.b = -b1/n;
                vo.c = -c1/n;
                vo.d = a1/n;
                vo.tx = (c1*vo.ty-d1*tx1)/n;
                vo.ty = -(a1*vo.ty-b1*tx1)/n;
            return this;
        }

        isIdentity() {
            var vo:MatrixVO = this.vo
        return vo.tx === 0 && vo.ty === 0 && vo.a === 1 && vo.b === 0 && vo.c === 0 && vo.d === 1;
        }

        equals (matrix:Matrix2D) {
            var vo:MatrixVO = this.vo
        return vo.tx === matrix.vo.tx && vo.ty === matrix.vo.ty && vo.a === matrix.vo.a && vo.b === matrix.vo.b && vo.c === matrix.vo.c && vo.d === matrix.vo.d;
        }



        transformPoint(x:number, y:number, pt?:Point):Point {
            var vo:MatrixVO = this.vo
                pt = pt || new Point();
                pt.x = x * vo.a + y * vo.c + vo.tx;
                pt.y = x * vo.b + y * vo.d + vo.ty;
            return pt;
        }



    }
}