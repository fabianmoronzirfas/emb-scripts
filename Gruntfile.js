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
    clean:["cross-reference/zips/*.zip","footnotes/zips/*.zip","image-reference/zips/*.zip","panel-reference/zips/*.zip","table-reference/zips/*.zip"],

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

  grunt.registerTask("default", ["clean","hub","copy:main"]);
};

