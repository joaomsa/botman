module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        concat: {
            dist: {
                src: [
                    "src/main.js",
                    "src/scripts/*"
                ],
                dest: "dist/botman.user.js"
            }
        },

        watch: {
            dist: {
                files: [
                    "src/**/*"
                ],
                tasks: ["concat"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask("default", ["watch"]);
}
