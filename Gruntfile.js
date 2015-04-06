/**
 * Example Grunt Hub
 *
 * Edit the hub.all.src to point to your Gruntfile locations.
 * Then run `grunt`.
 */
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    hub: {
      all: {
        src: ['*/Gruntfile.js'],
        tasks: ['build'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-hub');

  grunt.registerTask('default', ['hub']);
};
