/**
 * Created by Vlad on 7/15/2015.
 */
///<reference path="../libs/typings/jquery.d.ts" />
///<reference path="../libs/typings/svgjs.d.ts" />
var Test = (function () {
    function Test() {
        var _this = this;
        var tools = $('#tools');
        this.chkAll = $('#chkAll').on('change', function () { return _this.onCheckAllChange(); });
        var c = new Container($('#building_c'));
        c.addAxis(new Axis($('#Axis')));
        c.addAxis(new Axis($('#Axis2')));
        this.c = c;
        var b = this.c.getAxis(1);
        var dots = [];
        //  var dot = new Dot(' dot 100x100',new Point(100,100));
        // dot.offset(-200,-300);
        // b.getFloor().on('click',(evt)=>this.onFloorClick(evt));
        // dot.setPos(b.transformPoint(dot.p));
        var pozs = [{ "x": 215.17145447432995, "y": 212.76172678917646 }, { "x": 56.142378225922585, "y": 265.20573887974024 }, { "x": 730.9521438553929, "y": 608.140772394836 }, { "x": 782.8789498656988, "y": 177.1478684619069 }, { "x": 381.6274179145694, "y": 589.02433142066 }, { "x": 21.496057510375977, "y": 325.3415632992983 }, { "x": 98.4149869531393, "y": 77.45092883706093 }, { "x": 295.6329019740224, "y": 628.1002461910248 }, { "x": 514.7975726053119, "y": 325.2354299649596 }, { "x": 73.39946758002043, "y": 87.24315669387579 }, { "x": 3.154577501118183, "y": 7.934784330427647 }, { "x": 661.1742189154029, "y": 87.06492688506842 }, { "x": 283.5581509396434, "y": 558.9896366000175 }, { "x": 166.29401128739119, "y": 657.5469741597772 }, { "x": 363.0776338279247, "y": 0.2620251849293709 }, { "x": 721.845443174243, "y": 346.03761434555054 }, { "x": 768.4383545070887, "y": 535.2868840098381 }, { "x": 79.52180933207273, "y": 231.59336410462856 }, { "x": 421.9799358397722, "y": 230.70451095700264 }, { "x": 449.42026175558567, "y": 599.0188645198941 }, { "x": 296.1183352395892, "y": 775.3022788092494 }, { "x": 213.69051281362772, "y": 137.29318529367447 }, { "x": 242.2224096953869, "y": 718.5798559337854 }, { "x": 47.82835468649864, "y": 121.1811589077115 }, { "x": 74.13299195468426, "y": 436.66759207844734 }, { "x": 158.99365041404963, "y": 208.4112834185362 }, { "x": 87.66234237700701, "y": 543.5546413064003 }, { "x": 95.03505080938339, "y": 771.7841187492013 }, { "x": 771.6460132971406, "y": 136.81608345359564 }, { "x": 392.01107304543257, "y": 676.8729563802481 }];
        for (var i = 0, n = pozs.length; i < n; i++) {
            var x = pozs[i].x; //Math.random()*800;
            var y = pozs[i].y; // Math.random()*800;
            //  pozs.push({x:x,y:y});
            dots.push(new Dot(i, 'D' + i + ' x:' + x + ' y:' + y, new Point(x, y)));
        }
        // dots.push(new Dot(' dot 100x100',new Point(100,100)));
        // dots.push(new Dot('dot 800x800',new Point(800,800)));
        //dots.push(new Dot('dot 100x800',new Point(100,800)));
        //dots.push(new Dot('dot 800x100',new Point(800,100)));
        // dots.push(new Dot('dot000 2',b.transformPoint(new Point(100-200,100-300))));
        //dots.push(new Dot('dot000 3',b.transformPoint(new Point(100-200,800-300))));
        // dots.push(new Dot('dot000 4',b.transformPoint(new Point(800-200,100-300))));
        var ar = dots;
        for (var i = 0, n = ar.length; i < n; i++) {
            ar[i].setMatrix(b.m);
        }
        c.setDots(dots);
        // c.setOffset(500,500);
        // c.setDelta(0,100,0);
        c.setDelta(0, 0, 0);
        c.screenx = 450;
        c.screeny = 450;
        c.setCenter(450, 450);
        c.setDotsCenter(450, 450);
        // c.setCenter(200,200);
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
            //console.log(v);
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
    Test.prototype.showDots = function (isAll) {
        // var ar =this.
        //  for (var i = 0, n = ar.length; i < n; i++) {
        //    var vo = ar[i];
        // }
    };
    Test.prototype.onCheckAllChange = function () {
        // console.log(this.chkAll.prop('checked'));
        this.c.checkForCollision();
        this.showDots(this.chkAll.prop('checked'));
    };
    return Test;
})();
var Container = (function () {
    function Container(view) {
        var _this = this;
        this.view = view;
        this.axs = [];
        this.offsetx = 0;
        this.offsety = 0;
        this.screenx = 0;
        this.screeny = 0;
        console.log(view);
        this.parent = view.parent();
        this.parent.on('mousedown', function (evt) { return _this.onMouseDown(evt); });
        this.parent.on('mouseup', function (evt) { return _this.onMouseUp(evt); });
    }
    Container.prototype.refreshDots = function () {
        //  var m=this.b.m;
        var ar = this.dots;
        for (var i = 0, n = ar.length; i < n; i++)
            ar[i].refresh();
        this.checkForCollision();
        //dot.setPos(m.transformPoint(dot.p.x,dot.p.y));
    };
    Container.prototype.checkForCollision = function () {
        var ar = this.dots;
        for (var i = 0, n = ar.length; i < n; i++)
            ar[i].checkCollision();
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
        //  this.view.css('left',x+'px').css('top',y+'px');
        this.view.css('left', x + 'px').css('top', y + 'px');
        this.parent.css('left', this.screenx - x + 'px').css('top', this.screeny - y + 'px');
        this.offsetx = x;
        this.offsety = y;
        // this.b.setCenter(0-x,0-y);
        var ar = this.axs;
        for (var i = 0, n = ar.length; i < n; i++)
            ar[i].setCenter(0 - x, 0 - y);
    };
    Container.prototype.setDotsCenter = function (x, y) {
        var ar = this.dots;
        for (var i = 0, n = ar.length; i < n; i++)
            ar[i].setCenter(0 - x, 0 - y);
    };
    Container.prototype.setDots = function (d) {
        this.dots = d;
        var ar = d;
        var cont = $('#overlay');
        var svg = $('<div>').attr('id', 'Draw').appendTo(cont);
        var dots = $('<div>').attr('id', 'Dots').appendTo(cont);
        var draw = SVG('Draw').size(800, 800);
        for (var i = 0, n = ar.length; i < n; i++) {
            ar[i].setDraw(draw);
            ar[i].addTo(dots);
            if (i < n - 1)
                ar[i].setOthers(ar.slice(i + 1));
        }
        var draw = SVG('Draw').size(800, 800);
    };
    Container.prototype.onMouseDown = function (evt) {
        var _this = this;
        this.view.on('mousemove', function (evt) { return _this.onMouseMove(evt); });
        this.startx = evt.clientX;
        this.starty = evt.clientY;
        this.prevx = evt.clientX;
        this.prevy = evt.clientY;
    };
    Container.prototype.addOffset = function (x, y) {
        this.setCenter(this.offsetx + x, this.offsety + y);
        this.setDotsCenter(this.offsetx, this.offsety);
        this.refreshDots();
    };
    Container.prototype.onMouseMove = function (evt) {
        var dx = evt.clientX - this.prevx;
        var dy = evt.clientY - this.prevy;
        this.prevx = evt.clientX;
        this.prevy = evt.clientY;
        // this.b.addDelta(dx,dy);// Matrix dx and dy don't work
        this.addOffset(-dx, -dy);
        //this.addD(dx,dy);
        //  console.log(evt);
    };
    Container.prototype.onMouseUp = function (evt) {
        this.view.off('mousemove');
    };
    // private onClick(evt:JQueryEventObject):void{
    //    console.log(evt);
    // }
    Container.prototype.setPos = function (x, y) {
    };
    return Container;
})();
var Dot = (function () {
    function Dot(id, label, p) {
        this.p = p;
        this.id = id;
        this.text = $('<div>').text(label);
        this.view = $('<div>').addClass('dot').append(this.text);
        this.setPos(p);
    }
    Dot.prototype.setDraw = function (svg) {
        // this.rect = svg.rect(10,10);
    };
    Dot.prototype.setOthers = function (ar) {
        this.others = ar;
    };
    Dot.prototype.setHit = function (id) {
        if (!this.isCollided) {
            this.isCollided = true;
            this.view.addClass('colide');
            this.text.text(' D ' + this.id + ' hitted by  ' + id + ' ' + this.x.toFixed() + ' ' + this.y.toFixed() + ' ' + this.w.toFixed() + ' ' + this.h.toFixed());
        }
    };
    Dot.prototype.resetHit = function () {
        if (this.isCollided) {
            this.text.text(' D ' + this.id + ' no collision ' + this.x.toFixed() + ' ' + this.y.toFixed() + ' ' + this.w.toFixed() + ' ' + this.h.toFixed());
            this.view.removeClass('colide');
            this.isCollided = false;
        }
    };
    Dot.prototype.addTo = function (cont) {
        cont.append(this.view);
        //  console.log(this.x+'  '+this.y);
        var rec = this.view.children()[0].getBoundingClientRect();
        this.h = rec.height;
        this.w = rec.width;
        this.l_dx = (-this.w / 2);
        this.l_dy = (-this.h - 5);
        this.text.width(this.w);
        this.text.text(' D ' + this.id + ' - ' + this.x.toFixed() + ' ' + this.y.toFixed() + ' ' + this.w.toFixed() + ' ' + this.h.toFixed());
        this.text.css('transform', 'translate(' + this.l_dx + 'px,' + this.l_dy + 'px)');
        //this.view.width(this.w);
        //this.view.height(this.h);
        // this.rect.attr({'width':this.w,'height':this.h,'fill':'#fff'});
        // console.log(this.view.children()[0].getBoundingClientRect());
    };
    Dot.prototype.checkCollision = function () {
        if (!this.others)
            return;
        var ar = this.others;
        for (var i = 0, n = ar.length; i < n; i++) {
            if (ar[i].isCollided)
                continue;
            if (this.isCollide(ar[i])) {
                ar[i].setHit(this.id);
                this.text.text(' D' + this.id + ' colided with D' + ar[i].id + ' ' + this.x.toFixed() + ' ' + this.y.toFixed() + ' ' + this.w.toFixed() + ' ' + this.h.toFixed());
                this.view.addClass('colide');
                this.isCollided = true;
                break;
            }
        }
        //if(i==n && this.isCollide) {
        //  }
    };
    Dot.prototype.isCollide = function (dot) {
        return (this.x < dot.x + dot.w && this.x + this.w > dot.x && this.y < dot.y + dot.h && this.h + this.y > dot.y);
    };
    Dot.prototype.refresh = function () {
        this.resetHit();
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
        this.lx = p.x + this.l_dx;
        this.ly = p.y + this.l_dy;
        this.px = p.x;
        this.py = p.y;
        this.x = p.x; //-(this.w/2);
        this.y = p.y; //-(this.h);
        // if(this.rect){
        //  this.rect.attr('x', this.x);
        // this.rect.attr('y', this.y);
        // }
        // this.view.css({left:p.x,top:p.y});
        this.view.css('transform', 'translate(' + this.x + 'px,' + this.y + 'px)');
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
    Axis.prototype.addDelta = function (x, y) {
        var m = this.m;
        m.tx += x;
        m.ty += y;
        this.apply();
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