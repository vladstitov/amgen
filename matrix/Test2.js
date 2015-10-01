/**
 * Created by Vlad on 8/18/2015.
 */
///<reference path="../libs/typings/jquery.d.ts" />
///<reference path="Matrix2D.ts" />
///<reference path="Tools.ts" />
///<reference path="TouchController.ts" />
///<reference path="TouchController2.ts" />
var Test2 = (function () {
    function Test2() {
        var _this = this;
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
        this.building = new view.DisplayObject0(document.getElementById('Building'), 'webkitTransform', 'webkitTransformOrigin');
        this.building.drawCenter();
        var ar = [{ x: 100, y: 100 }, { x: 800, y: 100 }, { x: 800, y: 800 }, { x: 100, y: 800 }];
        for (var i = 0, n = ar.length; i < n; i++) {
            var p = ar[i];
            $('<dot>').addClass('dot').text('x: ' + p.x + ' y: ' + p.y).css({ left: p.x, top: p.y }).appendTo(this.building.$view);
        }
        // this.viewPort = document.getElementById('ViewPort');
        this.dots = new view.DisplayObject0(document.getElementById('Dots'), 'webkitTransform', 'webkitTransformOrigin');
        $('#Content').click(function (evt) { return _this.onViewPortClick(evt); });
        this.tools = new ui.Tools();
        this.tools.onChange = function () { return _this.onToolsChage(); };
        this.touch = new ui.TouchController2();
        this.touch.onMoveStart = function () { return _this.onMoveStart(); };
        this.touch.onMoveEnd = function () { return _this.onMoveEnd(); };
        this.touch.onGestStart = function () { return _this.onGestStart(); };
        this.touch.onGestStop = function () { return _this.onGestStop(); };
        this.curAng = 0;
        this.curScale = 1;
        this.setCenter(200, 200);
    }
    Test2.prototype.onViewPortClick = function (evt) {
        var x = evt.clientX;
        var y = evt.clientY;
        console.log('onViewPortClick x: ' + x + '  y: ' + y);
        this.setCenter(x, y);
    };
    Test2.prototype.setCenter = function (x, y) {
        var p = this.building.globalToLocal(x, y);
        console.log(p);
        this.building.setCenter(x, y).applyReg();
        // this.building.style['webkitTransformOrigin']=  p.x+'px '+p.y+'px';
        // $(this.building).css('transform-origin', p.x+'px '+p.y+'px');
    };
    Test2.prototype.onToolsChage = function () {
        //console.log('change');
        this.curAng = this.tools.angle;
        this.curScale = this.tools.scale;
        this.building.setAngle(this.curAng);
        this.building.setScale(this.curScale).apply();
        var p = this.building.localToGlobal(500, 500);
        // console.log(p);
        // this.dot100.css({left:p.x,top:p.y});
    };
    Test2.prototype.onGestStop = function () {
        this.isRS = false;
    };
    Test2.prototype.onGestStart = function () {
        console.log(' onGestStart ');
        this.startAng = this.curAng;
        this.startScale = this.curScale;
        var cX = this.touch.centerX;
        var cy = this.touch.centerY;
        this.setCenter(cX, cy);
        this.isRS = true;
    };
    Test2.prototype.onMoveEnd = function () {
        this.isPoz = false;
    };
    Test2.prototype.onMoveStart = function () {
        this.startX = this.posX;
        this.startY = this.posY;
        this.isPoz = true;
    };
    Test2.prototype.cFPS = function () {
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
    Test2.prototype.onAnimationFrame = function (st) {
        var _this = this;
        this.cFPS();
        requestAnimationFrame(function (st) { return _this.onAnimationFrame(st); });
        this.render();
    };
    Test2.prototype.stopTimer = function () {
        clearInterval(this.timer);
    };
    Test2.prototype.calcZR = function () {
        this.curScale = this.startScale + ((this.touch.dist * 0.005) * this.curScale / 5);
        this.curAng = this.startAng + this.touch.ang;
    };
    Test2.prototype.calcPosition = function () {
        var gx = this.startX + this.touch.moveX;
        var gy = this.startY + this.touch.moveY;
        var dx = gx - this.posX;
        this.posX += dx * 0.1;
        var dy = gy - this.posY;
        this.posY += dy * 0.1;
    };
    Test2.prototype.render = function () {
        if (this.isPoz) {
            this.calcPosition();
        }
        if (this.isRS) {
            this.calcZR();
        }
    };
    return Test2;
})();
$(document).ready(function () {
    var test = new Test2();
});
//# sourceMappingURL=Test2.js.map