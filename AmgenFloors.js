/**
 * Created by Vlad on 6/17/2015.
 */
///<reference path="AmgenApp.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var amgen;
(function (amgen) {
    var FloorCampus = (function () {
        function FloorCampus(vo, dest) {
            this.trycount = 0;
            // console.log('FloorCampus   ',vo);
            this.model = vo;
            this.dest = dest;
            this.jid = dest.clientId;
            //  this.worldVo=dest;
            this.mapid = vo.mapId;
            this.idView = 'floor-map-' + vo.mapId;
            this.list = new amgen.ListNano();
            this.list.parent = this.jid;
            this.list.setId(this.mapid);
            this.list.setData(AmgenModel.getDestinatopnsByMapid(this.mapid));
            var that = this;
            this.list.onSelected = function (item) {
                if (item.wp)
                    that.selectPolygonByWp(item.wp.id);
            };
            this.view = $('<section>').addClass('floor-map');
            var image = $('<img>').attr('src', vo.uri).appendTo(this.view);
            var self = this;
            image.load(function (evt) {
                var img = evt.currentTarget;
                self.setDemetions(img.clientWidth, img.clientHeight);
            });
            this.image = image;
            this.header = $('<h2>').text(dest.name).appendTo(this.view);
        }
        FloorCampus.prototype.parseSVG = function (res) {
            if (typeof res === 'string')
                res = JSON.parse(res);
            this.drawSvg(res);
            // console.log(res);
        };
        FloorCampus.prototype.setBuilding = function (building) {
            this.building = building;
        };
        FloorCampus.prototype.remove = function () {
            var that = this;
            this.view.fadeOut(function () {
                that.view.remove();
            });
            this.list.hide();
        };
        FloorCampus.prototype.getList = function () {
            return this.list.getView();
        };
        FloorCampus.prototype.renderList = function () {
            // console.log(this.mapid);
            this.list.render();
        };
        FloorCampus.prototype.selectPolygonByWp = function (wpid) {
            if (Polygon.selected)
                Polygon.selected.hide();
            var ar = this.polygons;
            if (!ar)
                return;
            var vo;
            for (var i = 0, n = ar.length; i < n; i++) {
                vo = ar[i];
                if (vo.wpid === wpid) {
                    vo.show();
                    break;
                }
                vo = null;
            }
            Polygon.selected = vo;
        };
        FloorCampus.prototype.drawSvg = function (ar) {
            var polygons = [];
            var view = this.view;
            var svg = SVG(this.idView).size(this.width, this.height);
            for (var i = 0, n = ar.length; i < n; i++) {
                var poly = new Polygon(svg, ar[i], view);
                poly.parent = this.jid;
                poly.setDestinations(this.list.getDestinationsAt(poly.wpid));
                polygons.push(poly);
            }
            var list = this.list;
            var that = this;
            Polygon.dispatcher.on(Polygon.OVER, function (evt, poly) {
                poly = poly.show();
                if (Polygon.selected)
                    Polygon.selected.hide();
                if (poly) {
                    Polygon.selected = poly;
                    list.selectDestinationsAt(poly.wpid);
                }
            });
            Polygon.dispatcher.on(Polygon.OUT, function (evt, poly) {
                poly.hide();
                Polygon.selected = null;
            });
            Polygon.dispatcher.on(Polygon.CLICK, function (evt, poly) {
                //console.log(poly.getUrl());
                var ar = poly.getClientIds();
                if (ar && ar.length)
                    list.followclientId(ar[0]);
            });
            this.polygons = polygons;
        };
        FloorCampus.prototype.setDemetions = function (w, h) {
            this.width = w;
            this.height = h;
            this.svgImg = $('<div>').addClass('svg-map').attr('id', this.idView).appendTo(this.view);
            var that = this;
            AmgenConnector.getFile('svg_' + this.mapid + '.json').done(function (res) {
                that.parseSVG(res);
            });
            //  console.log(w,h);
            this.svgImg.width(w);
            this.svgImg.height(h);
        };
        FloorCampus.prototype.show = function () {
            this.view.fadeIn();
            return this;
        };
        FloorCampus.prototype.showDestinationByCientId = function (clientid) {
            var that = this;
            if (!this.polygons) {
                setTimeout(function () {
                    that.showDestinationByCientId(clientid);
                }, 1000);
                return;
            }
            this.currentClientId = clientid;
            var vo = this.list.getDestinationByClientId(clientid);
            if (vo) {
                if (vo.wp) {
                    this.selectPolygonByWp(vo.wp.id);
                    this.list.selectDestinationsAt(vo.wp.id);
                }
            }
        };
        return FloorCampus;
    })();
    amgen.FloorCampus = FloorCampus;
    var Polygon = (function () {
        function Polygon(svg, vo, view) {
            this.parent = '';
            this.view = view;
            this.wpid = vo.wp;
            var polygon = svg.polygon(vo.points).opacity(0.01);
            var that = this;
            polygon.on('mouseover', function () {
                Polygon.dispatcher.triggerHandler(Polygon.OVER, that);
            });
            polygon.on('mouseout', function () {
                Polygon.dispatcher.triggerHandler(Polygon.OUT, that);
            });
            polygon.on('click', function () {
                Polygon.dispatcher.triggerHandler(Polygon.CLICK, that);
            });
            this.polygon = polygon;
        }
        Polygon.prototype.getUrl = function () {
            return this.bubble.getUrl();
        };
        Polygon.prototype.getClientIds = function () {
            return this.bubble.clientIds;
        };
        Polygon.prototype.setDestinations = function (ar) {
            this.dests = ar;
            if (ar.length) {
                //console.log(this.polygon);
                this.bubble = new BubbleFloor();
                this.bubble.parent = this.parent;
                this.bubble.setData(ar);
                this.view.append(this.bubble.view);
            }
        };
        Polygon.prototype.show = function () {
            if (this.dests.length === 0)
                return null;
            if (this.bubble) {
                this.bubble.view.stop();
                this.bubble.view.fadeIn();
            }
            this.polygon.opacity(0.85);
            return this;
        };
        Polygon.prototype.hide = function () {
            this.polygon.opacity(0.01);
            if (this.bubble) {
                this.bubble.view.stop();
                this.bubble.view.fadeOut();
            }
        };
        Polygon.OVER = 'OVER';
        Polygon.OUT = 'OUT';
        Polygon.CLICK = 'CLICK';
        Polygon.dispatcher = $({});
        return Polygon;
    })();
    var FloorWorld = (function () {
        function FloorWorld(vo) {
            this.pinsIndex = {};
            this.model = vo;
            this.view = $('<section>').addClass('floor-map');
            this.image = $('<img>').attr('src', vo.uri).appendTo(this.view);
            this.list = new amgen.ListCategory($('#list-world-view'));
            var self = this;
            this.list.onSelected = function (item) {
                self.onListSelected(item);
            };
        }
        FloorWorld.prototype.onListSelected = function (item) {
            if (Pin.selected)
                Pin.selected.hideBubble();
            Pin.selected = null;
            if (item.wp)
                this.showPinByWpId(item.wp.id);
        };
        FloorWorld.prototype.showPinByWpId = function (id) {
            var ar = this.pins;
            for (var i = 0, n = ar.length; i < n; i++) {
                if (ar[i].id == id) {
                    Pin.selected = ar[i];
                    Pin.selected.showBubble();
                    break;
                }
            }
        };
        FloorWorld.prototype.selectCampus = function (id) {
            this.list.selectItemById(id);
        };
        FloorWorld.prototype.showRegion = function (id) {
            // console.log('showRegion  '+id);
            if (isNaN(id))
                return;
            var dests = this.list.showRegion(id);
            this.showPinsOfRegion(id);
            // console.log(dests);
        };
        FloorWorld.prototype.showPinsAll = function () {
            var ar = this.pins;
            for (var i = 0, n = ar.length; i < n; i++)
                ar[i].show();
        };
        FloorWorld.prototype.showPinsOfRegion = function (id) {
            id = Number(id);
            if (!id)
                this.showPinsAll();
            else {
                var ar = this.pins;
                for (var i = 0, n = ar.length; i < n; i++) {
                    var vo = ar[i];
                    if (vo.region === id)
                        vo.show();
                    else
                        vo.hide();
                }
            }
        };
        FloorWorld.prototype.show = function () {
        };
        FloorWorld.prototype.getPin = function (item) {
            return this.pinsIndex[item.id];
        };
        FloorWorld.prototype.setWaypoints = function (ar) {
            // console.log('set waypoints ',ar);
            this.waypoints = ar;
            var out = [];
            var obj = {};
            var self = this;
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                if (item.jids) {
                    var pin = new Pin(item);
                    out.push(pin);
                    obj[item.id] = pin;
                    this.view.append(pin.view);
                }
            }
            var list = this.list;
            Pin.dispatcher.on(Pin.OVER, function (evt, pin) {
                if (Pin.selected)
                    Pin.selected.hideBubble();
                list.deselect();
                Pin.selected = pin;
                pin.showBubble();
            });
            Pin.dispatcher.on(Pin.OUT, function (evt, pin) {
                if (Pin.selected)
                    Pin.selected.hideBubble();
                Pin.selected = null;
            });
            this.pinsIndex = obj;
            this.pins = out;
        };
        return FloorWorld;
    })();
    amgen.FloorWorld = FloorWorld;
    var Pin = (function () {
        function Pin(data) {
            this.model = data;
            if (data.dests.length) {
                this.region = data.dests[0].categoryId[0];
            }
            this.bubble = new amgen.Bubble();
            this.bubble.setData(data.dests, { x: 0, y: 15 });
            this.bubble.id = data.id;
            //  console.log(this.region);
            this.id = data.id;
            //console.log(data);
            //this.region = data.
            this.jids = data.jids;
            this.view = $('<div>').addClass('pin');
            this.view.css('top', data.y);
            this.view.css('left', data.x);
            this.view.append(this.bubble.view);
            // console.log(this.id)
            // this.bubble.view.hide();
            this.bubble.hide(1);
            var that = this;
            this.view.on('mouseover', function (evt) {
                Pin.dispatcher.triggerHandler(Pin.OVER, that);
            });
            this.view.on('mouseout', function (evt) {
                Pin.dispatcher.triggerHandler(Pin.OUT, that);
            });
            //this.view.on('click','li',function(evt){self.onClick($(evt.currentTarget))})
            // this.view.text('Pin');
        }
        Pin.prototype.onPinOver = function (el) {
            amgenDispatcher.triggerHandler('PIN_SELECTED', this.model, this);
        };
        Pin.prototype.onPinOut = function (el) {
            // if(this.destinations) this.destinations.hide();
        };
        Pin.prototype.showBubble = function () {
            this.view.addClass('selected');
            this.bubble.show();
        };
        Pin.prototype.hideBubble = function () {
            this.view.removeClass('selected');
            this.bubble.hide();
        };
        Pin.prototype.show = function () {
            this.view.stop();
            this.view.fadeIn();
        };
        Pin.prototype.hide = function () {
            this.view.stop();
            this.view.fadeOut();
        };
        Pin.prototype.onClick = function (el) {
            var i = el.data('i');
            var item = this.data[i];
            amgenDispatcher.triggerHandler('PIN_CLICKED', item, this);
        };
        Pin.prototype.renderItem = function (item, i) {
            return '<li data-i="' + i + '" >' + item.name + '</li>';
        };
        Pin.prototype.showDestinations = function (ar) {
            if (this.destinations)
                this.destinations.show();
            else {
                this.data = ar;
                var out = '';
                for (var i = 0, n = ar.length; i < n; i++) {
                    out += this.renderItem(ar[i], i);
                }
                this.destinations = $('<ul>').html(out).appendTo(this.view);
            }
        };
        Pin.prototype.hideDestinations = function () {
            this.destinations.hide();
        };
        Pin.dispatcher = $({});
        Pin.OVER = 'OVER';
        Pin.OUT = 'OUT';
        Pin.CLICK = 'CLICK';
        return Pin;
    })();
    var Point = (function () {
        function Point() {
        }
        return Point;
    })();
    var WP = (function (_super) {
        __extends(WP, _super);
        function WP() {
            _super.apply(this, arguments);
        }
        return WP;
    })(Point);
    var Dest = (function () {
        function Dest() {
        }
        return Dest;
    })();
    var BubbleFloor = (function () {
        function BubbleFloor() {
            //this.view = ${'<div>').addClass('bubble');
            this.parent = '';
            this.view = $('<div>').addClass('bubble');
            this.list = $('<ul>').appendTo(this.view);
            var self = this;
            this.view.on('click', 'li', function (evt) {
                self.onMouseClick($(evt.currentTarget));
            });
            this.view.hide();
            // this.view.on('mouseleave',function(evt){
            //  console.log('on-mouseleave');
            self.view.hide('fast');
            // })
        }
        BubbleFloor.prototype.getUrl = function () {
            return this.list.find('a').attr('href');
        };
        BubbleFloor.prototype.onMouseClick = function (el) {
            var i = el.data('i');
            if (isNaN(i))
                return;
            var item = this.data[i];
            if (this.onClick)
                this.onClick(item);
        };
        BubbleFloor.prototype.renderItem = function (item, i, parent) {
            return '<li data-i="' + i + '" ><a href="#' + parent + '/' + item.id + '/' + item.clientId + '/' + item.name.replace(' ', '-') + '" >' + item.name + '</a></li>';
        };
        BubbleFloor.prototype.setData = function (ar) {
            this.data = ar;
            var ids = [];
            var out = '';
            var parent = this.parent;
            var wp = { x: 0, y: 0 };
            for (var i = 0, n = ar.length; i < n; i++) {
                if (ar[i].wp)
                    wp = ar[i].wp;
                ids.push(ar[i].clientId);
                out += this.renderItem(ar[i], i, parent);
            }
            this.clientIds = ids;
            this.list.html(out);
            this.view.css('left', wp.x - 20).css('top', wp.y - 40);
        };
        return BubbleFloor;
    })();
    amgen.BubbleFloor = BubbleFloor;
})(amgen || (amgen = {}));
//# sourceMappingURL=AmgenFloors.js.map