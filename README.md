# [Response](http://responsejs.com)

Response is a lightweight, jQuery plugin, that gives designers/devs tools for producing performance-optimized, mobile-first responsive websites. It provides easy-to-use action hooks for dynamically swapping code blocks based on screen sizes and semantic methods for progressively serving images/media via HTML5 data attributes. Response's methods are also available as object properties, making them useful tools in OOP-minded custom development.

Documentation [is in the works here](http://responsejs.com).

## API (v 0.3.0)

```javascript

Response.create(options)  // Create breakpoint-based attribute sets ( See @link responsejs.com )
Response.chain()  // Expose chainable versions of inX/inY/inViewport/dataset/deletes methods to jQuery

```

### Dimensions

```javascript

Response.viewportW() // return viewport width
Response.viewportH() // return viewport height
Response.deviceW     // device width  property
Response.deviceH     // device height property
Response.deviceMax   // calculated Math.max(deviceW, deviceH)
Response.deviceMin   // calculated Math.min(deviceW, deviceH)
Response.overflowX() // # of horizontal pixels that doc overflows viewport (or 0 if no overflow)
Response.overflowY() // # of vertical pixels that doc overflows viewport (or 0 if no overflow)
Response.scrollX()   // cross-broswer equiv to native window.scrollX   // ~ jQuery(window).scrollLeft()
Response.scrollY()   // cross-broswer equiv to native window.scrollY   // ~ jQuery(window).scrollTop()

```

### Booleans

```javascript
// band() methods test width ranges. wave() methods test height ranges:
Response.band(481)    // true in viewports 481px wide and up.
Response.band(0, 480) // true in viewports 0-480px wide.
Response.wave(641)    // true in viewport 641px high and up.
Response.wave(0, 640) // true in viewports 0-640px high.

// device dimensions never change (regardless of viewport size or rotation)
Response.device.band(481)    // true for devices 481px wide and up
Response.device.band(0, 480) // true for devices 0-480px wide.
Response.device.wave(641)    // true for devices 641px high and up.
Response.device.wave(0, 640) // true for devices 0-640px high.

Response.dpr(1.5);  // true when device-pixel-ratio is 1.5+
Response.dpr(2);    // true when device-pixel-ratio is 2+
Response.dpr(3/2);  // [!] FAIL (Gotta be a decimal or integer)
Response.dpr();     // get device-pixel-ratio - returns integer or float (0 if undetectable)

// @param  object   elem   can be native or jQuery element
// @param  number   verge  (optional) pixel amount (default: 0)
Response.inX(elem [, verge]) // true if any part of elem is in the same x axis range as viewport
Response.inY(elem [, verge]) // true if any part of elem is in the same y axis range as viewport
Response.inViewport(elem [, verge])  // true if any part of elem is in the viewport

// examples
Response.inViewport($('p.example'))  // true if any part of <p class=example> is in viewport (exact)
Response.inViewport(this)      // true if any part of `this` elem is in viewport (exact)
Response.inViewport(this, 100) // true if any part of `this` elem is in viewport (or is within 100px of it)

// Most responsive sites only overflow in one direction (vertical scroll but not horizontal). When there's 
// no horiz.overflow, the inX method is always true, and it'd be slightly faster to simply test .inY
Response.inViewport(this) === Response.inX(this) && Response.inY(this) // always true

// media queries
Response.media(mediaQuery).matches // uses window.matchMedia || window.msMatchMedia

```

### HTML5 Dataset

Response's dataset methods mimic the HTML5 dataset specification as closely as possible.


```javascript

@param object         elem  can be a native element or jQuery element
@param string|object  key   is a camelCase or lowercase name for the data attribute.

Response.dataset(elem, key)              // get (elem can be native or jQuery elem)
Response.dataset(elem, [key])            // get and render (See Response.render)
Response.dataset(elem, key, value)       // set

Response.dataset(elem, {key1:1, key:2})  // set multiple data attrs at once
Response.deletes(elem, keys)             // delete attrs (space-separated string)
Response.deletes(elem, keys)        // delete (remove) one or more space-separated data attributes
Response.render(str)                // convert stringified primitives to correct value e.g. "true" to true 

// Enable jQueryish chaining by calling Response.chain()

$('div').dataset(key)                 // get (from first matched element)
$('div').dataset([key])               // get and render (See Response.render)
$('div').dataset(key, value)          // set (sets all matched elems)
$('div').dataset({k1:val, k2:val})    // set multiple attrs at once (on all matched elems)
$('div').deletes(keys)                // delete attrs (space-separated string)

// Examples

$('body').dataset("pulpFiction", 5)            // sets <body data-pulp-fiction="5">
$('div').dataset("pulpFiction", 5)             // sets <div data-pulp-fiction="5"> on all matched divs
$('div').deletes("pulpFiction")                // deletes (removes) data-pulp-fiction on all matched divs.
$('body').dataset({pulpFiction:5, movie:true}) // sets <body data-pulp-fiction="5" data-movie="true">
$('body').dataset("pulpFiction")               // returns "5"
$('body').dataset(["pulpFiction"])             // returns 5
Response.dataset(document.body, "movie")       // returns "true"
Response.dataset(document.body, ["movie"])     // returns true


```
### DOM

```javascript

Response.store()
Response.target()
Response.access()

```

### Filters

```javascript

// Filters - ( Disabled by default. Enable them by calling Response.chain() )
// @param  number   verge    optional
// @param  boolean  inverse  optional   use true to inverse the filter (keep only the elems NOT in the viewport)

$('div').inViewport(verge, inverse)  
$('div').inViewport().addClass('im-in-the-viewport-bro')

$('div').inX()
$('div').inY()

```

### Utils

```javascript

Response.action(callback)  // bind callback (or array of callbacks) to ready and resize events.
Response.route(ukn)        // handler for accepting args as singles or arrays   
Response.merge(base, adds [, overwrite])  // merge adds into base 

```

## Setup

Since version 0.3.0, the mode parameter is ignored because the appropriate mode is auto-detected. This means that you only need to set up one set for each prop rather than two (and then use that prefix for all elements). If if you already have both in your HTML then you'll still want to setup both so that both prefixes work. Supported props are:
"width" (default), "height", "device-width", "device-height", and "device-pixel-ratio"

Since version 0.2.6, Response does not setup any default attributes. Devs should setup their attributes by using `Response.create()` directly or by passing args in a JSON object stored in a `data-responsejs` attribute on the `<body>` tag.

### Example: custom setup via JSON in data attribute (recommended method)
```html
    <body data-responsejs='{ 
        "create": [ 
            { "prop": "width", "mode": "src",  "prefix": "src", "breakpoints": [1281,1025,961,641,481,320,0] },
            { "prop": "width", "mode": "markup", "prefix": "r", "breakpoints": [1281,1025,961,641,481,320,0] }
        ]}'
    >
```
Tip: use [jsonlint.com](http://jslint.com/) to make sure JSON is valid.

### Example: custom setup via JavaScript (after the lib is loaded):
```javascript
    Response.create([{
        mode: "markup", // either "markup" or "src"
        prefix: "r",    // the prefix for your custom data attributes
        breakpoints: [1281,1025,961,641,481,320,0] // array of (min) breakpoints
    },
    {
        mode: "src",    // either "markup" or "src"
        prefix: "src",  // the prefix for your custom data attributes
        breakpoints: [1281,1025,961,641,481,320,0] // array of (min) breakpoints
    }])
```