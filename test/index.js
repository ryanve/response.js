(function(root, win, doc) {
  var $ = root.$ = require('ender') // expose for console use
    , html = doc.documentElement
    , $win = $(win)
    , $doc = $(doc)
    , sos = require('sos')
    , log = sos.log
    , clear = sos.clear
    , O = root.Response || void console.warn('Try refreshing the page.')
    , crossovers = 0
    , tempBase = O;
  
  $doc.ready(function() {
    var props = [
            'devicew', 'deviceh', 'devicemax', 'devicemin', 'dpr', 'dprmin'
          , 'viewporth', 'viewportw', 'scrollx', 'scrolly'
          , 'bandmin', 'bandminmax', 'wavemin', 'waveminmax'
          , 'devicebandmin', 'devicebandminmax', 'devicewavemin', 'devicewaveminmax' 
          , 'inx', 'iny', 'inviewport', 'inviewport0', 'vergepos', 'vergeneg'
        ]
      , $ids = []
      , $html = $(html)
      , $numbers = $('#numbers')
      , $booleans = $('#booleans');
      
    O.each(props, function(name) {
      $ids[name] = $('#' + name);
    });
    
    function update(arr) {
      var result, prop, $el, output;
      if (typeof arr == 'string') {
        prop = tempBase[arr];
        result = typeof prop == 'function' ? prop() : prop;
        $el = $ids[arr.toLowerCase()];
      } else {
        prop = tempBase[arr.shift()];
        $el = $ids[arr.shift()];
        result = arr.length ? prop.apply(this, arr) : prop();
      }
      if ($el) {
        if ($el = $el.find('.output')) {
          output = '' + result;
          if (typeof result == 'boolean') $el.removeClass('true false').addClass(output);
          return $el.html(output);
        }
      }
      return false;
    }

    O.each(['deviceW','deviceH','deviceMax','deviceMin','dpr'], update);
    
    function onReadyAndResize() {
      O.each(['viewportW', 'viewportH'], update);
      update(['band', 'bandmin', 481]);
      update(['wave', 'wavemin', 481]);
      update(['band', 'bandminmax', 481, 961]);
      update(['wave', 'waveminmax', 481, 800]);
    }
    
    function crossoverToggle(){
      $html.toggleClass('dark');
      crossovers++ && clear();
      log('crossover (' + crossovers + ') near ' + O.viewportW() + 'x' + O.viewportH());
    }
    
    O.action(onReadyAndResize)
     .crossover(crossoverToggle);
    
    // These change on scroll:
    $win.on('scroll', function() {
      // Test both the jQuery and native versions:
      O.inViewport($booleans) ? $numbers.addClass('dark') : $numbers.removeClass('dark');
      
      O.each(['scrollX', 'scrollY'], update);
      update(['inViewport', 'inviewport', $numbers]); 
      update(['inViewport', 'inviewport0', $numbers[0]]); // native elem
      update(['inX', 'inx', $numbers]);
      update(['inY', 'iny', $numbers]);
      update(['inViewport', 'vergepos', $numbers,  100]);
      update(['inViewport', 'vergeneg', $numbers, -100]);
    }).trigger('scroll');
    
    // These ones are static:
    update(['dpr', 'dprmin', 1.5]);
    tempBase = O.device;
    update(['band', 'devicebandmin', 481]);
    update(['wave', 'devicewavemin', 481]);
    update(['band', 'devicebandminmax', 481, 961]);
    update(['wave', 'devicewaveminmax', 481, 800]);
    tempBase = O;
  });
}(this, window, document));