/**
 * Created by Vlad on 8/18/2015.
 */
///<reference path="../libs/typings/jquery.d.ts" />
var Test2 = (function () {
    function Test2() {
        var _this = this;
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
        if ('transform' in document.body.style) {
            this.prefixedTransform = 'transform';
        }
        else if ('webkitTransform' in document.body.style) {
            this.prefixedTransform = 'webkitTransform';
        }
        this.building = document.getElementById('Building');
        this.viewPort = document.getElementById('ViewPort');
        this.style = window.getComputedStyle(this.building, null);
        // this.startTimer();
        this.tools = new Tools();
        this.tools.onChange = function () { return _this.onToolsChage(); };
        this.touch = new TouchController();
        this.touch.onMoveStart = function () { return _this.onMoveStart(); };
        this.touch.onMoveEnd = function () { return _this.onMoveEnd(); };
        this.touch.onGestStart = function () { return _this.onGestStart(); };
        this.touch.onGestStop = function () { return _this.onGestStop(); };
        // this.touch.onMove=(dx,dy)=>this.
        this.onAnimationFrame(0);
    }
    Test2.prototype.oncenterChaged = function (x, y) {
        $(this.building).css('transform-origin', x + 'px ' + y + 'px');
    };
    Test2.prototype.onToolsChage = function () {
        console.log('change');
        this.oncenterChaged(50, 50);
        this.curAng = this.tools.angle;
        this.curScale = this.tools.scale;
        this.building.style[this.prefixedTransform] = 'translate(0,0) rotate(' + this.curAng + 'deg) scale(' + this.curScale + ') translateZ(0)';
    };
    Test2.prototype.onGestStop = function () {
        this.isRS = false;
    };
    Test2.prototype.onGestStart = function () {
        console.log(' onGestStart ');
        this.startAng = this.curAng;
        this.startScale = this.curScale;
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
    Test2.prototype.matrixToArray = function (str) {
        return str.split('(')[1].split(')')[0].split(',');
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
            this.viewPort.style[this.prefixedTransform] = 'translate(' + this.posX + 'px,' + this.posY + 'px) rotate(0) scale(1) translateZ(0)';
        }
        if (this.isRS) {
            this.calcZR();
            this.building.style[this.prefixedTransform] = 'translate(0,0) rotate(' + this.curAng + 'deg) scale(' + this.curScale + ') translateZ(0)';
        }
        // var ar= this.matrixToArray(this.style.getPropertyValue(this.prefixedTransform));
    };
    return Test2;
})();
var TouchController = (function () {
    function TouchController() {
        var _this = this;
        this.startX = 0;
        this.startY = 0;
        this.dist = 0;
        this.ang = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.centerX = 0;
        this.centerY = 0;
        document.getElementById('Building').addEventListener('touchstart', function (evt) { return _this.addListeners(evt); });
    }
    TouchController.prototype.handleMove = function (x, y) {
        if (!this.isMoving) {
            if (this.isGestur)
                this.stopGestures();
            this.isMoving = true;
            this.startX = x;
            this.startY = y;
            this.moveX = 0;
            this.moveY = 0;
            if (this.onMoveStart)
                this.onMoveStart();
        }
        else {
            this.moveX = x - this.startX;
            this.moveY = y - this.startY;
            if (this.onMove)
                this.onMove(this.moveX, this.moveY);
        }
        //// console.log(this.moveX+'  '+this.moveY);
    };
    TouchController.prototype.stopMoving = function () {
        this.isMoving = false;
        if (this.onMoveEnd)
            this.onMoveEnd();
    };
    TouchController.prototype.stopGestures = function () {
        this.isGestur = false;
        if (this.onGestStop)
            this.onGestStop();
    };
    TouchController.prototype.handleGesture = function (x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        this.centerX = (x2 + x1) / 2;
        this.centerY = (y1 + y2) / 2;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var ang = Math.atan2(dy, dx) * 57.2957795;
        if (!this.isGestur) {
            if (this.isMoving) {
                this.stopMoving();
                return;
            }
            this.startDist = dist;
            this.startAng = ang;
            this.isGestur = true;
            this.ang = 0;
            this.dist = 0;
            if (this.onGestStart)
                this.onGestStart();
        }
        else {
            this.dist = dist - this.startDist;
            this.ang = ang - this.startAng;
            if (this.onGest)
                this.onGest(this.dist, this.ang);
        }
    };
    TouchController.prototype.onTouchMove = function (evt) {
        evt.preventDefault();
        if (evt.touches.length == 1)
            this.handleMove(evt.touches[0].clientX, evt.touches[0].clientY);
        else if (evt.touches.length == 2)
            this.handleGesture(evt.touches[0].clientX, evt.touches[0].clientY, evt.touches[1].clientX, evt.touches[1].clientY);
    };
    TouchController.prototype.onTouchEnd = function () {
        if (this.isMoving)
            this.stopMoving();
        if (this.isGestur)
            this.stopGestures();
    };
    TouchController.prototype.addListeners = function (evt) {
        var that = this;
        var onTouchMove = function (evt) {
            that.onTouchMove(evt);
        };
        var onTouchEnd = function (evt) {
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            document.removeEventListener('touchcancel', onTouchEnd);
            that.onTouchEnd();
            that.active = false;
        };
        this.active = true;
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
        document.addEventListener('touchcancel', onTouchEnd);
    };
    return TouchController;
})();
var Tools = (function () {
    function Tools() {
        var _this = this;
        this.angle = 0;
        this.scale = 1;
        this.skew = 0;
        var tools = $('#tools');
        this.$rotate = tools.find('[data-id=rotate]:first').on('change', function () {
            _this.angle = (((_this.$rotate.val() - 50) / 50) * 360);
            if (_this.onChange)
                _this.onChange();
        });
        this.$scale = tools.find('[data-id=scale]:first').on('change', function () {
            var v = ((_this.$scale.val()) / 50);
            if (v < 0.2)
                v = 0.2;
            _this.scale = v;
            if (_this.onChange)
                _this.onChange();
        });
        this.$skew = tools.find('[data-id=lay]:first').on('change', function () {
            var v = (_this.$skew.val() - 50) / 50;
            _this.skew = v;
            if (_this.onChange)
                _this.onChange();
        });
    }
    return Tools;
})();
$(document).ready(function () {
    var test = new Test2();
});
//# sourceMappingURL=Test2.js.map