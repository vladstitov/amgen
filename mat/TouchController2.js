/**
 * Created by Vlad on 8/28/2015.
 */
///<reference path="Test2.ts" />
var ui;
(function (ui) {
    var TouchController2 = (function () {
        function TouchController2() {
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
            document.getElementById('Building').addEventListener('touchstart', function (evt) { return _this.start(); });
        }
        TouchController2.prototype.handleMove = function (x, y) {
            if (!this.isMoving) {
                if (this.isGestur)
                    this.stopGestures();
                this.isMoving = true;
                this.startX = x;
                this.startY = y;
                this.moveX = 0;
                this.moveY = 0;
                this.prevX = x;
                this.prevY = y;
                if (this.onMoveStart)
                    this.onMoveStart();
            }
            else {
                this.moveX = x - this.startX;
                this.moveY = y - this.startY;
                var dx = x - this.prevX;
                var dy = y - this.prevY;
                this.prevX = x;
                this.prevY = y;
                this.moveDist = Math.sqrt(dx * dx + dy * dy);
                this.dx = dx;
                this.dy = dy;
                if (this.onMove)
                    this.onMove(this.moveX, this.moveY);
            }
            //// console.log(this.moveX+'  '+this.moveY);
        };
        TouchController2.prototype.stopMoving = function () {
            this.isMoving = false;
            if (this.onMoveEnd)
                this.onMoveEnd();
        };
        TouchController2.prototype.stopGestures = function () {
            this.isGestur = false;
            if (this.onGestStop)
                this.onGestStop();
        };
        TouchController2.prototype.setCenter = function (x, y) {
            // if(Math.abs(this.centerX-x) + Math.abs(this.centerY+y)>10){
            this.centerX = x;
            this.centerY = y;
            //}
        };
        TouchController2.prototype.handleGesture = function (x1, y1, x2, y2) {
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
        TouchController2.prototype.onTouchMove = function (evt) {
            evt.preventDefault();
            if (evt.touches.length == 1)
                this.handleMove(evt.touches[0].clientX, evt.touches[0].clientY);
            else if (evt.touches.length == 2)
                this.handleGesture(evt.touches[0].clientX, evt.touches[0].clientY, evt.touches[1].clientX, evt.touches[1].clientY);
        };
        TouchController2.prototype.animationFrame = function () {
            var _this = this;
            if (this.isAct)
                requestAnimationFrame(function () { return _this.animationFrame(); });
        };
        TouchController2.prototype.start = function () {
            var _this = this;
            if (!this.isAct)
                requestAnimationFrame(function () { return _this.animationFrame(); });
            this.isAct = true;
        };
        TouchController2.prototype.stop = function () {
            this.isAct = false;
        };
        TouchController2.prototype.setTimedInterval = function (callback, delay, timeout, onEnd) {
            var id = window.setInterval(callback, delay);
            window.setTimeout(function () {
                window.clearInterval(id);
                onEnd();
            }, timeout);
        };
        TouchController2.prototype.keepMoving = function (x, y) {
            // console.log('keepMoving '+x+'   '+y);
            this.moveX += x;
            this.moveY += y;
        };
        TouchController2.prototype.onTouchEnd = function () {
            var _this = this;
            if (this.isMoving) {
                console.log(this.moveDist);
                if (this.moveDist > 3) {
                    var rot = Math.atan2(this.moveY, this.moveX); // * 57.2957795;
                    console.log('   angle     ' + (rot * 57));
                    var endX = (this.moveDist * 5) * Math.cos(rot);
                    var endY = (this.moveDist * 5) * Math.sin(rot);
                    // console.log('endX  '+ );
                    this.setTimedInterval(function () { return _this.keepMoving(endX / 10, endY / 10); }, 100, 1000, function () { return _this.stopMoving(); });
                }
                else
                    this.stopMoving();
            }
            if (this.isGestur)
                this.stopGestures();
        };
        TouchController2.prototype.addListeners = function (evt) {
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
        return TouchController2;
    })();
    ui.TouchController2 = TouchController2;
})(ui || (ui = {}));
//# sourceMappingURL=TouchController2.js.map