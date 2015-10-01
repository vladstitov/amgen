/**
 * Created by Vlad on 8/14/2015.
 */

    ///<reference path="../libs/typings/jquery.d.ts" />

class MatrixTest{

    private ar1:any[];
    private ar2:any[];
    private transform:string;
    private div:HTMLElement;
    constructor(){
        var div = document.getElementById('Building');
        console.log(div.style);
        this.div= div;
        var prefixes = ['', '-moz-', '-webkit-', '-o-', '-ms-'];
        var transform = 'transform';
        var vendorProp;
        if (!(transform in div.style)) {
            for (var i=0; i<prefixes.length; ++i) {
                vendorProp = prefixes[i] + transform;
                if (vendorProp in div.style) {
                    transform = vendorProp;
                    break;
                }
            }
        }


        this.transform=transform;
        console.log(transform);
        var Matrix = window['WebKitCSSMatrix'] || window['MSCSSMatrix'] || window['CSSMatrix'];

        div.style.width = div.style.height = '1000px';
        //div.style.backgroundColor = 'red';
        var arr1 = [];
        var arr2 = [];
        var j = 0;

        for (var i = 0; i < 1000; i++) {
            var m = new Matrix().rotate(1,1,i).scale(i/1000,i/1000,i).translate(1,1);
            console.log(m);
            arr1.push(m+ '');
            arr2.push('rotateZ('+i+'deg).translate('+i+'px, '+i+'px)');
        }

        this.ar1=arr1;
        this.ar2=arr2;

        $('[data-id=btn1]:first').on('click',()=>this.test1())

        $('[data-id=btn2]:first').on('click',()=>this.test2())
    }
    current:number=0
    private last:number;
    counter:number=0
    total:number;
    max:number;
    onAnimationFrame(ts){
        this.total+=ts-this.last;
        this.last=ts;
        if(this.counter>100){
            this.counter=0;
            this.total=0;
        }
        console.log(this.ar1[this.current]);

        this.div.style[this.transform] = this.ar1[this.current];

        this.current++;
        if(this.current<this.max)requestAnimationFrame((ts)=>this.onAnimationFrame(ts));

    }

    private test1():void{
        var now = Date.now();
        this.max= this.ar1.length;
        this.current=0;
        this.onAnimationFrame(0)
       // console.log(this.div.style[this.transform]);

      //  for (var i = 0,n=this.ar1.length; i < n; i++) {
         //   this.div.style[this.transform] = this.ar1[i];

      //  }
       // console.log(Date.now()-now);
    }
    private test2():void{
        var now = Date.now();
        for (var i = 0,n=this.ar2.length; i < n; i++) {
            this.div.style[this.transform] = this.ar2[i];
        }
        console.log(Date.now()-now);
    }
}