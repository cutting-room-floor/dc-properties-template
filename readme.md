# Map-site Template

A way to jumpstart building a map-based microsite, the map-site template bundles common html and css formatting with reusable javascript components.

To build a project based on this template, clone this repository, edit the html content and css, and alter the configuration script.

## HTML template

The html markup for the template is in `index.html`. It's a simple HTML5 page layout. Generally, there are three things to change in this document:

1. Content elements like the `title`, `h1`, and `div#about` elements
2. Add new container elements for features like maps, layer switchers, and geocoders
3. Layout structure, as controlled by the `class` attribute on the `body` element
    
There are three layout classes that can be applied to the `body` element:

- `right` A full screen map with a header and right content sidebar (default)
- `left` A similar full screen map with a centered header and left content sidebar
- `hero` An inline map hero with a header and full-width, scrollable content section
    
## CSS styles

Most of the hard work on a microsite build is template design implemented through CSS. This template by default is simple and clean, and it's based on the tiles.mapbox.com full map view. This design and be completely overridden by applying new CSS styles.

CSS styles are in two files:

- `style.css` contains all the layout and typographic styles as well as some overridden styles for map controls, as well as a reset stylesheet from [Eric Meyer](http://meyerweb.com/eric/tools/css/reset/). Implement your design by editing this file.
- `map.css` holds the default map styles from tiles.mapbox.com embeds.

## Site configuration

An internal javascript library abstracts common things microsites need maps to do in an easy and repeatable way:

- Add one or more maps to a page
- Turn on features and controls for the map like zoom buttons, share links and embed code, interactive overlays, and more
- Overlays can be fixed to a specific location or full the mouse cursor 
- Add one or more layer switchers for each map, which can take the form of a list of layers or inline links
- Specify with layer of a map to change when changing layers
- Use the layer switcher's list or inline links to control the maps position and zoom level with configurable easing
- Add a geocoder search to orient the map based on a plain-text address. Place names zoom the map to their bounding extent and address points add a marker on each specific location
    
## Using this template

[todo]