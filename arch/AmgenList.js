/**
 * Created by Vlad on 6/4/2015.
 */
///<reference path="AmgenBuilding.ts" />
$.fn.scrollTo = function (target, options, callback) {
    if (typeof options == 'function' && arguments.length == 2) {
        callback = options;
        options = target;
    }
    var settings = $.extend({
        scrollTarget: target,
        offsetTop: 50,
        duration: 500,
        easing: 'swing'
    }, options);
    return this.each(function () {
        var scrollPane = $(this);
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({ scrollTop: scrollY }, parseInt(settings.duration), settings.easing, function () {
            if (typeof callback == 'function') {
                callback.call(this);
            }
        });
    });
};
var amgen;
(function (amgen) {
    var ListNano = (function () {
        function ListNano() {
            this.isRendered = false;
            this.nano = $('<div>').addClass('nano');
            this.list = $('<ul>').addClass('nano-content').appendTo(this.nano);
            // console.log(this.list)
        }
        ListNano.prototype.addListeners = function () {
            var that = this;
            this.list.on('click', 'li', function (evt) {
                that.onClick($(evt.currentTarget));
            });
            this.list.on('mouseover', 'li', function (evt) {
                that.onMouseover($(evt.currentTarget));
            });
        };
        ListNano.prototype.selectElement = function (el) {
            if (this.selectedEl)
                this.selectedEl.removeClass('selected');
            if (el)
                el.addClass('selected');
            this.selectedEl = el;
        };
        ListNano.prototype.onClick = function (el) {
            var i = el.data('i');
            if (isNaN(i))
                return;
            var item = this.data[i];
            if (item) {
                this.selectElement(el);
                this.destinationClicked(item);
                if (this.onItemClick)
                    this.onItemClick(item);
            }
        };
        ListNano.prototype.destinationClicked = function (dest) {
            if (dest)
                this.followclientId(dest.clientId);
        };
        ListNano.prototype.onMouseover = function (el) {
            var i = el.data('i');
            if (isNaN(i))
                return;
            var item = this.data[i];
            if (item) {
                this.selectElement(el);
                if (this.onSelected)
                    this.onSelected(item);
            }
        };
        ListNano.prototype.renderItem = function (item, i, parent) {
            return '<li class="item" data-i="' + i + '" data-id="' + item.id + '"><a href="#building/' + item.id + '/' + parent + '/' + item.clientId + '/' + item.name.replace(' ', '-').replace(',', '') + '" >' + item.name + '</a></li>';
        };
        ListNano.prototype.hide = function () {
            this.nano.nanoScroller({ destroy: true });
            // this.nano.hide('fast');
        };
        ListNano.prototype.getDestinationByClientId = function (clientid) {
            var ar = this.data;
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                if (vo.clientId == clientid)
                    return vo;
            }
            return null;
        };
        ListNano.prototype.selectDestination = function (dest) {
            var id = dest.id;
            var el = this.list.children('[data-id=' + id + ']');
            if (el.length) {
                this.selectElement(el);
                return el;
            }
            else
                console.log(' ERROR cant find  in list' + id);
        };
        ListNano.prototype.followclientId = function (clientId) {
            if (clientId) {
                AmgenConnector.getDiviceId(clientId).done(function (res) {
                    if (res != 0)
                        window.location.href = '/rest/web/x/' + res + '/en';
                });
            }
        };
        ListNano.prototype.selectDestinationsAt = function (wpid) {
            var dests = this.getDestinationsAt(wpid);
            if (dests.length === 0)
                return;
            var el = this.selectDestination(dests[0]);
            this.nano.nanoScroller({ scrollTo: el });
        };
        ListNano.prototype.getDestinationsAt = function (wpid) {
            var ar = this.data;
            var out = [];
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                if (vo.wp && vo.wp.id == wpid)
                    out.push(vo);
            }
            return out;
        };
        ListNano.prototype.setId = function (id) {
            this.id = id;
            this.nano.data('id', id);
        };
        ListNano.prototype.setData = function (ar) {
            this.data = ar;
            this.current = ar;
        };
        ListNano.prototype.getData = function () {
            return this.data;
        };
        ListNano.prototype.setCurrent = function (ar) {
            this.current = ar;
        };
        ListNano.prototype.getView = function () {
            if (!this.isRendered) {
                var that = this;
                setTimeout(function () {
                    that.render();
                }, 50);
            }
            this.addListeners();
            var nano = this.nano;
            console.log('rendering nano  on getView ');
            setTimeout(function () {
                nano.nanoScroller();
            }, 50);
            return this.nano;
        };
        ListNano.prototype.render = function () {
            if (this.isRendered)
                return;
            this.isRendered = true;
            // console.log('render');
            var ar = this.current;
            var parent = this.parent;
            var out = '';
            for (var i = 0, n = ar.length; i < n; i++) {
                out += this.renderItem(ar[i], i, parent);
            }
            this.list.html(out);
            var nano = this.nano;
            setTimeout(function () {
                nano.nanoScroller();
            }, 50);
        };
        return ListNano;
    })();
    amgen.ListNano = ListNano;
    var ListCategory = (function () {
        function ListCategory(view) {
            this.breadcrumb = new BredCrombs($('#head-port .breadcrumbs:first'));
            this.view = view;
            var container = this.view.find('.list-container:first');
            this.nano = $('<div>').addClass('nano').appendTo(container);
            this.list = $('<ul>').addClass('nano-content').appendTo(this.nano);
            // console.log(container)
            var that = this;
            this.list.on('click', 'li', function (evt) {
                that.onClick(evt);
            });
            this.list.on('mouseover', 'li', function (evt) {
                that.onMouseover(evt);
            });
        }
        ListCategory.prototype.selectElement = function (el) {
            this.deselect();
            var i = el.data('i');
            var j = el.data('j');
            if (isNaN(i))
                return;
            var item = this.data[j].dests[i];
            if (item.isCampus) {
                this.selectedItem = item;
                el.addClass('selected');
                this.selectedEl = el;
            }
        };
        ListCategory.prototype.hide = function (speed) {
            this.view.hide(speed);
            this.breadcrumb.hide(speed);
        };
        ListCategory.prototype.show = function (speed) {
            this.view.show(speed);
            this.breadcrumb.show(speed);
        };
        ListCategory.prototype.selectItemById = function (id) {
            var el = this.list.children('[data-id=' + id + ']:first');
            if (el) {
                this.selectElement(el);
            }
        };
        ListCategory.prototype.deselect = function () {
            if (this.selectedEl)
                this.selectedEl.removeClass('selected');
            this.selectedItem = null;
        };
        ListCategory.prototype.onMouseover = function (evt) {
            var el = $(evt.currentTarget);
            this.selectElement(el);
            if (this.selectedItem) {
                if (this.onSelected)
                    this.onSelected(this.selectedItem);
                amgenDispatcher.triggerHandler('CAMPUS_SELECTED', this.selectedItem);
            }
            //console.log(item);
        };
        // private getItemById(id:number):any{
        //   return this.indexed[id];
        //}
        ListCategory.prototype.onClick = function (evt) {
            var el = $(evt.currentTarget);
            var i = el.data('i');
            var j = el.data('j');
            if (isNaN(i))
                return;
            var item = this.data[j].dests[i];
            if (item.isCampus) {
                amgenDispatcher.triggerHandler('CAMPUS_CLICKED', item);
            }
            // if(item.typeId==4)
            // console.log(item);
        };
        ListCategory.prototype.getChildrenType2 = function (type, obj, out) {
            // console.log(obj.name);
            var ar = obj.children;
            if (!ar || ar.length === 0)
                return null;
            for (var i = 0, n = ar.length; i < n; i++) {
                var child = ar[i];
                if (child.typeId == type)
                    out.push(child);
                else
                    this.getChildrenType2(type, child, out);
            }
        };
        ListCategory.prototype.getChildrenType = function (type, obj) {
            // console.log(obj.name);
            var ar = obj.children;
            if (!ar || ar.length === 0)
                return null;
            if (ar[0].typeId == type)
                return ar;
            else
                for (var i = 0, n = ar.length; i < n; i++) {
                    var child = ar[i];
                    return this.getChildrenType(type, child);
                }
        };
        ListCategory.prototype.renderItem = function (item, i, j) {
            item.isCampus = true;
            return '<li class="item" data-j="' + j + '" data-i="' + i + '" data-id="' + item.id + '"><a href="#campus/' + item.id + '/' + item.clientId + '/' + item.name.replace(' ', '-').replace(',', '') + '" >' + item.name + '</a></li>';
        };
        ListCategory.prototype.renderRegion = function (item, j) {
            var out = '';
            var ar = item.dests;
            // console.log(item);
            if (ar)
                for (var i = 0, n = ar.length; i < n; i++)
                    out += this.renderItem(ar[i], i, j);
            return '<ul class="region" data-j="' + j + '" data-id="' + item.id + '"><h3>' + item.name + '</h3>' + out + '</ul>';
        };
        // private renderCampuses(ar,num:number):string{
        // var out='';
        //for(var i=0,n=ar.length;i<n;i++) out+= this.renderItem(ar[i],i,num);
        //return out;
        //}
        /*
        private renderRegions(ar):void{
            var out='';
           for(var i=0,n=ar.length;i<n;i++)out+=this.renderRegion(ar[i],i)

            this.list.html(out);

            this.nano.nanoScroller();

        }
*/
        //private getRegionById(id):void{
        // }
        ListCategory.prototype.showAll = function () {
            this.list.children('.region').each(function (index, e) {
                $(e).show('fast');
            });
        };
        ListCategory.prototype.showRegion = function (id) {
            var nano = this.nano;
            if (!id) {
                this.showAll();
            }
            else {
                var regions = this.list.children('.region');
                regions.each(function (indes, e) {
                    var el = $(e);
                    if (el.data('id') == id) {
                        el.show('fast');
                    }
                    else
                        el.hide('fast');
                });
            }
            this.breadcrumb.selectItem(id);
            setTimeout(function () {
                nano.nanoScroller();
            }, 500);
            return this.dataIndexed[id];
            //this.current =this.
        };
        ListCategory.prototype.render = function () {
            if (this.isRendered) {
                this.showAll();
                return;
            }
            var ar = this.current;
            //  console.log(ar);
            var out = '';
            for (var i = 0, n = ar.length; i < n; i++)
                out += this.renderRegion(ar[i], i);
            this.list.html(out);
            this.nano.nanoScroller();
            this.isRendered = true;
        };
        ListCategory.prototype.renderAll = function () {
            this.current = this.data;
            this.render();
        };
        ListCategory.prototype.setData = function (data) {
            this.data = data;
            this.dataIndexed = _.indexBy(data, 'id');
            this.breadcrumb.setData(data);
            this.breadcrumb.render();
            // this.renderRegions(data);
            //this.list = data.list;
            //this.indexed = data.indexed;
            //this.structure = data.structure;
            /*
             var ar = this.getChildrenType(7,this.structure[0]);
 
             console.log(this.structure);
             var out =[];
 
             for(var i= 0,n=ar.length;i<n;i++){
                 var reg = ar[i];
 
                 var cams =[];
                 this.getChildrenType2(4,reg,cams)
                 reg.campuses=cams;
                 if(reg.id==1087){
                     this.allmaps = reg;
                     continue;
                 }
                 if(ar[i].campuses){
                   //  var str = this.renderRegion(ar[i],out.length)+ this.renderCampuses(ar[i].campuses,out.length);
                    // ar[i].view=$('<ul>').html(str);
                 }
                 //if(reg.campuses)
                     out.push(reg);
             }
 
             //console.log(out);
             this.regins = out;
             this.current = out;
             */
        };
        return ListCategory;
    })();
    amgen.ListCategory = ListCategory;
    var BredCrombs = (function () {
        function BredCrombs(view) {
            this.view = view;
            view.hide();
        }
        BredCrombs.prototype.show = function (speed) {
            this.view.show(speed);
        };
        BredCrombs.prototype.hide = function (speed) {
            this.view.hide(speed);
        };
        BredCrombs.prototype.setData = function (data) {
            this.data = data;
            this.current = data;
        };
        BredCrombs.prototype.selectItem = function (id) {
            if (!id)
                id = 0;
            this.view.find('.selected').removeClass('selected');
            this.view.find('[data-id=' + id + ']').addClass('selected');
        };
        BredCrombs.prototype.renderItem = function (obj, i) {
            // var out='';
            return '<a href="#world/' + obj.id + '/' + obj.name + '" class="item" data-id="' + obj.id + '" >' + obj.name + '</a>';
        };
        BredCrombs.prototype.render = function () {
            var ar = this.current;
            var out = '<a href="#world" class="item selected" data-id="0" >ALL</a>';
            for (var i = 0, n = ar.length; i < n; i++)
                out += this.renderItem(ar[i], i);
            this.view.html(out);
            this.view.fadeIn();
        };
        return BredCrombs;
    })();
    amgen.BredCrombs = BredCrombs;
})(amgen || (amgen = {}));
//# sourceMappingURL=AmgenList.js.map