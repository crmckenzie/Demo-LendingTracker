<link href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">

# Configuring Your Environment For The First Time

I use Windows so these instructions are for windows developers

1. Install Node

    <code>
        cinst nodejs.install
    </code>

    <div class="well">
        Node is the tooling that allows you to run javascript code outside the browser.
    </div>

2. Install NPM

    <code>
        cinst npm
    </code>

    <div class="well">
        <p>
            For .NET developers, npm can be thought of as the Node-equivalent of nuget. Node javascript libraries are shared using npm.
        </p>
        <p>
            You may have to restart your console program for these changes to take effect.
        </p>
    </div>

3. Install the grunt command-line interface.

    <code>
        npm install -g grunt-cli
    </code>

    <div class="well">
        Grunt is a task runner (think Ant, Nant, or rake) for Node packages. The -g argument installs grunt globally (as against locally in your project). We're going to use grunt to execute our unit tests.
    </div>

4. Create a default grunt profile.

    <code>
        
        npm install -g grunt-init

        $path = [System.IO.Path]::Combine($env:UserProfile, ".grunt-init/gruntfile")

        git clone https://github.com/gruntjs/grunt-init-gruntfile.git $path

    </code>

    <div class="well">
        This part is a bit janky. Basically it just installs default configuration for grunt into your user's home directory on Windows.
    </div>


# Project Configuration

1. In your solution root

    <code>
    npm init
    </code>

    <div class="well">
        Just accept the default options. Since we are not publishing a node library none of the this meta-data really matters. We just need npm to recognize the solution as a node application.
    </div>

2. Edit your .gitignore

    <code>

        # Logs logs *.log

        # Runtime data

        pids
        *.pid
        *.seed

        # Directory for instrumented libs generated by jscoverage/JSCover
        lib-cov

        # Coverage directory used by tools like istanbul
        coverage

        # Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
        .grunt

        # Compiled binary addons (http://nodejs.org/api/addons.html)
        build/Release

        # Dependency directory
        # Deployed apps should consider commenting this line out:
        # see https://npmjs.org/doc/faq.html#Should-I-check-my-node_modules-folder-into-git
        node_modules
    </code>

3. Configure the project for grunt

    <code>
        npm install grunt-init
    </code>

    <div class="well">
        <p>Is the DOM involved in ANY way? Answer yes.</p>
        <p>Answer as you see fit to the rest of the questions.</p>
    </div>

4. Install karma

    <code>
        
        npm install karma --save-dev     

        npm install -g karma-cli   

    </code>


    <div class="well">
        Karma is a unit test runner and reporting engine.
    </div>

5. Initialize karma

    <code>
        karma init
    </code>

    <div class="well">
    <p>
    Which testing framework do you want to use ?
    Press tab to list possible options. Enter to move to the next question.
    </p>
    <p>
    jasmine
    </p>
    <p>
    Do you want to use Require.js ?
    This will add Require.js plugin.
    Press tab to list possible options. Enter to move to the next question.
    </p>
    <p>
    yes
    </p>
    <p>
    Do you want to capture any browsers automatically ?
    Press tab to list possible options. Enter empty string to move to the next quest
    </p>
    <p>
    Chrome
    </p>
    <p>
    PhantomJS
    </p>
    <p>
    What is the location of your source and test files ?
    You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
    Enter empty string to move to the next question.
    </p>
    <p>
    Should any of the files included by the previous patterns be excluded ?
    You can use glob patterns, eg. "**/*.swp".
    Enter empty string to move to the next question.
    </p>
    <p>
    Do you wanna generate a bootstrap file for RequireJS?
    This will generate test-main.js/coffee that configures RequireJS and starts the
    </p>
    <p>
    yes
    </p>
    <p>
    Do you want Karma to watch all the files and run the tests on change ?
    Press tab to list possible options.
    </p>
    <p>
    yes    
    </p>
    </div>

6. Edit karma.conf

    <code>

        // list of files / patterns to load in the browser
        files: [
          'test-main.js',
          { pattern: 'Demo-LendingTracker.Tests/**/*.js', included: false },
          { pattern: 'Demo-LendingTracker/Scripts/app/**/*.js', included: false}
        ],


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


    </code>

    <div class="well">
        You can verify that your default karma configuration is correct by running karma start.
        If you start adding files to the monitored js folders karma should detect the changes.

        It's important to specify included: false on the js files since we are going to load them
        using requirejs.
    </div>

7. Edit test-main.js

    <code>

        var allTestFiles = [];
        var TEST_REGEXP = /(spec|tests)\.js$/i;

        var pathToModule = function (path) {
            return path;
            return path.replace(/^\/base\//, '').replace(/\.js$/, '');
        };

        Object.keys(window.__karma__.files).forEach(function (file) {
            if (TEST_REGEXP.test(file)) {
                // Normalize paths to RequireJS module names.
                allTestFiles.push(pathToModule(file));
            }
        });

        require.config({
            // Karma serves files under /base, which is the basePath from your config file
            baseUrl: '/base/Demo-LendingTracker/Scripts',

            // dynamically load all test files
            deps: allTestFiles,

            paths: {
                "bootstrap": 'bootstrap',
                "tests": "/base/Demo-LendingTracker.Tests",
                "jquery": "jquery-2.1.1",
                'ko': 'knockout-3.2.0',
                "PubSub": '//cdn.jsdelivr.net/pubsubjs/1.4.2/pubsub.min'
            },
            shim: {
                bootstrap: ["jquery"],
                ko: { exports: 'ko' },
                PubSub: { exports: 'PubSub' }
            },

            // we have to kickoff jasmine, as it is asynchronous
            callback: window.__karma__.start
        });
    </code>

8. Install grunt-karma

    <code>
         npm install grunt-karma --save-dev
    </code>

9. Edit the grunt file

    <code>

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


    </code>

10. Add the karma task to the gruntfile beneath the jshint task

    <code>

        karma: {
                    unit: {
                        configFile: "karma.conf.js",
                        singleRun: true,
                        autoWatch:false,
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
    </code>


11. Our Grunt watch task has some dependencies, so we need to make sure everything is installed.

    <code>

        npm install

    </code>

12. At this point you should be able to watch your js files for changes and get real-time feedback via grunt.

    <code>

        grunt
    </code>