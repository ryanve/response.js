//github.com/ryanve/universal#grunt
module.exports = function(grunt) {
  var _ = grunt.util._,
    fs = require('fs'),
    pkg = grunt.file.readJSON('package.json'),
    path = require('path'),
    from = 'src/',
    main = pkg.main && path.basename(pkg.main) || 'index.js',
    source = [_.find([from + 'index.js', from + main, from + pkg.name], function(v) {
      return fs.existsSync(v);
    })],
    holder = (function(who) {
      return typeof who == 'string' ? who.split(/\s+</)[0].trim() : who && who.name || '';
    }(pkg.author));

  grunt.initConfig({
    pkg: pkg,
    aok: { test: ['./test'] },
    jshint: {
      // gruntjs.com/configuring-tasks#globbing-patterns
      // **/** matches in current and sub dirs
      all: ['./'], // current dir and sub dirs
      sub: ['*/'], // sub dirs
      dir: ['*.js'], // current dir
      src: ['src/'],
      test: ['test/'],
      grunt: [path.basename(__filename)],
      build: [main],
      options: {
        ignores: ['**/**/node_modules/', '**/**/vendor/', '**/**.min.js'],
        debug:true, expr:true, sub:true, boss:true, supernew:true, node:true,
        undef:true, unused:true, devel:true, evil:true, laxcomma:true, eqnull:true, 
        browser:true, globals:{ender:true, define:true}, jquery:true, maxerr:10
      }
    },
    concat: {
      options: {
        banner: [
          '/*!',
          ' * <%= pkg.name %> <%= pkg.version %>+<%= grunt.template.today("UTC:yyyymmddHHMM") %>',
          ' * <%= pkg.homepage %>',
          ' * MIT License (c) <%= grunt.template.today("UTC:yyyy") %> ' + holder,
          ' */\n\n'
        ].join('\n')
      },
      build: {
        files: _.object([main], [source])
      }
    },
    uglify: {
      options: {
        report: 'gzip',
        preserveComments: 'some'
      },
      build: {
        files: _.object([main.replace(/\.js$/i, '.min.js')], [main])
      }
    }
  });

  fs.existsSync('tasks') && grunt.loadTasks('tasks');
  if (!pkg.devDependencies) return;
  _.keys(pkg.devDependencies).some(function(name) {
    this.test(name) && grunt.loadNpmTasks(name);
  }, /^grunt-|aok/);

  grunt.registerTask('test', ['jshint:sub'].concat(pkg.devDependencies.aok ? 'aok' : []));
  grunt.registerTask('build', ['jshint:grunt', 'test', 'concat:build', 'jshint:build', 'uglify']);
  grunt.registerTask('default', ['build']);
};