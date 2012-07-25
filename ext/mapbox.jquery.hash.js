!function($) {

    $.fn.hash = hash;

    function hash(e) {

        var $this = $(this),
            mapid = $this.parents('[data-map]').data('map'),
            map = $('#' + mapid).data('map');

        map.addCallback('panned', setHash);
        map.addCallback('zoomed', setHash);

        setHash(map);
        return false;
    }

    var lastCall = Infinity;

    // Only sets hash after 100ms of not being called
    function setHash(map) {
        var t = (new Date()).getTime();
        lastCall = t;
        window.setTimeout(function() {
            if (lastCall == t) {
                actuallySetHash(map);
                lastCall = Infinity;
            } else {
            }
        }, 100);
    }

    function actuallySetHash(map) {
        var loc = 'loc=' + map.center().lat + ',' + map.center().lon + ',' + map.zoom(),
            layers = [];

        for (var i = 0; i < map.layers.length; i++) {
            if (map.layers[i].enabled && map.layers[i].named()) {
                layers.push(map.layers[i].named());
            }
        }
        layers = 'layers=' + layers.join(',');
        document.location.hash = [loc, layers].join('&');
    }

    function setFromHash() {
        var hashsplit = document.location.hash.split('&'),
            args = {};

        for (var i = 0; i < hashsplit.length; i++) {
            var s = hashsplit[i].split('=');
            if (s.length == 2) {
                args[s[0]] = s[1];
            }
        }

        if (args.loc) {
            var split = args.loc.split(',');
            map.setCenterZoom({
                lat: split[0],
                lon: split[1]
            }, split[2]);
        }

        if (args.layers) {
            var split = args.layers.split(',');
            for (var i = 0; i < split.length; i++) {
                $('[data-control="switcher"] [href="#' + split[i] + '"]').switchLayer();
            }
        }
        return false;
    }

    
    $(function() {
        $('[data-hash="true"] a').bind('enabled.hash disabled.hash', hash);
    });

    setFromHash();

}(window.jQuery);
