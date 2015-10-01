///<reference path="../libs/typings/jquery.d.ts" />
///<reference path="Matrix2D.ts" />
///<reference path="Tools.ts" />
///<reference path="TouchController.ts" />
///<reference path="TouchController3.ts" />
///<reference path="Renderer.ts" />
///<reference path="Renderer3.ts" />
///<reference path="DisplayContainer.ts" />
///<reference path="DisplaySimple.ts" />
///<reference path="utils.ts" />


class Test3{

     render:Renderer3
    constructor(){
        this.render = new Renderer3();
        this.render.building.setCenter(500,500);
        this.render.building.applyReg();


        var tools:ui.Tools = new ui.Tools();
        tools.onChange=(angle,scale,skew)=>{
            console.log(angle,scale);
            this.render.building.setAS(angle,scale)
        }

        var ar:any[]=[{x:100,y:100},{x:800,y:100},{x:800,y:800},{x:100,y:800}]

        for (var i = 0, n = ar.length; i < n; i++) {
            var p = ar[i];
          var dot =  $('<dot>').addClass('dot').data('x',p.x).data('y',p.y).text('x: '+p.x+' y: '+p.y).css({left:p.x,top:p.y});
            this.render.viewPort.addChild(dot)

        }
        setInterval(()=>{
            var ar = this.render.viewPort.children;

            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                var p = this.render.building.toGlobal(vo.data('x'),vo.data('y'))
                if(p)vo.css({left:p.x,top:p.y});

            }

        },2000)


    }

}



$(document).ready(function(){var test = new Test3();})