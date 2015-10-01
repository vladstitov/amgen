/**
 * Created by Vlad on 7/7/2015.
 *
 */
///<reference path="../libs/typings/jquery.d.ts" />
var view;
(function (view) {
    var Point = (function () {
        function Point() {
        }
        return Point;
    })();
    view.Point = Point;
    var MatrixVO = (function () {
        function MatrixVO() {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
        }
        return MatrixVO;
    })();
    view.MatrixVO = MatrixVO;
    var Matrix2D = (function () {
        function Matrix2D() {
            this.DEG_TO_RAD = Math.PI / 180;
            this.vo = new MatrixVO();
            // this.setValues(a, b, c, d, tx, ty);
            // this.identity = new Matrix2D(1,0,0,1,0,0);
        }
        Matrix2D.prototype.toString = function () {
            var vo = this.vo;
            return vo.a + ',' + vo.b + ',' + vo.c + ',' + vo.d + ',' + vo.tx + ',' + vo.ty;
        };
        Matrix2D.prototype.setAr = function (ar) {
            var vo = this.vo;
            vo.a = ar[0];
            vo.b = ar[1];
            vo.c = ar[2];
            vo.d = ar[3];
            vo.tx = ar[4];
            vo.ty = ar[5];
            return this;
        };
        Matrix2D.prototype.append = function (a, b, c, d, tx, ty) {
            var vo = this.vo;
            var a1 = vo.a;
            var b1 = vo.b;
            var c1 = vo.c;
            var d1 = vo.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                vo.a = a1 * a + c1 * b;
                vo.b = b1 * a + d1 * b;
                vo.c = a1 * c + c1 * d;
                vo.d = b1 * c + d1 * d;
            }
            vo.tx = a1 * tx + c1 * ty + vo.tx;
            vo.ty = b1 * tx + d1 * ty + vo.ty;
            return this;
        };
        Matrix2D.prototype.prepend = function (a, b, c, d, tx, ty) {
            var vo = this.vo;
            var a1 = vo.a;
            var c1 = vo.c;
            var tx1 = vo.tx;
            vo.a = a * a1 + c * vo.b;
            vo.b = b * a1 + d * vo.b;
            vo.c = a * c1 + c * vo.d;
            vo.d = b * c1 + d * vo.d;
            vo.tx = a * tx1 + c * vo.ty + tx;
            vo.ty = b * tx1 + d * vo.ty + ty;
            return this;
        };
        Matrix2D.prototype.appendMatrix = function (matrix) {
            var vo = matrix.vo;
            return this.append(vo.a, vo.b, vo.c, vo.d, vo.tx, vo.ty);
        };
        Matrix2D.prototype.prependMatrix = function (matrix) {
            var vo = matrix.vo;
            return this.prepend(vo.a, vo.b, vo.c, vo.d, vo.tx, vo.ty);
        };
        Matrix2D.prototype.appendTransform = function (x, y, scaleX, scaleY, angle, skewX, skewY, regX, regY) {
            var vo = this.vo;
            if (angle % 360) {
                var r = angle * this.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            }
            else {
                cos = 1;
                sin = 0;
            }
            if (skewX || skewY) {
                // TODO: can this be combined into a single append operation?
                skewX *= this.DEG_TO_RAD;
                skewY *= this.DEG_TO_RAD;
                this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            }
            else {
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            }
            if (regX || regY) {
                // append the registration offset:
                vo.tx -= regX * vo.a + regY * vo.c;
                vo.ty -= regX * vo.b + regY * vo.d;
            }
            return this;
        };
        Matrix2D.prototype.rotate = function (angle) {
            var vo = this.vo;
            angle = angle * this.DEG_TO_RAD;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var a1 = vo.a;
            var b1 = vo.b;
            vo.a = a1 * cos + vo.c * sin;
            vo.b = b1 * cos + vo.d * sin;
            vo.c = -a1 * sin + vo.c * cos;
            vo.d = -b1 * sin + vo.d * cos;
            return this;
        };
        Matrix2D.prototype.skew = function (skewX, skewY) {
            skewX = skewX * this.DEG_TO_RAD;
            skewY = skewY * this.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
            return this;
        };
        Matrix2D.prototype.scale = function (x, y) {
            var vo = this.vo;
            vo.a *= x;
            vo.b *= x;
            vo.c *= y;
            vo.d *= y;
            //this.tx *= x;
            //this.ty *= y;
            return this;
        };
        Matrix2D.prototype.copy = function (matrix) {
            var vo = this.vo;
            vo.a = matrix.vo.a;
            vo.b = matrix.vo.b;
            vo.c = matrix.vo.c;
            vo.d = matrix.vo.d;
            vo.tx = matrix.vo.tx;
            vo.ty = matrix.vo.ty;
            return this;
        };
        Matrix2D.prototype.translate = function (x, y) {
            var vo = this.vo;
            vo.tx += vo.a * x + vo.c * y;
            vo.ty += vo.b * x + vo.d * y;
            return this;
        };
        Matrix2D.prototype.identity = function () {
            this.vo = new MatrixVO();
            return this;
        };
        Matrix2D.prototype.invert = function () {
            var vo = this.vo;
            var a1 = vo.a;
            var b1 = vo.b;
            var c1 = vo.c;
            var d1 = vo.d;
            var tx1 = vo.tx;
            var n = a1 * d1 - b1 * c1;
            vo.a = d1 / n;
            vo.b = -b1 / n;
            vo.c = -c1 / n;
            vo.d = a1 / n;
            vo.tx = (c1 * vo.ty - d1 * tx1) / n;
            vo.ty = -(a1 * vo.ty - b1 * tx1) / n;
            return this;
        };
        Matrix2D.prototype.isIdentity = function () {
            var vo = this.vo;
            return vo.tx === 0 && vo.ty === 0 && vo.a === 1 && vo.b === 0 && vo.c === 0 && vo.d === 1;
        };
        Matrix2D.prototype.equals = function (matrix) {
            var vo = this.vo;
            return vo.tx === matrix.vo.tx && vo.ty === matrix.vo.ty && vo.a === matrix.vo.a && vo.b === matrix.vo.b && vo.c === matrix.vo.c && vo.d === matrix.vo.d;
        };
        Matrix2D.prototype.transformPoint = function (x, y, pt) {
            var vo = this.vo;
            pt = pt || new Point();
            pt.x = x * vo.a + y * vo.c + vo.tx;
            pt.y = x * vo.b + y * vo.d + vo.ty;
            return pt;
        };
        return Matrix2D;
    })();
    view.Matrix2D = Matrix2D;
})(view || (view = {}));
//# sourceMappingURL=Matrix2D.js.map