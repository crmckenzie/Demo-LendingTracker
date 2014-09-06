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
        "tests": "/base/Demo-LendingTracker.Tests",
        "jquery": "//code.jquery.com/jquery-2.1.0.min",
        'ko': '//ajax.aspnetcdn.com/ajax/knockout/knockout-3.0.0',
        "PubSub": '//cdn.jsdelivr.net/pubsubjs/1.4.2/pubsub.min',
    },
    shim: {
        ko: { exports: 'ko' },
        PubSub: { exports: 'PubSub' }
    },

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});