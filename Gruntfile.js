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
    clean:["release/*.zip","cross-reference/zips/*.zip","footnotes/zips/*.zip","image-reference/zips/*.zip","panel-reference/zips/*.zip","table-reference/zips/*.zip"],

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
    },

    compress: {
  main: {
    options: {
      archive: "release/test-doc.zip"
    },
    files: [
      // {src: ["path/*"], dest: "internal_folder/", filter: "isFile"}, // includes files in path
      {flatten:true, src:["testdocs/test-greps.indd","testdocs/test-greps-02.indd"]}, // includes files in path and its subdirs
      // {expand: true, cwd: "path/", src: ["**"], dest: "internal_folder3/"}, // makes all src relative to cwd
      // {flatten: true, src: ["path/**"], dest: "internal_folder4/", filter: "isFile"} // flattens results to a single level
    ]
  }
},
  });


  grunt.registerTask("default", ["clean","hub","copy:main","compress:main"]);
};

