/**
 * Created by Vlad on 9/4/2015.
 */
///<reference path="Test3.ts" />
var view;
(function (_view) {
    var DisplayContainer = (function () {
        function DisplayContainer(view, transform, origin, name) {
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
            this.getConcatenatedMatrix = function () {
                var o = this;
                var mtx = this.getMatrix();
                // while (o = o.parent) {
                // mtx.prependMatrix(o.getMatrix());
                //}
                return mtx;
            };
            this.name = name;
            this.view = view;
            this.$view = $(view);
            this.transform = transform;
            this.origin = origin;
            this.style = window.getComputedStyle(view, null);
        }
        DisplayContainer.prototype.addChild = function (el) {
            this.children.push(el);
            this.$view.append(el);
        };
        DisplayContainer.prototype.drawCenter = function () {
            this.center = $('<div>').addClass('dot center').appendTo(this.$view);
        };
        DisplayContainer.prototype.setCenter = function (x, y) {
            this.regX = x;
            this.regY = y;
            if (this.center)
                this.center.css({ left: x, top: y });
            return this;
        };
        DisplayContainer.prototype.applyReg = function () {
            this.view.style[this.origin] = this.regX + 'px ' + this.regY + 'px ';
            return this;
        };
        DisplayContainer.prototype.setAngle = function (ang) {
            // this.rotation= ang*this.DEG_TO_RAD;
            this.angle = ang;
            return this;
        };
        DisplayContainer.prototype.setScale = function (x) {
            this.scaleX = x;
            return this;
        };
        DisplayContainer.prototype.setRS = function (a, s) {
            this.scale = s;
            this.scaleX = s;
            this.scaleY = s;
            this.angle = a;
            this.apply();
        };
        DisplayContainer.prototype.setXY = function (x, y) {
            this.posX = x;
            this.posY = y;
            this.apply();
        };
        DisplayContainer.prototype.applyMatrix = function () {
            return this;
        };
        DisplayContainer.prototype.apply = function () {
            if (this.asMatrix) {
                var m = new _view.Matrix2D();
                m.rotate(this.angle);
                m.scale(this.scale, this.scale);
                this.view.style[this.transform] = 'matrix(' + m.toString() + ')';
            }
            else
                this.view.style[this.transform] = 'translate(' + this.posX + 'px,' + this.posY + 'px) rotate(' + this.angle + 'deg) scale(' + this.scale + ') translateZ(0)';
            this.ar = null;
            return this;
        };
        DisplayContainer.prototype.matrixToArray = function (str) {
            return str.split('(')[1].split(')')[0].split(',');
        };
        DisplayContainer.prototype.readMatrixVO = function () {
            var vo = new _view.MatrixVO();
            var ar = this.readMatrixAr();
            vo.a = ar[0];
            vo.b = ar[1];
            vo.c = ar[2];
            vo.d = ar[3];
            vo.tx = ar[4];
            vo.ty = ar[5];
            return vo;
        };
        DisplayContainer.prototype.readMatrixAr = function () {
            // var trans = this.style.getPropertyValue('-webkit-transform');
            //  console.log(trans);
            return this.matrixToArray(this.style.getPropertyValue('-webkit-transform')).map(Number);
            // return this.mCache
        };
        DisplayContainer.prototype.toGlobal = function (x, y) {
            if (!this.ar)
                this.ar = this.readMatrixAr();
            var ar = this.ar;
            var pt = new _view.Point();
            pt.x = x * ar[0] + y * ar[2] + ar[4];
            pt.y = x * ar[1] + y * ar[3] + ar[5];
            return pt;
        };
        DisplayContainer.prototype.globalToLocal = function (x, y, pt) {
            return this.getConcatenatedMatrix().invert().transformPoint(x, y, pt);
        };
        DisplayContainer.prototype.localToGlobal = function (x, y, pt) {
            return this.getConcatenatedMatrix().transformPoint(x, y, pt);
        };
        DisplayContainer.prototype.localToGlobalMatr = function (x, y) {
            return this.matrix.transformPoint(x, y);
        };
        DisplayContainer.prototype.getMatrix = function () {
            var o = this;
            var mtx = new _view.Matrix2D();
            console.log(mtx.toString());
            var nm = mtx.appendTransform(o.posX, o.posY, o.scaleX, o.scaleY, o.angle, o.skewX, o.skewY, o.regX, o.regY);
            console.log(nm.toString());
            return nm;
        };
        return DisplayContainer;
    })();
    _view.DisplayContainer = DisplayContainer;
})(view || (view = {}));
//# sourceMappingURL=DisplayContainer.js.map