# CHANGELOG | [current](https://github.com/ryanve/response.js/blob/master/response.js) 

## [0.7.0](https://github.com/ryanve/response.js/commit/ec0ac38574a73ca325296168d785a695e7eda9e5)
- Added [elo](http://github.com/ryanve/elo) as a compatible framework. 
- `Response.store` now has capability so [store from any attribute](http://www.youtube.com/watch?v=-VBoTq4sTWk).
- `Response.merge` brings in all values except `undefined`.
- `Response.dpr()` nows ensures `boolean|number` return.
- Added thisArg functionality to `Response.each` / `Response.route` / `Response.sift`
- Added typestring functionality to `Response.sift` (e.g. `Response.sift(arr, "string")` filters for `typeof` string only)
- `Response.map` now delegates to native `[].map` when available and emulates it otherwise.
- Removed excess element references in breakpoint set objects.
- Removed uneeded memoization in breakpoint sets.

## [0.6.1](https://github.com/ryanve/response.js/commit/c4ce4b5f6b412a71ff6c66cb49ec943506f9b893) (2012-07-19)
- Allow for empty breakpoints like `data-r961=""` to work as expected. ([See #12](https://github.com/ryanve/response.js/issues/12))

## [0.6.0](https://github.com/ryanve/response.js/commit/6fdc4d1596b1f58fd9ef094805e19f1c118aff52) (2012-06-19)
- Added `Response.noConflict()`
- Added support for [non-numeric custom breakpoints](https://github.com/ryanve/response.js/issues/10#issuecomment-6439578).
- Added `Response.bridge()`. `Response.chain()` is now an alias for `Response.bridge()`. Use `Response.bridge()`.
- Removed [depreciated](https://github.com/ryanve/response.js/issues/6) `.overflowX()`/`.overflowY()` methods.
- Reorganized closure to better accomodate [module loaders](https://github.com/ryanve/response.js/pull/9).

## [0.5.3](https://github.com/ryanve/response.js/commit/dc2b203e8e3e5ae0ba45a1f615e1b09dfd9c16cd) (2012-05-19)
- Fixed incorrect comparison operator in `Response.render()`

## [0.5.2](https://github.com/ryanve/response.js/commit/fa85d8a6c7a77fcd9ab1ed8fc65a604a5260a2ef) (2012-04-25)
- minor optimizations

## [0.5.1](https://github.com/ryanve/response.js/commit/cbcbd6022c659937abd2e08b8b9c7e8009b18c4d) (2012-03-21)
- `Response.addTest()` now can be chained like `Response.addTest().addTest().addTest()` 
- **CSS**: For styling purposes `.responsejs` now gets added to the `html` tag when Response has been successfully loaded. `.no-responsejs` is removed if it is present.

## [0.5.0](https://github.com/ryanve/response.js/commit/0f7a4d98cc28ac733ca53b2ecf0c3d8c494162bd) (2012-03-18)
- [Jeesh](http://ender.no.de/#jeesh) compatibility added. (0.5.0 requires jQuery, Zepto, **or** Jeesh.)
- [Consistency](https://github.com/ryanve/response.js/issues/4): The 4 device dimension getters (deviceW / deviceH / deviceMax / deviceMax) were converted from properties to methods in order to be [consistent](https://github.com/ryanve/response.js/issues/4) with the rest of the dimensions API => they now require parens, e.g. `Response.deviceW()`
- **Events**: Ready, resize, and crossover events added to the API. (See Events in the [readme](https://github.com/ryanve/response.js/blob/master/README.md))
- **Extending**: Added ability to add custom props/tests via `Response.addTest(prop, testFn)` (See Extending in the [readme](https://github.com/ryanve/response.js/blob/master/README.md))
- Improved performance of inX / inY / inViewport methods. 

## [0.4.2](https://github.com/ryanve/response.js/commit/82e8f5b148b6b411438014dbd5b638625d9d73b7) (2012-03-08)
- Fixed 2 important bugs: 
  - [error @breakpoints from custom breakpoints handler](https://github.com/ryanve/response.js/commit/64d3fd9b953809cbbe773769c76b1bcf488635cb)
  - [escaping in special characters in selector strings](https://github.com/ryanve/response.js/commit/82e8f5b148b6b411438014dbd5b638625d9d73b7)

## [0.4.1](https://github.com/ryanve/response.js/commit/c06f9c9c7275ef1d154613fe33ed95146d174558) (2012-03-02)
- Minor [tweak](https://github.com/ryanve/response.js/commit/c06f9c9c7275ef1d154613fe33ed95146d174558) improves performance of the overflowX/overflowY methods.

## [0.4.0](https://github.com/ryanve/response.js/commit/b6614cb95da16caf087cf1b76a1023f7f5c94e58) (2012-02-27)
 
- **Methods**: The string utilities camelize and datatize (both part of the dataset API) were added to the public API. The optimized iterators introduced in 0.3.0 were also added to the public API. (See map/each/sift/affix in the [readme](https://github.com/ryanve/response.js/blob/master/README.md))
- **Lazyloading**: The lazyloading module introduced in 0.3.0 is now fully available as on opt-in feature for sets. In `Response.create` options objects devs can specify `lazy: true` (or `"lazy": true` in the JSON setup). 

## [0.3.1](https://github.com/ryanve/response.js/commit/b6614cb95da16caf087cf1b76a1023f7f5c94e58) (2012-02-27)
**Aliased prefixes**: Version 0.3.1 makes it possible to alias multiple prefixes in a space-separated string. Aliasing multiple prefixes has much better performance than creating two sets for the same prop, but the latter is also supported for back compatibility. Since 0.3.1, if the prefix param is omitted it will default to "min-[prop]-" For example if the prop is `"width"` then the prefix would default to `"min-width-"` which would create functionality for `data-min-width-0`, `data-min-width-320`, etc. based on the breakpoints. 

Aliasing is the recommended way to backsupport the separate prefixes previously needed for separate modes while still gaining the performance benefit of the mode autodection introduced in 0.3.0. It also gives devs greater flexibility in naming their prefixes because the prefix name can be changed without breaking existing code. Alias prefixes can be used interchangably. For HTML readablity, future docs will recommend the default prefixing. A JSON setup that supports the default, "r", and "src" prefixes would look like this:

```html
<body data-responsejs='{ 
    "create": {  "prop": "width"
               , "prefix": "min-width- r src"
               , "breakpoints": [1281,1025,961,641,481,320,0]  }
}'>
```

## [0.3.0](https://github.com/ryanve/response.js/commit/411447f71123289266532aa7b941ec68360e6f12) (2012-02-14)
- [**Zepto**](https://github.com/madrobby/zepto): Response is now fully compatible with [Zepto](https://github.com/madrobby/zepto). To do this, functions that relied on jQuery methods lacking Zepto equivalents such as [$.grep](http://api.jquery.com/jQuery.grep/) / [$.parseJSON](http://api.jquery.com/jQuery.parseJSON/) / [$.data](http://api.jquery.com/jQuery.data/) needed to be converted. Our code now mostly uses native methods to accomplish these tasks. This has a two-fold effect: the underlying code now is a bit longer but it *runs* way faster—win.
- [**HTML5 dataset**](https://github.com/ryanve/response.js/blob/master/README.md): In adapting more methods into native code `Response.dataset` was born. Using syntax just like [jQuery.data](http://api.jquery.com/jQuery.data/), `Response.dataset(elem, key, value)` provides a blazing fast cross-browser implementation of the native dataset API and this is now used for all data attribute storage and access within Response. (See examples in the [readme](https://github.com/ryanve/response.js/blob/master/README.md).)
- [**Mode autodetection**](https://twitter.com/#!/ResponseJS/status/158784160754966529): In previous versions it was necessary to specify [markup or src](http://responsejs.com/#modes) mode in their attribute set definitions. In 0.3.0 the appropriated mode is autodetected! This is done by checking the [tagName](https://developer.mozilla.org/en/DOM/element.tagName) against elements that support the `src` attribute per [the spec](dev.w3.org/html5/spec-author-view/index.html#attributes-1). The mode parameter is now ignored in lieu of this autodetection. This is great because it means that devs only need to set up one set for each prop where in previous versions they'd have needed two (but it stills work either way for backwards support).
  - `img`|`input`|`source`|`embed`|`track` always behave in src mode.
  - `iframe`|`audio`|`video` behave in src mode *only* if a `src` attribute is present.
  - Otherwise elements behave in [markup mode](http://responsejs.com/#modes). 
- **OO**: The code that powers the attribute sets now employs an object-based approach. Using prototypal/differential inheritance, attribute sets now inherit from an internal base object called `Elemset`. Each individual element within the set also inherits from the same object. Whoa—slick. This makes the code that powers the sets easier to maintain and at the same time improves their efficiency.
- **Lazyloading**: Attribute sets are now capable of lazyloading. In 0.3.0 this feature is at an experimental phase and is only rolled out for Webkit browsers—where the JavaScript engine is lightning fast. The effect of this is that content stored in Response data attributes is not loaded until it is near the active viewport. This has potential for enormous performance savings. In creating this feature, three area-based methods were introduced: [inX/inY/inViewport](https://github.com/ryanve/response.js/blob/master/README.md).
- **Chainable** forms of Response's dataset / deletes / inX / inY / inViewport methods are available as an opt-in. They are disabled by default. Calling `Response.chain()` exposes them to `$.fn` and makes them available in the jQuery chain. (See usage in [readme](https://github.com/ryanve/response.js/blob/master/README.md).)
- [**Dimensions methods**](https://github.com/ryanve/response.js/blob/master/README.md) were added to the main API.
- **Local Iterators**: In an effort to further improve performance, local iteration functions optimized for their needed usage in Response using native loops are now used in place of `$.map` / `$.each` / `$.grep`
- **Dropped**: The legacy version of `Response.create` in 0.2.5 took string params. This was never in the docs so it seems safe to drop support for this. Therefore in 0.3+ the `Response.create` [param](http://responsejs.com/#create) must be an object (or an array of objects). The `Response.decide` method used internally was depreciated/removed in 0.3.0.

## [0.2.9](https://github.com/ryanve/response.js/commit/6d483eee4eb0e60b96d3b251d8f3bad168fc0fda#response.js) (2012-01-02)
- [Fixed issue reading data-responsejs attribute](https://github.com/ryanve/response.js/issues/3).
- Added new boolean methods: 
  - `Response.wave` tests viewport `height` ranges (vertical equivalent to [Response.band](http://responsejs.com/#band))
  - `Response.device.wave` tests `device-height` ranges 
  - `Response.device.band` tests `device-width` ranges 
- Breakpoints can now be based on any of the props—in addition to `'width'` and `'device-pixel-ratio'` the [Response.create](http://responsejs.com/#create) `prop` parameter now accepts `'height'`, `'device-width'`, and `'device-height'`.

## [0.2.8](https://github.com/ryanve/response.js/commit/088c80427ada40f9a6d38b44f7502c14a9f0bc70) (2011-12-17)
- Added local function for handling range comparison in preparation for new methods in 0.2.9.
- `Response.decide` loop optimized.
- Removed depreciated [Response.affix](https://github.com/ryanve/response.js/issues/1) method.

## [0.2.7](https://github.com/ryanve/response.js/commit/0885b9c17fd85c85f23753720ca3f27f33bdc4cd) (2011-10-26)
- Error handling was improved. Now, most of the public methods will throw an exception to the console if the args sent to them are incorrect. The exception says the name of the method that caused the problem and when possible the name of the arg preceded by an @ sign.
- Some issues with device-pixel-ratio [decimals](http://stackoverflow.com/questions/7907180/retain-precision-during-numeric-sort) and were resolved. Response.target was updated with the ability to target data keys containing decimal points. [They needed to be escaped.](https://github.com/jquery/sizzle/issues/76) Response.create now properly supports device-pixel-ratio based attributes. Response.dpr was further optimized.

## [0.2.6](https://github.com/ryanve/response.js/commit/28feb9d5608149c175a57d99383007bd90366b4a) (2011-10-24)
- The default attribute setups were eliminated in favor of letting devs choose their own setup options (breakpoints etc.) either via Response.create or by passing the custom setup options in a JSON object stored in a data attribute on the body tag. The latter method is preferrable because it requires no scripting.
- The Response.create method was reworked to accomodate the ability to pass args via an object (or an array of objects) so that devs can better understand its use and so that it would be more efficient at creating multiple attribute sets (it now only triggers the ready event once). The original string args still work, but going forward, objects will be preferred.
- Some methods (ones mainly for internal operations) were localized for efficiency:
  - Response.format REPLACED w/ local var sortNums
  - Response.send REPLACED w/ local var applyActive
  - Response.swap REPLACED w/ local var swapEach
- Response.mins REPLACED w/ Response.mapBool (which is more general and thus better suited as a method).
- Response.band was made more efficient by eliminating the check for .matchMedia. (Checking the window width always works.)
- Minor performance tweaks were made.

## [0.2.5](https://github.com/ryanve/response.js/commit/a8790261b4c850aff2dd9be3a7512fa5118d6a01) (2011-09-20)

- Moved default Response.create() lines outside the object. 
- Created GitHub repo.
    
## [0.2.4](http://responsejs.com/source/v0/response.0.2.4.js) (2011-09-19)

- Further streamlined code need to run .dpr 
- Confirmed Opera support for window.devicePixelRatio 
  - see: [opera.com/docs/specs/presto28/#changes](http://opera.com/docs/specs/presto28/#changes)
- Confirmed Android support for devicePixelRatio 
  - see: [developer.android.com/reference/android/webkit/WebView.html](http://developer.android.com/reference/android/webkit/WebView.html) 
- Omitting Moderizr.mq as second fallback (not needed) 
    
## [0.2.3](http://responsejs.com/source/v0/response.0.2.3.js) (2011-09-19)

- Streamlined code need to run .dpr to by combinating arrays and local vars.
    
## [0.2.2](http://responsejs.com/source/v0/response.0.2.2.js) (2011-09-19)

- Changed .dpr to use local vars to reduce long text in media queries.
    
## [0.2.1](http://responsejs.com/source/v0/response.0.2.1.js) (2011-09-19)
- Added .format and .affix methods for better handling arrays
- Modified .mins and .create methods to support multiple prop-based mins.

## [0.2.0](http://responsejs.com/source/v0/response.0.2.4.js) (2011-09-19)
- Reintroduced and optimized .dpr method
- Changed args for .create:
    - using prefix now to produce keys
    - breakpoints arg is now optional

## [0.1.9](http://responsejs.com/source/v0/response.0.1.9.js) (2011-09-18)
- Several new methods introduced prevent repeating code and to offer more tools for OOP:
    - New methods include: .send .decide .swap .create .access .target .store .mins
- Converted ternary triangle (.decide) into loop for better extendability/scalabilty.
    - see: [stackoverflow.com/questions/7424757/loop-arrays-to-set-value-vals0-vals1-vals2-in-jquery](http://stackoverflow.com/questions/7424757/loop-arrays-to-set-value-vals0-vals1-vals2-in-jquery)

## [0.1.8](http://responsejs.com/source/v0/response.0.1.8.js) (2011-09-11)
- Converted ternary triangle to use arrays rather than local vars.

## [0.1.7](http://responsejs.com/source/v0/response.0.1.7.js) (2011-09-11)
- Caught error in r1281 definition.
- Optimized ternary triangles a bit.
    - see: [stackoverflow.com/questions/7382291/fastest-way-to-perform-this-ternary-operator-switch-array](http://stackoverflow.com/questions/7382291/fastest-way-to-perform-this-ternary-operator-switch-array)

## [0.1.6](http://responsejs.com/source/v0/response.0.1.6.js) (2011-09-11)
- Readability and documentation improved.
    - tabs converted to space for normalized code readability
    - comments elaborated and edited

## [0.1.5](http://responsejs.com/source/v0/response.0.1.5.js) (2011-09-10)
- Major improvements were made to the HTML5 attribute section.
    - renamed attributes to number-based names
    - added additional better optimized breakpoints
    - added "ternary triangles" for determining priority
- Removed Response.dpr but may reintroduce later if in demand.

## [0.1.4](http://responsejs.com/source/v0/response.0.1.4.js) (2011-09-10)
- Forced a more strict callback for Response.dpr in order to avoid need for eval().
- Response.actionSet method added.
    - see: [stackoverflow.com/questions/7375158/using-each-to-execute-array-of-functions-on-resize](http://stackoverflow.com/questions/7375158/using-each-to-execute-array-of-functions-on-resize)

## [0.1.3](http://responsejs.com/source/v0/response.0.1.3.js) (2011-09-10)
- Updated description to better reflect the full scope of the lib.
- Cached $document and and changed all $(window) and $(document) to cached versions.
- Changed all global vars to local vars.
- Applied safer and simpler syntax for property definitions.
- Honed in on better (and working) approach to Response.action
    - see: [stackoverflow.com/questions/7372852/chain-ready-and-resize-into-function](http://stackoverflow.com/questions/7372852/chain-ready-and-resize-into-function)

## [0.1.2](http://responsejs.com/source/v0/response.0.1.2.js) (2011-09-09)
- Introduced concept for Response.on property (not fully working at this point and renamed Response.action in 0.1.3)

## [0.1.1](http://responsejs.com/source/v0/response.0.1.1.js) (2011-08-22)
- Changed $this.data(key,value) operations to $.data(element,key,value) for speed.
- Fixed two missing ; errors by adding commas after .band and .dpr methods.

## [0.1.0](http://responsejs.com/source/v0/response.0.1.0.js) (2011-08-21)
- 1st working version. Includes Response.band and Response.dpr methods.