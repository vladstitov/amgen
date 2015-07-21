/**
 * Created by Vlad on 6/22/2015.
 */
///<reference path="AmgenApp.ts" />
var amgen;
(function (amgen) {
    var Resize = (function () {
        function Resize() {
            this.origin = 1920;
            var that = this;
            $(window).resize(function () {
                clearTimeout(that.timeout);
                that.timeout = setTimeout(function () {
                    that.onResize();
                }, 200);
            });
            this.onResize();
        }
        Resize.prototype.onResize = function () {
            var w = $(window).width();
            var k = w / this.origin;
            if (k == 1)
                k = 0.99;
            $('.bubble').show();
            k = Math.round(k * 10);
            console.log(k);
            $('#building').attr('class', 'zoom' + k);
            // console.log($('.floor-map'));
            //TweenMax.to('.building',0.3,{scaleX:k,scaleY:k});
        };
        return Resize;
    })();
    amgen.Resize = Resize;
})(amgen || (amgen = {}));
//# sourceMappingURL=Resize.js.map