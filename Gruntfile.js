/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
            jQuery: true,

            ko: true,
            describe: true,
            it: true,
            define: true,
            beforeEach: true,
            expect: true,
            alert: true,
            spyOn: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
          src: [
              'Demo-LendingTracker/Scripts/app/**/*.js',
              'Demo-LendingTracker.Tests/**/*.js'
          ]
      }
    },
    karma: {
        unit: {
            configFile: "karma.conf.js",
            singleRun: true,
            autoWatch: false,
            browsers: ['PhantomJS']
        },
        teamcity: {
            configFile: "karma.conf.js",
            singleRun: true,
            browsers: ['PhantomJS'],
            reporters: ['progress', 'teamcity']
        },
        ci: {
            configFile: "karma.conf.js",
            autoWatch: true
        },
        debug: {
            configFile: "karma.conf.js",
            autoWatch: true,
            browsers: ['PhantomJS', 'Chrome']
        }
    },
    watch: {
        karma: {
            files: [
                'Demo-LendingTracker/Scripts/app/**/*.js',
                'Demo-LendingTracker.Tests/**/*js'
            ],
            tasks: ['karma:unit']
        },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      jshint: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  // Default task.
  grunt.registerTask('default', ['watch']);

};
