var TileJSONs = [
    'http://a.tiles.mapbox.com/v3/examples.map-20v6611k,mapbox.dc-property-values.jsonp',
    'http://a.tiles.mapbox.com/v3/mapbox.dc-building.jsonp',
    'http://a.tiles.mapbox.com/v3/mapbox.dc-construction.jsonp',
    'http://a.tiles.mapbox.com/v3/mapbox.dc-crime.jsonp',
    'http://a.tiles.mapbox.com/v3/mapbox.dc-crime-robbery.jsonp',
    'http://a.tiles.mapbox.com/v3/mapbox.dc-crime-theft.jsonp',
    'http://a.tiles.mapbox.com/v3/mapbox.dc-crime-auto.jsonp'
];

$('#map').mapbox(TileJSONs, function(map, tiledata) {

    // Assign readable names to all layers
    map.getLayerAt(0).named('base');
    map.getLayerAt(1).named('building');
    map.getLayerAt(2).named('construction');
    map.getLayerAt(3).named('crime');
    map.getLayerAt(4).named('robbery');
    map.getLayerAt(5).named('theft');
    map.getLayerAt(6).named('auto');

    // Don't composite base layer with other layers
    map.getLayer('base').composite(false);

    // Disable all overlay layers by default
    map.disableLayer('building');
    map.disableLayer('construction');
    map.disableLayer('crime');
    map.disableLayer('robbery');
    map.disableLayer('theft');
    map.disableLayer('auto');

    // Set initial latitude, longitude and zoom level
    map.setCenterZoom({
        lat: 38.90900,
        lon: -77.01439
    }, 13);

    // Set minimum and maximum zoom levels
    map.setZoomRange(0, 15);

    // Enable share control
    mapbox.share().map(map).add();

});
