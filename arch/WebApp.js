/**
 * Created by Vlad on 6/17/2015.
 */
$(globalDispatcher).on("AppLoaded", function(){
    $(globalDispatcher).on("AppReady");

    $('#loadingScreen').addClass('loadDisappear');
    setTimeout(function(){
        $('#loadingScreen').hide();
    }, 2000);
var resize = new amgen.Resize($('#map-mainview'));


});


var amgen;
(function (amgen) {
    var Resize = (function () {
        function Resize(view) {
            this.view = view;
            this.origin = 1820;
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
            if(w>2300) return;
            var k = w / this.origin;

            TweenMax.to(this.view, 0.3, { scaleX: k, scaleY: k });
        };
        return Resize;
    })();
    amgen.Resize = Resize;
})(amgen || (amgen = {}));
var amgen;
(function (amgen) {
    var AmgenApp = (function () {
        function AmgenApp() {
        }
        return AmgenApp;
    })();
    amgen.AmgenApp = AmgenApp;
})(amgen || (amgen = {}));

