# Response
[Response](http://responsejs.com) is an experimental [jQuery](http://jquery.com)/[Ender](https://github.com/ender-js/Ender)/[Zepto](http://zeptojs.com) plugin that gives web designers performant tools for building responsive websites. It can dynamically swap content based on [breakpoints](#breakpoint-sets) and data attributes.

## API ([0.7](../../releases))

### Breakpoint Sets

Response's main feature is its breakpoint sets. They offer the ability to serve different content via breakpoint-based data attributes. They are best applied with a mobile-first approach. Devs can choose custom breakpoints to create exactly data attributes they need. By default none are setup.

#### Creating Breakpoint Sets

Sets are created either by calling [Response.create(options)](http://responsejs.com/#create) directly, or automatically via JSON stored in a `body[data-responsejs]`. 
The <var>options</var> can be a plain object or an array of them. See [wiki examples](../../wiki/how-to-create-breakpoint-sets).

```js
Response.create({
    prop: "width"  // "width" "device-width" "height" "device-height" or "device-pixel-ratio"
  , prefix: "min-width- r src"  // the prefix(es) for your data attributes (aliases are optional)
  , breakpoints: [1281,1025,961,641,481,320,0] // min breakpoints (defaults for width/device-width)
  , lazy: true // optional param - data attr contents lazyload rather than whole page at once
});
```

#### OR

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

##### To write markup like:

```html
<div data-min-width-481="markup @ 481px+" data-min-width-961="markup @ 961px+">
  default markup for 480px- or no-js
</div>
```

### Dimensions

```js
Response.viewportW() // CSS viewport width
Response.viewportH() // CSS viewport height
Response.scrollX() // cross-broswer window.scrollX
Response.scrollY() // cross-broswer window.scrollY

Response.deviceW() // device width
Response.deviceH() // device height
Response.deviceMax() // calculated Math.max(deviceW, deviceH)
Response.deviceMin() // calculated Math.min(deviceW, deviceH)
```

### Booleans

```js
// band() methods test width ranges. wave() methods test height ranges:
Response.band(481) // true in viewports 481px wide and up.
Response.band(0, 480) // true in viewports 0-480px wide.
Response.wave(641) // true in viewport 641px high and up.
Response.wave(0, 640) // true in viewports 0-640px high.

// Device dimensions never change (regardless of viewport size or rotation)
Response.device.band(481) // true for devices 481px wide and up
Response.device.band(0, 480) // true for devices 0-480px wide.
Response.device.wave(641) // true for devices 641px high and up.
Response.device.wave(0, 640) // true for devices 0-640px high.

Response.dpr(1.5) // true when device-pixel-ratio is 1.5+
Response.dpr(2) // true when device-pixel-ratio is 2+
Response.dpr(3/2) // [!] FAIL (Gotta be a decimal or integer)
Response.dpr() // get device-pixel-ratio - returns integer or float (0 if undetectable)

// @param {Element} elem
// @param {number} cushion pixel amount (default: 0)
Response.inX(elem, cushion) // true if any part of elem is in the same x axis range as viewport
Response.inY(elem, cushion) // true if any part of elem is in the same y axis range as viewport
Response.inViewport(elem, cushion) // true if any part of elem is in the viewport

// Examples
Response.inViewport($('p.example')) // true if any part of <p class=example> is in viewport (exact)
Response.inViewport(this) // true if any part of `this` elem is in viewport (exact)
Response.inViewport(this, 100) // true if any part of `this` elem is in viewport (or w/in 100px of it)

// Media queries
Response.media(mediaQuery).matches
```

### HTML5 Dataset

Response includes dataset methods like those in [<b>dope</b>](https://github.com/ryanve/dope). Please see [#19](../../issues/19) and let us know if you are using these.

```js
Response.dataset(elem, key) // get
Response.dataset(elem, [key]) // get and render (See Response.render)
Response.dataset(elem, key, value) // set
Response.dataset(elem, atts) // set multiple data atts at once
Response.deletes(elem, keys) // delete one or more data atts

Response.dataset(document.body, "pulpFiction", 5) // sets <body data-pulp-fiction="5">
Response.dataset(document.body, "pulpFiction") // -> "5"
Response.dataset(document.body, ["pulpFiction"]) // -> 5
```

#### Dataset methods [integrated](#integration) into jQuery

```js
$('div').dataset(key) // get (from first matched element)
$('div').dataset([key]) // get and render (See Response.render)
$('div').dataset(key, value) // set (sets all matched elems)
$('div').dataset(atts) // set multiple data atts at once
$('div').deletes(keys) // delete one or more data atts
```

### Data Utils

```js
Response.render(str)   // convert stringified primitives to correct value e.g. "true" to true 
Response.camelize(str) // convert 'pulp-fiction' or 'data-pulp-fiction' to pulpFiction
Response.datatize(str) // convert 'pulpFiction' to 'data-pulp-fiction'
Response.target(keys) // convert keys like "a b c" or ["a","b","c"] to $("[data-a],[data-b],[data-c]")
Response.access(keys) // access an array of dataset values that correspond to an array of dataset keys
Response.store($elems, key, attrToReadFrom?) // store init content of each elem to data key
```

### Filters

**@deprecated**. To be removed. See [github.com/ryanve/verge/issues/1](https://github.com/ryanve/verge/issues/1)

### Events

```js
Response.ready(fn)  // call fn on ready
Response.resize(fn) // call fn on resize
Response.action(fn|fns) // call fn(s) on ready *and* on resize
Response.crossover(fn, prop?) // call fn on breakpoint set crossovers points

Response.crossover(function() {
  // do stuff each time viewport crosses width breakpoints
}, 'width');
```

### Objects/Arrays

```js
Response.affix(stack, prefix?, suffix?) // create array w/ prefix|suffix added to each stack value
Response.each(stack, fn, scope?) // call fn for each item in stack
Response.map(stack, fn, scope?) // map stack into a new array
Response.merge(target, source) // merge source's defined values into target
Response.object(parent) // create a new object that inherits parent (via Object.create where possible)
Response.route(stack|other, fn, scope?) // call fn on each stack value or on a non-stack
Response.sift(stack, fn?, scope|invert?) // like _.compact, [].filter, and jQuery.grep
```

### Extending

```js
/**
 * @param {string} prop custom property name (or an existing prop to override)
 * @param {Function} test callback to test min breakpoints for the prop
 */
Response.addTest('viewport-area', function(min) {
  return min >= Response.viewportW() * Response.viewportH();
}).create({
    prop: 'viewport-area' // custom prop name
  , breakpoints: [100000, 1000000, 10000000] // custom breakpoints
  , dynamic: true // set this to true if prop needs to be tested on resize
});
```

### Integration

```js
Response.bridge($) // Integrate chainable inX/inY/inViewport/dataset/deletes methods into $.fn
```

```js
Response.noConflict(); // remove the global `Response`
Response.noConflict(function(Response){  
  // Remove the global and get safe reference to `Response` in here
});
```

#### [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) usage

```js
// see the source for more info on this
define(['jquery'], Response.noConflict);  // define module and destroy global
```

## Resources

- [Website](http://responsejs.com/)
- [Test Suite](http://responsejs.com/test/)
- [Issues](../../issues)
- [Wiki](../../wiki)

#### Related Modules

- [verge](https://github.com/ryanve/verge) - viewport utilities
- [actual](https://github.com/ryanve/actual) - `@media` detector
- [dope](https://github.com/ryanve/dope) - dataset abstraction
- [res](https://github.com/ryanve/res) - resolution utilities

## Fund

<b>[Tip the developer](https://www.gittip.com/ryanve/)</b> =)

## License

[MIT](response.js#L4-L5)