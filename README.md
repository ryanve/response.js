# Response
Response is an experimental [jQuery](http://jquery.com)/[Ender](https://github.com/ender-js/Ender)/[Zepto](http://zeptojs.com) plugin that gives web designers tools for building responsive websites. It can dynamically swap content based on [breakpoints](#breakpoint-sets) and data attributes. (<b>npm</b>: [response.js](https://www.npmjs.org/package/response.js))

## API [(0.10)](../../releases)
### Breakpoint sets

Response's main feature is its breakpoint sets. They offer the ability to serve different content via breakpoint-based data attributes. They are best applied with a mobile-first approach. Devs can choose custom breakpoints to create exactly data attributes they need. By default none are setup.

#### [Creating breakpoint sets](../../wiki/how-to-create-breakpoint-sets)

Sets are created either by calling [Response.create(options)](http://responsejs.com/#create) directly, or automatically via JSON stored in a `body[data-responsejs]`.
The <var>options</var> can be a plain object or an array of them.

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

##### To write markup like

```html
<div data-min-width-481="markup @ 481px+" data-min-width-961="markup @ 961px+">
  default markup for 480px- or no-js
</div>
```

### Extending
#### Define a custom [breakpoint set](#breakpoint-sets) that uses a custom test

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

<a name="dimensions"></a>
### Methods from [verge](https://github.com/ryanve/verge/tree/1.9.1)

```js
Response.viewportW() // CSS viewport width
Response.viewportH() // CSS viewport height
Response.mq(mediaQuery) // => boolean
Response.inViewport(elem, cushion?) // => boolean
Response.inX(elem, cushion?) // => boolean
Response.inY(elem, cushion?) // => boolean
Response.scrollX() // => number
Response.scrollY() // => number
```

### Device size
```js
Response.deviceW() // device width
Response.deviceH() // device height
Response.deviceMax() // calculated Math.max(deviceW, deviceH)
Response.deviceMin() // calculated Math.min(deviceW, deviceH)
```

### `devicePixelRatio`

```js
Response.dpr(1.5) // true when device-pixel-ratio is 1.5+
Response.dpr(2) // true when device-pixel-ratio is 2+
Response.dpr() // get device-pixel-ratio - returns integer or float (0 if undetectable)
```

### Viewport size ranges

```js
Response.band(481) // true in viewports 481px wide and up.
Response.band(0, 480) // true in viewports 0-480px wide.
Response.wave(641) // true in viewport 641px high and up.
Response.wave(0, 640) // true in viewports 0-640px high.
```

### Device size ranges

```js
Response.device.band(481) // true for devices 481px wide and up
Response.device.band(0, 480) // true for devices 0-480px wide.
Response.device.wave(641) // true for devices 641px high and up.
Response.device.wave(0, 640) // true for devices 0-640px high.
```

### Events
#### Call a function on [breakpoint set](#breakpoint-sets) crossovers

```js
Response.crossover('width', function() {
  // runs when 'width' breakpoints are crossed
})

Response.crossover(function() {
  // runs when any defined breakpoint is crossed
})
```

#### [`@deprecated`](../../issues/51) event utils

```js
Response.ready(fn) // call fn on ready
Response.resize(fn) // call fn on resize
Response.action(fn|fns) // call fn(s) on ready *and* on resize
```

<a name="html5-dataset"></a>
<a name="data-utils"></a>
### [`@deprecated`](../../issues/51) dataset utils

```js
Response.dataset(elem, key) // get
Response.dataset(elem, [key]) // get and render (See Response.render)
Response.dataset(elem, key, value) // set
Response.dataset(elem, atts) // set multiple data atts at once
Response.deletes(elem, keys) // delete one or more data atts
Response.dataset(document.body, "pulpFiction", 5) // sets <body data-pulp-fiction="5">
Response.dataset(document.body, "pulpFiction") // -> "5"
Response.dataset(document.body, ["pulpFiction"]) // -> 5

Response.render(str) // convert stringified primitives to correct value e.g. "true" to true
Response.camelize(str) // convert 'pulp-fiction' or 'data-pulp-fiction' to pulpFiction
Response.datatize(str) // convert 'pulpFiction' to 'data-pulp-fiction'
Response.target(keys) // convert keys like "a b c" or ["a","b","c"] to $("[data-a],[data-b],[data-c]")
Response.access(keys) // access an array of dataset values that correspond to an array of dataset keys
Response.store($elems, key, attrToReadFrom?) // store init content of each elem to data key
```

<a name="objectsarrays"></a>
### [`@deprecated`](../../issues/51) object utils

```js
Response.affix(stack, prefix?, suffix?) // create array w/ prefix|suffix added to each stack value
Response.each(stack, fn, scope?) // call fn for each item in stack
Response.map(stack, fn, scope?) // map stack into a new array
Response.merge(target, source) // merge source's defined values into target
Response.object(parent) // create a new object that inherits parent (via Object.create where possible)
Response.route(stack|other, fn, scope?) // call fn on each stack value or on a non-stack
Response.sift(stack, fn?, scope|invert?) // like _.compact, [].filter, and jQuery.grep
```

### `.noConflict()`

```js
Response.noConflict() // remove the global `Response`
Response.noConflict(function(Response) {
  // Remove the global and get safe reference to `Response` in here
})
```

### [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) usage

```js
define(['jquery'], Response.noConflict);  // define module and destroy global
```

## Resources

- [Issues](../../issues)
- [Wiki](../../wiki)

#### Related Modules

- [verge](https://github.com/ryanve/verge) - viewport utilities
- [actual](https://github.com/ryanve/actual) - `@media` detector
- [dope](https://github.com/ryanve/dope) - dataset abstraction
- [res](https://github.com/ryanve/res) - resolution utilities
