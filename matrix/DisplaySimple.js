/**
 * Created by Vlad on 9/4/2015.
 */
///<reference path="Test3.ts" />
var view;
(function (_view) {
    var DisplaySimple = (function () {
        function DisplaySimple(view, transform, origin, name) {
            this.posX = 0;
            this.posY = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.scale = 1;
            //  rotation:number=0
            this.angle = 0;
            this.skewX = 0;
            this.skewY = 0;
            this.regX = 0;
            this.regY = 0;
            this.asMatrix = false;
            this.children = [];
            this.name = name;
            this.view = view;
            this.$view = $(view);
            this.transform = transform;
            this.origin = origin;
            this.style = window.getComputedStyle(view, null);
        }
        DisplaySimple.prototype.addChild = function (el) {
            this.children.push(el);
            this.$view.append(el);
        };
        DisplaySimple.prototype.drawCenter = function () {
            this.center = $('<div>').addClass('dot center').appendTo(this.$view);
        };
        DisplaySimple.prototype.setCenter = function (x, y) {
            this.regX = x;
            this.regY = y;
            if (this.center)
                this.center.css({ left: x, top: y });
            return this;
        };
        DisplaySimple.prototype.applyReg = function () {
            this.view.style[this.origin] = this.regX + 'px ' + this.regY + 'px ';
            return this;
        };
        DisplaySimple.prototype.setAngle = function (ang) {
            // this.rotation= ang*this.DEG_TO_RAD;
            this.angle = ang;
            return this;
        };
        DisplaySimple.prototype.setScale = function (x) {
            this.scaleX = x;
            return this;
        };
        DisplaySimple.prototype.setAS = function (a, s) {
            this.scale = s;
            this.scaleX = s;
            this.scaleY = s;
            this.angle = a;
            this.apply();
        };
        DisplaySimple.prototype.setXY = function (x, y) {
            this.posX = x;
            this.posY = y;
            this.apply();
        };
        DisplaySimple.prototype.apply = function () {
            this.view.style[this.transform] = 'translate(' + this.posX + 'px,' + this.posY + 'px) rotate(' + this.angle + 'deg) scale(' + this.scale + ') translateZ(0)';
            this.ar = null;
            return this;
        };
        DisplaySimple.prototype.matrixToArray = function (str) {
            return str.split('(')[1].split(')')[0].split(',');
        };
        /*
                readMatrixVO():MatrixVO{
                    var vo=new MatrixVO();
                    var ar=this.readMatrixAr();
                    vo.a = ar[0];
                    vo.b = ar[1];
                    vo.c = ar[2];
                    vo.d = ar[3];
                    vo.tx = ar[4];
                    vo.ty = ar[5];
                    return vo
                }
                */
        DisplaySimple.prototype.readMatrixAr = function () {
            // var trans = this.style.getPropertyValue('-webkit-transform');
            //  console.log(trans);
            return this.matrixToArray(this.style.getPropertyValue('-webkit-transform')).map(Number);
            // return this.mCache
        };
        DisplaySimple.prototype.toGlobal = function (x, y) {
            //console.log(this.regX,this.regY);
            x = x - this.regX;
            y = y - this.regY;
            if (!this.ar)
                this.ar = this.readMatrixAr();
            var ar = this.ar;
            var pt = new _view.Point();
            pt.x = x * ar[0] + y * ar[2] + ar[4] + this.regX;
            pt.y = x * ar[1] + y * ar[3] + ar[5] + this.regY;
            return pt;
        };
        return DisplaySimple;
    })();
    _view.DisplaySimple = DisplaySimple;
})(view || (view = {}));
//# sourceMappingURL=DisplaySimple.js.map