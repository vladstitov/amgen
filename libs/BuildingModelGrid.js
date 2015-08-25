(function(_JMap) {

  function BinaryHeap(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  BinaryHeap.prototype = {
    push: function(element) {
      // Add the new element to the end of the array.
      this.content.push(element);

      // Allow it to sink down.
      this.sinkDown(this.content.length - 1);
    },
    pop: function() {
      // Store the first element so we can return it later.
      var result = this.content[0];
      // Get the element at the end of the array.
      var end = this.content.pop();
      // If there are any elements left, put the end element at the
      // start, and let it bubble up.
      if (this.content.length > 0) {
        this.content[0] = end;
        this.bubbleUp(0);
      }
      return result;
    },
    remove: function(node) {
      var i = this.content.indexOf(node);

      // When it is found, the process seen in 'pop' is repeated
      // to fill up the hole.
      var end = this.content.pop();

      if (i !== this.content.length - 1) {
        this.content[i] = end;

        if (this.scoreFunction(end) < this.scoreFunction(node)) {
          this.sinkDown(i);
        } else {
          this.bubbleUp(i);
        }
      }
    },
    size: function() {
      return this.content.length;
    },
    rescoreElement: function(node) {
      this.sinkDown(this.content.indexOf(node));
    },
    sinkDown: function(n) {
      // Fetch the element that has to be sunk.
      var element = this.content[n];

      // When at 0, an element can not sink any further.
      while (n > 0) {

        // Compute the parent element's index, and fetch it.
        var parentN = ((n + 1) >> 1) - 1,
          parent = this.content[parentN];
        // Swap the elements if the parent is greater.
        if (this.scoreFunction(element) < this.scoreFunction(parent)) {
          this.content[parentN] = element;
          this.content[n] = parent;
          // Update 'n' to continue at the new position.
          n = parentN;
        }
        // Found a parent that is less, no need to sink any further.
        else {
          break;
        }
      }
    },
    bubbleUp: function(n) {
      // Look up the target element and its score.
      var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

      while (true) {
        // Compute the indices of the child elements.
        var child2N = (n + 1) << 1,
          child1N = child2N - 1;
        // This is used to store the new position of the element, if any.
        var swap = null,
          child1Score;
        // If the first child exists (is inside the array)...
        if (child1N < length) {
          // Look it up and compute its score.
          var child1 = this.content[child1N];
          child1Score = this.scoreFunction(child1);

          // If the score is less than our element's, we need to swap.
          if (child1Score < elemScore) {
            swap = child1N;
          }
        }

        // Do the same checks for the other child.
        if (child2N < length) {
          var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
          if (child2Score < (swap === null ? elemScore : child1Score)) {
            swap = child2N;
          }
        }

        // If the element needs to be moved, swap it, and continue.
        if (swap !== null) {
          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        }
        // Otherwise, we are done.
        else {
          break;
        }
      }
    }
  };

  function as_Grid(waypoints, paths, pathTypes, maps) {
    var settings = {
      verticalScale: 100
    };

    this.waypoints = waypoints;
    this.paths = paths;
    this.pathTypes = pathTypes;
    this.maps = maps;
    this.verticalScale = settings.verticalScale;
    this.moverTypes = [];
    this.nodes = [];
    this.edges = [];



    for (var i = 0; i < waypoints.length; i++) {
      var edges = this.generateEdges(waypoints[i].id);
      var neighbors = this.generateNeighbors(waypoints[i].id, edges);
      var node = new as_Node(waypoints[i].id, waypoints[i].x, waypoints[i].y, this.getMapZValue(this.waypoints[i].mapId), this.waypoints[i].decisionPoint, this.waypoints[i].mapId, edges, neighbors);
      this.nodes.push(node);
    }

    for (i = 0; i < this.pathTypes.length; i++) {

      if (this.pathTypes[i].pathTypeId != 1) {

        var pathTypeImg = "";
        if (this.pathTypes[i].pathtypeUri && this.pathTypes[i].pathtypeUri[0]) pathTypeImg = this.pathTypes[i].pathtypeUri[0].uri;
        var lObj = {
          moverId: this.pathTypes[i].pathTypeId,
          speed: this.pathTypes[i].speed,
          maxFloors: this.pathTypes[i].maxfloors,
          imagePath: pathTypeImg,
          accessiblity: this.pathTypes[i].accessibility,
          typeName: this.pathTypes[i].typeName
        };
        this.moverTypes.push(lObj);
      }

    }


  }

  as_Grid.prototype = {
    getPathsWithWaypoint: function(wpid) {
      var pathsReturn = [];
      for (var i = 0; i < this.paths.length; i++) {
        for (var j = 0; j < this.paths[i].waypoints.length; j++) {
          if (this.paths[i].waypoints[j] == wpid) {
            pathsReturn.push(this.paths[i]);
          }
        }
      }
      return pathsReturn;
    },
    getPathTypeById: function(pathTypeId) {
      for (var i = 0; i < this.pathTypes.length; i++) {
        if (this.pathTypes[i].pathTypeId == pathTypeId) {
          return this.pathTypes[i];
        }
      }

      return null;
    },
    getWPById: function(wpid) {
      for (var i = 0; i < this.waypoints.length; i++) {
        if (this.waypoints[i].id == wpid) return this.waypoints[i];
      }
    },
    generateEdges: function(wpid) {
      var paths = this.getPathsWithWaypoint(wpid);

      var returnArray = [];

      for (var i = 0; i < paths.length; i++) {
        if (paths[i].status !== 0) {
          var pathType = this.getPathTypeById(paths[i].type);
          var edge = new as_Edge(paths[i].id, paths[i].waypoints, paths[i].type, pathType.weight, pathType.accessibility, pathType.speed, paths[i].direction);
          returnArray.push(edge);
        }
      }

      return returnArray;
    },
    generateNeighbors: function(wpid, edges) {
      var neighbors = [];
      var srcWP = this.getWPById(wpid);
      var srcWPPos = {
        x: srcWP.x,
        y: srcWP.y,
        z: this.getMapZValue(srcWP.mapId)
      };
      for (var i = 0; i < edges.length; i++) {
        var currentEdge = edges[i];
        for (var j = 0; j < currentEdge.nodes.length; j++) {
          if (currentEdge.nodes[j] == wpid) continue;
          var currentWP = this.getWPById(currentEdge.nodes[j]);
          var wpStart = {
            x: currentWP.x,
            y: currentWP.y,
            z: this.getMapZValue(currentWP.mapId)
          };

          var distance = this.heuristic(wpStart, srcWPPos);

          var floorPref = 1;
          if (srcWPPos.z == wpStart.z) {
            floorPref = this.getFloorPreferenceMultiplier(currentWP.mapId);
          } else {

            if (currentEdge.direction !== 0) {
              if (currentEdge.direction == 1) {
                if (srcWPPos.z > wpStart.z) continue;
              } else if (currentEdge.direction == 2) {
                if (srcWPPos.z < wpStart.z) continue;
              }
            }
          }



          var totalCost = ((distance * currentEdge.cost) * floorPref) * ((Math.abs(wpStart.z - srcWPPos.z) / currentEdge.speed) + 1);

          var neighbor = {
            id: currentWP.id,
            cost: totalCost,
            acc: currentEdge.acc,
            edgeId: currentEdge.id,
            edgeTypeId: currentEdge.type,
            distance: distance,
            x: currentWP.x,
            y: currentWP.y,
            z: this.getMapZValue(currentWP.mapId)
          };

          neighbors.push(neighbor);
        }
      }

      return neighbors;

    },
    getFloorPreferenceMultiplier: function(mapId) {
      var currentMultiplier = 1;
      if (this.maps) {
        var currentPref = 0;
        for (var i = 0; i < this.maps.length; i++) {
          if (this.maps[i].mapId == mapId) {
            if (!this.maps[i].preference) break;
            if (this.maps[i].preference === 0) {
              currentMultiplier = 1;
            } else if (this.maps[i].preference > 0) {
              currentMultiplier = currentMultiplier / (this.maps[i].preference + 1);
            } else if (this.maps[i].preference < 0) {
              currentMultiplier = currentMultiplier * (Math.abs(this.maps[i].preference) + 1);
            }
            break;
          }
        }
      }

      return currentMultiplier;
    },
    getMapZValue: function(mapId) {
      for (var i = 0; i < this.maps.length; i++) {
        if (this.maps[i].mapId == mapId) {
          return (this.maps[i].floorSequence * this.verticalScale);
        }
      }

      return null;
    },
    heuristic: function(start, end) {
      return Math.sqrt(Math.pow((start.x - end.x), 2) + Math.pow((start.y - end.y), 2) + Math.pow((start.z - end.z), 2));

    }


  };

  function as_Node(id, x, y, z, decisionPoint, mapId, edges, neighbors) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.z = z;
    this.decisionPoint = decisionPoint;
    this.mapId = mapId;
    this.edges = edges;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.visited = false;
    this.closed = false;
    this.parent = null;
    this.neighbors = neighbors;
    this.usedEdgeTypeId = null;

  }

  function as_Edge(id, nodeIds, type, cost, acc, speed, direction) {
    this.id = id;
    this.nodes = nodeIds;
    this.type = type;
    this.cost = cost;
    this.acc = acc;
    this.speed = speed;
    this.direction = direction;
  }

  function as_Search(grid) {
    this.grid = grid;
  }

  as_Search.prototype = {

    search: function(from, to, accessLevel) {
      this.cleanGrid();
      var start = this.getNodeById(from);
      var end = this.getNodeById(to);
      var openStartHeap = this.getHeap();

      start.h = 0;
      openStartHeap.push(start);

      while (openStartHeap.size() > 0) {
        var currentNode = openStartHeap.pop();

        if (currentNode === end) {
          return this.pathTo(currentNode, start);
        }

        currentNode.closed = true;

        var neighbors = this.getNeighbors(currentNode);

        for (var i = 0, il = neighbors.length; i < il; ++i) {
          var neighbor = neighbors[i];
          var neighborNode = this.getNeighborNodeObject(neighbor.id);

          if (neighbor.acc > accessLevel) {
            // console.log("BAD NEIGHBOR", neighbor.acc, accessLevel);
            continue;
          }

          var heur = 0;
          //if(currentNode.mapId == neighborNode.mapId) heur = this.heuristic(neighborNode, end);

          if (neighborNode.closed) {
            continue;
          }

          var gScore = currentNode.g + this.getNeighborCost(neighbor);
          var beenVisited = neighborNode.visited;


          if (!beenVisited || ((gScore + heur) < neighborNode.f)) {
            neighborNode.visited = true;
            neighborNode.parent = currentNode;
            neighborNode.h = heur;
            neighborNode.g = gScore;
            neighborNode.f = neighborNode.g + heur;
            neighborNode.usedEdgeTypeId = neighbor.edgeTypeId;


            if (!beenVisited) {
              openStartHeap.push(neighborNode);
            } else {
              openStartHeap.rescoreElement(neighborNode);
            }

          }

        }
      }

      return [];

    },

    cleanNode: function(node) {
      node.f = 0;
      node.g = 0;
      node.h = 0;
      node.visited = false;
      node.closed = false;
      node.parent = null;
      node.usedEdgeTypeId = null;
    },

    cleanGrid: function() {
      for (var i = 0; i < this.grid.nodes.length; i++) {
        this.cleanNode(this.grid.nodes[i]);
      }
    },

    getNodeById: function(id) {
      for (var i = 0; i < this.grid.nodes.length; i++) {

        if (id == this.grid.nodes[i].id) return this.grid.nodes[i];
      }
    },
    getHeap: function() {
      return new BinaryHeap(function(node) {
        return node.f;
      });
    },
    pathTo: function(node, start) {
      var curr = node,
        path = [];
      while (curr.parent) {
        path.push(curr);
        curr = curr.parent;
      }
      path.push(start);
      path = path.reverse();

      var floorArray = [];
      var currentFloor = [];
      var currentFloorId = -1;
      for (var i = 0; i < path.length; i++) {

        var returnPoint = {
          x: 0,
          y: 0,
          decisionPoint: 0,
          mapId: 0,
          id: 0
        };

        if (i === 0) {
          currentFloorId = path[i].mapId;
        }

        if (path[i].mapId != currentFloorId) {
          floorArray.push({
            seq: (path[i - 1].z / this.grid.verticalScale),
            mapId: currentFloorId,
            mover: this.getPathTypeById(path[i].usedEdgeTypeId),
            points: currentFloor.slice(0),
            cost: path[i].f
          });
          currentFloor = [];
          currentFloorId = path[i].mapId;
        }

        returnPoint.x = path[i].x;
        returnPoint.y = path[i].y;
        returnPoint.mapId = path[i].mapId;
        returnPoint.id = path[i].id;
        returnPoint.decisionPoint = path[i].decisionPoint;

        currentFloor.push(returnPoint);

        if (i == path.length - 1) {
          floorArray.push({
            seq: (path[i].z / this.grid.verticalScale),
            mapId: currentFloorId,
            mover: this.getPathTypeById(path[i].usedEdgeTypeId),
            points: currentFloor,
            cost: path[i].f
          });
        }
      }

      return floorArray;
    },
    getNeighbors: function(node) {
      return node.neighbors;
    },
    getNeighborNodeObject: function(id) {
      for (var i = 0; i < this.grid.nodes.length; i++) {
        if (id == this.grid.nodes[i].id) return this.grid.nodes[i];
      }
    },
    getNeighborCost: function(neighbor) {
      var cost = neighbor.cost;
      return cost;
    },
    getPathTypeById: function(typeId) {

      for (var i = 0; i < this.grid.moverTypes.length; i++) {
        if (this.grid.moverTypes[i].moverId == typeId) return this.grid.moverTypes[i];
      }
      return null;

    },
    heuristic: function(start, end) {
        return Math.abs(start.x - end.x) + Math.abs(start.y - end.y) + Math.abs(start.z - end.z);

      }
      /*
      heuristic:function(start, end) {
         return Math.sqrt(Math.pow((start.x - end.x), 2) + Math.pow((start.y - end.y), 2) + Math.pow((start.z - end.z), 2));

      }*/


  };



  var BuildingModelGrid = (function() {

    /**
     * This class parses all the waypoints and corresponding map meta data from the CMS
     * @class BuildingModelGrid
     * @constructor
     */
    function BuildingModelGrid() {
      var self = this;
      this.waypoints = [];
      this.paths = null;
      this.destinations = null;
      this.device = null;
      this.amenities = null;
      this.events = null;
      this.maps = null;
      this.pathTypes = null;
      this.verticalPaths = null;
      this.defaultPaths = null;
      this.verticalScale = 1;
      this.legacyConversion = {};
      this.useAStar = true;
      this.defaultPathType = 1;

      this.rawResponses = {};

      this.destinationEntitiyType = 1;
      this.deviceEntityType = 2;
      this.amenityEntityType = 26;
      this.eventEntityType = 19;

      this.mappedObjects = {};
      this.mappedObjects.devices = {};
      this.mappedObjects.destinations = {};
      this.mappedObjects.amenities = {};
      this.mappedObjects.events = {};

      this.localDispatcher = {};
      this.EVENTS = {
        API_QUEUE_COMPLETE: "api_queue_complete",
        MAPS_LOADED: "map_load_complete",
        DESTINATIONS_LOADED: "destination_load_complete",
        AMENITIES_LOADED: "amenity_load_complete",
        EVENTS_LOADED: "event_load_complete",
        DEVICES_LOADED: "devices_load_complete",
        PATHS_LOADED: "path_load_complete",
        WAYPOINTS_LOADED: "waypoint_load_complete",
        PATH_TYPES_LOADED: "path_types_load_complete"
      };

      this.onInitializeComplete = null;
      this.apiQueue = new JMap.createAPIQueue(this.localDispatcher, this.EVENTS.API_QUEUE_COMPLETE, JMap, this);

      $(this.localDispatcher).on(this.EVENTS.MAPS_LOADED, $.proxy(this.onMapsLoaded, this));
      $(this.localDispatcher).on(this.EVENTS.DESTINATIONS_LOADED, $.proxy(this.onDestinationsLoaded, this));
      $(this.localDispatcher).on(this.EVENTS.AMENITIES_LOADED, $.proxy(this.onAmenitiesLoaded, this));
      $(this.localDispatcher).on(this.EVENTS.EVENTS_LOADED, $.proxy(this.onEventsLoaded, this));
      $(this.localDispatcher).on(this.EVENTS.PATHS_LOADED, $.proxy(this.onPathsLoaded, this));
      $(this.localDispatcher).on(this.EVENTS.DEVICES_LOADED, $.proxy(this.onDevicesLoaded, this));
      $(this.localDispatcher).on(this.EVENTS.PATH_TYPES_LOADED, $.proxy(this.onPathTypesLoaded, this));

    }

    //Loads all prerequisite data
    BuildingModelGrid.prototype.load = function(callback) {
      this.onInitializeComplete = callback;
      $(this.localDispatcher).on(this.EVENTS.API_QUEUE_COMPLETE, $.proxy(this.onAPIQueueComplete, this));

      this.apiQueue.add("getMaps", [], this.EVENTS.MAPS_LOADED);
      this.apiQueue.add("getDestinations", [], this.EVENTS.DESTINATIONS_LOADED);
      this.apiQueue.add("getAmenities", [], this.EVENTS.AMENITIES_LOADED);
      this.apiQueue.add("getPaths", [], this.EVENTS.PATHS_LOADED);
      this.apiQueue.add("getPathTypes", [], this.EVENTS.PATH_TYPES_LOADED);
      this.apiQueue.add("getDevice", [], this.EVENTS.DEVICES_LOADED);
      this.apiQueue.add("getPathTypes", [], this.EVENTS.PATH_TYPES_LOADED);
      this.apiQueue.start();

    };

    BuildingModelGrid.prototype.onMapsLoaded = function(ev, response) {

      this.maps = JMap.storage.maps.data;
      this.rawResponses.maps = JMap.storage.maps.data;

      for (var i = 0; i < this.maps.length; i++) {
        this.maps[i].waypoints = [];
        this.maps[i].id = this.maps[i].mapId;
      }


    };

    BuildingModelGrid.prototype.onDestinationsLoaded = function(ev, response) {

      this.destinations = response;
      this.rawResponses.destinations = response;

      for (var i = 0; i < this.destinations.length; i++) {
        this.destinations[i].waypoints = [];
      }

    };

    BuildingModelGrid.prototype.onAmenitiesLoaded = function(ev, response) {
      this.amenities = response;
      this.rawResponses.amenities = response;

      for (var i = 0; i < this.amenities.length; i++) {
        this.amenities[i].waypoints = [];
      }

    };

    BuildingModelGrid.prototype.onEventsLoaded = function(ev, response) {
      this.events = response;
      this.rawResponses.events = response;

      for (var i = 0; i < this.events.length; i++) {
        this.events[i].waypoints = [];
      }

    };

    BuildingModelGrid.prototype.onPathsLoaded = function(ev, response) {

      this.paths = [];
      for (var i = 0; i < response.length; i++) {
        if (response[i].waypoints.length > 1) {
          this.paths.push(response[i]);
        }
      }
      this.rawResponses.paths = response;
    };

    BuildingModelGrid.prototype.onPathTypesLoaded = function(ev, response) {
      this.pathTypes = response;
      this.rawResponses.pathTypes = response;
    };

    BuildingModelGrid.prototype.onDevicesLoaded = function(ev, response) {
      console.log("Device", response);
      this.device = response;
      this.rawResponses.devices = response;
      this.device.waypoints = [];
    };

    BuildingModelGrid.prototype.onAPIQueueComplete = function(ev) {
      $(this.localDispatcher).off(this.EVENTS.API_QUEUE_COMPLETE);
      $(this.localDispatcher).on(this.EVENTS.WAYPOINTS_LOADED, $.proxy(this.onWaypointsLoaded, this));
      $(this.localDispatcher).on(this.EVENTS.API_QUEUE_COMPLETE, $.proxy(this.convertData, this));

      for (var i = 0; i < this.maps.length; i++) this.apiQueue.add("getWaypoints", [this.maps[i].mapId], this.EVENTS.WAYPOINTS_LOADED);
      this.apiQueue.start();
    };

    BuildingModelGrid.prototype.onWaypointsLoaded = function(ev, response) {

      var responseMapId = null;
      var responseMap = null;

      // debugger;
      for (var i = 0; i < response.length; i++) {
        this.waypoints.push(response[i]);


        if (response[i].associations) {
          var associationArray = response[i].associations;
          for (var j = 0; j < associationArray.length; j++) {
            switch (associationArray[j].entityTypeId) {
              case this.destinationEntitiyType:
                this.addWaypointToDestination(associationArray[j].entityId, associationArray[j].waypointId);
                break;
              case this.deviceEntityType:
                this.addWaypointToDevice(associationArray[j].waypointId);
                break;
              case this.amenityEntityType:
                this.addWaypointToAmenity(associationArray[j].entityId, associationArray[j].waypointId);
                break;
              case this.eventEntityType:
                this.addWaypointToEvent(associationArray[j].entityId, associationArray[j].waypointId);
                break;
            }
          }
        }

      }



    };



    //Mapping Back and Forth//

    BuildingModelGrid.prototype.addWaypointToDestination = function(destid, wpid) {

      for (var i = 0; i < this.destinations.length; i++) {
        if (this.destinations[i].id == destid) {
          if (this.destinations[i].waypoints.indexOf(wpid) == -1) {
            this.destinations[i].waypoints.push(wpid);
          }
        }
      }

    };

    BuildingModelGrid.prototype.addWaypointToDevice = function(wpid) {

      this.device.waypoints.push(wpid);

    };

    BuildingModelGrid.prototype.addWaypointToAmenity = function(destid, wpid) {

      for (var i = 0; i < this.amenities.length; i++) {
        if (this.amenities[i].componentId == destid) {
          if (this.amenities[i].waypoints.indexOf(wpid) == -1) this.amenities[i].waypoints.push(wpid);
        }
      }

    };

    BuildingModelGrid.prototype.addWaypointToEvent = function(destid, wpid) {

      for (var i = 0; i < this.events.length; i++) {
        if (this.events[i].componentId == destid) {
          if (this.events[i].waypoints.indexOf(wpid) == -1) this.events[i].waypoints.push(wpid);
        }
      }

    };


    /* Getters */

    //Devices
    BuildingModelGrid.prototype.getDeviceAssignedWaypoint = function(deviceid) {
      if (deviceid != this.device.id) return null;

      if (this.device.waypoints[0]) {
        return this.getWaypointInformation(this.device.waypoints[0]);
      }
    };


    //Destination
    BuildingModelGrid.prototype.getDestinationClientIdById = function(destId) {
      for (var i = 0; i < this.destinations.length; i++) {
        if (this.destinations[i].id == destId) {
          return this.destinations[i].clientId;
        }
      }
    };

    BuildingModelGrid.prototype.getDestinationByWaypointId = function(wpid) {
      var wpDests = [];
      for (var i = 0; i < this.destinations.length; i++) {
        if (this.destinations[i].waypoints.indexOf(wpid) != -1) {
          wpDests.push(this.destinations[i]);
        }
      }

      return wpDests;
    };
    //Path Type
    BuildingModelGrid.prototype.getPathType = function(typeId) {
      for (var i = 0; i < this.pathTypes.length; i++) {
        if (this.pathTypes[i].pathTypeId == typeId) {
          return this.pathTypes[i];
        }

      }
    };

    //Waypoint
    BuildingModelGrid.prototype.getWaypointInformation = function(wpid) {
      var wpInfo = null;

      for (var i = 0; i < this.maps.length; i++) {
        for (var j = 0; j < this.maps[i].waypoints.length; j++) {
          if (this.maps[i].waypoints[j].id == wpid) {
            wpInfo = this.maps[i].waypoints[j];
          }
        }
      }

      return wpInfo;
    };

    BuildingModelGrid.prototype.getWaypoints = function() {
      return this.waypoints;
    };



    BuildingModelGrid.prototype.convertData = function(ev) {
      this.verticalPaths = [];
      this.defaultPaths = [];

      var i, j, wpInfo;
      var defaultMapId = null;
      if (this.device.waypoints.length > 0) {
        wpInfo = this.getWaypointInformation(this.device.waypoints[0]);
        if (wpInfo) defaultMapId = wpInfo.mapId;
      } else {
        //If no waypoint asociated with device assign first map in array to default.
        defaultMapId = this.maps[0].mapId;
      }

      //Convert Mover types to less efficent way
      this.legacyConversion.mover_types = [];
      this.legacyConversion.movers = [];

      for (i = 0; i < this.paths.length; i++) {

        if (this.paths[i].type != 1) {
          var mapId = null;
          var isMover = false;
          var discard = false;
          for (j = 0; j < this.paths[i].waypoints.length; j++) {
            wpInfo = this.getWaypointInformation(this.paths[i].waypoints[j]);

            if (wpInfo === null) {
              discard = true;
              break;
            }
            if (mapId === null) mapId = wpInfo.mapId;
            else {

              if (mapId != wpInfo.mapId) {
                isMover = true;
                break;
              }
            }
          }

          if (!discard) {
            if (isMover) {
              this.verticalPaths.push(this.paths[i]);
            }
          }

        }
      }



      for (i = 0; i < this.pathTypes.length; i++) {

        if (this.pathTypes[i].pathTypeId != 1) {

          var pathTypeImg = "";
          if (this.pathTypes[i].pathtypeUri && this.pathTypes[i].pathtypeUri[0]) pathTypeImg = this.pathTypes[i].pathtypeUri[0].uri;
          var lObj = {
            moverId: this.pathTypes[i].pathTypeId,
            speed: this.pathTypes[i].speed,
            maxFloors: this.pathTypes[i].maxfloors,
            imagePath: pathTypeImg,
            accessiblity: this.pathTypes[i].accessibility,
            typeName: this.pathTypes[i].typeName
          };
          this.legacyConversion.mover_types.push(lObj);
        }

      }


      for (i = 0; i < this.verticalPaths.length; i++) {

        var typeInfo = this.getPathType(this.verticalPaths[i].type);
        var connections = [];

        for (j = 0; j < this.verticalPaths[i].waypoints.length; j++) {
          var wpData = this.getWaypointInformation(this.verticalPaths[i].waypoints[j]);
          var connObj = {
            mapId: wpData.mapId,
            wpid: this.verticalPaths[i].waypoints[j]
          };

          connections.push(connObj);
        }

        var moverObj = {
          speed: typeInfo.speed,
          type: this.verticalPaths[i].type,
          status: this.verticalPaths[i].status,
          name: this.verticalPaths[i].name,
          connections: connections,
          id: this.verticalPaths[i].id,
          access: this.verticalPaths[i].accessibility,
          direction: this.verticalPaths[i].direction,
          maxFloors: typeInfo.maxfloors
        };

        this.legacyConversion.movers.push(moverObj);
      }

      // debugger;

      for (i = 0; i < this.maps.length; i++) {

        if (this.maps[i].mapId == defaultMapId) {
          this.maps[i].defaultMapForDevice = true;
        }

      }



      var newMovers = [];

      for (i = 0; i < this.legacyConversion.movers.length; i++) {
        if (this.legacyConversion.movers[i].connections !== null) {
          for (j = 0; j < this.legacyConversion.movers[i].connections.length; j++) {
            this.legacyConversion.movers[i].connections[j].wp = this.getWPByIdAndMapid(this.legacyConversion.movers[i].connections[j].wpid, this.legacyConversion.movers[i].connections[j].mapId);
            newMovers.push(this.legacyConversion.movers[i]);
          }
        }
      }
      this.legacyConversion.movers = newMovers;

      this.parseDecisionPoints();
      this.buildAStarData();
      if (this.onInitializeComplete) this.onInitializeComplete();

    };



    BuildingModelGrid.prototype.buildAStarData = function() {
      var astarGrid = new as_Grid(this.waypoints, this.paths, this.pathTypes, this.maps);
      this.astar = new as_Search(astarGrid);
    };



    //GETTERS ///////////////////////////

    BuildingModelGrid.prototype.getYah = function(deviceid) {
      var id = Number(deviceid);
      if (isNaN(id)) id = JMap.storage.device.deviceId;
      return this.getDeviceAssignedWaypoint(id);

    };



    /**
     * Get a waypoint by it's id and the Map's Id that it belongs to.
     * @method getWPByIdAndMapid
     * @param {int} wpid Integer identifier of the waypoint
     * @param {int} mapId Reference this under the "Map ID" column in the CMS.
     * @return Waypoint Object
     */
    BuildingModelGrid.prototype.getWPByIdAndMapid = function(wpid, mapId) {
      return this.getWaypointInformation(wpid);
    };

    /**
     * Returns all assigned movers in the project.
     *
     * @method getAllMovers
     * @return Array of MappedMover Object
     */

    BuildingModelGrid.prototype.getAllMovers = function() {
      return this.legacyConversion.movers;
    };


    /**
     * Gets the map data by it's mapId
     * @method getMapDataById
     * @param {int} id Reference this under the "Map ID" column in the CMS.
     * @return Map Data Object
     */
    BuildingModelGrid.prototype.getMapDataById = function(id) {
      for (var i = 0, len = JMap.storage.maps.data.length; i < len; i++) {
        // console.log(JMap.storage.maps.data[i]);
        if (id == JMap.storage.maps.data[i].mapId) return JMap.storage.maps.data[i];
      }
      return null;
    };


    BuildingModelGrid.prototype.getFloorPreferenceMultiplier = function(mapId) {
      var currentMultiplier = 1;
      if (this.maps) {
        var currentPref = 0;
        for (var i = 0; i < this.maps.length; i++) {
          if (this.maps[i].mapId == mapId) {
            if (!this.maps[i].preference) break;
            if (this.maps[i].preference === 0) {
              currentMultiplier = 1;
            } else if (this.maps[i].preference > 0) {
              currentMultiplier = currentMultiplier / (this.maps[i].preference + 1);
            } else if (this.maps[i].preference < 0) {
              currentMultiplier = currentMultiplier * (Math.abs(this.maps[i].preference) + 1);
            }
            break;
          }
        }
      }

      return currentMultiplier;
    };

    /**
     * Gets a waypoint using a Desination's Client ID.
     * @method getWPByJid
     * @param {String} jid Reference this under the "Client ID" column in the CMS.
     * @return Waypoint Object
     */
    BuildingModelGrid.prototype.getWPByJid = function(jid) {
      for (var i = 0, n = this.destinations.length; i < n; i++) {
        if (this.destinations[i].clientId == jid)
          if (this.destinations[i].waypoints[0]) {
            return this.getWaypointInformation(this.destinations[i].waypoints[0]);
          }
      }
      return null;
    };

    BuildingModelGrid.prototype.getWPsByJid = function(jid) {
      var returnArray = [];
      for (var i = 0, n = this.destinations.length; i < n; i++) {
        if (this.destinations[i].clientId == jid) {
          for (var j = 0; j < this.destinations[i].waypoints.length; j++) {
            returnArray.push(this.getWaypointInformation(this.destinations[i].waypoints[j]));
          }
        }
      }

      return returnArray;
    };

    /**
     * @method getWPsByLid
     * @return Array. Includes all waypoint objects.
     */
    BuildingModelGrid.prototype.getWPsByLid = function(lid) {
      var returnArray = [];
      for (var i = 0; i < this.amenities.length; i++) {
        if (lid == this.amenities[i].componentId) return this.amenities[i].slice();
      }

      return returnArray;
    };

    /**
     * @method getLidsByWP
     * @return Array. Includes all legend ids.
     */
    BuildingModelGrid.prototype.getLidsByWP = function(wpid) {
      var returnArray = [];

      for (var i = 0; i < this.amenities.length; i++) {
        var currentAmenity = this.amenities[i];
        if (currentAmenity.waypoints.indexOf(wpid) != -1) returnArray.push(currentAmenity.componentId);
      }

      return returnArray;
    };
    /**
     * Gets an array of all the map data.
     * @method getAllFloors
     * @return Array. Includes all Map data objects.
     */
    BuildingModelGrid.prototype.getAllFloors = function() {
      return this.maps;
    };


    /**
     * Gets a specific floor using it's mapId.
     * @method getFloorById
     * @param {int} in Reference this under the "Map ID" column in the CMS.
     * @return Map Data Object
     */
    BuildingModelGrid.prototype.getFloorById = function(num) {
      for (var i = 0, n = this.maps.length; i < n; i++) {
        if (this.maps[i].mapId == num)
          return this.maps[i];
      }
      return null;
    };

    BuildingModelGrid.prototype.getFloorBySequence = function(seq) {
      for (var i = 0, n = this.maps.length; i < n; i++) {
        // console.log(this.arFloors[i]);
        if (this.maps[i].floorSequence == seq)
          return this.maps[i];
      }
      return null;
    };

    BuildingModelGrid.prototype.getLogicalConnections = function(wpid, removedWPs) {
      var logical_connections = [];
      if (removedWPs[wpid]) return logical_connections;
      for (var i = 0; i < this.paths.length; i++) {
        if (this.paths[i].type != this.defaultPathType) continue;

        if (this.paths[i].waypoints[0] == this.paths[i].waypoints[1]) continue;
        if (removedWPs[this.paths[i].waypoints[0]]) continue;
        if (removedWPs[this.paths[i].waypoints[1]]) continue;

        if (this.paths[i].waypoints[0] == wpid) {
          logical_connections.push(this.paths[i]);
        } else if (this.paths[i].waypoints[1] == wpid) {
          logical_connections.push(this.paths[i]);
        }
      }
      return logical_connections;
    };

    BuildingModelGrid.prototype.getConnections = function(wpid) {
      var connections = [];
      for (var i = 0; i < this.paths.length; i++) {

        if (this.paths[i].type == this.defaultPathType) {
          if (this.paths[i].waypoints.length > 1) {
            if (this.paths[i].waypoints[0] == this.paths[i].waypoints[1]) continue;

            if (this.paths[i].waypoints[0] == wpid) {
              connections.push(this.paths[i]);
            } else if (this.paths[i].waypoints[1] == wpid) {
              connections.push(this.paths[i]);
            }

          }
        }

      }

      return connections;
    };

    //////////////MAIN METHODS /////////////////////////////////////////

    /**
     * Finds the points involved in the most efficient point from one waypoint to another.
     *
     * @method findWay
     * @param {Waypoint object} wpfrom The starting waypoint.
     * @param {Waypoint object} wpto The end waypoint.
     * @param {Boolean} accessible Specifies whether to use accessible routes or not. Defualts to false.
     * @return Array of Objects. The length on the Array reflects the number of floors involved. Each Object has it's own array of points for it's part in the route.
     */
    BuildingModelGrid.prototype.findWay = function(wpfrom, wpto, elevator, omitIntermediate) {
      if (!wpfrom || !wpto) return [];
      this._mover = [];
      var accessLevel = 100;
      if (elevator) accessLevel = 50;
      var res = this.astar.search(wpfrom.id, wpto.id, accessLevel);
      return res;
    };

    BuildingModelGrid.prototype.setOffset = function(posOffset) {
      for (var i = 0; i < this.waypoints.length; i++) {
        var wp = this.waypoints[i];
        wp.x = wp.x + posOffset.x;
        wp.y = wp.y + posOffset.y;
        this.waypoints[i] = wp;
      }

    };

    BuildingModelGrid.prototype.parseDecisionPoints = function() {
      this.decisionPoints = [];
      var removedWaypoints = {};

      for (var i = 0; i < this.waypoints.length; i++) {
        this.waypoints[i].connections = this.getConnections(this.waypoints[i].id);
        if (this.waypoints[i].connections.length < 2) removedWaypoints[this.waypoints[i].id] = true;
      }

      for (var j = 0; j < this.waypoints.length; j++) {
        this.waypoints[j].logical_connections = this.getLogicalConnections(this.waypoints[j].id, removedWaypoints);
        if (this.waypoints[j].logical_connections.length > 2) this.decisionPoints.push(this.waypoints[j]);
      }

    };



    /*Utilities */
    BuildingModelGrid.prototype.getPointsInBoundByMap = function(startX, startY, endX, endY, centerX, centerY, mapId) {
      var nodeArr = [];
      var _this = this;


      for (var i = 0; i < this.waypoints.length; i++) {
        //console.log(this._nodeList[i]);
        if (this.waypoints[i].mapId != mapId) continue;
        if ((this.waypoints[i].x > startX) && (this.waypoints[i].x < endX) && (this.waypoints[i].y > startY) && (this.waypoints[i].y < endY)) {

          var nodeElement = {
            x: this.waypoints[i].x,
            y: this.waypoints[i].y,
            id: this.waypoints[i].id,
            logical_connections: this.waypoints[i].logical_connections
          };
          nodeElement.distance = _this.getDistance(centerX, centerY, nodeElement.x, nodeElement.y);
          nodeArr.push(nodeElement);
        }

      }

      if (nodeArr.length > 1) {
        nodeArr.sort(function(a, b) {
          return _this.getDistance(centerX, centerY, a.x, a.y) - _this.getDistance(centerX, centerY, b.x, b.y);
        });
      }

      return nodeArr;
    };

    BuildingModelGrid.prototype.getDistance = function(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    };

    BuildingModelGrid.prototype.getConnectedMover = function(id) {
      var moversOnFloor = [];
      for (var i = 0, n = this.legacyConversion.movers.length; i < n; i++) {
        var mov = this.legacyConversion.movers[i];
        for (var j = 0, k = mov.connections.length; j < k; j++) {
          var con = mov.connections[j];
          if (con.mapId == id) {
            mov.connection = con;
            moversOnFloor.push(mov);
          }
        }
      }
      return moversOnFloor;
    };

    return BuildingModelGrid;
  })();
  _JMap.BuildingModelGrid = BuildingModelGrid;

})(window.JMap || (window.JMap = {}));