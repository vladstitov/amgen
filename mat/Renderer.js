/**
 * Created by Vlad on 9/3/2015.
 */
/**
 * Created by Vlad on 8/18/2015.
 */
///<reference path="Test3.ts" />
var Renderer = (function () {
    function Renderer() {
        var _this = this;
        this.prefixedTransform = 'webkitTransform';
        // viewPort:HTMLElement;
        this.posX = 0;
        this.posY = 0;
        this.startX = 0;
        this.startY = 0;
        this.startScale = 1;
        this.startAng = 0;
        this.curScale = 1;
        this.curAng = 0;
        this.total = 0;
        this.last = 0;
        this.count = 0;
        this.consol = $('#Console');
        this.buildingView = document.getElementById('Building');
        this.viewPort = document.getElementById('ViewPort');
        this.building = new view.DisplayObject(document.getElementById('Building'), 'webkitTransform', 'webkitTransformOrigin');
        this.building.drawCenter();
        var ar = [{ x: 100, y: 100 }, { x: 800, y: 100 }, { x: 800, y: 800 }, { x: 100, y: 800 }];
        for (var i = 0, n = ar.length; i < n; i++) {
            var p = ar[i];
            $('<dot>').addClass('dot').text('x: ' + p.x + ' y: ' + p.y).css({ left: p.x, top: p.y }).appendTo(this.building.$view);
        }
        // this.viewPort = document.getElementById('ViewPort');
        this.dots = new view.DisplayObject(document.getElementById('Dots'), 'webkitTransform', 'webkitTransformOrigin');
        // $('#Content').click((evt)=>this.onViewPortClick(evt));
        // this.tools = new ui.Tools();
        this.touch = new ui.TouchController3(this.buildingView, $('#Indicator'));
        this.touch.onMoveStart = function () { return _this.onMoveStart(); };
        this.touch.onMoveEnd = function () { return _this.onMoveEnd(); };
        this.touch.onGestStart = function () { return _this.onGestStart(); };
        this.touch.onGestStop = function () { return _this.onGestStop(); };
        this.curAng = 0;
        this.curScale = 1;
        // this.setCenter(200,200);
        //this.onAnimationFrame(0);
    }
    Renderer.prototype.onGestStart = function () {
        // console.log(' onGestStart ');
        this.startAng = this.curAng;
        this.startScale = this.curScale;
        var cX = this.touch.centerX;
        var cy = this.touch.centerY;
        this.stopG = false;
        this.startGest();
        // this.onAnimationFrame(0);
        this.calcZR();
        this.start();
    };
    Renderer.prototype.onMoveStart = function () {
        this.startX = this.posX;
        this.startY = this.posY;
        //this.startPos();
        this.calcPosition();
        this.start();
        //  setTimeout(()=>this.calcPosition(),20);
    };
    Renderer.prototype.onMoveEnd = function () {
        this.stop();
    };
    Renderer.prototype.onGestStop = function () {
        this.stopG = true;
        this.stop();
    };
    Renderer.prototype.cFPS = function () {
        var now = new Date().getTime();
        var fps = 1000 / (now - this.last);
        this.total += fps;
        this.last = now;
        this.count++;
        if (this.count == 30) {
            this.count = 0;
            $('#FPS').text((this.total / 30).toFixed());
            this.total = 0;
        }
    };
    Renderer.prototype.start = function () {
        if (!this.isActive) {
            this.isActive = true;
            this.onAnimationFrame(0);
        }
        clearTimeout(this.timeout);
    };
    Renderer.prototype.stop = function () {
        var _this = this;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
            $('#Move').show();
            _this.isActive = false;
        }, 5000);
    };
    Renderer.prototype.onAnimationFrame = function (st) {
        var _this = this;
        this.cFPS();
        if (this.isActive)
            requestAnimationFrame(function (st) { return _this.onAnimationFrame(st); });
        this.render();
    };
    Renderer.prototype.stopTimer = function () {
        clearInterval(this.timer);
    };
    Renderer.prototype.calcZR = function () {
        var z = (this.touch.zoom * this.curScale);
        this.curScale = this.startScale + (z * 0.001);
        var ga = this.startAng + this.touch.angle;
        var da = ga - this.curAng;
        if (this.stopG && Math.abs(da) < 1)
            this.stopGest();
        if (Math.abs(da) > 100)
            this.curAng = ga;
        else
            this.curAng += (da * 0.2);
        //  this.consol.text(this.curScale+'   '+this.curAng);
    };
    Renderer.prototype.startGest = function () {
        this.isRS = true;
        $('#Gestur2').show();
    };
    Renderer.prototype.stopGest = function () {
        this.isRS = false;
        $('#Gestur2').hide();
    };
    Renderer.prototype.stopPos = function () {
        this.isPoz = false;
        $('#Move2').hide();
    };
    Renderer.prototype.startPos = function () {
        this.isPoz = true;
        $('#Move2').show();
    };
    Renderer.prototype.calcPosition = function () {
        var gx = this.startX + this.touch.DX;
        var gy = this.startY + this.touch.DY;
        var dx = gx - this.posX;
        var dy = gy - this.posY;
        if (Math.sqrt((dx * dx) + (dy * dy)) < 0.1) {
            this.stopPos();
        }
        else {
            this.startPos();
            this.posX += dx * 0.1;
            this.posY += dy * 0.1;
        }
    };
    Renderer.prototype.render = function () {
        // console.log(this.posX+ '   '+ this.isPoz);
        this.calcPosition();
        if (this.isPoz) {
            //  this.stopGest();
            this.viewPort.style[this.prefixedTransform] = 'translate(' + this.posX + 'px,' + this.posY + 'px) rotate(0) scale(1) translateZ(0)';
        }
        if (this.isRS) {
            this.stopPos();
            this.calcZR();
            // this.mCache=null;
            this.buildingView.style[this.prefixedTransform] = 'translate(0,0) rotate(' + this.curAng + 'deg) scale(' + this.curScale + ') translateZ(0)';
        }
    };
    return Renderer;
})();
//# sourceMappingURL=Renderer.js.map