/**
 * Created by Vlad on 7/15/2015.
 */
///<reference path="../libs/typings/jquery.d.ts" />
var Test = (function () {
    function Test() {
        var _this = this;
        var tools = $('#tools');
        var c = new Container($('#building_c'));
        c.addAxis(new Axis($('#Axis')));
        c.addAxis(new Axis($('#Axis2')));
        this.c = c;
        var b = this.c.getAxis(1);
        var dots = [];
        //  var dot = new Dot(' dot 100x100',new Point(100,100));
        // dot.offset(-200,-300);
        b.getFloor().on('click', function (evt) { return _this.onFloorClick(evt); });
        for (var i = 0, n = 300; i < n; i++) {
            var x = Math.random() * 800;
            var y = Math.random() * 800;
            dots.push(new Dot(' dot ' + x + 'x' + y, new Point(x, y)));
        }
        dots.push(new Dot(' dot 100x100', new Point(100, 100)));
        dots.push(new Dot('dot 800x800', new Point(800, 800)));
        dots.push(new Dot('dot 100x800', new Point(100, 800)));
        dots.push(new Dot('dot 800x100', new Point(800, 100)));
        // dots.push(new Dot('dot000 2',b.transformPoint(new Point(100-200,100-300))));
        //dots.push(new Dot('dot000 3',b.transformPoint(new Point(100-200,800-300))));
        // dots.push(new Dot('dot000 4',b.transformPoint(new Point(800-200,100-300))));
        var ar = dots;
        for (var i = 0, n = ar.length; i < n; i++)
            ar[i].setMatrix(b.m);
        c.setDots(dots);
        // c.setOffset(500,500);
        // c.setDelta(0,100,0);
        c.setDelta(0, 0, 0);
        c.setCenter(450, 450);
        c.refreshDots();
        var that = this;
        var rotate = tools.find('[data-id=rotate]:first').on('change', function () {
            var v = ((rotate.val() - 50) / 50);
            c.rotate(v);
        });
        var scale = tools.find('[data-id=scale]:first').on('change', function () {
            //  console.log( scale.val());
            var v = ((scale.val()) / 50);
            if (v < 0.2)
                v = 0.2;
            c.scale(v);
            // that.refreshDots();
        });
        var skew = tools.find('[data-id=lay]:first').on('change', function () {
            var v = (skew.val() - 50) / 50;
            console.log(v);
            c.setDelta(0, v * 200, 0);
            c.skew(v);
            // c.refreshDots();
        });
        console.log(rotate);
    }
    Test.prototype.onFloorClick = function (evt) {
        console.log(evt);
        // this.c.setDelta(evt.offsetX,evt.offsetY);
        this.c.refreshDots();
    };
    return Test;
})();
var Container = (function () {
    function Container(view) {
        // view.on('click',(evt)=>this.onClick(evt));
        this.view = view;
        this.axs = [];
        this.offsetx = 0;
        this.offsety = 0;
    }
    Container.prototype.refreshDots = function () {
        //  var m=this.b.m;
        var ar = this.dots;
        for (var i = 0, n = ar.length; i < n; i++) {
            ar[i].refresh();
        }
    };
    Container.prototype.rotate = function (v) {
        // this.b.rotate(v);
        var ar = this.axs;
        for (var i = 0, n = ar.length; i < n; i++)
            ar[i].rotate(v);
        this.refreshDots();
    };
    Container.prototype.scale = function (v) {
        var ar = this.axs;
        for (var i = 0, n = ar.length; i < n; i++)
            ar[i].scale(v);
        //this.b.scale(v);
        this.refreshDots();
    };
    Container.prototype.skew = function (v) {
        var ar = this.axs;
        for (var i = 0, n = ar.length; i < n; i++)
            ar[i].skew(v);
        // this.b.skew(v);
        this.refreshDots();
    };
    Container.prototype.addAxis = function (b) {
        this.b = b;
        this.axs.push(b);
    };
    Container.prototype.getAxis = function (i) {
        return this.axs[i];
    };
    Container.prototype.setDelta = function (x, y, i) {
        this.axs[i].setDelta(x, y);
    };
    Container.prototype.setCenter = function (x, y) {
        var ar = this.dots;
        //  this.view.css('left',x+'px').css('top',y+'px');
        this.view.css('left', x + 'px').css('top', y + 'px');
        this.offsetx = x;
        this.offsety = y;
        for (var i = 0, n = ar.length; i < n; i++)
            ar[i].setCenter(0 - x, 0 - y);
        // this.b.setCenter(0-x,0-y);
        var ar2 = this.axs;
        for (var i = 0, n = ar2.length; i < n; i++)
            ar2[i].setCenter(0 - x, 0 - y);
    };
    Container.prototype.setDots = function (d) {
        this.dots = d;
        var ar = d;
        for (var i = 0, n = ar.length; i < n; i++)
            $('#overlay').append(ar[i].view);
    };
    // private onClick(evt:JQueryEventObject):void{
    //    console.log(evt);
    // }
    Container.prototype.setPos = function (x, y) {
    };
    return Container;
})();
var Dot = (function () {
    function Dot(label, p) {
        this.p = p;
        this.view = $('<div>').html(label).addClass('dot');
        this.setPos(p);
    }
    Dot.prototype.refresh = function () {
        this.setPos(this.m.transformPoint((this.p.x + this.c_x), (this.p.y + this.c_y)));
    };
    Dot.prototype.setMatrix = function (m) {
        this.m = m;
    };
    Dot.prototype.setCenter = function (x, y) {
        // this.p.x+=x;
        // this.p.y+=y;
        this.c_x = x;
        this.c_y = y;
    };
    Dot.prototype.setPos = function (p) {
        // this.view.css({left:p.x,top:p.y});
        this.view.css('transform', 'translate(' + p.x + 'px,' + p.y + 'px)');
    };
    return Dot;
})();
var Axis = (function () {
    function Axis(view) {
        this.view = view;
        this.r = 0;
        this.s = 1;
        $('<div>').addClass('zero').appendTo(view);
        this.m = new Matrix(1, 0, 0, 1, 0, 0);
        this.apply();
        this.floor = view.find('.floor:first');
    }
    //offsetx:number;
    //offsety:number;
    Axis.prototype.getFloor = function () {
        return this.floor;
    };
    Axis.prototype.setCenter = function (x, y) {
        //this.offsetx=x;
        // this.offsety=y;
        this.floor.css('left', x + 'px').css('top', y + 'px');
    };
    Axis.prototype.cloneM = function () {
        return this.m.clone();
    };
    Axis.prototype.transformPoint = function (p) {
        return this.m.transformPoint(p.x, p.y);
    };
    Axis.prototype.setDelta = function (x, y) {
        var m = this.m;
        m.tx = x;
        m.ty = y;
        this.apply();
    };
    Axis.prototype.skew = function (v) {
        var sx = -v;
        var m = this.m;
        console.log(sx);
        var sc = (1 - Math.abs(v));
        console.log(sc);
        m.c = sx;
        m.d = sc;
        this.apply();
    };
    Axis.prototype.rotate = function (ang) {
        // console.log('rotate '+(ang)+ ' now '+ this.r);
        var d = ang - this.r;
        ///  console.log('rotate '+(d));
        var m = this.m;
        var a = d * Math.PI;
        var cos = Math.cos(a);
        var sin = Math.sin(a);
        var a1 = m.a;
        var b1 = m.b;
        m.a = a1 * cos + m.c * sin;
        m.b = b1 * cos + m.d * sin;
        m.c = -a1 * sin + m.c * cos;
        m.d = -b1 * sin + m.d * cos;
        this.m = m;
        this.r = ang;
        this.apply();
    };
    Axis.prototype.scale = function (v) {
        //console.log('scale '+v);
        var x = v / this.s;
        var y = v / this.s;
        var m = this.m; //new Matrix()
        m.a *= x;
        m.b *= x;
        m.c *= y;
        m.d *= y;
        // m.tx *= x;
        // m.ty *= y;
        this.s = v;
        this.m = m;
        this.apply();
    };
    Axis.prototype.apply = function () {
        var ar = this.m.get();
        //  console.log(ar);
        this.view.css('transform', 'matrix(' + ar + ')');
    };
    return Axis;
})();
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
})();
var Matrix = (function () {
    function Matrix(a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        this.clone = function () {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        };
    }
    Matrix.prototype.get = function () {
        return [this.a, this.b, this.c, this.d, this.tx, this.ty];
    };
    Matrix.prototype.transformPoint = function (x, y) {
        var pt = new Point(0, 0);
        var m = this;
        pt.x = x * m.a + y * m.c + m.tx;
        pt.y = (x * m.b + y * m.d + m.ty);
        return pt;
    };
    Matrix.prototype.append = function (a, b, c, d, tx, ty) {
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
    Matrix.prototype.setReg = function (regX, regY) {
        this.tx -= regX * this.a + regY * this.c;
        this.ty -= regX * this.b + regY * this.d;
        return this;
    };
    Matrix.prototype.prepend = function (a, b, c, d, tx, ty) {
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
    return Matrix;
})();
$(document).ready(function () {
    var test = new Test();
});
//# sourceMappingURL=test.js.map