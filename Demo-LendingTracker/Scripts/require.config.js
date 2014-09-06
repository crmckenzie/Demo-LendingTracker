require.config({

  baseUrl: window.baseSiteUrl + 'Scripts',

  paths: {
    "jquery": "jquery-2.1.1.min.js",
    'ko': 'knockout-3.2.0.js',
    "PubSub": '//cdn.jsdelivr.net/pubsubjs/1.4.2/pubsub.min',
  },
  shim: {
    ko: { exports: 'ko' },
    PubSub: { exports: 'PubSub' }
  },

});