# Response - [responsejs.com](http://responsejs.com)

Response is a lightweight, jQuery plugin, that gives designers/devs tools for producing performance-optimized, mobile-first responsive websites. It provides easy-to-use action hooks for dynamically swapping code blocks based on screen sizes and semantic methods for progressively serving images/media via HTML5 data attributes. Response's methods are also available as object properties, making them useful tools in OOP-minded custom development.

Documentation [is in the works here](http://responsejs.com).

## Setup

Since version 0.2.6, Response does not setup any default attributes. Devs should setup their attributes by using `Response.create()` directly or by passing args in a JSON object stored in a `data-responsejs` attribute on the `<body>` tag.

### Example: custom setup via JSON in data attribute (recommended method)
```html
    <body data-responsejs='{ 
        "create": [ 
            { "mode": "src", "prefix": "src", "breakpoints": [1281,1025,961,641,481,320,0] },
            { "mode": "markup", "prefix": "r", "breakpoints": [1281,1025,961,641,481,320,0] }
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