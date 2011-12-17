# CHANGELOG | [current](https://github.com/ryanve/response.js/blob/master/response.js) 

## [0.2.8](https://github.com/ryanve/response.js/commit/088c80427ada40f9a6d38b44f7502c14a9f0bc70#response.js) (2011-12-17)
- Added local function for handling range comparison in preparation for new methods in 0.2.9.
- `Response.decide` loop optimized.
- Removed depreciated [Response.affix](https://github.com/ryanve/response.js/issues/1) method.

## [0.2.7](https://github.com/ryanve/response.js/commit/0885b9c17fd85c85f23753720ca3f27f33bdc4cd#response.js) (2011-10-26)
- Error handling was improved. Now, most of the public methods will throw an exception to the console if the args sent to them are incorrect. The exception says the name of the method that caused the problem and when possible the name of the arg preceded by an @ sign.
- Some issues with device-pixel-ratio [decimals](http://stackoverflow.com/questions/7907180/retain-precision-during-numeric-sort) and were resolved. Response.target was updated with the ability to target data keys containing decimal points. [They needed to be escaped.](https://github.com/jquery/sizzle/issues/76) Response.create now properly supports device-pixel-ratio based attributes. Response.dpr was further optimized.

## [0.2.6](https://github.com/ryanve/response.js/commit/28feb9d5608149c175a57d99383007bd90366b4a#response.js) (2011-10-24)
- The default attribute setups were eliminated in favor of letting devs choose their own setup options (breakpoints etc.) either via Response.create or by passing the custom setup options in a JSON object stored in a data attribute on the body tag. The latter method is preferrable because it requires no scripting.
- The Response.create method was reworked to accomodate the ability to pass args via an object (or an array of objects) so that devs can better understand its use and so that it would be more efficient at creating multiple attribute sets (it now only triggers the ready event once). The original string args still work, but going forward, objects will be preferred.
- Some methods (ones mainly for internal operations) were localized for efficiency:
  - Response.format REPLACED w/ local var sortNums
  - Response.send REPLACED w/ local var applyActive
  - Response.swap REPLACED w/ local var swapEach
- Response.mins REPLACED w/ Response.mapBool (which is more general and thus better suited as a method).
- Response.band was made more efficient by eliminating the check for .matchMedia. (Checking the window width always works.)
- Minor performance tweaks were made.

## [0.2.5](https://github.com/ryanve/response.js/commit/a8790261b4c850aff2dd9be3a7512fa5118d6a01#response.js) (2011-09-20)

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