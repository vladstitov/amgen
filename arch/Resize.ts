/**
 * Created by Vlad on 6/22/2015.
 */
    ///<reference path="../../test/typings/jquery.d.ts" />
module amgen{
    declare var TweenLite:any;
    declare var TweenMax:any;
    export class Resize{
        timeout:number
        origin:number = 1920;
        constructor(){

            var that=this;
            $(window).resize(function(){
                clearTimeout(that.timeout);
                that.timeout = setTimeout(function(){ that.onResize();}, 200);

            })
            this.onResize();
        }



        onResize():void {
            var w=$(window).width();
           var k:number = w/this.origin;
           // console.log(w);
          // console.log($('.floor-map'));
          TweenMax.to('.building',0.3,{scaleX:k,scaleY:k});
        }
    }
}