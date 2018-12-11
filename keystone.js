var keystone = require('keystone');

keystone.set('routes', require('./routes'));


keystone.init ({
    'cookie secret': 'secure string goes here',
    'name': 'projectglu',
    'user model': 'User',
    'auto update': true,
    'auth': true,
    views: 'templates/views',
    'view engine': 'pug',
});

keystone.import('models');

keystone.start();