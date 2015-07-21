/**
 * Created by Vlad on 6/4/2015.
 */
///<reference path="../../test/typings/jquery.d.ts" />
///<reference path="../../test/typings/svgjs.d.ts" />
///<reference path="../../test/typings/underscore.d.ts" />
var mapping;
(function (mapping) {
    var Building = (function () {
        function Building(cont) {
            this.timeout = 0;
            this.current = -1;
            this.view = $('<section>').addClass('building').appendTo(cont);
            var that = this;
            this.tools = $('.tools:first');
            this.btnSave = $('.tools [data-id=save]:first').on('click', function () {
                that.onSaveClicked();
            });
            this.chkAuto = $('.tools [data-id=auto]:first').on('click', function () {
                that.onAutoClicked();
            });
            this.btnNext = $('.tools [data-id=next]:first').on('click', function () {
                that.goNext();
            });
            this.name = $('.tools [data-id=name]:first');
            Floor.dispatcher.on('COMPLETE', function (evt, fl) {
                if (that.auto)
                    that.timeout = setTimeout(function () {
                        that.saveCurrentFloor();
                    }, 7000);
            });
        }
        Building.prototype.onSaveClicked = function () {
            this.saveCurrentFloor();
        };
        Building.prototype.onAutoClicked = function () {
            if (this.chkAuto.prop('checked')) {
                this.auto = true;
            }
            else {
                clearTimeout(this.timeout);
            }
        };
        Building.prototype.onFileSaved = function (res, url, mapid) {
            console.log('saved  ' + res);
            this.tools.append('<br/><a href="' + url + '"  target="_blank" >' + mapid + '</a>');
            this.goNext();
        };
        Building.prototype.saveCurrentFloor = function () {
            var svg = this.currentFloor.getNewSVG();
            // console.log(svg);
            var that = this;
            var mapid = this.currentFloor.mapid;
            var filename = 'svg_' + mapid + '.json';
            $.ajax({
                url: '/rest/web/customfile/' + filename,
                type: 'PUT',
                contentType: 'text/plain',
                success: function (res) {
                    that.onFileSaved(res, '/rest/web/customfile/' + filename, mapid);
                },
                data: JSON.stringify(svg)
            });
        };
        Building.prototype.goNext = function () {
            this.current++;
            if (this.current >= this.floors.length) {
                this.view.empty();
                $('<h1>').text('DONE').appendTo(this.view);
                return;
            }
            var fl = new Floor(this.floors[this.current]);
            this.name.text(fl.name);
            fl.setWaypoints(this.waypoints[fl.mapid]);
            this.view.empty();
            this.view.append(fl.view);
            this.currentFloor = fl;
        };
        Building.prototype.setData = function (floors, waypoints) {
            this.floors = floors;
            //   console.log(floors);
            //  console.log(waypoints);
            this.waypoints = _.groupBy(waypoints.waypoints, 'mapid');
            this.goNext();
        };
        return Building;
    })();
    mapping.Building = Building;
    var Floor = (function () {
        function Floor(vo) {
            this.model = vo;
            this.name = vo.name;
            //console.log(vo);
            this.mapid = vo.mapId;
            this.svgID = 'svg-id-' + vo.mapid;
            this.view = $('<section>').addClass('floor-map'); //.hide();
            var image = $('<img>').attr('src', vo.uri).appendTo(this.view);
            var self = this;
            image.load(function (evt) {
                var img = evt.currentTarget;
                self.setDemetions(img.clientWidth, img.clientHeight);
            });
            this.image = image;
            this.svgImg = $('<div>').addClass('svg-map').attr('id', this.svgID).appendTo(this.view).load(vo.svgMap, function (evt) {
                self.onSvgLoaded();
            });
        }
        Floor.prototype.hilitePolygon = function (wpid) {
            var item = this.svgIndexed[wpid];
            if (item)
                this.onPolygonOver(item.wp, item.polygon);
            else
                this.onPolygonOver(null, null);
        };
        Floor.prototype.onPolygonOver = function (data, polygon) {
            if (this.selectedSVG)
                this.selectedSVG.opacity(0.5);
            this.selectedSVG = null;
            if (data) {
                polygon.opacity(0.85);
                this.selectedSVG = polygon;
            }
            // console.log(data);
        };
        Floor.prototype.createPolygon = function (svg, vo, callBack) {
            var polygon = svg.polygon(vo.points).opacity(0.35);
            // vo.polygon = polygon;
            polygon.on('mouseover', function () {
                callBack(vo.wp, polygon);
            });
            polygon.on('mouseout', function () {
                callBack(null, null);
            });
        };
        Floor.prototype.drawSvg = function (ar) {
            this.svgsAr = ar;
            this.svgIndexed = _.indexBy(ar, 'wp');
            var svg = SVG(this.svgID).size(this.width, this.height);
            //console.log(svg);
            var callBack = this.onPolygonOver;
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                this.createPolygon(svg, vo, callBack);
            }
        };
        Floor.prototype.mapDestination = function (vo) {
            var X = vo.x;
            var Y = vo.y;
            // console.log(vo.wp);
            var el = document.elementFromPoint(X, Y);
            // console.log(el);
            var H = el.getBoundingClientRect().height;
            var W = el.getBoundingClientRect().width;
            // console.log(H+'  '+W);
            if ((H + W) > 1000)
                return null;
            return el.getAttribute('points');
            //$('<div>').addClass('test-dot').css('top',Y).css('left',X).appendTo(this.view);
        };
        Floor.prototype.onSvgLoaded = function () {
            var out = [];
            //  this.view.show();
            console.log('svg loaded     ');
            var ar = this.waypoints;
            for (var i = 0, n = ar.length; i < n; i++) {
                var vo = ar[i];
                var points = this.mapDestination(vo);
                if (points)
                    out.push({ wp: vo.id, mapid: this.mapid, points: points });
            }
            this.svgdata = out;
            // console.log(out);
            // this.view.hide();
            this.svgImg.empty();
            this.drawSvg(out);
            Floor.dispatcher.triggerHandler('COMPLETE', this);
        };
        Floor.prototype.getNewSVG = function () {
            return this.svgdata;
        };
        Floor.prototype.drawNewSVG = function () {
            this.drawSvg(this.svgdata);
        };
        Floor.prototype.setDemetions = function (w, h) {
            this.width = w;
            this.height = h;
            //  console.log(w,h);
            this.svgImg.width(w);
            this.svgImg.height(h);
        };
        Floor.prototype.setWaypoints = function (ar) {
            this.waypoints = ar;
        };
        Floor.dispatcher = $({});
        return Floor;
    })();
    mapping.Floor = Floor;
})(mapping || (mapping = {}));
//# sourceMappingURL=MappingBuilding.js.map