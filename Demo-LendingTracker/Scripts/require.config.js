require.config({

  baseUrl: 'Scripts',

  paths: {
      "jquery": "jquery-2.1.1.min",
      'bootstrap': 'bootstrap.min',
    'ko': 'knockout-3.2.0',
    "PubSub": '//cdn.jsdelivr.net/pubsubjs/1.4.2/pubsub.min',
  },
  shim: {
      bootstrap: ['jquery'],
    ko: { exports: 'ko' },
    PubSub: { exports: 'PubSub' }
  },

  deps: ["jquery", "ko", "PubSub", 'bootstrap' ],
});