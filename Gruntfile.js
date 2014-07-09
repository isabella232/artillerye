'use strict';

var request = require('request');
var sources = [
  'app.js',
  'js/shared/globals.js',
  'js/shared/packets.js',
  'js/shared/physics.js',
  'js/shared/player.js',
  'js/shared/spirits.js',
  'server/gameproc.js',
  'server/index.js',
  'server/user.js'
];

module.exports = function (grunt) {
  
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35727, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // develop: {
    //   server: {
    //     file: 'app.js'
    //   }
    // },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'Gruntfile.js',
          'app.js',
          'routes/*.js'
        ],
        tasks: ['develop'], //, 'delayed-livereload']
      }/*,
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      css: {
        files: ['public/css/*.css'],
        options: {
          livereload: reloadPort
        }
      },
      jade: {
        files: ['views/*.jade'],
        options: {
          livereload: reloadPort
        }
      }*/
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          args: ['dev'],
          // nodeArgs: ['--debug'],
          watchedExtensions: ['js', 'json'],
          ignore: ['node_modules/**', 'client/**'],
        }
      }
    },
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      beforeConcat: {
        files: {
          src: sources
        }
      }
    },    
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', ['nodemon']);
};
