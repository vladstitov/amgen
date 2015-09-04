/**
 * Created by Vlad on 8/28/2015.
 */
///<reference path="Test2.ts" />
var ui;
(function (ui) {
    var TouchController3 = (function () {
        function TouchController3(el, ind) {
            var _this = this;
            this.startX = 0;
            this.startY = 0;
            this.zoom = 0;
            this.angle = 0;
            this.DX = 0;
            this.DY = 0;
            this.moveSpeed = 0;
            //  moveSpeed5:number=0;
            //   count5:number;
            //  accum5:number;
            this.centerX = 0;
            this.centerY = 0;
            this.ind = ind;
            el.addEventListener('touchstart', function (evt) { return _this.addListeners(evt); });
        }
        TouchController3.prototype.handleMove = function (x, y) {
            if (this.isGestur) {
                this.stopGestures();
                return;
            }
            if (!this.isMoving) {
                this.isMoving = true;
                this.startX = x;
                this.startY = y;
                this.DX = 0;
                this.DY = 0;
                this.prevX = x;
                this.prevY = y;
                if (this.ind) {
                    $('#Move').show();
                }
                if (this.onMoveStart)
                    this.onMoveStart();
            }
            else {
                this.DX = x - this.startX;
                this.DY = y - this.startY;
                if (this.ind) {
                    this.ind.css({ left: this.DX, top: this.DY });
                }
                var dx = x - this.prevX;
                var dy = y - this.prevY;
                this.moveSpeed = Math.sqrt(dx * dx + dy * dy);
                this.prevX = x;
                this.prevY = y;
                if (this.onMove)
                    this.onMove(this.DX, this.DY);
            }
            //// console.log(this.moveX+'  '+this.moveY);
        };
        TouchController3.prototype.stopMoving = function () {
            $('#Move').hide();
            this.isMoving = false;
            if (this.onMoveEnd)
                this.onMoveEnd();
        };
        TouchController3.prototype.stopGestures = function () {
            $('#Gestur').hide();
            this.isGestur = false;
            if (this.onGestStop)
                this.onGestStop();
        };
        TouchController3.prototype.setCenter = function (x, y) {
            // if(Math.abs(this.centerX-x) + Math.abs(this.centerY+y)>10){
            this.centerX = x;
            this.centerY = y;
            //}
        };
        TouchController3.prototype.handleGesture = function (x1, y1, x2, y2) {
            if (this.isMoving) {
                this.stopMoving();
                return;
            }
            var dx = x2 - x1;
            var dy = y2 - y1;
            this.setCenter((x2 + x1) / 2, (y1 + y2) / 2);
            var dist = Math.sqrt(dx * dx + dy * dy);
            var a = Math.atan2(dy, dx) * 57.2957795;
            var ang = (a + 360) % 360; // (a > 0 ? a : (2*Math.PI + a)) * 360 / (2*Math.PI)
            if (!this.isGestur) {
                this.startDist = dist;
                this.startAng = ang;
                this.isGestur = true;
                this.angle = 0;
                this.zoom = 0;
                if (this.ind) {
                    $('#Gestur').show();
                }
                if (this.onGestStart)
                    this.onGestStart();
            }
            else {
                this.zoom = dist - this.startDist;
                this.angle = ang - this.startAng;
                var sc = dist / this.startDist;
                if (this.ind) {
                    this.ind.css('transform', 'scale(' + sc + ') rotate(' + this.angle + 'deg)');
                }
                if (this.onGest)
                    this.onGest(this.zoom, this.angle);
            }
        };
        TouchController3.prototype.onTouchMove = function (evt) {
            evt.preventDefault();
            if (evt.touches.length == 1)
                this.handleMove(evt.touches[0].clientX, evt.touches[0].clientY);
            else if (evt.touches.length == 2)
                this.handleGesture(evt.touches[0].clientX, evt.touches[0].clientY, evt.touches[1].clientX, evt.touches[1].clientY);
        };
        TouchController3.prototype.setTimedInterval = function (callback, delay, timeout, onEnd) {
            var id = window.setInterval(callback, delay);
            window.setTimeout(function () {
                window.clearInterval(id);
                onEnd();
            }, timeout);
        };
        TouchController3.prototype.onTouchEnd = function () {
            if (this.isMoving)
                this.stopMoving();
            if (this.isGestur)
                this.stopGestures();
        };
        TouchController3.prototype.addListeners = function (evt) {
            var that = this;
            var onTouchMove = function (evt) {
                that.onTouchMove(evt);
            };
            var onTouchEnd = function (evt) {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                document.removeEventListener('touchcancel', onTouchEnd);
                that.onTouchEnd();
            };
            this.active = true;
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
            document.addEventListener('touchcancel', onTouchEnd);
        };
        return TouchController3;
    })();
    ui.TouchController3 = TouchController3;
})(ui || (ui = {}));
//# sourceMappingURL=TouchController3.js.map