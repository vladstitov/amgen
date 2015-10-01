/**
 * Created by Vlad on 8/28/2015.
 */
///<reference path="Test2.ts" />
var ui;
(function (ui) {
    var Tools = (function () {
        function Tools() {
            var _this = this;
            this.angle = 0;
            this.scale = 1;
            this.skew = 0;
            var tools = $('#tools');
            this.$rotate = tools.find('[data-id=rotate]:first').on('change', function () {
                _this.angle = (((_this.$rotate.val() - 50) / 50) * 360);
                if (_this.onRotate)
                    _this.onRotate(_this.angle);
                if (_this.onChange)
                    _this.onChange(_this.angle, _this.scale, _this.skew);
            });
            this.$scale = tools.find('[data-id=scale]:first').on('change', function () {
                var v = ((_this.$scale.val()) / 50);
                if (v < 0.2)
                    v = 0.2;
                _this.scale = v;
                if (_this.onScale)
                    _this.onScale(_this.scale);
                if (_this.onChange)
                    _this.onChange(_this.angle, _this.scale, _this.skew);
            });
            this.$skew = tools.find('[data-id=lay]:first').on('change', function () {
                var v = (_this.$skew.val() - 50) / 50;
                _this.skew = v;
                if (_this.onSkew)
                    _this.onSkew();
                if (_this.onChange)
                    _this.onChange(_this.angle, _this.scale, _this.skew);
            });
        }
        return Tools;
    })();
    ui.Tools = Tools;
})(ui || (ui = {}));
//# sourceMappingURL=Tools.js.map