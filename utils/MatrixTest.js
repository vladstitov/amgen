/**
 * Created by Vlad on 8/14/2015.
 */
///<reference path="../libs/typings/jquery.d.ts" />
var MatrixTest = (function () {
    function MatrixTest() {
        var _this = this;
        this.current = 0;
        this.counter = 0;
        var div = document.getElementById('Container');
        console.log(div.style);
        this.div = div;
        var prefixes = ['', '-moz-', '-webkit-', '-o-', '-ms-'];
        var transform = 'transform';
        var vendorProp;
        if (!(transform in div.style)) {
            for (var i = 0; i < prefixes.length; ++i) {
                vendorProp = prefixes[i] + transform;
                if (vendorProp in div.style) {
                    transform = vendorProp;
                    break;
                }
            }
        }
        this.transform = transform;
        console.log(transform);
        var Matrix = window['WebKitCSSMatrix'] || window['MSCSSMatrix'] || window['CSSMatrix'];
        div.style.width = div.style.height = '1000px';
        //div.style.backgroundColor = 'red';
        var arr1 = [];
        var arr2 = [];
        var j = 0;
        for (var i = 0; i < 1000; i++) {
            arr1.push(new Matrix().rotate(1, 1, i).scale(i / 1000, i / 1000, i).translate(1, 1) + '');
            arr2.push('rotateZ(' + i + 'deg).translate(' + i + 'px, ' + i + 'px)');
        }
        this.ar1 = arr1;
        this.ar2 = arr2;
        $('[data-id=btn1]:first').on('click', function () { return _this.test1(); });
        $('[data-id=btn2]:first').on('click', function () { return _this.test2(); });
    }
    MatrixTest.prototype.onAnimationFrame = function (ts) {
        var _this = this;
        this.total += ts - this.last;
        this.last = ts;
        if (this.counter > 100) {
            this.counter = 0;
            this.total = 0;
        }
        console.log(this.current);
        this.div.style[this.transform] = this.ar1[this.current];
        this.current++;
        if (this.current < this.max)
            requestAnimationFrame(function (ts) { return _this.onAnimationFrame(ts); });
    };
    MatrixTest.prototype.test1 = function () {
        var now = Date.now();
        this.max = this.ar1.length;
        this.current = 0;
        this.onAnimationFrame(0);
        // console.log(this.div.style[this.transform]);
        //  for (var i = 0,n=this.ar1.length; i < n; i++) {
        //   this.div.style[this.transform] = this.ar1[i];
        //  }
        // console.log(Date.now()-now);
    };
    MatrixTest.prototype.test2 = function () {
        var now = Date.now();
        for (var i = 0, n = this.ar2.length; i < n; i++) {
            this.div.style[this.transform] = this.ar2[i];
        }
        console.log(Date.now() - now);
    };
    return MatrixTest;
})();
//# sourceMappingURL=MatrixTest.js.map