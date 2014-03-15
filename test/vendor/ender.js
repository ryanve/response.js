/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://enderjs.com)
  * Build: ender build scriptjs@2.5 qwery@3.4 bonzo@1.4.0 elo@1.6 sos@0.0
  * Packages: ender-core@2.0.0 ender-commonjs@1.0.7 scriptjs@2.5.2 qwery@3.4.2 bonzo@1.4.0 elo@1.6.0 sos@0.0.1
  * =============================================================
  */

(function () {

  /*!
    * Ender: open module JavaScript framework (client-lib)
    * http://enderjs.com
    * License MIT
    */
  
  /**
   * @constructor
   * @param  {*=}      item      selector|node|collection|callback|anything
   * @param  {Object=} root      node(s) from which to base selector queries
   */
  function Ender(item, root) {
    var i
    this.length = 0 // Ensure that instance owns length
  
    if (typeof item == 'string')
      // start with strings so the result parlays into the other checks
      // the .selector prop only applies to strings
      item = ender._select(this['selector'] = item, root)
  
    if (null == item) return this // Do not wrap null|undefined
  
    if (typeof item == 'function') ender._closure(item, root)
  
    // DOM node | scalar | not array-like
    else if (typeof item != 'object' || item.nodeType || (i = item.length) !== +i || item == item.window)
      this[this.length++] = item
  
    // array-like - bitwise ensures integer length
    else for (this.length = i = (i > 0 ? ~~i : 0); i--;)
      this[i] = item[i]
  }
  
  /**
   * @param  {*=}      item   selector|node|collection|callback|anything
   * @param  {Object=} root   node(s) from which to base selector queries
   * @return {Ender}
   */
  function ender(item, root) {
    return new Ender(item, root)
  }
  
  
  /**
   * @expose
   * sync the prototypes for jQuery compatibility
   */
  ender.fn = ender.prototype = Ender.prototype
  
  /**
   * @enum {number}  protects local symbols from being overwritten
   */
  ender._reserved = {
    reserved: 1,
    ender: 1,
    expose: 1,
    noConflict: 1,
    fn: 1
  }
  
  /**
   * @expose
   * handy reference to self
   */
  Ender.prototype.$ = ender
  
  /**
   * @expose
   * make webkit dev tools pretty-print ender instances like arrays
   */
  Ender.prototype.splice = function () { throw new Error('Not implemented') }
  
  /**
   * @expose
   * @param   {function(*, number, Ender)}  fn
   * @param   {object=}                     scope
   * @return  {Ender}
   */
  Ender.prototype.forEach = function (fn, scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }
  
  /**
   * @expose
   * @param {object|function} o
   * @param {boolean=}        chain
   */
  ender.ender = function (o, chain) {
    var o2 = chain ? Ender.prototype : ender
    for (var k in o) !(k in ender._reserved) && (o2[k] = o[k])
    return o2
  }
  
  /**
   * @expose
   * @param {string}  s
   * @param {Node=}   r
   */
  ender._select = function (s, r) {
    return s ? (r || document).querySelectorAll(s) : []
  }
  
  /**
   * @expose
   * @param {function} fn
   */
  ender._closure = function (fn) {
    fn.call(document, ender)
  }
  
  if (typeof module !== 'undefined' && module['exports']) module['exports'] = ender
  var $ = ender
  
  /**
   * @expose
   * @param {string} name
   * @param {*}      value
   */
  ender.expose = function (name, value) {
    ender.expose.old[name] = window[name]
    window[name] = value
  }
  
  /**
   * @expose
   */
  ender.expose.old = {}
  
  /**
   * @expose
   * @param {boolean} all   restore only $ or all ender globals
   */
  ender.noConflict = function (all) {
    window['$'] = ender.expose.old['$']
    if (all) for (var k in ender.expose.old) window[k] = ender.expose.old[k]
    return this
  }
  
  ender.expose('$', ender)
  ender.expose('ender', ender); // uglify needs this semi-colon between concating files
  
  /*!
    * Ender: open module JavaScript framework (module-lib)
    * http://enderjs.com
    * License MIT
    */
  
  var global = this
  
  /**
   * @param  {string}  id   module id to load
   * @return {object}
   */
  function require(id) {
    if ('$' + id in require._cache)
      return require._cache['$' + id]
    if ('$' + id in require._modules)
      return (require._cache['$' + id] = require._modules['$' + id]._load())
    if (id in window)
      return window[id]
  
    throw new Error('Requested module "' + id + '" has not been defined.')
  }
  
  /**
   * @param  {string}  id       module id to provide to require calls
   * @param  {object}  exports  the exports object to be returned
   */
  function provide(id, exports) {
    return (require._cache['$' + id] = exports)
  }
  
  /**
   * @expose
   * @dict
   */
  require._cache = {}
  
  /**
   * @expose
   * @dict
   */
  require._modules = {}
  
  /**
   * @constructor
   * @param  {string}                                          id   module id for this module
   * @param  {function(Module, object, function(id), object)}  fn   module definition
   */
  function Module(id, fn) {
    this.id = id
    this.fn = fn
    require._modules['$' + id] = this
  }
  
  /**
   * @expose
   * @param  {string}  id   module id to load from the local module context
   * @return {object}
   */
  Module.prototype.require = function (id) {
    var parts, i
  
    if (id.charAt(0) == '.') {
      parts = (this.id.replace(/\/.*?$/, '/') + id.replace(/\.js$/, '')).split('/')
  
      while (~(i = parts.indexOf('.')))
        parts.splice(i, 1)
  
      while ((i = parts.lastIndexOf('..')) > 0)
        parts.splice(i - 1, 2)
  
      id = parts.join('/')
    }
  
    return require(id)
  }
  
  /**
   * @expose
   * @return {object}
   */
  Module.prototype._load = function () {
    var m = this
  
    if (!m._loaded) {
      m._loaded = true
  
      /**
       * @expose
       */
      m.exports = {}
      m.fn.call(global, m, m.exports, function (id) { return m.require(id) }, global)
    }
  
    return m.exports
  }
  
  /**
   * @expose
   * @param  {string}                     id        main module id
   * @param  {Object.<string, function>}  modules   mapping of module ids to definitions
   * @param  {string}                     main      the id of the main module
   */
  Module.createPackage = function (id, modules, main) {
    var path, m
  
    for (path in modules) {
      new Module(id + '/' + path, modules[path])
      if (m = path.match(/^(.+)\/index$/)) new Module(id + '/' + m[1], modules[path])
    }
  
    if (main) require._modules['$' + id] = require._modules['$' + id + '/' + main]
  }
  
  if (ender && ender.expose) {
    /*global global,require,provide,Module */
    ender.expose('global', global)
    ender.expose('require', require)
    ender.expose('provide', provide)
    ender.expose('Module', Module)
  }
  
  Module.createPackage('scriptjs', {
    'dist\script': function (module, exports, require, global) {
      /*!
        * $script.js JS loader & dependency manager
        * https://github.com/ded/script.js
        * (c) Dustin Diaz 2014 | License MIT
        */
      
      (function (name, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else this[name] = definition()
      })('$script', function () {
        var doc = document
          , head = doc.getElementsByTagName('head')[0]
          , s = 'string'
          , f = false
          , push = 'push'
          , readyState = 'readyState'
          , onreadystatechange = 'onreadystatechange'
          , list = {}
          , ids = {}
          , delay = {}
          , scripts = {}
          , scriptpath
      
        function every(ar, fn) {
          for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
          return 1
        }
        function each(ar, fn) {
          every(ar, function (el) {
            return !fn(el)
          })
        }
      
        function $script(paths, idOrDone, optDone) {
          paths = paths[push] ? paths : [paths]
          var idOrDoneIsDone = idOrDone && idOrDone.call
            , done = idOrDoneIsDone ? idOrDone : optDone
            , id = idOrDoneIsDone ? paths.join('') : idOrDone
            , queue = paths.length
          function loopFn(item) {
            return item.call ? item() : list[item]
          }
          function callback() {
            if (!--queue) {
              list[id] = 1
              done && done()
              for (var dset in delay) {
                every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
              }
            }
          }
          setTimeout(function () {
            each(paths, function (path) {
              if (path === null) return callback()
              if (scripts[path]) {
                id && (ids[id] = 1)
                return scripts[path] == 2 && callback()
              }
              scripts[path] = 1
              id && (ids[id] = 1)
              create(!/^https?:\/\//.test(path) && scriptpath ? scriptpath + path + '.js' : path, callback)
            })
          }, 0)
          return $script
        }
      
        function create(path, fn) {
          var el = doc.createElement('script')
            , loaded = f
          el.onload = el.onerror = el[onreadystatechange] = function () {
            if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
            el.onload = el[onreadystatechange] = null
            loaded = 1
            scripts[path] = 2
            fn()
          }
          el.async = 1
          el.src = path
          head.insertBefore(el, head.lastChild)
        }
      
        $script.get = create
      
        $script.order = function (scripts, id, done) {
          (function callback(s) {
            s = scripts.shift()
            !scripts.length ? $script(s, id, done) : $script(s, callback)
          }())
        }
      
        $script.path = function (p) {
          scriptpath = p
        }
        $script.ready = function (deps, ready, req) {
          deps = deps[push] ? deps : [deps]
          var missing = [];
          !each(deps, function (dep) {
            list[dep] || missing[push](dep);
          }) && every(deps, function (dep) {return list[dep]}) ?
            ready() : !function (key) {
            delay[key] = delay[key] || []
            delay[key][push](ready)
            req && req(missing)
          }(deps.join('|'))
          return $script
        }
      
        $script.done = function (idOrDone) {
          $script([null], idOrDone)
        }
      
        return $script
      });
      
    },
    'src\ender': function (module, exports, require, global) {
      var s = require('scriptjs')
      ender.ender({
          script: s
        , require: s
        , ready: s.ready
        , getScript: s.get
      });
      
    }
  }, 'dist\script');

  Module.createPackage('qwery', {
    'qwery': function (module, exports, require, global) {
      /*!
        * @preserve Qwery - A Blazing Fast query selector engine
        * https://github.com/ded/qwery
        * copyright Dustin Diaz 2012
        * MIT License
        */
      
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('qwery', this, function () {
        var doc = document
          , html = doc.documentElement
          , byClass = 'getElementsByClassName'
          , byTag = 'getElementsByTagName'
          , qSA = 'querySelectorAll'
          , useNativeQSA = 'useNativeQSA'
          , tagName = 'tagName'
          , nodeType = 'nodeType'
          , select // main select() method, assign later
      
          , id = /#([\w\-]+)/
          , clas = /\.[\w\-]+/g
          , idOnly = /^#([\w\-]+)$/
          , classOnly = /^\.([\w\-]+)$/
          , tagOnly = /^([\w\-]+)$/
          , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
          , splittable = /(^|,)\s*[>~+]/
          , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
          , splitters = /[\s\>\+\~]/
          , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
          , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
          , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
          , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
          , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
          , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
          , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
          , tokenizr = new RegExp(splitters.source + splittersMore.source)
          , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')
      
        var walker = {
            ' ': function (node) {
              return node && node !== html && node.parentNode
            }
          , '>': function (node, contestant) {
              return node && node.parentNode == contestant.parentNode && node.parentNode
            }
          , '~': function (node) {
              return node && node.previousSibling
            }
          , '+': function (node, contestant, p1, p2) {
              if (!node) return false
              return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
            }
          }
      
        function cache() {
          this.c = {}
        }
        cache.prototype = {
          g: function (k) {
            return this.c[k] || undefined
          }
        , s: function (k, v, r) {
            v = r ? new RegExp(v) : v
            return (this.c[k] = v)
          }
        }
      
        var classCache = new cache()
          , cleanCache = new cache()
          , attrCache = new cache()
          , tokenCache = new cache()
      
        function classRegex(c) {
          return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
        }
      
        // not quite as fast as inline loops in older browsers so don't use liberally
        function each(a, fn) {
          var i = 0, l = a.length
          for (; i < l; i++) fn(a[i])
        }
      
        function flatten(ar) {
          for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
          return r
        }
      
        function arrayify(ar) {
          var i = 0, l = ar.length, r = []
          for (; i < l; i++) r[i] = ar[i]
          return r
        }
      
        function previous(n) {
          while (n = n.previousSibling) if (n[nodeType] == 1) break;
          return n
        }
      
        function q(query) {
          return query.match(chunker)
        }
      
        // called using `this` as element and arguments from regex group results.
        // given => div.hello[title="world"]:foo('bar')
        // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
        function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
          var i, m, k, o, classes
          if (this[nodeType] !== 1) return false
          if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
          if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
          if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
            for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
          }
          if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
          if (wholeAttribute && !value) { // select is just for existance of attrib
            o = this.attributes
            for (k in o) {
              if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
                return this
              }
            }
          }
          if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
            // select is for attrib equality
            return false
          }
          return this
        }
      
        function clean(s) {
          return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
        }
      
        function checkAttr(qualify, actual, val) {
          switch (qualify) {
          case '=':
            return actual == val
          case '^=':
            return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
          case '$=':
            return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
          case '*=':
            return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
          case '~=':
            return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
          case '|=':
            return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
          }
          return 0
        }
      
        // given a selector, first check for simple cases then collect all base candidate matches and filter
        function _qwery(selector, _root) {
          var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
            , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
            , dividedTokens = selector.match(dividers)
      
          if (!tokens.length) return r
      
          token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
          if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
          if (!root) return r
      
          intr = q(token)
          // collect base candidates to filter
          els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
            function (r) {
              while (root = root.nextSibling) {
                root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
              }
              return r
            }([]) :
            root[byTag](intr[1] || '*')
          // filter elements according to the right-most part of the selector
          for (i = 0, l = els.length; i < l; i++) {
            if (item = interpret.apply(els[i], intr)) r[r.length] = item
          }
          if (!tokens.length) return r
      
          // filter further according to the rest of the selector (the left side)
          each(r, function (e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
          return ret
        }
      
        // compare element to a selector
        function is(el, selector, root) {
          if (isNode(selector)) return el == selector
          if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?
      
          var selectors = selector.split(','), tokens, dividedTokens
          while (selector = selectors.pop()) {
            tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
            dividedTokens = selector.match(dividers)
            tokens = tokens.slice(0) // copy array
            if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
              return true
            }
          }
          return false
        }
      
        // given elements matching the right-most part of a selector, filter out any that don't match the rest
        function ancestorMatch(el, tokens, dividedTokens, root) {
          var cand
          // recursively work backwards through the tokens and up the dom, covering all options
          function crawl(e, i, p) {
            while (p = walker[dividedTokens[i]](p, e)) {
              if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
                if (i) {
                  if (cand = crawl(p, i - 1, p)) return cand
                } else return p
              }
            }
          }
          return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
        }
      
        function isNode(el, t) {
          return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
        }
      
        function uniq(ar) {
          var a = [], i, j;
          o:
          for (i = 0; i < ar.length; ++i) {
            for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
            a[a.length] = ar[i]
          }
          return a
        }
      
        function arrayLike(o) {
          return (typeof o === 'object' && isFinite(o.length))
        }
      
        function normalizeRoot(root) {
          if (!root) return doc
          if (typeof root == 'string') return qwery(root)[0]
          if (!root[nodeType] && arrayLike(root)) return root[0]
          return root
        }
      
        function byId(root, id, el) {
          // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
          return root[nodeType] === 9 ? root.getElementById(id) :
            root.ownerDocument &&
              (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
                (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
        }
      
        function qwery(selector, _root) {
          var m, el, root = normalizeRoot(_root)
      
          // easy, fast cases that we can dispatch with simple DOM calls
          if (!root || !selector) return []
          if (selector === window || isNode(selector)) {
            return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
          }
          if (selector && arrayLike(selector)) return flatten(selector)
          if (m = selector.match(easy)) {
            if (m[1]) return (el = byId(root, m[1])) ? [el] : []
            if (m[2]) return arrayify(root[byTag](m[2]))
            if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
          }
      
          return select(selector, root)
        }
      
        // where the root is not document and a relationship selector is first we have to
        // do some awkward adjustments to get it to work, even with qSA
        function collectSelector(root, collector) {
          return function (s) {
            var oid, nid
            if (splittable.test(s)) {
              if (root[nodeType] !== 9) {
                // make sure the el has an id, rewrite the query, set root to doc and run it
                if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
                s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
                collector(root.parentNode || root, s, true)
                oid || root.removeAttribute('id')
              }
              return;
            }
            s.length && collector(root, s, false)
          }
        }
      
        var isAncestor = 'compareDocumentPosition' in html ?
          function (element, container) {
            return (container.compareDocumentPosition(element) & 16) == 16
          } : 'contains' in html ?
          function (element, container) {
            container = container[nodeType] === 9 || container == window ? html : container
            return container !== element && container.contains(element)
          } :
          function (element, container) {
            while (element = element.parentNode) if (element === container) return 1
            return 0
          }
        , getAttr = function () {
            // detect buggy IE src/href getAttribute() call
            var e = doc.createElement('p')
            return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
              function (e, a) {
                return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
                  e.getAttribute(a, 2) : e.getAttribute(a)
              } :
              function (e, a) { return e.getAttribute(a) }
          }()
        , hasByClass = !!doc[byClass]
          // has native qSA support
        , hasQSA = doc.querySelector && doc[qSA]
          // use native qSA
        , selectQSA = function (selector, root) {
            var result = [], ss, e
            try {
              if (root[nodeType] === 9 || !splittable.test(selector)) {
                // most work is done right here, defer to qSA
                return arrayify(root[qSA](selector))
              }
              // special case where we need the services of `collectSelector()`
              each(ss = selector.split(','), collectSelector(root, function (ctx, s) {
                e = ctx[qSA](s)
                if (e.length == 1) result[result.length] = e.item(0)
                else if (e.length) result = result.concat(arrayify(e))
              }))
              return ss.length > 1 && result.length > 1 ? uniq(result) : result
            } catch (ex) { }
            return selectNonNative(selector, root)
          }
          // no native selector support
        , selectNonNative = function (selector, root) {
            var result = [], items, m, i, l, r, ss
            selector = selector.replace(normalizr, '$1')
            if (m = selector.match(tagAndOrClass)) {
              r = classRegex(m[2])
              items = root[byTag](m[1] || '*')
              for (i = 0, l = items.length; i < l; i++) {
                if (r.test(items[i].className)) result[result.length] = items[i]
              }
              return result
            }
            // more complex selector, get `_qwery()` to do the work for us
            each(ss = selector.split(','), collectSelector(root, function (ctx, s, rewrite) {
              r = _qwery(s, ctx)
              for (i = 0, l = r.length; i < l; i++) {
                if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
              }
            }))
            return ss.length > 1 && result.length > 1 ? uniq(result) : result
          }
        , configure = function (options) {
            // configNativeQSA: use fully-internal selector or native qSA where present
            if (typeof options[useNativeQSA] !== 'undefined')
              select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
          }
      
        configure({ useNativeQSA: true })
      
        qwery.configure = configure
        qwery.uniq = uniq
        qwery.is = is
        qwery.pseudos = {}
      
        return qwery
      });
      
    },
    'src\ender': function (module, exports, require, global) {
      (function ($) {
        var q = function () {
          var r
          try {
            r = require('qwery')
          } catch (ex) {
            r = require('qwery-mobile')
          } finally {
            return r
          }
        }()
      
        $.pseudos = q.pseudos
      
        $._select = function (s, r) {
          // detect if sibling module 'bonzo' is available at run-time
          // rather than load-time since technically it's not a dependency and
          // can be loaded in any order
          // hence the lazy function re-definition
          return ($._select = (function () {
            var b
            if (typeof $.create == 'function') return function (s, r) {
              return /^\s*</.test(s) ? $.create(s, r) : q(s, r)
            }
            try {
              b = require('bonzo')
              return function (s, r) {
                return /^\s*</.test(s) ? b.create(s, r) : q(s, r)
              }
            } catch (e) { }
            return q
          })())(s, r)
        }
      
        $.ender({
            find: function (s) {
              var r = [], i, l, j, k, els
              for (i = 0, l = this.length; i < l; i++) {
                els = q(s, this[i])
                for (j = 0, k = els.length; j < k; j++) r.push(els[j])
              }
              return $(q.uniq(r))
            }
          , and: function (s) {
              var plus = $(s)
              for (var i = this.length, j = 0, l = this.length + plus.length; i < l; i++, j++) {
                this[i] = plus[j]
              }
              this.length += plus.length
              return this
            }
          , is: function(s, r) {
              var i, l
              for (i = 0, l = this.length; i < l; i++) {
                if (q.is(this[i], s, r)) {
                  return true
                }
              }
              return false
            }
        }, true)
      }(ender));
      
    }
  }, 'qwery');

  Module.createPackage('bonzo', {
    'bonzo': function (module, exports, require, global) {
      /*!
        * Bonzo: DOM Utility (c) Dustin Diaz 2012
        * https://github.com/ded/bonzo
        * License MIT
        */
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('bonzo', this, function() {
        var win = window
          , doc = win.document
          , html = doc.documentElement
          , parentNode = 'parentNode'
          , specialAttributes = /^(checked|value|selected|disabled)$/i
            // tags that we have trouble inserting *into*
          , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
          , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
          , table = ['<table>', '</table>', 1]
          , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
          , option = ['<select>', '</select>', 1]
          , noscope = ['_', '', 0, 1]
          , tagMap = { // tags that we have trouble *inserting*
                thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
              , tr: ['<table><tbody>', '</tbody></table>', 2]
              , th: td , td: td
              , col: ['<table><colgroup>', '</colgroup></table>', 2]
              , fieldset: ['<form>', '</form>', 1]
              , legend: ['<form><fieldset>', '</fieldset></form>', 2]
              , option: option, optgroup: option
              , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
            }
          , stateAttributes = /^(checked|selected|disabled)$/
          , ie = /msie/i.test(navigator.userAgent)
          , hasClass, addClass, removeClass
          , uidMap = {}
          , uuids = 0
          , digit = /^-?[\d\.]+$/
          , dattr = /^data-(.+)$/
          , px = 'px'
          , setAttribute = 'setAttribute'
          , getAttribute = 'getAttribute'
          , byTag = 'getElementsByTagName'
          , features = function() {
              var e = doc.createElement('p')
              e.innerHTML = '<a href="#x">x</a><table style="float:left;"></table>'
              return {
                hrefExtended: e[byTag]('a')[0][getAttribute]('href') != '#x' // IE < 8
              , autoTbody: e[byTag]('tbody').length !== 0 // IE < 8
              , computedStyle: doc.defaultView && doc.defaultView.getComputedStyle
              , cssFloat: e[byTag]('table')[0].style.styleFloat ? 'styleFloat' : 'cssFloat'
              , transform: function () {
                  var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
                  for (i = 0; i < props.length; i++) {
                    if (props[i] in e.style) return props[i]
                  }
                }()
              , classList: 'classList' in e
              , opasity: function () {
                  return typeof doc.createElement('a').style.opacity !== 'undefined'
                }()
              }
            }()
          , trimReplace = /(^\s*|\s*$)/g
          , whitespaceRegex = /\s+/
          , toString = String.prototype.toString
          , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
          , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
          , trim = String.prototype.trim ?
              function (s) {
                return s.trim()
              } :
              function (s) {
                return s.replace(trimReplace, '')
              }
      
          , getStyle = features.computedStyle
              ? function (el, property) {
                  var value = null
                    , computed = doc.defaultView.getComputedStyle(el, '')
                  computed && (value = computed[property])
                  return el.style[property] || value
                }
              : !(ie && html.currentStyle)
                ? function (el, property) {
                    return el.style[property]
                  }
                :
                /**
                 * @param {Element} el
                 * @param {string} property
                 * @return {string|number}
                 */
                function (el, property) {
                  var val, value
                  if (property == 'opacity' && !features.opasity) {
                    val = 100
                    try {
                      val = el['filters']['DXImageTransform.Microsoft.Alpha'].opacity
                    } catch (e1) {
                      try {
                        val = el['filters']('alpha').opacity
                      } catch (e2) {}
                    }
                    return val / 100
                  }
                  value = el.currentStyle ? el.currentStyle[property] : null
                  return el.style[property] || value
                }
      
        function isNode(node) {
          return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
        }
      
      
        function normalize(node, host, clone) {
          var i, l, ret
          if (typeof node == 'string') return bonzo.create(node)
          if (isNode(node)) node = [ node ]
          if (clone) {
            ret = [] // don't change original array
            for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
            return ret
          }
          return node
        }
      
        /**
         * @param {string} c a class name to test
         * @return {boolean}
         */
        function classReg(c) {
          return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @param {boolean=} opt_rev
         * @return {Bonzo|Array}
         */
        function each(ar, fn, opt_scope, opt_rev) {
          var ind, i = 0, l = ar.length
          for (; i < l; i++) {
            ind = opt_rev ? ar.length - i - 1 : i
            fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
          }
          return ar
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @return {Bonzo|Array}
         */
        function deepEach(ar, fn, opt_scope) {
          for (var i = 0, l = ar.length; i < l; i++) {
            if (isNode(ar[i])) {
              deepEach(ar[i].childNodes, fn, opt_scope)
              fn.call(opt_scope || ar[i], ar[i], i, ar)
            }
          }
          return ar
        }
      
      
        /**
         * @param {string} s
         * @return {string}
         */
        function camelize(s) {
          return s.replace(/-(.)/g, function (m, m1) {
            return m1.toUpperCase()
          })
        }
      
      
        /**
         * @param {string} s
         * @return {string}
         */
        function decamelize(s) {
          return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
        }
      
      
        /**
         * @param {Element} el
         * @return {*}
         */
        function data(el) {
          el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
          var uid = el[getAttribute]('data-node-uid')
          return uidMap[uid] || (uidMap[uid] = {})
        }
      
      
        /**
         * removes the data associated with an element
         * @param {Element} el
         */
        function clearData(el) {
          var uid = el[getAttribute]('data-node-uid')
          if (uid) delete uidMap[uid]
        }
      
      
        function dataValue(d) {
          var f
          try {
            return (d === null || d === undefined) ? undefined :
              d === 'true' ? true :
                d === 'false' ? false :
                  d === 'null' ? null :
                    (f = parseFloat(d)) == d ? f : d;
          } catch(e) {}
          return undefined
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @return {boolean} whether `some`thing was found
         */
        function some(ar, fn, opt_scope) {
          for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
          return false
        }
      
      
        /**
         * this could be a giant enum of CSS properties
         * but in favor of file size sans-closure deadcode optimizations
         * we're just asking for any ol string
         * then it gets transformed into the appropriate style property for JS access
         * @param {string} p
         * @return {string}
         */
        function styleProperty(p) {
            (p == 'transform' && (p = features.transform)) ||
              (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin')) ||
              (p == 'float' && (p = features.cssFloat))
            return p ? camelize(p) : null
        }
      
        // this insert method is intense
        function insert(target, host, fn, rev) {
          var i = 0, self = host || this, r = []
            // target nodes could be a css selector if it's a string and a selector engine is present
            // otherwise, just use target
            , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
          // normalize each node in case it's still a string and we need to create nodes on the fly
          each(normalize(nodes), function (t, j) {
            each(self, function (el) {
              fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
            }, null, rev)
          }, this, rev)
          self.length = i
          each(r, function (e) {
            self[--i] = e
          }, null, !rev)
          return self
        }
      
      
        /**
         * sets an element to an explicit x/y position on the page
         * @param {Element} el
         * @param {?number} x
         * @param {?number} y
         */
        function xy(el, x, y) {
          var $el = bonzo(el)
            , style = $el.css('position')
            , offset = $el.offset()
            , rel = 'relative'
            , isRel = style == rel
            , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]
      
          if (style == 'static') {
            $el.css('position', rel)
            style = rel
          }
      
          isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
          isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)
      
          x != null && (el.style.left = x - offset.left + delta[0] + px)
          y != null && (el.style.top = y - offset.top + delta[1] + px)
      
        }
      
        // classList support for class management
        // altho to be fair, the api sucks because it won't accept multiple classes at once
        if (features.classList) {
          hasClass = function (el, c) {
            return el.classList.contains(c)
          }
          addClass = function (el, c) {
            el.classList.add(c)
          }
          removeClass = function (el, c) {
            el.classList.remove(c)
          }
        }
        else {
          hasClass = function (el, c) {
            return classReg(c).test(el.className)
          }
          addClass = function (el, c) {
            el.className = trim(el.className + ' ' + c)
          }
          removeClass = function (el, c) {
            el.className = trim(el.className.replace(classReg(c), ' '))
          }
        }
      
      
        /**
         * this allows method calling for setting values
         *
         * @example
         * bonzo(elements).css('color', function (el) {
         *   return el.getAttribute('data-original-color')
         * })
         *
         * @param {Element} el
         * @param {function (Element)|string}
         * @return {string}
         */
        function setter(el, v) {
          return typeof v == 'function' ? v(el) : v
        }
      
        function scroll(x, y, type) {
          var el = this[0]
          if (!el) return this
          if (x == null && y == null) {
            return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
          }
          if (isBody(el)) {
            win.scrollTo(x, y)
          } else {
            x != null && (el.scrollLeft = x)
            y != null && (el.scrollTop = y)
          }
          return this
        }
      
        /**
         * @constructor
         * @param {Array.<Element>|Element|Node|string} elements
         */
        function Bonzo(elements) {
          this.length = 0
          if (elements) {
            elements = typeof elements !== 'string' &&
              !elements.nodeType &&
              typeof elements.length !== 'undefined' ?
                elements :
                [elements]
            this.length = elements.length
            for (var i = 0; i < elements.length; i++) this[i] = elements[i]
          }
        }
      
        Bonzo.prototype = {
      
            /**
             * @param {number} index
             * @return {Element|Node}
             */
            get: function (index) {
              return this[index] || null
            }
      
            // itetators
            /**
             * @param {function(Element|Node)} fn
             * @param {Object=} opt_scope
             * @return {Bonzo}
             */
          , each: function (fn, opt_scope) {
              return each(this, fn, opt_scope)
            }
      
            /**
             * @param {Function} fn
             * @param {Object=} opt_scope
             * @return {Bonzo}
             */
          , deepEach: function (fn, opt_scope) {
              return deepEach(this, fn, opt_scope)
            }
      
      
            /**
             * @param {Function} fn
             * @param {Function=} opt_reject
             * @return {Array}
             */
          , map: function (fn, opt_reject) {
              var m = [], n, i
              for (i = 0; i < this.length; i++) {
                n = fn.call(this, this[i], i)
                opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
              }
              return m
            }
      
          // text and html inserters!
      
          /**
           * @param {string} h the HTML to insert
           * @param {boolean=} opt_text whether to set or get text content
           * @return {Bonzo|string}
           */
          , html: function (h, opt_text) {
              var method = opt_text
                    ? html.textContent === undefined ? 'innerText' : 'textContent'
                    : 'innerHTML'
                , that = this
                , append = function (el, i) {
                    each(normalize(h, that, i), function (node) {
                      el.appendChild(node)
                    })
                  }
                , updateElement = function (el, i) {
                    try {
                      if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                        return el[method] = h
                      }
                    } catch (e) {}
                    append(el, i)
                  }
              return typeof h != 'undefined'
                ? this.empty().each(updateElement)
                : this[0] ? this[0][method] : ''
            }
      
            /**
             * @param {string=} opt_text the text to set, otherwise this is a getter
             * @return {Bonzo|string}
             */
          , text: function (opt_text) {
              return this.html(opt_text, true)
            }
      
            // more related insertion methods
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , append: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el.appendChild(i)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , prepend: function (node) {
              var that = this
              return this.each(function (el, i) {
                var first = el.firstChild
                each(normalize(node, that, i), function (i) {
                  el.insertBefore(i, first)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , appendTo: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t.appendChild(el)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , prependTo: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t.insertBefore(el, t.firstChild)
              }, 1)
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , before: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode].insertBefore(i, el)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , after: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode].insertBefore(i, el.nextSibling)
                }, null, 1)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , insertBefore: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t[parentNode].insertBefore(el, t)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , insertAfter: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                var sibling = t.nextSibling
                sibling ?
                  t[parentNode].insertBefore(el, sibling) :
                  t[parentNode].appendChild(el)
              }, 1)
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , replaceWith: function (node) {
               return bonzo(this[0].parentNode.replaceChild(bonzo(normalize(node))[0], this[0]))
            }
      
            /**
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , clone: function (opt_host) {
              var ret = [] // don't change original array
                , l, i
              for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
              return bonzo(ret)
            }
      
            // class management
      
            /**
             * @param {string} c
             * @return {Bonzo}
             */
          , addClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                // we `each` here so you can do $el.addClass('foo bar')
                each(c, function (c) {
                  if (c && !hasClass(el, setter(el, c)))
                    addClass(el, setter(el, c))
                })
              })
            }
      
      
            /**
             * @param {string} c
             * @return {Bonzo}
             */
          , removeClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                each(c, function (c) {
                  if (c && hasClass(el, setter(el, c)))
                    removeClass(el, setter(el, c))
                })
              })
            }
      
      
            /**
             * @param {string} c
             * @return {boolean}
             */
          , hasClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return some(this, function (el) {
                return some(c, function (c) {
                  return c && hasClass(el, c)
                })
              })
            }
      
      
            /**
             * @param {string} c classname to toggle
             * @param {boolean=} opt_condition whether to add or remove the class straight away
             * @return {Bonzo}
             */
          , toggleClass: function (c, opt_condition) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                each(c, function (c) {
                  if (c) {
                    typeof opt_condition !== 'undefined' ?
                      opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                      hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
                  }
                })
              })
            }
      
            // display togglers
      
            /**
             * @param {string=} opt_type useful to set back to anything other than an empty string
             * @return {Bonzo}
             */
          , show: function (opt_type) {
              opt_type = typeof opt_type == 'string' ? opt_type : ''
              return this.each(function (el) {
                el.style.display = opt_type
              })
            }
      
      
            /**
             * @return {Bonzo}
             */
          , hide: function () {
              return this.each(function (el) {
                el.style.display = 'none'
              })
            }
      
      
            /**
             * @param {Function=} opt_callback
             * @param {string=} opt_type
             * @return {Bonzo}
             */
          , toggle: function (opt_callback, opt_type) {
              opt_type = typeof opt_type == 'string' ? opt_type : '';
              typeof opt_callback != 'function' && (opt_callback = null)
              return this.each(function (el) {
                el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
                opt_callback && opt_callback.call(el)
              })
            }
      
      
            // DOM Walkers & getters
      
            /**
             * @return {Element|Node}
             */
          , first: function () {
              return bonzo(this.length ? this[0] : [])
            }
      
      
            /**
             * @return {Element|Node}
             */
          , last: function () {
              return bonzo(this.length ? this[this.length - 1] : [])
            }
      
      
            /**
             * @return {Element|Node}
             */
          , next: function () {
              return this.related('nextSibling')
            }
      
      
            /**
             * @return {Element|Node}
             */
          , previous: function () {
              return this.related('previousSibling')
            }
      
      
            /**
             * @return {Element|Node}
             */
          , parent: function() {
              return this.related(parentNode)
            }
      
      
            /**
             * @private
             * @param {string} method the directional DOM method
             * @return {Element|Node}
             */
          , related: function (method) {
              return bonzo(this.map(
                function (el) {
                  el = el[method]
                  while (el && el.nodeType !== 1) {
                    el = el[method]
                  }
                  return el || 0
                },
                function (el) {
                  return el
                }
              ))
            }
      
      
            /**
             * @return {Bonzo}
             */
          , focus: function () {
              this.length && this[0].focus()
              return this
            }
      
      
            /**
             * @return {Bonzo}
             */
          , blur: function () {
              this.length && this[0].blur()
              return this
            }
      
            // style getter setter & related methods
      
            /**
             * @param {Object|string} o
             * @param {string=} opt_v
             * @return {Bonzo|string}
             */
          , css: function (o, opt_v) {
              var p, iter = o
              // is this a request for just getting a style?
              if (opt_v === undefined && typeof o == 'string') {
                // repurpose 'v'
                opt_v = this[0]
                if (!opt_v) return null
                if (opt_v === doc || opt_v === win) {
                  p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
                  return o == 'width' ? p.width : o == 'height' ? p.height : ''
                }
                return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
              }
      
              if (typeof o == 'string') {
                iter = {}
                iter[o] = opt_v
              }
      
              if (!features.opasity && 'opacity' in iter) {
                // oh this 'ol gamut
                iter.filter = iter.opacity != null && iter.opacity !== ''
                  ? 'alpha(opacity=' + (iter.opacity * 100) + ')'
                  : ''
                // give it layout
                iter.zoom = o.zoom || 1
                ;delete iter.opacity
              }
      
              function fn(el, p, v) {
                for (var k in iter) {
                  if (iter.hasOwnProperty(k)) {
                    v = iter[k];
                    // change "5" to "5px" - unless you're line-height, which is allowed
                    (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
                    try { el.style[p] = setter(el, v) } catch(e) {}
                  }
                }
              }
              return this.each(fn)
            }
      
      
            /**
             * @param {number=} opt_x
             * @param {number=} opt_y
             * @return {Bonzo|number}
             */
          , offset: function (opt_x, opt_y) {
              if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
                return this.each(function (el) {
                  xy(el, opt_x.left, opt_x.top)
                })
              } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
                return this.each(function (el) {
                  xy(el, opt_x, opt_y)
                })
              }
              if (!this[0]) return {
                  top: 0
                , left: 0
                , height: 0
                , width: 0
              }
              var el = this[0]
                , de = el.ownerDocument.documentElement
                , bcr = el.getBoundingClientRect()
                , scroll = getWindowScroll()
                , width = el.offsetWidth
                , height = el.offsetHeight
                , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
                , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)
      
              return {
                  top: top
                , left: left
                , height: height
                , width: width
              }
            }
      
      
            /**
             * @return {number}
             */
          , dim: function () {
              if (!this.length) return { height: 0, width: 0 }
              var el = this[0]
                , de = el.nodeType == 9 && el.documentElement // document
                , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
                   // el isn't visible, can't be measured properly, so fix that
                   function (t) {
                     var s = {
                         position: el.style.position || ''
                       , visibility: el.style.visibility || ''
                       , display: el.style.display || ''
                     }
                     t.first().css({
                         position: 'absolute'
                       , visibility: 'hidden'
                       , display: 'block'
                     })
                     return s
                  }(this) : null
                , width = de
                    ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
                    : el.offsetWidth
                , height = de
                    ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
                    : el.offsetHeight
      
              orig && this.first().css(orig)
              return {
                  height: height
                , width: width
              }
            }
      
            // attributes are hard. go shopping
      
            /**
             * @param {string} k an attribute to get or set
             * @param {string=} opt_v the value to set
             * @return {Bonzo|string}
             */
          , attr: function (k, opt_v) {
              var el = this[0]
                , n
      
              if (typeof k != 'string' && !(k instanceof String)) {
                for (n in k) {
                  k.hasOwnProperty(n) && this.attr(n, k[n])
                }
                return this
              }
      
              return typeof opt_v == 'undefined' ?
                !el ? null : specialAttributes.test(k) ?
                  stateAttributes.test(k) && typeof el[k] == 'string' ?
                    true : el[k] : (k == 'href' || k =='src') && features.hrefExtended ?
                      el[getAttribute](k, 2) : el[getAttribute](k) :
                this.each(function (el) {
                  specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
                })
            }
      
      
            /**
             * @param {string} k
             * @return {Bonzo}
             */
          , removeAttr: function (k) {
              return this.each(function (el) {
                stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
              })
            }
      
      
            /**
             * @param {string=} opt_s
             * @return {Bonzo|string}
             */
          , val: function (s) {
              return (typeof s == 'string' || typeof s == 'number') ?
                this.attr('value', s) :
                this.length ? this[0].value : null
            }
      
            // use with care and knowledge. this data() method uses data attributes on the DOM nodes
            // to do this differently costs a lot more code. c'est la vie
            /**
             * @param {string|Object=} opt_k the key for which to get or set data
             * @param {Object=} opt_v
             * @return {Bonzo|Object}
             */
          , data: function (opt_k, opt_v) {
              var el = this[0], o, m
              if (typeof opt_v === 'undefined') {
                if (!el) return null
                o = data(el)
                if (typeof opt_k === 'undefined') {
                  each(el.attributes, function (a) {
                    (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
                  })
                  return o
                } else {
                  if (typeof o[opt_k] === 'undefined')
                    o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
                  return o[opt_k]
                }
              } else {
                return this.each(function (el) { data(el)[opt_k] = opt_v })
              }
            }
      
            // DOM detachment & related
      
            /**
             * @return {Bonzo}
             */
          , remove: function () {
              this.deepEach(clearData)
              return this.detach()
            }
      
      
            /**
             * @return {Bonzo}
             */
          , empty: function () {
              return this.each(function (el) {
                deepEach(el.childNodes, clearData)
      
                while (el.firstChild) {
                  el.removeChild(el.firstChild)
                }
              })
            }
      
      
            /**
             * @return {Bonzo}
             */
          , detach: function () {
              return this.each(function (el) {
                el[parentNode] && el[parentNode].removeChild(el)
              })
            }
      
            // who uses a mouse anyway? oh right.
      
            /**
             * @param {number} y
             */
          , scrollTop: function (y) {
              return scroll.call(this, null, y, 'y')
            }
      
      
            /**
             * @param {number} x
             */
          , scrollLeft: function (x) {
              return scroll.call(this, x, null, 'x')
            }
      
        }
      
      
        function cloneNode(host, el) {
          var c = el.cloneNode(true)
            , cloneElems
            , elElems
            , i
      
          // check for existence of an event cloner
          // preferably https://github.com/fat/bean
          // otherwise Bonzo won't do this for you
          if (host.$ && typeof host.cloneEvents == 'function') {
            host.$(c).cloneEvents(el)
      
            // clone events from every child node
            cloneElems = host.$(c).find('*')
            elElems = host.$(el).find('*')
      
            for (i = 0; i < elElems.length; i++)
              host.$(cloneElems[i]).cloneEvents(elElems[i])
          }
          return c
        }
      
        function isBody(element) {
          return element === win || (/^(?:body|html)$/i).test(element.tagName)
        }
      
        function getWindowScroll() {
          return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
        }
      
        function createScriptFromHtml(html) {
          var scriptEl = document.createElement('script')
            , matches = html.match(simpleScriptTagRe)
          scriptEl.src = matches[1]
          return scriptEl
        }
      
        /**
         * @param {Array.<Element>|Element|Node|string} els
         * @return {Bonzo}
         */
        function bonzo(els) {
          return new Bonzo(els)
        }
      
        bonzo.setQueryEngine = function (q) {
          query = q;
          delete bonzo.setQueryEngine
        }
      
        bonzo.aug = function (o, target) {
          // for those standalone bonzo users. this love is for you.
          for (var k in o) {
            o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
          }
        }
      
        bonzo.create = function (node) {
          // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
          return typeof node == 'string' && node !== '' ?
            function () {
              if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
              var tag = node.match(/^\s*<([^\s>]+)/)
                , el = doc.createElement('div')
                , els = []
                , p = tag ? tagMap[tag[1].toLowerCase()] : null
                , dep = p ? p[2] + 1 : 1
                , ns = p && p[3]
                , pn = parentNode
                , tb = features.autoTbody && p && p[0] == '<table>' && !(/<tbody/i).test(node)
      
              el.innerHTML = p ? (p[0] + node + p[1]) : node
              while (dep--) el = el.firstChild
              // for IE NoScope, we may insert cruft at the begining just to get it to work
              if (ns && el && el.nodeType !== 1) el = el.nextSibling
              do {
                // tbody special case for IE<8, creates tbody on any empty table
                // we don't want it if we're just after a <thead>, <caption>, etc.
                if ((!tag || el.nodeType == 1) && (!tb || (el.tagName && el.tagName != 'TBODY'))) {
                  els.push(el)
                }
              } while (el = el.nextSibling)
              // IE < 9 gives us a parentNode which messes up insert() check for cloning
              // `dep` > 1 can also cause problems with the insert() check (must do this last)
              each(els, function(el) { el[pn] && el[pn].removeChild(el) })
              return els
            }() : isNode(node) ? [node.cloneNode(true)] : []
        }
      
        bonzo.doc = function () {
          var vp = bonzo.viewport()
          return {
              width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
            , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
          }
        }
      
        bonzo.firstChild = function (el) {
          for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
            if (c[i].nodeType === 1) e = c[j = i]
          }
          return e
        }
      
        bonzo.viewport = function () {
          return {
              width: ie ? html.clientWidth : win.innerWidth
            , height: ie ? html.clientHeight : win.innerHeight
          }
        }
      
        bonzo.isAncestor = 'compareDocumentPosition' in html ?
          function (container, element) {
            return (container.compareDocumentPosition(element) & 16) == 16
          } : 'contains' in html ?
          function (container, element) {
            return container !== element && container.contains(element);
          } :
          function (container, element) {
            while (element = element[parentNode]) {
              if (element === container) {
                return true
              }
            }
            return false
          }
      
        return bonzo
      }); // the only line we care about using a semi-colon. placed here for concatenation tools
      
    },
    'src\ender': function (module, exports, require, global) {
      (function ($) {
      
        var b = require('bonzo')
        b.setQueryEngine($)
        $.ender(b)
        $.ender(b(), true)
        $.ender({
          create: function (node) {
            return $(b.create(node))
          }
        })
      
        $.id = function (id) {
          return $([document.getElementById(id)])
        }
      
        function indexOf(ar, val) {
          for (var i = 0; i < ar.length; i++) if (ar[i] === val) return i
          return -1
        }
      
        function uniq(ar) {
          var r = [], i = 0, j = 0, k, item, inIt
          for (; item = ar[i]; ++i) {
            inIt = false
            for (k = 0; k < r.length; ++k) {
              if (r[k] === item) {
                inIt = true; break
              }
            }
            if (!inIt) r[j++] = item
          }
          return r
        }
      
        $.ender({
          parents: function (selector, closest) {
            if (!this.length) return this
            if (!selector) selector = '*'
            var collection = $(selector), j, k, p, r = []
            for (j = 0, k = this.length; j < k; j++) {
              p = this[j]
              while (p = p.parentNode) {
                if (~indexOf(collection, p)) {
                  r.push(p)
                  if (closest) break;
                }
              }
            }
            return $(uniq(r))
          }
      
        , parent: function() {
            return $(uniq(b(this).parent()))
          }
      
        , closest: function (selector) {
            return this.parents(selector, true)
          }
      
        , first: function () {
            return $(this.length ? this[0] : this)
          }
      
        , last: function () {
            return $(this.length ? this[this.length - 1] : [])
          }
      
        , next: function () {
            return $(b(this).next())
          }
      
        , previous: function () {
            return $(b(this).previous())
          }
      
        , related: function (t) {
            return $(b(this).related(t))
          }
      
        , appendTo: function (t) {
            return b(this.selector).appendTo(t, this)
          }
      
        , prependTo: function (t) {
            return b(this.selector).prependTo(t, this)
          }
      
        , insertAfter: function (t) {
            return b(this.selector).insertAfter(t, this)
          }
      
        , insertBefore: function (t) {
            return b(this.selector).insertBefore(t, this)
          }
      
        , clone: function () {
            return $(b(this).clone(this))
          }
      
        , siblings: function () {
            var i, l, p, r = []
            for (i = 0, l = this.length; i < l; i++) {
              p = this[i]
              while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
              p = this[i]
              while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
            }
            return $(r)
          }
      
        , children: function () {
            var i, l, el, r = []
            for (i = 0, l = this.length; i < l; i++) {
              if (!(el = b.firstChild(this[i]))) continue;
              r.push(el)
              while (el = el.nextSibling) el.nodeType == 1 && r.push(el)
            }
            return $(uniq(r))
          }
      
        , height: function (v) {
            return dimension.call(this, 'height', v)
          }
      
        , width: function (v) {
            return dimension.call(this, 'width', v)
          }
        }, true)
      
        /**
         * @param {string} type either width or height
         * @param {number=} opt_v becomes a setter instead of a getter
         * @return {number}
         */
        function dimension(type, opt_v) {
          return typeof opt_v == 'undefined'
            ? b(this).dim()[type]
            : this.css(type, opt_v)
        }
      }(ender));
    }
  }, 'bonzo');

  Module.createPackage('elo', {
    'elo': function (module, exports, require, global) {
      /*!      
       * elo 1.6.0 cross-browser JavaScript events and data module      
       * @link http://elo.airve.com      
       * @license MIT      
       * @author Ryan Van Etten      
       */      
            
      /*jshint expr:true, sub:true, supernew:true, debug:true, node:true, boss:true, devel:true, evil:true,       
        laxcomma:true, eqnull:true, undef:true, unused:true, browser:true, jquery:true, maxerr:100 */      
            
      (function(root, name, make) {      
          if (typeof module != 'undefined' && module['exports']) module['exports'] = make();      
          else root[name] = make();      
      }(this, 'elo', function() {      
            
          // elo takes much inspiration from:      
          // jQuery (jquery.com)      
          // Bean   (github.com/fat/bean)      
          // Bonzo  (github.com/ded/bonzo)      
            
          // Array notation is used on property names that we don't want the      
          // Google Closure Compiler to rename in advanced optimization mode.       
          // developers.google.com/closure/compiler/docs/api-tutorial3      
          // developers.google.com/closure/compiler/docs/js-for-compiler      
            
          var domReady, eloReady      
            , root = this      
            , name = 'elo'      
            , win = window      
            , doc = document      
            , docElem = doc.documentElement      
            , slice = [].slice      
            , push = [].push      
            
              // Data objects are organized by unique identifier:      
              // Use null objects so we don't need to do hasOwnProperty checks      
            , eventMap = {} // event data cache      
            , dataMap = {} // other data cache      
            , uidProp = 'uidElo' // property name      
            , uidAttr = 'data-uid-elo' // elements are identified via data attribute      
            , uid = 4 // unique identifier      
            , queryEngine = function(s, root) {      
                  return s ? (root || doc).querySelectorAll(s) : [];      
              }      
            
              // Feature detection:      
            , W3C = !!doc.addEventListener      
            , FIX = !('onblur' in docElem) // Detect whether to fix event detection in hasEvent()      
            
              // Normalize the native add/remove-event methods:      
            , add = W3C ? function(node, type, fn) { node.addEventListener(type, fn, false); }      
                        : function(node, type, fn) { node.attachEvent('on' + type, fn); }      
            , rem = W3C ? function(node, type, fn) { node.removeEventListener(type, fn, false); }      
                        : function(node, type, fn) { node.detachEvent('on' + type, fn); }      
            
              // Local vars specific to domReady:      
            , readyStack = [] // stack of functions to fire when the DOM is ready      
            , isReady = /^loade|c/.test(doc.readyState) // test initial state      
            , needsHack = !!docElem.doScroll      
            , readyType = needsHack ? 'onreadystatechange' : 'DOMContentLoaded';      
            
          // Temporary local version of hook allows for the actual      
          // $.hook to be added after the api has been created. If $.hook       
          // is added, then this local version becomes a ref to $.hook      
          // See the source of @link github.com/ryanve/dj      
          // It's the best kind of magic.      
          function hook(k) {      
              var realHook = api['hook'];      
              if (!realHook || !realHook['remix'])      
                  return 'select' === k ? queryEngine : 'api' === k ? eloReady : void 0;      
              // send the default hooks      
              realHook('select', queryEngine);      
              realHook('api', eloReady);      
              realHook(name, api) && realHook(name, false);      
              hook = realHook; // redefine self      
              return realHook.apply(this, arguments);      
          }      
            
          /**      
           * api is the export (all public methods are added to it)      
           * @param {*} item      
           * @param {Object=} root       
           */      
          function api(item, root) {      
              return new Api(item, root);      
          }      
            
         /**      
          * @constructor      
          * @param {*=} item       
          * @param {Object=} root       
          * adapted from jQuery and ender      
          */      
          function Api(item, root) {      
              var i;      
              this.length = 0;      
              item = typeof item == 'string' ? hook('select')(this['selector'] = item, root) : item;      
              if (typeof item == 'function') {      
                  hook('api')(item); // designed to be closure or ready shortcut      
              } else if (null != item) {              
                  if (item.nodeType || typeof (i = item.length) != 'number' || item.window == item)      
                      this[this.length++] = item;      
                  else for (this.length = i = i > 0 ? i >> 0 : 0; i--;) // ensure positive integer      
                      this[i] = item[i];       
              }      
          }      
                
          // jQuery-inspired magic to make `api() instanceof api` be `true` and to make      
          // it so that methods added to api.fn map back to the prototype and vice versa.      
          api.prototype = api['fn'] = Api.prototype;      
            
          // Create top-level reference to self:      
          // This makes it possible to bridge into a host, destroy the global w/ noConflict,       
          // and still access the entire api from the host (not just the bridged methods.)      
          // It is also useful for other modules that may want to detect this module, it can be      
          // used to check if an method on the host is from the api, e.g. `($.each === $.elo.each)`      
          // and similarly it can be used for assigning methods even after the global is gone.      
          api[name] = api;      
            
          // Create reference to self in the chain:      
          api['fn'][name] = api;      
            
          /**       
           * Function that returns false for compat w/ jQuery's false shorthand.      
           */      
          function returnFalse() {      
              return false;      
          }      
            
          /**      
           * A hella' ballistic iterator: jQuery had sex with Underscore. This was the offspring.      
           * @param {*} ob is the array|object|string|function to iterate over.      
           * @param {Function} fn is the callback - it receives (value, key, ob)      
           * @param {*=} scope thisArg (defaults to current item)      
           * @param {*=} breaker value for which if fn returns it, the loop stops (default: false)      
           */      
          function each(ob, fn, scope, breaker) {      
              // Opt out of the native forEach here b/c we want to:      
              // - Default the scope to the current item.      
              // - Return the object for chaining.      
              // - Be able to break out of the loop if the fn returns the breaker.      
              // - Be able to iterate strings. (Avoid `in` tests.)      
              if (null == ob) return ob;      
              var i = 0, l = ob.length;      
              breaker = void 0 !== breaker && breaker; // default: false      
              if (typeof ob != 'function' && l === +l) {      
                  while (i < l) if (fn.call(scope || ob[i], ob[i], i++, ob) === breaker) break;      
              } else {      
                  for (i in ob) if (fn.call(scope || ob[i], ob[i], i, ob) === breaker) break;      
              }      
              return ob;      
          }      
            
          /**      
           * Iterate space-separated values. Optimized for internal use.      
           * @link http://jsperf.com/eachssv      
           * @param {Array|string|*} list to iterate over      
           * @param {Function} fn callback      
           */      
          function eachSSV(list, fn) {      
              var l, i = 0;      
              list = list instanceof Array ? list : list.split(' ');      
              for (l = list.length; i < l; i++) {      
                  list[i] && fn(list[i], i, list);      
              }      
          }      
            
          /**      
           * Augment an object with the properties of another object.      
           * @param {Object|Array|Function} r receiver      
           * @param {Object|Array|Function} s supplier      
           */      
           function aug(r, s) {      
              for (var k in s) r[k] = s[k];       
              return r;      
          }      
            
          /**      
           * Apply every function in a stack using the specified scope and args.      
           * @param {{length:number}} fns stack of functions to fire      
           * @param {*=} scope thisArg      
           * @param {(Array|Arguments)=} args      
           * @param {*=} breaker unless undefined      
           * @return {boolean} true if none return the breaker      
           */      
          function applyAll(fns, scope, args, breaker) {      
              if (!fns) return true;      
              var i = 0, l = fns.length;      
              breaker = void 0 === breaker ? {} : breaker; // disregard if none      
              for (args = args || []; i < l; i++)      
                  if (typeof fns[i] == 'function' && fns[i].apply(scope, args) === breaker) return false;      
              return true;      
          }      
            
          /**      
           * Get the unique id associated with the specified item. If an id has not      
           * yet been created, then create it. Return `undefined` for invalid types.      
           * To have an id, the item must be truthy and either an object or function.      
           * @param {*} item      
           * @return {number|undefined}      
           */      
          function getId(item) {      
              var id;      
              if (!item) return;      
              if (typeof item != 'object' && typeof item != 'function') return;      
              if (item.nodeType && item.getAttribute && item.setAttribute) {      
                  id = item.getAttribute(uidAttr);      
                  id || item.setAttribute(uidAttr, (id = uid++));      
                  return id;      
              }      
              if (item === doc) return 3;      
              if (item === win) return 2;      
              if (item === root) return 1;      
              return item[uidProp] = item[uidProp] || uid++; // other objects/funcs      
          }      
            
          /**      
           * Get or set arbitrary data associated with an object.      
           * @param {Object|Array|Function} obj      
           * @param {(string|Object)=} key      
           * @param {*=} val      
           */          
          function data(obj, key, val) {      
              var id = getId(obj), hasVal = arguments.length > 2;      
              if (!id || (hasVal && key == null)) throw new TypeError('@data');       
              dataMap[id] = dataMap[id] || {};      
              if (key == null) return key === null ? void 0 : dataMap[id]; // GET invalid OR all      
              if (hasVal) return dataMap[id][key] = val; // SET (single)      
              if (typeof key != 'object') return dataMap[id][key]; // GET (single)      
              return aug(dataMap[id], key); // SET (multi)      
          }      
            
          /**      
           * Remove data associated with an object that was added via data()      
           * Remove data by key, or if no key is provided, remove all.      
           * @param {*=} ob      
           * @param {(string|number)=} keys      
           */      
          function removeData(ob, keys) {      
              var id = ob && getId(ob);      
              if (id && dataMap[id]) {      
                  if (2 > arguments.length) delete dataMap[id]; // Remove all data.      
                  else if (typeof keys == 'number') delete dataMap[id][keys];       
                  else keys && eachSSV(keys, function(k) {      
                      delete dataMap[id][k];       
                  });      
              }      
              return ob;      
          }      
            
          /**      
           * Remove event handlers from the internal eventMap. If `fn` is not specified,      
           * then remove all the event handlers for the specified `type`. If `type` is       
           * not specified, then remove all the event handlers for the specified `node`.      
           * @param {Object|*} node      
           * @param {(string|null)=} type      
           * @param {Function=} fn      
           */      
          function cleanEvents(node, type, fn) {      
              if (!node) return;      
              var fid, typ, key, updated = [], id = getId(node);      
              if (id && eventMap[id]) {      
                  if (!type) {      
                      // Remove all handlers for all event types      
                      delete eventMap[id];      
                  } else if (eventMap[id][key = 'on' + type]) {      
                      if (!fn) {      
                          // Remove all handlers for a specified type      
                          delete eventMap[id][key];       
                      } else if (fid = fn[uidProp]) {      
                          // Remove a specified handler      
                          eachSSV(eventMap[id][key], function(handler) {      
                              fid !== handler[uidProp] && updated.push(handler);      
                          });      
                          if (updated.length) eventMap[id][key] = updated;      
                          else delete eventMap[id][key];      
                          // If an `fn` was specified and the event name is namespaced, then we      
                          // also need to remove the `fn` from the non-namespaced handler array:      
                          typ = type.split('.')[0]; // type w/o namespace      
                          typ === type || cleanEvents(node, 'on' + typ, fn);      
                      }      
                  }      
              }      
          }      
            
          /**      
           * Delete **all** the elo data associated with the specified item(s)      
           * @param {Object|Node|Function} item or collection of items to purge      
           */      
          function cleanData(item) {      
              var deleted, l, i = 0;      
              if (!item) return;      
              removeData(item);      
              if (typeof item == 'object') {      
                  cleanEvents(item);      
                  if (item.nodeType) item.removeAttribute && item.removeAttribute(uidAttr);      
                  else for (l = item.length; i < l;) cleanData(item[i++]); // Deep.      
              } else if (typeof item != 'function') { return; }      
              if (uidProp in item) {      
                  try {      
                      deleted = delete item[uidProp];      
                  } catch(e) {}      
                  if (!deleted) item[uidProp] = void 0;      
              }      
          }      
            
          /**      
           * Test if the specified node supports the specified event type.      
           * This function uses the same signature as Modernizr.hasEvent,       
           * @link http://bit.ly/event-detection      
           * @link http://github.com/Modernizr/Modernizr/pull/636      
           * @param {string|*} eventName an event name, e.g. 'blur'      
           * @param {(Object|string|*)=} node a node, window, or tagName (defaults to div)      
           * @return {boolean}      
           */      
          function hasEvent(eventName, node) {      
              var isSupported;      
              if (!eventName) return false;      
              eventName = 'on' + eventName;      
            
              if (!node || typeof node == 'string') node = doc.createElement(node || 'div');      
              else if (typeof node != 'object') return false; // `node` was invalid type      
            
               // Technique for modern browsers and IE:      
              isSupported = eventName in node;      
            
              // We're done unless we need the fix:                    
              if (!isSupported && FIX) {      
                  // Hack for old Firefox - bit.ly/event-detection      
                  node.setAttribute || (node = doc.createElement('div'));      
                  if (node.setAttribute && node.removeAttribute) {      
                      // Test via hack      
                      node.setAttribute(eventName, '');      
                      isSupported = typeof node[eventName] == 'function';      
                      // Cleanup      
                      null == node[eventName] || (node[eventName] = void 0);      
                      node.removeAttribute(eventName);      
                  }      
              }      
              // Nullify node references to prevent memory leaks      
              node = null;       
              return isSupported;      
          }      
            
          /**      
           * Adapter for handling 'event maps' passed to on|off|one      
           * @param {Object|*} list events map (event names as keys and handlers as values)      
           * @param {Function} fn method (on|off|one) to call on each pair      
           * @param {(Node|Object|*)=} node or object to attach the events to      
           */      
          function eachEvent(list, fn, node) {      
              for (var name in list) fn(node, name, list[name]);      
          }      
                
          /**      
           * Get a new function that calls the specified `fn` with the specified `scope`.      
           * We use this to normalize the scope passed to event handlers in non-standard browsers.      
           * In modern browsers the value of `this` in the listener is the node.      
           * In old IE, it's the window. We normalize it here to be the `node`.      
           * @param {Function} fn function to normalize      
           * @param {*=} scope thisArg (defaults to `window`)      
           * @return {Function}      
           */      
          function normalizeScope(fn, scope) {      
              function normalized() {      
                  return fn.apply(scope, arguments);       
              }      
              // Technically we should give `normalized` its own uid (maybe negative or      
              // underscored). But, for our internal usage, cloning the original is fine,       
              // and it simplifies removing event handlers via off() (see cleanEvents()).      
              if (fn[uidProp]) normalized[uidProp] = fn[uidProp];       
              return normalized;      
          }      
            
          /**      
           * on() Attach an event handler function for one or more event types to the specified node.      
           * @param {Node|Object} node object to add events to      
           * @param {string|Object} types space-separated event names, or an events map      
           * @param {Function=} fn handler to add      
           */          
          function on(node, types, fn) {      
              // Don't deal w/ text/comment nodes for jQuery-compatibility.      
              // jQuery's `false` "shorthand" has no effect here.                  
              var id, isMap = !fn && typeof types == 'object';      
              if (!node || 3 === node.nodeType || 8 === node.nodeType) return;      
              if (null == types || typeof node != 'object')      
                  throw new TypeError('@on');       
              if (isMap) {      
                  eachEvent(types, on, node);       
              } else if (fn = false === fn ? returnFalse : fn) {      
                  if (id = getId(node)) {      
                      fn[uidProp] = fn[uidProp] || uid++; // add identifier      
                      eventMap[id] = eventMap[id] || []; // initialize if needed      
                      fn = W3C ? fn : normalizeScope(fn, node);      
                      eachSSV(types, function(type) {      
                          var typ = type.split('.')[0] // w/o namespace      
                            , key = 'on' + type // w/ namespace if any      
                            , prp = 'on' + typ  // w/o namespace      
                            , hasNamespace = typ !== type;      
                          // Add native events via the native method.      
                          hasEvent(typ, node) && add(node, typ, fn);      
                          // Update our internal eventMap's handlers array.      
                          eventMap[id][key] ? eventMap[id][key].push(fn) : eventMap[id][key] = [fn];      
                          // Update the non-namespaced array for firing when non-namespaced events trigger.      
                          hasNamespace && (eventMap[id][prp] ? eventMap[id][prp].push(fn) : eventMap[id][prp] = [fn]);      
                      });      
                  }      
              }      
          }      
            
          /**      
           * off() Remove an event handlers added via on() from the specified node. If `fn` is      
           * not specified, then remove all the handlers for the specified types. If `types`      
           * is not specfied, then remove *all* the handlers from the specified node.      
           * @param {Node|Object} node object to remove events from      
           * @param {string|Object} types space-separated event names, or an events map      
           * @param {Function=} fn handler to remove      
           */      
          function off(node, types, fn) {      
              if (!node || 3 === node.nodeType || 8 === node.nodeType) return;      
              if (typeof node != 'object')      
                  throw new TypeError('@off');      
              fn = false === fn ? returnFalse : fn;      
              if (types == null) cleanEvents(node, types, fn); // Remove all.      
              else if (!fn && typeof types == 'object') eachEvent(types, off, node); // Map.      
              else eachSSV(types, function(type) {      
                  var typ = type.split('.')[0];      
                  typeof fn == 'function' && hasEvent(typ, node) && rem(node, typ, fn);      
                  cleanEvents(node, type, fn);      
              });       
          }      
            
          /**      
           * one() Add an event handler that only runs once and is then removed.      
           * @param {Node|Object} node object to add events to      
           * @param {string|Object} types space-separated event names, or an events map      
           * @param {Function=} fn handler to add      
           */      
          function one(node, types, fn) {      
              if (null == fn && typeof types == 'object') {      
                  eachEvent(types, one, node);      
              } else {      
                  var actualHandler;      
                  on(node, types, (actualHandler = function() {      
                      off(node, types, actualHandler);      
                      return fn !== false && fn.apply(node, arguments);      
                  }));      
              }      
          }      
            
          /**      
           * Trigger handlers registered via .on() for the specifed event type. This works for      
           * native and custom events, but unlike jQuery.fn.trigger it does *not* fire the      
           * browser's native actions for the event. To do so would take a lot more code.       
           * In that respect it works like jQuery.fn.triggerHandler, but elo.fn.trigger      
           * works like jQuery.fn.trigger otherwise (e.g. it operates on the whole set).       
           * @param {Node|Object} node object to remove events from      
           * @param {string} type is an event name to trigger      
           * @param {(Array|*)=} extras extra parameters to pass to the handler      
           * Handlers receive (eventData, extras[0], extras[1], ...)      
           */      
          function trigger(node, type, extras) {      
              if (!type || !node || 3 === node.nodeType || 8 === node.nodeType) return;      
              if (typeof node != 'object') throw new TypeError('@trigger');      
              var eventData = {}, id = getId(node);      
              if (!id || !eventMap[id]) return;      
              // Emulate the native and jQuery arg signature for event listeners,      
              // supplying an object as first arg, but only supply a few props.      
              // The `node` becomes the `this` value inside the handler.      
              eventData['type'] = type.split('.')[0]; // w/o namespace      
              eventData['isTrigger'] = true;      
              applyAll(eventMap[id]['on' + type], node, null == extras ? [eventData] : [eventData].concat(extras));      
          }      
            
          // START domReady      
          // Make the standalone domReady function       
          // Adapated from github.com/ded/domready      
            
          /**       
           * Push the readyStack or, if the DOM is already ready, fire the `fn`      
           * @param  {Function}  fn         the function to fire when the DOM is ready      
           * @param  {Array=}    argsArray  is an array of args to supply to `fn` (defaults to [api])      
           */      
          function pushOrFire(fn, argsArray) {      
              if (isReady) fn.apply(doc, argsArray || [api]);      
              else readyStack.push({f: fn, a: argsArray});      
          }      
            
          // Fire all funcs in the readyStack and clear each from the readyStack as it's fired      
          function flush(ob) {// voided arg      
              // When the hack is needed, we prevent the flush from      
              // running until the readyState regex passes:      
              if (needsHack && !(/^c/).test(doc.readyState)) return;      
              // Remove the listener.      
              rem(doc, readyType, flush);      
              // The flush itself only runs once.      
              isReady = 1; // Record that the DOM is ready (needed in pushOrFire)      
              while (ob = readyStack.shift())      
                  ob.f && ob.f.apply(doc, ob.a || [api]);      
              // Fire handlers added via .on() too. These get an eventData object as      
              // the arg and are fired after the ones above. (jQuery works the same.)      
              trigger(doc, 'ready');      
          }      
            
          // Add the ready listener:      
          add(doc, readyType, flush);      
            
          /**       
           * Define our local `domReady` method:      
           * The `argsArray` parameter is for internal use (but extendable via domReady.remix())      
           * The public methods are created via remixReady()      
           * @param {Function}  fn         the function to fire when the DOM is ready      
           * @param {Array=}    argsArray  is an array of args to supply to `fn` (defaults to [api])      
           */      
          domReady = !needsHack ? pushOrFire : function(fn, argsArray) {      
              if (self != top) {      
                  pushOrFire(fn, argsArray);      
              } else {      
                  try {      
                      docElem.doScroll('left');       
                  } catch (e) {      
                      return setTimeout(function() {       
                          domReady(fn, argsArray);       
                      }, 50);       
                  }      
                  fn.apply(doc, argsArray || [api]);      
              }      
          };      
                
          /**       
           * Utility for making the public version(s) of the ready function. This gets      
           * exposed as a prop on the outputted ready method itself so that devs have a      
           * way to bind the ready function to a host lib and/or customize (curry) the      
           * args supplied to the ready function.      
           * @param  {...}   args   are zero or more args that fns passed to ready will receive      
           * @return {Function}      
           */          
          function remixReady(args) {      
              // The `args` are supplied to the remixed ready function:      
              args = slice.call(arguments);      
              function ready(fn) {      
                  domReady(fn, args); // call the local (private) domReady method, which takes args      
                  if (this !== win) return this; // chain instance or parent but never window      
              }      
              // Put the remix function itself as method on the method.      
              ready['remix'] = remixReady;       
              ready['relay'] = function($) {       
                  return remixReady($ || void 0);       
              };      
              return ready; // the actual domReady/.ready method that elo exposes      
          }      
            
          // Build the public domReady/.ready methods. (We include a top-level .ready alias.      
          // Keep that in mind when integrating w/ libs that aim to be jQuery-compatible b/c      
          // jQuery uses jQuery.ready privately for something else and here all 3 are aliased.)      
          //api['ready'] = api['domReady'] = api['fn']['ready'] = remixReady(api);      
          api['domReady'] = api['fn']['ready'] = eloReady = remixReady(api);      
            
          // END domReady      
                
          // Top-level only      
          api['applyAll'] = applyAll;      
          api['hasEvent'] = hasEvent;      
          api['qsa'] = queryEngine;         
            
          // Top-level + chainable      
          // The top-level version are the simple (singular) versions defined above. (They       
          // operate directly on a node or object). The effin versions of these are 'built'      
          // below via wrapperize() and they operate on each object in a matched set.      
          api['removeData'] = removeData;      
          api['cleanData'] = cleanData;      
          api['addEvent'] = add;      
          api['removeEvent'] = rem;      
          api['on'] = on;      
          api['off'] = off;      
          api['one'] = one;       
          api['trigger'] = trigger;      
            
          // Top-level + chainable (more)      
          // The effin versions of these are made manually below      
          api['each'] = each;      
          api['data'] = data;      
            
          /**       
           * Utility for converting simple static methods into their chainable effin versions.      
           * @link   jsperf.com/wrapperized-methods/3      
           * @param  {Function}  fn      
           * @return {Function}      
           */      
          function wrapperize(fn) {      
              return function() {      
                  var i = 0, args = [0], l = this.length;      
                  for (push.apply(args, arguments); i < l;)      
                      null != (args[0] = this[i++]) && fn.apply(this, args);      
                  return this;      
              };      
          }      
            
          // Build effin versions of these static methods.      
          eachSSV('addEvent removeEvent on off one trigger removeData', function(methodName) {      
              api['fn'][methodName] = wrapperize(api[methodName]);      
          });      
            
          /**      
           * @param {Function} fn callback receives (value, key, ob)      
           * @param {*=} scope thisArg (defaults to current item)      
           * @param {*=} breaker defaults to `false`      
           */      
          api['fn']['each'] = function(fn, scope, breaker) {      
              return each(this, fn, scope, breaker);       
          };      
            
          // In elo 1.4+ the cleanData method is only directly avail on the top-level.      
          // api['fn']['cleanData'] = function (inclInstance) {      
          //    return true === inclInstance ? cleanData(this) : each(this, cleanData);      
          // };      
            
          /**      
           * @this {{length:number}} stack of functions to fire      
           * @param {*=} scope      
           * @param {(Array|Arguments)=} args      
           * @param {*=} breaker      
           * @return {boolean}      
           */      
          api['fn']['applyAll'] = function(scope, args, breaker) {      
              return applyAll(this, scope, args, breaker);       
          };      
                
          // Handle data separately so that we can return the value on gets      
          // but return the instance on sets. This sets the val on each elem      
          // in the set vs. the lower-level method that only sets one object.      
          api['fn']['data'] = function(key, val) {      
              var i, n, count = arguments.length, hasVal = 1 < count;      
              if (!count) return this[0] ? data(this[0]) : void 0; // GET-all      
              // We have to make sure `key` is not an object (in which case it'd be set, not get)      
              // Strings created by (new String()) are treated as objects. ( bit.ly/NPuVIr )      
              // Also remember that `key` can be a `number` too.      
              if (!hasVal && typeof key != 'object')      
                  // Expedite simple gets by directly grabbing from the dataMap.      
                  // Return the value (if it exists) or else undefined:      
                  return (i = getId(this[0])) && dataMap[i] ? dataMap[i][key] : void 0; // GET      
              for (i = 0, n = this.length; i < n; i++)      
                  // Iterate thru the truthy items, setting data on each of them.      
                  this[i] && (hasVal ? data(this[i], key, val) : data(this[i], key)); // SET      
              return this;      
          };      
                
          // Include this b/c of it relates to internal data.      
          // adapted from jQuery.fn.empty      
          api['fn']['empty'] = function() {      
              for (var node, i = 0; null != (node = this[i]); i++) {      
                  1 === node.nodeType && cleanData(node.getElementsByTagName('*'));      
                  while (node.firstChild) node.removeChild(node.firstChild);      
              }      
              return this;      
          };      
                
          /**      
           * @param {string} type event name      
           * @return {Function}      
           */      
          function shorthand(type) {      
              return function() {      
                  var use = [type], method = 1 < push.apply(use, arguments) ? 'on' : 'trigger';      
                  return this[method].apply(this, use);      
              };      
          }      
            
          /**      
           * Add event shorthands to the chain or a specified object.      
           * @param {Array|string} list of shortcut names      
           * @param {*=} dest destination defaults to `this`      
           * @link http://developer.mozilla.org/en/DOM_Events      
           * @example $.dubEvent('resize scroll focus')      
           */      
          function dubEvent(list, dest) {      
              dest = dest === Object(dest) ? dest : this === win ? {} : this;      
              return eachSSV(list, function(n) {      
                  dest[n] = shorthand(n);      
              }), dest;      
          }      
          api['fn']['dubEvent'] = dubEvent;      
            
          /**      
           * Integrate applicable methods|objects into a host.      
           * @link http://github.com/ryanve/submix      
           * @this {Object|Function} supplier      
           * @param {Object|Function} r receiver      
           * @param {boolean=} force whether to overwrite existing props (default: false)      
           * @param {(Object|Function|null)=} $ the top-level of the host api (default: `r`)      
           */      
          function bridge(r, force, $) {      
              var v, k, relay, custom, s = this; // s is the supplier      
              if (!r || !s || s === win) return;      
              custom = s['bridge']; // supplier may have custom bridge      
              if (typeof custom == 'function' && custom['relay'] === false) {      
                  custom.apply(this, arguments);      
                  return r;      
              }      
              force = true === force; // require explicit true to force      
              $ = typeof $ == 'function' || typeof $ == 'object' ? $ : r; // allow null      
              for (k in s) {      
                  v = s[k];      
                  if (typeof v == 'function' || typeof v == 'object' && v) {      
                      if ('fn' === k && v !== s) {      
                          // 2nd check above prevents infinite loop       
                          // from `.fn` having ref to self on it.      
                          bridge.call(v, r[k], force, $);      
                      } else if (force ? r[k] !== r && r[k] !== $ : r[k] == null) {      
                          // The check above prevents overwriting receiver's refs to      
                          // self (even if forced). Now handle relays and the transfer:      
                          relay = v['relay'];      
                          if (typeof relay == 'function') {      
                              // Fire relay functions. I haven't fully solidified the      
                              // relay call sig. Considering: .call(v, $, r[k], k, r)      
                              // This passes the essentials:      
                              relay = relay.call(v, $, r[k]);      
                          }      
                          if (relay !== false) {// Provides a way to bypass non-agnostic props.      
                              // Transfer the value. Default to the orig supplier value:      
                              r[k] = relay || v;      
                          }      
                      }      
                  }      
              }      
              return r;      
          }      
                
          // signify that this bridge() is module agnostic      
          bridge['relay'] = true;      
          api['bridge'] = bridge;      
            
          /**      
           * @param {Object|Function} api      
           * @param {Object|Function} root      
           * @param {string} name      
           * @param {string=} alias      
           */      
          function noConflictRemix(api, root, name, alias) {      
              if (!root || !name || !api ) return;      
              var old = root[name], viejo;      
              alias = typeof alias == 'string' && alias;      
              viejo = alias && root[alias];      
            
              function noConflict(fn) {      
                  alias && api === root[alias] && (root[alias] = viejo);      
                  (fn || !alias) && api === root[name] && (root[name] = old);      
                  typeof fn == 'function' && fn.call(root, api, name, alias);       
                  return api;      
              }      
            
              noConflict['relay'] = false;      
              noConflict['remix'] = noConflictRemix;      
              return noConflict;      
          }      
          api['noConflict'] = noConflictRemix(api, root, name, '$');      
            
          // api.eventMap = eventMap; // only for testing      
          // api.dataMap = dataMap;   // only for testing      
          return api;      
      }));
    },
    'ender': function (module, exports, require, global) {
      // bridge file for ender.jit.su      
      require('elo')['bridge'](ender);
    }
  }, 'elo');

  Module.createPackage('sos', {
    'sos': function (module, exports, require, global) {
      /*!      
       * sos 0.0.1+201403010720      
       * https://github.com/ryanve/sos      
       * MIT License (c) 2014 Ryan Van Etten      
       */      
            
      (function(root, name, make) {      
        if (typeof module != 'undefined' && module['exports']) module['exports'] = make();      
        else root[name] = make();      
      }(this, 'sos', function() {      
            
        var model = sos.prototype = Sos.prototype      
          , slice = [].slice      
          , force = '--force'      
          , flag = 'flag'      
          , _op = '_flag'      
          , win = typeof window != 'undefined' && window      
          , con = typeof console != 'undefined' && console      
          , instance = sos()      
            
        /**      
         * @constructor      
         */      
        function Sos() {      
          this[_op] = []      
        }      
              
        function sos() {      
          return arguments.length ? cs.apply(this instanceof Sos ? this : sos, arguments) : new Sos      
        }      
              
        sos[flag] = bind(model[flag] = function(name, n) {      
          var op = this[_op]      
          name = name > '@' ? '--' + name : name      
          return op[name] = true === n ? 1/0 : false === n ? 0 : n === +n ? n : op[name] || 0      
        }, instance)      
              
        function cs(name) {      
          var did = 1, rest = slice.call(arguments, 1)      
          if (con) name in con ? con[name].apply(con, rest) : --did      
          else win && rest.length && this[flag](force) ? win.alert(name + ': ' + rest.join(' ')) : --did      
          return did      
        }      
              
        function partial(fn) {      
          var rest = slice.call(arguments, 1)      
          return function() {      
            return fn.apply(this, rest.concat(slice.call(arguments)))      
          }      
        }      
              
        function bind(fn, scope) {      
          return function() {      
            return fn.apply(scope, arguments)      
          }      
        }      
              
        function each(o, fn, scope) {      
          for (var i = 0, l = o.length; i < l;) fn.call(scope, o[i++])      
        }      
              
        each(['dir', 'log', 'trace', 'info', 'warn', 'error', 'clear'], function(name) {      
          sos[name] = bind(model[name] = partial(cs, name), instance)      
        })      
            
        sos['assert'] = model['assert'] = function(exp) {      
          if (exp) return false      
          if (con && 'assert' in con) con['assert'].apply(con, arguments)      
          else sos['warn'].apply(con, slice.call(arguments, 1))      
          return true      
        }      
            
        return sos;      
      }));
    }
  }, 'sos');

  require('scriptjs');
  require('scriptjs/src\ender');
  require('qwery');
  require('qwery/src\ender');
  require('bonzo');
  require('bonzo/src\ender');
  require('elo');
  require('elo/ender');
  require('sos');

}.call(window));
//# sourceMappingURL=ender.js.map
