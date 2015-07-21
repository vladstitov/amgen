/**
 * Created by Vlad on 7/7/2015.
 */
var view;
(function (view) {
    var Point = (function () {
        function Point() {
        }
        return Point;
    })();
    view.Point = Point;
    var DisplayObject = (function () {
        function DisplayObject() {
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.skewX = 0;
            this.skewY = 0;
            this.regX = 0;
            this.regY = 0;
            this.getConcatenatedMatrix = function (matrix) {
                var o = this;
                var mtx = this.getMatrix(matrix);
                while (o = o.parent) {
                    mtx.prependMatrix(o.getMatrix(o.matrix));
                }
                return mtx;
            };
        }
        DisplayObject.prototype.setTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            this.x = x || 0;
            this.y = y || 0;
            this.scaleX = scaleX == null ? 1 : scaleX;
            this.scaleY = scaleY == null ? 1 : scaleY;
            this.rotation = rotation || 0;
            this.skewX = skewX || 0;
            this.skewY = skewY || 0;
            this.regX = regX || 0;
            this.regY = regY || 0;
            return this;
        };
        DisplayObject.prototype.localToGlobal = function (x, y, pt) {
            return this.getConcatenatedMatrix(this.matrix).transformPoint(x, y, pt || new Point());
        };
        DisplayObject.prototype.getMatrix = function (matrix) {
            var o = this;
            var mtx = matrix && matrix.identity() || new Matrix2D(1, 0, 0, 1, 0, 0);
            return o.transformMatrix ? mtx.copy(o.transformMatrix) : mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        };
        return DisplayObject;
    })();
    view.DisplayObject = DisplayObject;
    var Matrix2D = (function () {
        function Matrix2D(a, b, c, d, tx, ty) {
            this.DEG_TO_RAD = Math.PI / 180;
            this.setValues(a, b, c, d, tx, ty);
            // this.identity = new Matrix2D(1,0,0,1,0,0);
        }
        Matrix2D.prototype.setValues = function (a, b, c, d, tx, ty) {
            this.a = (a == null) ? 1 : a;
            this.b = b || 0;
            this.c = c || 0;
            this.d = (d == null) ? 1 : d;
            this.tx = tx || 0;
            this.ty = ty || 0;
            return this;
        };
        Matrix2D.prototype.append = function (a, b, c, d, tx, ty) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                this.a = a1 * a + c1 * b;
                this.b = b1 * a + d1 * b;
                this.c = a1 * c + c1 * d;
                this.d = b1 * c + d1 * d;
            }
            this.tx = a1 * tx + c1 * ty + this.tx;
            this.ty = b1 * tx + d1 * ty + this.ty;
            return this;
        };
        Matrix2D.prototype.prepend = function (a, b, c, d, tx, ty) {
            var a1 = this.a;
            var c1 = this.c;
            var tx1 = this.tx;
            this.a = a * a1 + c * this.b;
            this.b = b * a1 + d * this.b;
            this.c = a * c1 + c * this.d;
            this.d = b * c1 + d * this.d;
            this.tx = a * tx1 + c * this.ty + tx;
            this.ty = b * tx1 + d * this.ty + ty;
            return this;
        };
        Matrix2D.prototype.appendMatrix = function (matrix) {
            return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        };
        Matrix2D.prototype.prependMatrix = function (matrix) {
            return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        };
        Matrix2D.prototype.appendTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
            if (rotation % 360) {
                var r = rotation * this.DEG_TO_RAD;
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
                this.tx -= regX * this.a + regY * this.c;
                this.ty -= regX * this.b + regY * this.d;
            }
            return this;
        };
        Matrix2D.prototype.rotate = function (angle) {
            angle = angle * this.DEG_TO_RAD;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var a1 = this.a;
            var b1 = this.b;
            this.a = a1 * cos + this.c * sin;
            this.b = b1 * cos + this.d * sin;
            this.c = -a1 * sin + this.c * cos;
            this.d = -b1 * sin + this.d * cos;
            return this;
        };
        Matrix2D.prototype.skew = function (skewX, skewY) {
            skewX = skewX * this.DEG_TO_RAD;
            skewY = skewY * this.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
            return this;
        };
        Matrix2D.prototype.scale = function (x, y) {
            this.a *= x;
            this.b *= x;
            this.c *= y;
            this.d *= y;
            //this.tx *= x;
            //this.ty *= y;
            return this;
        };
        Matrix2D.prototype.copy = function (matrix) {
            return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        };
        Matrix2D.prototype.translate = function (x, y) {
            this.tx += this.a * x + this.c * y;
            this.ty += this.b * x + this.d * y;
            return this;
        };
        Matrix2D.prototype.identity = function () {
            this.a = 1;
            this.d = 1;
            this.b = 0;
            this.c = 0;
            this.tx = 0;
            this.ty = 0;
            return this;
        };
        Matrix2D.prototype.invert = function () {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var n = a1 * d1 - b1 * c1;
            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = (c1 * this.ty - d1 * tx1) / n;
            this.ty = -(a1 * this.ty - b1 * tx1) / n;
            return this;
        };
        Matrix2D.prototype.isIdentity = function () {
            return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
        };
        Matrix2D.prototype.equals = function (matrix) {
            return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
        };
        Matrix2D.prototype.transformPoint = function (x, y, pt) {
            pt = pt || new Point();
            pt.x = x * this.a + y * this.c + this.tx;
            pt.y = x * this.b + y * this.d + this.ty;
            return pt;
        };
        return Matrix2D;
    })();
    view.Matrix2D = Matrix2D;
})(view || (view = {}));
//# sourceMappingURL=Matrix2D.js.map