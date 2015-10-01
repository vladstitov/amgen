/**
 * Created by Vlad on 9/4/2015.
 */
    ///<reference path="Test3.ts" />

module view{
    export class DisplayContainer{
        parent:DisplayContainer;
        posX:number=0;
        posY:number=0;
        scaleX:number=1;
        scaleY:number=1;
        scale:number=1;
        //  rotation:number=0
        angle:number=0;
        skewX:number=0;
        skewY:number=0;
        regX:number=0;
        regY:number=0;
        center:JQuery;
        asMatrix:boolean = false;
        name:string;

      //  DEG_TO_RAD = Math.PI / 180;

        matrix:Matrix2D;
        transformMatrix:Matrix2D;
        style:CSSStyleDeclaration;

        view:HTMLElement;
        $view:JQuery
        transform:string;
        origin:string


        ar:number[];

        constructor(view:HTMLElement,transform:string,origin:string,name:string){
            this.name=name;
            this.view = view;
            this.$view = $(view);
            this.transform = transform;
            this.origin = origin;
            this.style = window.getComputedStyle(view,null);

        }

        children:JQuery[]=[];
        addChild(el:JQuery){
            this.children.push(el)
            this.$view.append(el);
        }
        drawCenter():void{
            this.center = $('<div>').addClass('dot center').appendTo(this.$view);
        }

        setCenter(x:number,y:number):DisplayContainer{
            this.regX = x;
            this.regY = y;
            if(this.center)this.center.css({left:x,top:y});
            return this;
        }

        applyReg():DisplayContainer{
            this.view.style[this.origin]=this.regX+'px '+this.regY+'px ';
            return this;
        }

        setAngle(ang:number):DisplayContainer{
            // this.rotation= ang*this.DEG_TO_RAD;
            this.angle=ang;
            return this
        }

        setScale(x:number):DisplayContainer{
            this.scaleX = x;
            return this;
        }

        setRS(a:number,s:number):void{
            this.scale=s;
            this.scaleX=s;
            this.scaleY=s;
            this.angle=a;
            this.apply();
        }
        setXY(x:number,y:number):void{
            this.posX=x;
            this.posY=y;
            this.apply();
        }
        applyMatrix():DisplayContainer{

            return this;
        }
        apply():DisplayContainer{
            if(this.asMatrix){
                var m= new Matrix2D();
                m.rotate(this.angle);
                m.scale(this.scale,this.scale);
                this.view.style[this.transform]= 'matrix('+m.toString()+')';
            }
            else this.view.style[this.transform]= 'translate('+this.posX+'px,'+this.posY+'px) rotate('+this.angle+'deg) scale('+this.scale+') translateZ(0)';
            this.ar=null;
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
           // var trans = this.style.getPropertyValue('-webkit-transform');
          //  console.log(trans);
            return this.matrixToArray(this.style.getPropertyValue('-webkit-transform')).map(Number);
            // return this.mCache
        }

        toGlobal(x:number, y:number):Point {
        if(!this.ar) this.ar = this.readMatrixAr();
        var ar:number[] = this.ar;
            var pt =  new Point();
            pt.x = x * ar[0] + y * ar[2] + ar[4];
            pt.y = x * ar[1] + y * ar[3] + ar[5];
            return pt;
        }

        globalToLocal(x:number, y:number, pt?:Point) {
            return this.getConcatenatedMatrix().invert().transformPoint(x,y, pt);
        }
        localToGlobal(x:number, y:number, pt?:Point) {
            return this.getConcatenatedMatrix().transformPoint(x,y,pt);
        }
        localToGlobalMatr(x:number, y:number):Point{
            return this.matrix.transformPoint(x,y);
        }

        getConcatenatedMatrix = function():Matrix2D {
            var o:DisplayContainer = this;
            var mtx:Matrix2D = this.getMatrix();
            // while (o = o.parent) {
            // mtx.prependMatrix(o.getMatrix());
            //}
            return mtx;
        }

        getMatrix() {
            var o:DisplayContainer = this;
            var mtx:Matrix2D =  new Matrix2D();
            console.log(mtx.toString());
            var nm = mtx.appendTransform(o.posX, o.posY, o.scaleX, o.scaleY, o.angle, o.skewX, o.skewY, o.regX, o.regY);
            console.log(nm.toString());
            return nm
        }
        /*
         getMatrix(matrix:Matrix2D) {
         var o:DisplayContainer = this;
         var mtx:Matrix2D = matrix && matrix.identity() || new Matrix2D(1,0,0,1,0,0);
         return o.transformMatrix ?  mtx.copy(o.transformMatrix) : mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
         }
         */




    }

}