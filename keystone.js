var keystone = require('keystone');;
var handlebars = require('express-handlebars');
var Path = require("path");
var mongodb = require ('mongodb');

var MongoClient = mongodb.MongoClient;

var url = process.env.MONGODB_URI;

MongoClient.connect(url, function (err,db) {
	if(err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	}else {
		console.log('Connection established to', url);

		db.close();
	}
});
keystone.init({

	'name': 'projectglu',
	'brand': 'glu',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'hbs',

	'custom engine': handlebars.create({
		layoutsDir: Path.join(templates,'layouts'),
		partialsDir: Path.join(templates,'partials'),
		defaultLayout: 'default',
		helpers: new require(Path.join(templates,'helpers'))(),
		extname: '.hbs',
	}).engine,

	'auto update': true,
	'mongo': process.env.MONGODB_URI,
	'cloudinary config': process.env.CLOUDINARY_URL,

	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'demo',

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,

	'chartbeat property': process.env.CHARTBEAT_PROPERTY,
	'chartbeat domain': process.env.CHARTBEAT_DOMAIN,



});

keystone.import('models');




keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
	chartbeat_property: keystone.get('chartbeat property'),
	chartbeat_domain: keystone.get('chartbeat domain')
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'posts': ['posts', 'post-comments', 'post-categories'],
	'galleries': 'galleries',
	'enquiries': 'enquiries',
	'users': 'users',
	'field-tests': 'things'
});

keystone.start();

