// Array.indexOf polyfill courtesy of Mozilla MDN:
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}

function mmg() {
    var l = {},
        // a list of our markers
        markers = [],
        // the absolute position of the parent element
        position = null,
        factory = null,
        // map bounds
        left = null,
        right = null;

    var parent = document.createElement('div');
    parent.style.cssText = 'position: absolute; top: 0px;' +
      'left: 0px; width: 100%; height: 100%; margin: 0; padding: 0; z-index: 1';

    function defaultFactory(feature) {
        var d = document.createElement('div');
        d.className = 'mmg-default';
        return d;
    }

    function fLocation (feature) {
        // GeoJSON
        var geom = feature.geometry;
        // coerce the lat and lon values, just in case
        var lon = Number(geom.coordinates[0]),
            lat = Number(geom.coordinates[1]);
        return new MM.Location(lat, lon);
    }

    // Reposition al markers
    function repositionAllMarkers() {
        left = l.map.pointLocation(new MM.Point(0, 0));
        right = l.map.pointLocation(new MM.Point(l.map.dimensions.x, 0));
        for (var i = 0; i < markers.length; i++) {
            repositionMarker(markers[i]);
        }
    }

    // reposition a single marker element
    function repositionMarker(marker) {
        // remember the tile coordinate so we don't have to reproject every time
        if (!marker.coord) marker.coord = l.map.locationCoordinate(marker.location);
        var pos = l.map.coordinatePoint(marker.coord);
        var pos_loc;
        if (pos.x < 0) {
            pos_loc = new MM.Location(marker.location.lat, marker.location.lon);
            pos_loc.lon += Math.ceil((left.lon - marker.location.lon) / 360) * 360;
            pos = l.map.locationPoint(pos_loc);
        } else if (pos.x > l.map.dimensions.x) {
            pos_loc = new MM.Location(marker.location.lat, marker.location.lon);
            pos_loc.lon -= Math.ceil((marker.location.lon - right.lon) / 360) * 360;
            pos = l.map.locationPoint(pos_loc);
        }
        if (pos_loc) {
            marker.coord = l.map.locationCoordinate(pos_loc);
        }
        pos.scale = 1;
        pos.width = pos.height = 0;
        MM.moveElement(marker, pos);
    }

    /**
     * Add an HTML element as a marker, located at the position of the
     * provided GeoJSON feature, Location instance (or {lat,lon} object
     * literal), or "lat,lon" string.
     */
    var first = true;
    l.addMarker = function(marker, feature) {
        if (!marker || !feature) {
            return null;
        }
        // convert the feature to a Location instance
        marker.location = fLocation(feature);
        // position: absolute
        marker.style.position = 'absolute';
        // update the marker's position
        if (l.map) repositionMarker(marker);
        // append it to the DOM
        parent.appendChild(marker);

        // add it to the list
        markers.push(marker);

        return marker;
    };

    l.geojson = function(x) {
        if (!x) return markers;

        for (var i = 0; i < x.features.length; i++) {
            l.addMarker(factory(x.features[i]), x.features[i]);
        }
        return this;
    };

    l.draw = function() {
        repositionAllMarkers();
    };

    /**
     * Remove the element marker from the layer and the DOM.
     */
    l.removeMarker = function(marker) {
        var index = markers.indexOf(marker);
        if (index > -1) {
            markers.splice(index, 1);
        }
        if (marker.parentNode == parent) {
            parent.removeChild(marker);
        }
        return marker;
    };

    // remove all markers
    l.removeAllMarkers = function() {
        while (markers.length > 0) {
            this.removeMarker(markers[0]);
        }
    };

    l.factory = function(x) {
      if (!x) return factory;
      factory = x;
      return this;
    };

    l.parent = parent;

    l.factory(defaultFactory);


    return l;
}