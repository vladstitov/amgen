/**
 * Created by Vlad on 8/28/2015.
 */
    ///<reference path="Test2.ts" />
module ui {

    export class Tools {

        angle:number = 0;
        scale:number = 1;
        skew:number = 0;
        onChange:Function;
        private $rotate:JQuery
        private $scale:JQuery;
        private $skew:JQuery;

        constructor() {
            var tools = $('#tools');


            this.$rotate = tools.find('[data-id=rotate]:first').on('change', ()=> {
                this.angle = (((this.$rotate.val() - 50) / 50) * 360);
                if (this.onChange)this.onChange();
            })

            this.$scale = tools.find('[data-id=scale]:first').on('change', ()=> {
                var v = ((this.$scale.val()) / 50);
                if (v < 0.2) v = 0.2;
                this.scale = v;
                if (this.onChange)this.onChange();
            })

            this.$skew = tools.find('[data-id=lay]:first').on('change', ()=> {
                var v = (this.$skew.val() - 50) / 50;
                this.skew = v;
                if (this.onChange)this.onChange();
            })
        }


    }
}