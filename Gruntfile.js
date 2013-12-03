(function () {
  "use strict";

  module.exports = function (grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      tmp: 'tmp',
      filenames: {
        dist: 'dist/swig.js',
        min: 'dist/swig.min.js',
        sourceMap: 'dist/swig.js.map'
      },
      clean: {
        dist: {
          src: ['dist']
        },
        tmp: {
          src: ['<%= tmp %>']
        }
      },
      browserify: {
        dist: {
          files: {
            '<%= filenames.dist %>': ['browser/index.js']
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
        }
      }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mocha');

    grunt.registerTask('browser', ['browserify', 'uglify', 'concat']);
    grunt.registerTask('build', ['clean', 'browser']);

  };
}());