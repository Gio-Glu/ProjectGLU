var keystone = require('keystone');
var myip = require('quick-local-ip');
var handlebars = require('express-handlebars');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'foo',
    store: new MongoStore(options)
}));

keystone.init({

	'name': 'projectglu',
	'brand': 'glu',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/layouts',
		partialsDir: 'templates/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/helpers')(),
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
	
	"sessionStore": {
		"db": {
		  "name": "myDb",
		  "servers": [
			{ "host": "192.168.1.100", "port": 28001 },
			{ "host": "192.168.1.100", "port": 28002 },
			{ "host": "192.168.1.101", "port": 27017 }
		  ]
		}
	  }
});

keystone.import('models');

keystone.get('session options');


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

