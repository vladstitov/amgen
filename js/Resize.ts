/**
 * Created by Vlad on 6/22/2015.
 */
    ///<reference path="AmgenApp.ts" />
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
            if(k==1)k=0.99;
$('.bubble').show();
            k=Math.round(k*10);
            console.log(k);
            $('#building').attr('class','zoom'+k);
          // console.log($('.floor-map'));
          //TweenMax.to('.building',0.3,{scaleX:k,scaleY:k});
        }
    }
}