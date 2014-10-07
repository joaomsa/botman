module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        concat: {
            dist: {
                src: [
                    "src/Main.js",
                    "src/Botman.js",
                    "src/Message.js",
                    "src/Keyfaker.js",
                    "src/Util.js",
                    "src/scripts/*.js"
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
        },

        shell: {
            installFirefox: {
                command: "firefox dist/botman.user.js"
            },
            installChromium: {
                command: "chromium dist/botman.user.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-shell");
    grunt.registerTask("install:chromium", ["shell:installChromium"]);
    grunt.registerTask("install:firefox", ["shell:installFirefox"]);
    grunt.registerTask("install", ["install:firefox"]);
    grunt.registerTask("default", ["concat"]);
}
