(function(root) {
    var Map = {},
        layers;

    Map = function(el, l, callback) {
        wax.tilejson(l.api, function(t) {
            var handlers = [
                new MM.DragHandler(),
                new MM.DoubleClickHandler(),
                new MM.TouchHandler()
            ];
            if ($.inArray('zoomwheel', l.features) >= 0) {
                handlers.push(new MM.MouseWheelHandler());
            }

            MM_map = new MM.Map(el, new wax.mm.connector(t), null, handlers);
            MM_map.setCenterZoom({
                lat: (l.center) ? l.center.lat : t.center[1],
                lon: (l.center) ? l.center.lon : t.center[0]
            }, (l.center) ? l.center.zoom : t.center[2]);

            if (l.zoomRange) {
                MM_map.setZoomRange(l.zoomRange[0], l.zoomRange[1]);
            } else {
                MM_map.setZoomRange(t.minzoom, t.maxzoom);
            }

            wax.mm.attribution(MM_map, t).appendTo(MM_map.parent);

            for (var i = 0; i < l.features.length; i++) {
                switch(l.features[i]) {
                    case 'zoompan':
                        wax.mm.zoomer(MM_map).appendTo(MM_map.parent);
                        break;
                    case 'zoombox':
                        wax.mm.zoombox(MM_map);
                        break;
                    case 'legend':
                        MM_map.legend = wax.mm.legend(MM_map, t).appendTo(MM_map.parent);
                        break;
                    case 'bwdetect':
                        wax.mm.bwdetect(MM_map);
                        break;
                    case 'share':
                        wax.mm.share(MM_map, t).appendTo($('body')[0]);
                        break;
                    case 'tooltips':
                        MM_map.interaction = wax.mm.interaction()
                            .map(MM_map)
                            .tilejson(t)
                            .on(wax.tooltip()
                                .parent(MM_map.parent)
                                .events()
                            );
                        break;
                    case 'movetips':
                        MM_map.interaction = wax.mm.interaction()
                            .map(MM_map)
                            .tilejson(t)
                            .on(wax.movetip()
                                .parent(MM_map.parent)
                                .events()
                            );
                        break;
                }
            }
            if (callback && typeof(callback) == 'function') callback();
        });
        return Map;
    };

    Map.layers = function(x) {
        if (!arguments.length) return layers;
        layers = x;
        return Map;
    };

    Map.setOverlay = function(id) {

        if (!layers[id]) throw new Error('overlay with id ' + id + ' not found');
        var l = layers[id];

        wax.tilejson(l.api, function(t) {
            var level = (l.level === 'base') ? 0 : 1;
            
            try {
                MM_map.setLayerAt(level, new wax.mm.connector(t));
            } catch (e) {
                MM_map.insertLayerAt(level, new wax.mm.connector(t));
            }
            if (MM_map.interaction) MM_map.interaction.map(MM_map).tilejson(t);
            if (MM_map.legend) {
                MM_map.legend.content(t);
            }
        });

        if (l.center) {
            var lat = l.center.lat || MM_map.getCenter().lat,
                lon = l.center.lon || MM_map.getCenter().lon,
                zoom = l.center.zoom || MM_map.getZoom();

            if (l.center.ease > 0) {
                MM_map.easey = easey().map(MM_map)
                    .to(MM_map.locationCoordinate({ lat: lat, lon: lon })
                    .zoomTo(zoom)).run(l.center.ease);
            } else {
                MM_map.setCenterZoom({ lat: lat, lon: lon }, zoom);
            }
        }
    };

    Map.removeOverlay = function(id) {

        if (!layers[id]) throw new Error('overlay with id ' + id + ' not found');
        var l = layers[id];

        var level = (l.level === 'base') ? 0 : 1;
        MM_map.removeLayerAt(level);
        if (MM_map.legend) MM_map.legend.content(' ');
        if (MM_map.interaction) MM_map.interaction.remove();
    };

    root.Map = Map;

})(this);

// Bind the geocoder functionality to any div with the format
//
//     <div data-control='geocode' id="search">
//        <form class="geocode">
//          <input placeholder='Search for an address' type="text">
//          <input type='submit' />
//          <div id='geocode-error'></div>
//        </form>
//      </div>
//
function bindGeocoder() {
    $('[data-control="geocode"] form').submit(function(e) {
        var m = $('[data-control="geocode"]').attr('data-map');
        // If this doesn't explicitly name the layer it should affect,
        // use the first layer in MB.maps
        e.preventDefault();
        geocode($('input[type=text]', this).val(), m);
    });
    var geocode = function(query, m) {
        query = encodeURIComponent(query);
        $('form.geocode').addClass('loading');
        reqwest({
            url: 'http://open.mapquestapi.com/nominatim/v1/search?format=json&json_callback=callback&&limit=1&q=' + query,
            type: 'jsonp',
            jsonpCallback: 'callback',
            success: function (r) {
                r = r[0];

                if (MM_map.geocodeLayer) {
                    MM_map.geocodeLayer.removeAllMarkers();
                }

                $('form.geocode').removeClass('loading');

                if (r === undefined) {
                    $('#geocode-error').text('This address cannot be found.').fadeIn('fast');
                } else {
                    $('#geocode-error').hide();
                    MM_map.setExtent([
                        { lat: r.boundingbox[1], lon: r.boundingbox[2] },
                        { lat: r.boundingbox[0], lon: r.boundingbox[3] }
                    ]);

                    if (MM_map.getZoom() === MM_map.coordLimits[1].zoom) {
                        var point = { 'type': 'FeatureCollection',
                            'features': [{ 'type': 'Feature',
                            'geometry': { 'type': 'Point','coordinates': [r.lon, r.lat] },
                            'properties': {}
                        }]};

                        if (MM_map.geocodeLayer) {
                            MM_map.geocodeLayer.removeAllMarkers();
                            MM_map.geocodeLayer.geojson(point);
                        } else {
                            MM_map.geocodeLayer = mmg()
                                .geojson(point);
                            MM_map.addLayer(MM_map.geocodeLayer);
                        }

                        MM_map.setCenter({ lat: r.lat, lon: r.lon });
                    }
                }
            }
        });
        var attribution = 'Search by <a href="http://developer.mapquest.com/web/products/open">MapQuest Open</a>';
        if ($('.wax-attribution').html().indexOf(attribution) < 0) {
            $('.wax-attribution').append(' - ' + attribution);
        }
    };
}

$(function() {
    if (location.hash === '#embed') $('body').removeClass().addClass('embed');

    $('body').on('click.map', '[data-control="layer"]', function(e) {
        var $this = $(this),
            id = $this.attr('href');
        id = id.replace(/.*(?=#[^\s]+$)/, '').slice(1);
        var m = $('[data-control="geocode"]').attr('data-map') || 'main';
        e.preventDefault();
        if($this.hasClass('active')) {
            $('[data-control="layer"]').removeClass('active');
            window[m].removeOverlay(id);        
        } else {
            $('[data-control="layer"]').removeClass('active');
            $this.addClass('active');
            window[m].setOverlay(id);
        }
    });

    bindGeocoder();
});
