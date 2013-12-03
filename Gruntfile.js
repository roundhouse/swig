(function () {
  "use strict";

  var browserTests = [
    "tests/comments.test.js",
    "tests/filters.test.js",
    "tests/tags.test.js",
    "tests/variables.test.js",
    "tests/tags/autoescape.test.js",
    "tests/tags/else.test.js",
    "tests/tags/filter.test.js",
    "tests/tags/for.test.js",
    "tests/tags/if.test.js",
    "tests/tags/macro.test.js",
    "tests/tags/raw.test.js",
    "tests/tags/set.test.js",
    "tests/tags/spaceless.test.js",
    "tests/basic.test.js"
  ];

  module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      filenames: {
        dist: 'dist/swig.js',
        min: 'dist/swig.min.js',
        sourceMap: 'dist/swig.js.map'
      },
      clean: {
        dist: {
          src: ['dist']
        },
        browsertests: {
          src: ['<%= concat.browsertests.dest %>']
        }
      },
      browserify: {
        dist: {
          files: {
            '<%= filenames.dist %>': ['browser/index.js']
          }
        },
        browsertests: {
          files: {
            'browser/test/tests.js': '<%= concat.browsertests.dest %>'
          }
        }
      },
      uglify: {
        dist: {
          options: {
            comments: true,
            warnings: false,
            sourceMap: '<%= filenames.sourceMap %>'
          },
          src: '<%= filenames.dist %>',
          dest: '<%= filenames.min %>'
        }
      },
      concat: {
        options: {
          banner: grunt.file.read('browser/comments.js')
        },
        dist: {
          src: ['<%= filenames.dist %>'],
          dest: '<%= filenames.dist %>'
        },
        min: {
          src: ['<%= filenames.min %>'],
          dest: '<%= filenames.min %>'
        },
        browsertests: {
          src: browserTests,
          dest: 'tests/browser.js'
        }
      },
      mochaTest: {
        test: {
          options: {
            reporter: 'dot',
          },
          src: ['./tests/**/*.test.js']
        }
      },
      'regex-replace': {
        browsertests: {
          src: ['<%= concat.browsertests.dest %>'],
          actions: [{
            name: 'bin',
            search: /\.\.\/\.\.\/lib/g,
            replace: '../lib',
            flags: 'g'
          }]
        }
      },
      mocha: {
        test: {
          options: {
            reporter: 'Dot',
            run: true
          },
          src: ['browser/test/index.html']
        }
      }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-regex-replace');

    grunt.registerTask('browser', [
      'browserify',
      'uglify',
      'concat:dist',
      'concat:min'
    ]);
    grunt.registerTask('build', [
      'clean',
      'browser'
    ]);
    grunt.registerTask('default', [
      'build',
      'mochaTest'
    ]);
    grunt.registerTask('test', 'mochaTest');
    grunt.registerTask('test-browser', [
      'concat:browsertests',
      'regex-replace:browsertests',
      'browserify:browsertests',
      'clean:browsertests',
      'mocha'
    ]);
  };
}());