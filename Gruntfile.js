/**
 * Example Grunt Hub
 *
 * Edit the hub.all.src to point to your Gruntfile locations.
 * Then run `grunt`.
 */
module.exports = function(grunt) {
  "use strict";
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    hub: {
      all: {
        src: ["*/Gruntfile.js"],
        tasks: ["build"],
      },
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            src: ["*/zips/*"],
            dest: "release/",
            filter: "isFile",
            flatten: true,
          }
        ]
      }
    }
  });

  grunt.registerTask("default", ["hub","copy:main"]);
};