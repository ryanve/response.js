# CHANGELOG | [current](https://github.com/ryanve/response.js/blob/master/response.js) 

## 0.2.6 (2011-10-24)
- Some methods (ones mainly for internal operations) were localized for efficiency:
  - Response.format -> local var sortNums
  - Response.send -> local var applyActive
  - Response.swap -> local var swapEach
- The Response.create method was reworked to accomodate the ability to pass args via an object (or an array of objects) so that devs can better understand its use and so that it would be more efficient at creating multiple attribute sets (it now only triggers the ready event once). The original string args still work, but going forward, objects will be preferred.
- The default attribute setups were eliminated in favor of letter devs choose their own setup options (breakpoints etc.) They should now do either via Response.create or by passing the custom setup options in a JSON object stored in a data attribute on the body tag. The latter method is preferrable because it requires no scripting.
- Response.mins was renamed/changed to Response.mapBool (which is more general and thus suited for a method).
- Minor performance tweaks were made (mainly combining var statements).


## 0.2.5 (2011-09-20)

- Moved default Response.create() lines outside the object. 
    
## 0.2.4 (2011-09-19)

- Further streamlined code need to run .dpr 
- confirmed Opera support for devicePixelRatio 
  - see: [opera.com/docs/specs/presto28/#changes](http://opera.com/docs/specs/presto28/#changes)
- confirmed Android support for devicePixelRatio 
  - see: [developer.android.com/reference/android/webkit/WebView.html](http://developer.android.com/reference/android/webkit/WebView.html) 
- omitting Moderizr.mq as second fallback (not needed) 
    
## 0.2.3 (2011-09-19)

- Streamlined code need to run .dpr to by combinating arrays and local vars.
    
## 0.2.2 (2011-09-19)

- Changed .dpr to use local vars to reduce long text in media queries.
    
## 0.2.1 (2011-09-19)
- Added .format and .affix methods for better handling arrays
- Modified .mins and .create methods to support multiple prop-based mins.

## 0.2.0 (2011-09-19)
- Reintroduced and optimized .dpr method
- Changed args for .create:
    - using prefix now to produce keys
    - breakpoints arg is now optional

## 0.1.9 (2011-09-18)
- Several new methods introduced prevent repeating code and to offer more tools for OOP:
    - New methods include: .send .decide .swap .create .access .target .store .mins
- Converted ternary triangle (.decide) into loop for better extendability/scalabilty.
    - see: [stackoverflow.com/questions/7424757/loop-arrays-to-set-value-vals0-vals1-vals2-in-jquery](http://stackoverflow.com/questions/7424757/loop-arrays-to-set-value-vals0-vals1-vals2-in-jquery)

## 0.1.8 (2011-09-11)
- Converted ternary triangle to use arrays rather than local vars.

## 0.1.7 (2011-09-11)
- Caught error in r1281 definition.
- Optimized ternary triangles a bit.
    - see: [stackoverflow.com/questions/7382291/fastest-way-to-perform-this-ternary-operator-switch-array](http://stackoverflow.com/questions/7382291/fastest-way-to-perform-this-ternary-operator-switch-array)

## 0.1.6 (2011-09-11)
- Readability and documentation improved.
    - tabs converted to space for normalized code readability
    - comments elaborated and edited

## 0.1.5 (2011-09-10)
- Major improvements were made to the HTML5 attribute section.
    - renamed attributes to number-based names
    - added additional better optimized breakpoints
    - added "ternary triangles" for determining priority
- Removed Response.dpr but may reintroduce later if in demand.

## 0.1.4 (2011-09-10)
- Forced a more strict callback for Response.dpr in order to avoid need for eval().
- Response.actionSet method added.
    - see: [stackoverflow.com/questions/7375158/using-each-to-execute-array-of-functions-on-resize](http://stackoverflow.com/questions/7375158/using-each-to-execute-array-of-functions-on-resize)

## 0.1.3 (2011-09-10)
- Updated description to better reflect the full scope of the lib.
- Cached $document and and changed all $(window) and $(document) to cached versions.
- Changed all global vars to local vars.
- Applied safer and simpler syntax for property definitions.
- Honed in on better (and working) approach to Response.action
    - see: [stackoverflow.com/questions/7372852/chain-ready-and-resize-into-function](http://stackoverflow.com/questions/7372852/chain-ready-and-resize-into-function)

## 0.1.2 (2011-09-09)
- Introduced concept for Response.on property (not fully working at this point and renamed Response.action in 0.1.3)

## 0.1.1 (2011-08-22)
- Changed $this.data(key,value) operations to $.data(element,key,value) for speed.
- Fixed two missing ; errors by adding commas after .band and .dpr methods.

## 0.1.0 (2011-08-21)
- 1st working version. Includes Response.band and Response.dpr methods.