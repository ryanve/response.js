# [Response](http://responsejs.com)

[Response JS](http://responsejs.com) is a lightweight jQuery or Zepto plugin that gives web designers tools for building performance-optimized, mobile-first responsive websites. It provides semantic ways to dynamically swap code blocks based on breakpoints and serve images (or other media) progressively via HTML5 data attributes (see Breakpoint Sets).

## API (v 0.5.0)

### Breakpoint Sets

Response's most powerful feature is its breakpoint sets. They allow the ability to serve different content via breakpoint-based data attributes. Devs can choose custom breakpoints to create exactly data attributes they need. By default none are setup. Sets can be created using [Response.create(options)](http://responsejs.com/#create) directly or by passing args in a JSON object stored in a `data-responsejs` attribute on the `<body>` tag. In either case, a single set can be setup by passing a single object or multiple sets can be setup by passing an array of objects. See [change notes](https://github.com/ryanve/response.js/blob/master/CHANGELOG.md) for 0.3.0 (about mode autodetection) and 0.3.1 (about aliased prefixes).

```javascript
    Response.create({
        prop: "width"  // "width" "device-width" "height" "device-height" or "device-pixel-ration"
      , prefix: "min-width- r src"  // the prefix(es) for your data attributes (aliases are optional)
      , breakpoints: [1281,1025,961,641,481,320,0] // min breakpoints (defaults for width/device-width)
      , lazy: true // optional param - data attr contents lazyload rather than whole page at once
    });
```
**OR**

```html
    <body data-responsejs='{ 
        "create": [
            { "prop": "width"
            , "prefix": "min-width- r src"
            , "lazy": true
            , "breakpoints": [1281,1025,961,641,481,320,0] }
        ]}'
    >
```
**to write markup like:**

```html

   <div data-min-width-481="markup @ 481px+" data-min-width-961="markup @ 961px+">
       default markup for 480px- or no-js
   </div>
```


### Dimensions

```javascript

Response.viewportW() // return viewport width
Response.viewportH() // return viewport height
Response.overflowX() // # of horizontal pixels that doc overflows viewport (or 0 if no overflow)
Response.overflowY() // # of vertical pixels that doc overflows viewport (or 0 if no overflow)
Response.scrollX()   // cross-broswer equiv to native window.scrollX   // ~ jQuery(window).scrollLeft()
Response.scrollY()   // cross-broswer equiv to native window.scrollY   // ~ jQuery(window).scrollTop()

Response.deviceW()     // device width  property
Response.deviceH()     // device height property
Response.deviceMax()   // calculated Math.max(deviceW, deviceH)
Response.deviceMin()   // calculated Math.min(deviceW, deviceH)
// Read: github.com/ryanve/response.js/issues/4
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
Response.inViewport(this, 100) // true if any part of `this` elem is in viewport (or is w/in 100px of it)

// Most responsive sites only overflow in one direction (vertical scroll, not horizontal). When there's 
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

// Enable jQueryish chaining by calling Response.chain()

$('div').dataset(key)                 // get (from first matched element)
$('div').dataset([key])               // get and render (See Response.render)
$('div').dataset(key, value)          // set (sets all matched elems)
$('div').dataset({k1:val, k2:val})    // set multiple attrs at once (on all matched elems)
$('div').deletes(keys)                // delete attrs (space-separated string)

// Examples

$('body').dataset("pulpFiction", 5)            // sets <body data-pulp-fiction="5">
$('div').dataset("pulpFiction", 5)             // sets <div data-pulp-fiction="5"> on all matched divs
$('div').deletes("pulpFiction")                // remove data-pulp-fiction from all matched divs
$('body').dataset({pulpFiction:5, movie:true}) // sets <body data-pulp-fiction="5" data-movie="true">
$('body').dataset("pulpFiction")               // returns "5"
$('body').dataset(["pulpFiction"])             // returns 5
Response.dataset(document.body, "movie")       // returns "true"
Response.dataset(document.body, ["movie"])     // returns true
```

### Data Utils

```javascript

Response.render(str)   // convert stringified primitives to correct value e.g. "true" to true 
Response.camelize(str) // convert 'pulp-fiction' or 'data-pulp-fiction' to pulpFiction
Response.datatize(str) // convert 'pulpFiction' to 'data-pulp-fiction'
Response.target(keys)  // convert keys like "a b c" or ["a","b","c"] to $("[data-a],[data-b],[data-c]")
Response.access(keys)  // access an array of dataset values that correspond to an array of dataset keys
Response.store($elems, key [, overwrite]) // store init content of each elem to data key (see source)
```

### Filters

```javascript

// Filters - ( Disabled by default. Enable them by calling Response.chain() )
// @param  number   verge    optional
// @param  boolean  inverse  optional   use true to invert (keep only the elems NOT in the viewport)

$('div').inViewport(verge, inverse)  
$('div').inViewport().addClass('im-in-the-viewport-bro')

$('div').inX()
$('div').inY()
```

### Events

```javascript

Response.ready(callback)   // fire callback when DOM is ready
Response.resize(callback)  // bind callback the to resize event
Response.action(callback)  // bind callback (or array of callbacks) to ready *and* resize
Response.crossover(callback [, prop]) // bind callback to dynamic attribute sets' breakpoint crossovers

Response.action(function() {
    // do stuff on ready and resize
});

Response.crossover(function() {
    // do stuff each time viewport crosses width breakpoints
}, 'width');
```

### Objects/Arrays

```javascript

Response.affix(arr, prefix, suffix) // create a copy of arr with prefix and/or suffix added to each value
Response.each(arr, callback) // iterator arrays/array-like objs (~like Array.prototype.forEach)
Response.map(arr, callback, thisArg) // iterator for arrays/array-like objs (like Array.prototype.map)
Response.merge(base, adds) // merge adds into base (either can be array or object)
Response.object(prototype) // uses native Object.create (with polyfill support for first arg)
Response.route(ukn) // handler for accepting args as singles or arrays   
Response.sift(arr)  // create a copy of arr with falsey values removed
Response.sift(arr, callback) // cross-browser equivalent to arr.filter(callback)
Response.sift(arr, callback, invert) // equivalent to jQuery.grep
```

### Extending

```javascript

Response.chain()  // Expose chainable versions of inX/inY/inViewport/dataset/deletes methods to $.fn
```

```javascript

// Response.addTest(prop, testFn)
// @param   string    prop           a custom prop name (or an existing prop to override)
// @param   callback  testFn         boolean callback to test min breakpoints for the prop
// @since   0.5.0
// @example

Response.addTest('viewport-area', function(min) {
    return min >= Response.viewportW() * Response.viewportH();
});

Response.create({
    prop: 'viewport-area' // custom prop name
  , breakpoints: [100000, 1000000, 10000000] // custom breakpoints
  , dynamic: true // set this to true if prop needs to be tested on resize
});
```

