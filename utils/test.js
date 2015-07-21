/**
 * Created by Vlad on 7/15/2015.
 */
///<reference path="../libs/typings/jquery.d.ts" />
var Test = (function () {
    function Test() {
        var _this = this;
        var tools = $('#tools');
        var c = new Container($('#building_c'));
        c.setBuilding(new Building($('#building')));
        this.c = c;
        var b = this.c.getBuilding();
        var dots = [];
        var dot = new Dot(' dot 100x100', new Point(100, 100));
        // dot.offset(-200,-300);
        b.getFloor().on('click', function (evt) { return _this.onFloorClick(evt); });
        // dot.setPos(b.transformPoint(dot.p));
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
        c.setOffset(500, 500);
        c.refreshDots();
        var that = this;
        var rotate = tools.find('[data-id=rotate]:first').on('input', function () {
            var v = ((rotate.val() - 50) / 50);
            c.rotate(v);
        });
        var scale = tools.find('[data-id=scale]:first').on('input', function () {
            //  console.log( scale.val());
            var v = ((scale.val()) / 50);
            if (v < 0.2)
                v = 0.2;
            c.scale(v);
            // that.refreshDots();
        });
        console.log(rotate);
    }
    Test.prototype.onFloorClick = function (evt) {
        console.log(evt);
        this.c.setOffset(evt.offsetX, evt.offsetY);
        this.c.refreshDots();
    };
    return Test;
})();
var Container = (function () {
    function Container(view) {
        // view.on('click',(evt)=>this.onClick(evt));
        this.view = view;
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
        this.b.rotate(v);
        this.refreshDots();
    };
    Container.prototype.scale = function (v) {
        this.b.scale(v);
        this.refreshDots();
    };
    Container.prototype.setBuilding = function (b) {
        this.b = b;
    };
    Container.prototype.getBuilding = function () {
        return this.b;
    };
    Container.prototype.setOffset = function (x, y) {
        var ar = this.dots;
        //  this.view.css('left',x+'px').css('top',y+'px');
        this.view.css('left', x + 'px').css('top', y + 'px');
        this.offsetx = x;
        this.offsety = y;
        this.b.setoOffset(0 - x, 0 - y);
        for (var i = 0, n = ar.length; i < n; i++)
            ar[i].offset(0 - x, 0 - y);
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
        this.setPos(this.m.transformPoint(this.p.x + this.offx, this.p.y + this.offy));
    };
    Dot.prototype.setMatrix = function (m) {
        this.m = m;
    };
    Dot.prototype.offset = function (x, y) {
        // this.p.x+=x;
        // this.p.y+=y;
        this.offx = x;
        this.offy = y;
    };
    Dot.prototype.setPos = function (p) {
        this.view.css({ left: p.x, top: p.y });
    };
    return Dot;
})();
var Building = (function () {
    function Building(view) {
        this.view = view;
        this.r = 0;
        this.s = 1;
        this.m = new Matrix(1, 0, 0, 1, 0, 0);
        this.apply();
        this.floor = view.find('.floor:first');
    }
    Building.prototype.getFloor = function () {
        return this.floor;
    };
    Building.prototype.setoOffset = function (x, y) {
        this.offsetx = x;
        this.offsety = y;
        this.floor.css('left', x + 'px').css('top', y + 'px');
    };
    Building.prototype.cloneM = function () {
        return this.m.clone();
    };
    Building.prototype.transformPoint = function (p) {
        return this.m.transformPoint(p.x, p.y);
    };
    Building.prototype.rotate = function (ang) {
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
    Building.prototype.scale = function (v) {
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
    Building.prototype.apply = function () {
        var ar = this.m.get();
        //  console.log(ar);
        this.view.css('transform', 'matrix(' + ar + ')');
    };
    return Building;
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