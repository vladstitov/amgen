///<reference path="../libs/typings/jquery.d.ts" />
///<reference path="Matrix2D.ts" />
///<reference path="Tools.ts" />
///<reference path="TouchController.ts" />
///<reference path="TouchController3.ts" />
///<reference path="Renderer.ts" />
///<reference path="Renderer3.ts" />
///<reference path="DisplayContainer.ts" />
///<reference path="DisplaySimple.ts" />
var Test3 = (function () {
    function Test3() {
        var _this = this;
        this.render = new Renderer3();
        var ar = [{ x: 100, y: 100 }, { x: 800, y: 100 }, { x: 800, y: 800 }, { x: 100, y: 800 }];
        for (var i = 0, n = ar.length; i < n; i++) {
            var p = ar[i];
            var dot = $('<dot>').addClass('dot').data('x', p.x).data('y', p.y).text('x: ' + p.x + ' y: ' + p.y).css({ left: p.x, top: p.y });
            this.render.viewPort.addChild(dot);
        }
        setInterval(function () {
            var ar = _this.render.viewPort.children;
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                var p = _this.render.building.toGlobal(vo.data('x'), vo.data('y'));
                if (p)
                    vo.css({ left: p.x, top: p.y });
            }
        }, 2000);
    }
    return Test3;
})();
$(document).ready(function () {
    var test = new Test3();
});
//# sourceMappingURL=Test3.js.map