// Override movetips positioning

var wax = wax || {};
wax.movetip = wax.movetip  || {};

wax.movetip = function() {
    var popped = false,
        t = {},
        _tooltipOffset,
        _contextOffset,
        tooltip,
        parent;

    function moveTooltip(e) {
       var eo = wax.u.eventoffset(e);
       // faux-positioning
       if ((eo.y - _contextOffset.top) <
           (_tooltipOffset.height + 5) &&
           (_contextOffset.height > _tooltipOffset.height)) {
           eo.y += _tooltipOffset.height;
           tooltip.className += ' flip-y';
       }

       tooltip.style.left = eo.x + 'px';
       tooltip.style.top = eo.y - _tooltipOffset.height - 5 + 'px';
    }

    // Get the active tooltip for a layer or create a new one if no tooltip exists.
    // Hide any tooltips on layers underneath this one.
    function getTooltip(feature) {
        var tooltip = document.createElement('div'),
            inner = document.createElement('div'),
            tip = document.createElement('div');
        inner.innerHTML = feature;
        inner.className = 'inner';
        tip.className = 'tip';
        tooltip.className = 'wax-tooltip wax-tooltip-0';
        tooltip.appendChild(inner);
        tooltip.appendChild(tip);
        return tooltip;
    }

    // Hide a given tooltip.
    function hide() {
        if (tooltip) {
          tooltip.parentNode.removeChild(tooltip);
          tooltip = null;
        }
    }

    function on(o) {
        var content;
        if (popped) return;
        if ((o.e.type === 'mousemove' || o.e.type === 'touchend' || !o.e.type)) {
            content = o.formatter({ format: 'teaser' }, o.data);
            if (!content) return;
            hide();
            parent.style.cursor = 'pointer';
            tooltip = document.body.appendChild(getTooltip(content));
        }
        if (tooltip) {
          _tooltipOffset = wax.u.offset(tooltip);
          _contextOffset = wax.u.offset(parent);
          moveTooltip(o.e);
        }
    }

    function off() {
        parent.style.cursor = 'default';
        if (!popped) hide();
    }

    t.parent = function(x) {
        if (!arguments.length) return parent;
        parent = x;
        return t;
    };

    t.events = function() {
        return {
            on: on,
            off: off
        };
    };

    return t;
};


// Wax share addon
wax = wax || {};
wax.g = wax.g || {};
wax.mm = wax.mm || {};

wax.g.share =
wax.mm.share = function(map, tilejson) {
    tilejson = tilejson || {};
    tilejson.webpage = window.location.toString().split('#')[0];
    tilejson.embed = window.location.toString().split('#')[0] + '#embed';

    var link = document.createElement('a');
    var close = document.createElement('a');
    var embed = document.createElement('textarea');
    var share = document.createElement('div');
    var popup = document.createElement('div');
    var elements = [link, close, embed, share, popup];

    if (typeof com !== 'undefined') {
        var mm = com.modestmaps;
        for (var i = 0; i < elements.length; i++) {
            mm.addEvent(elements[i], 'mousedown', function(e) { mm.cancelEvent(e); });
            mm.addEvent(elements[i], 'dblclick', function(e) { mm.cancelEvent(e); });
        }
    }

    link.innerHTML = 'Share +';
    link.href = '#';
    link.className = 'share';
    link.onclick = link.ontouchstart = function() {
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        $('body').toggleClass('sharing');
        return false;
    };

    close.innerHTML = 'Close';
    close.href = '#';
    close.className = 'close';
    close.onclick = close.ontouchstart = function() {
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        $('body').toggleClass('sharing');
        return false;
    };

    embed.className = 'embed';
    embed.rows = 4;
    embed.setAttribute('readonly', 'readonly');
    embed.value = '<iframe width="500" height="300" frameBorder="0" src="{{embed}}"></iframe>'
        .replace('{{embed}}', tilejson.embed);
    embed.onclick = function() {
        embed.focus();
        embed.select();
        return false;
    };

    var twitter = 'http://twitter.com/intent/tweet?status='
        + encodeURIComponent(document.title + ' (' + tilejson.webpage + ')');
    var facebook = 'https://www.facebook.com/sharer.php?u='
        + encodeURIComponent(tilejson.webpage)
        + '&t=' + encodeURIComponent(document.title);
    share.innerHTML = ('<h3>Share this map</h3>'
        + '<p><a class="facebook" target="_blank" href="{{facebook}}">Facebook</a>'
        + '<a class="twitter" target="_blank" href="{{twitter}}">Twitter</a></p>')
        .replace('{{twitter}}', twitter)
        .replace('{{facebook}}', facebook);
    share.innerHTML += '<strong>Get the embed code</strong><br />'
    share.innerHTML += '<small>Copy and paste this HTML into your website or blog.</small>';
    share.appendChild(embed);
    share.appendChild(close);

    popup.className = 'wax-share';
    popup.style.display = 'none';
    popup.appendChild(share);

    return {
        appendTo: function(elem) {
            wax.u.$(elem).appendChild(link);
            wax.u.$(elem).appendChild(popup);
            return this;
        }
    };
};