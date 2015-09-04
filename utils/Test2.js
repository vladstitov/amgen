/**
 * Created by Vlad on 8/18/2015.
 */
///<reference path="../libs/typings/jquery.d.ts" />
///<reference path="Matrix2D.ts" />
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
        this.building = new view.DisplayObject(document.getElementById('Building'), 'webkitTransform', 'webkitTransformOrigin');
        // this.viewPort = document.getElementById('ViewPort');
        this.dots = new view.DisplayObject(document.getElementById('Dots'), 'webkitTransform', 'webkitTransformOrigin');
        //  $(this.viewPort).click((evt)=>this.onViewPortClick(evt));
        this.tools = new Tools();
        this.tools.onChange = function () { return _this.onToolsChage(); };
        this.touch = new TouchController();
        this.touch.onMoveStart = function () { return _this.onMoveStart(); };
        this.touch.onMoveEnd = function () { return _this.onMoveEnd(); };
        this.touch.onGestStart = function () { return _this.onGestStart(); };
        this.touch.onGestStop = function () { return _this.onGestStop(); };
        this.curAng = 0;
        this.curScale = 1;
        // this.touch.onMove=(dx,dy)=>this.
        this.setCenter(200, 200);
        //  this.dots.$view.offset({top:800,left:800});
        //  $('#Dots').offset({top:800,left:800})
        this.dot100 = $('<div>').addClass('dot').text('100x100').offset({ left: 100, top: 100 }).appendTo(this.dots.$view);
        var p = this.building.localToGlobal(100, 100);
        console.log(p);
        this.dot100.css({ top: p.y, left: p.x });
    }
    Test2.prototype.onViewPortClick = function (evt) {
        var x = evt.clientX;
        var y = evt.clientY;
        //  var  dot=$('<div>').addClass('dot').offset({left:p.x,top:p.y});
        // $(this.building).append(dot);
    };
    Test2.prototype.setCenter = function (x, y) {
        x = x - this.posX;
        y = y - this.posY;
        //  var p={x:x,y:y};
        //   var m = this.invert(this.getMatrix());
        //   var p = this.transformPoint(x,y,m);
        //  console.log(m);
        this.building.setCenter(x, y).applyReg();
        // this.building.style['webkitTransformOrigin']=  p.x+'px '+p.y+'px';
        // $(this.building).css('transform-origin', p.x+'px '+p.y+'px');
    };
    Test2.prototype.onToolsChage = function () {
        console.log('change');
        this.curAng = this.tools.angle;
        this.curScale = this.tools.scale;
        this.building.setAngle(this.curAng);
        this.building.setScale(this.curScale).applyRS();
        var p = this.building.localToGlobal(500, 500);
        console.log(p);
        this.dot100.css({ left: p.x, top: p.y });
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
    TouchController.prototype.setCenter = function (x, y) {
        // if(Math.abs(this.centerX-x) + Math.abs(this.centerY+y)>10){
        this.centerX = x;
        this.centerY = y;
        //}
    };
    TouchController.prototype.handleGesture = function (x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        this.setCenter((x2 + x1) / 2, (y1 + y2) / 2);
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