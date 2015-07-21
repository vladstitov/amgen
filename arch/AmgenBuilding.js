/**
 * Created by Vlad on 6/4/2015.
 */
///<reference path="../../../../test/typings/jquery.d.ts" />
///<reference path="../../../../test/typings/svgjs.d.ts" />
///<reference path="../../../../test/typings/underscore.d.ts" />
///<reference path="AmgenList.ts" />
///<reference path="AmgenFloors.ts" />
var amgen;
(function (amgen) {
    var Building = (function () {
        function Building(cont) {
            this.view = $('<section>').addClass('building').appendTo(cont);
            var self = this;
            this.listCampus = $('#list-campus-view .list-container:first');
            this.listCampusView = $('#list-campus-view').hide();
            // amgenDispatcher.on('CAMPUS_SELECTED',function(evt,item){ self.onCampusSelected(item);});
            // amgenDispatcher.on('CAMPUS_CLICKED',function(evt,item){ self.onCampusClicked(item); })
        }
        Building.prototype.setStructure = function (data) {
            this.homemap = new amgen.FloorWorld(data.worldmap);
            this.view.append(this.homemap.view);
            this.homemap.show();
            this.campuses = data.building;
        };
        Building.prototype.setCampuses = function (data) {
            this.homemap.list.setData(data);
            this.homemap.list.renderAll();
        };
        // setSelected(item):void{
        //  this.homemap.showDestinationsAt([item],item.wp);
        //console.log(item);
        // }
        Building.prototype.showDestinationsAt = function (ar, owner) {
            //  this.homemap.showDestinationsAt(ar,owner);
        };
        Building.prototype.setWaypoints = function (ar) {
            this.homemap.setWaypoints(ar);
        };
        Building.prototype.showRegionById = function (id) {
            this.showHome();
            this.homemap.showRegion(id);
        };
        Building.prototype.getCampusFloor = function (dest) {
            var fl;
            var ar = this.campuses;
            var jid = dest.clientId;
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                // console.log(vo.name+' '+jid);
                if (vo.name == jid) {
                    if (!vo.floor)
                        vo.floor = new amgen.FloorCampus(vo, dest);
                    return vo.floor;
                }
            }
            return fl;
        };
        Building.prototype.selectCampus = function (id) {
            this.showHome();
            this.homemap.selectCampus(id);
        };
        Building.prototype.showHome = function () {
            if (this.currentCampus) {
                var campus = this.currentCampus;
                this.currentCampus.remove();
                this.currentCampus = null;
                this.homemap.list.show('fast');
                this.homemap.view.fadeIn();
                this.listCampusView.hide('fast');
            }
            //  this.homemap.showRegion(id);
        };
        Building.prototype.showCampus = function (camp) {
            // console.log('showCampus',camp);
            if (this.currentCampus && this.currentCampus.jid == camp.clientId) {
                return this.currentCampus;
            }
            //  console.log(' new   Campus');
            var floor = this.getCampusFloor(camp);
            if (floor) {
                //floor.setBuilding(building)
                this.currentCampus = floor;
                this.homemap.view.fadeOut();
                this.homemap.list.hide('fast');
                this.view.prepend(floor.show().view);
                this.listCampus.empty();
                this.listCampusView.show();
                this.listCampus.append(floor.getList());
                return floor;
            }
            else {
                this.showHome();
                console.warn(' NO campus for ' + camp.name);
            }
            return null;
        };
        return Building;
    })();
    amgen.Building = Building;
    var Bubble = (function () {
        function Bubble() {
            //this.view = ${'<div>').addClass('bubble');
            this.view = $('<div>').addClass('bubble');
            this.list = $('<div>').addClass('list').appendTo(this.view);
            var self = this;
            this.view.on('click', 'a', function (evt) {
                self.onClick($(evt.currentTarget));
            });
            this.view.on('mouseleave', function (evt) {
                self.hide();
            });
        }
        Bubble.prototype.show = function () {
            this.view.stop();
            this.view.show('fast');
        };
        Bubble.prototype.hide = function (s) {
            if (s)
                this.view.hide();
            else {
                this.view.stop();
                this.view.hide('fast');
            }
        };
        Bubble.prototype.onClick = function (el) {
            var i = el.data('i');
            if (isNaN(i))
                return;
            var item = this.data[i];
            // amgenDispatcher.triggerHandler('DESTINATION_CLICKED',item);
        };
        Bubble.prototype.renderItem = function (item, i) {
            return '<a href="#campus/' + item.id + '/' + item.clientId + '/' + item.name + '" >' + item.name + '</a>';
        };
        Bubble.prototype.setData = function (ar, wp) {
            this.wp = wp;
            this.data = ar;
            var out = '';
            for (var i = 0, n = ar.length; i < n; i++) {
                out += this.renderItem(ar[i], i);
            }
            this.list.html(out);
            // this.view.css('left',wp.x).css('bottom',wp.y);
            this.view.show();
        };
        return Bubble;
    })();
    amgen.Bubble = Bubble;
})(amgen || (amgen = {}));
//# sourceMappingURL=AmgenBuilding.js.map