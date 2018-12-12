var keystone = require('keystone');
var Types = keystone.Field.Types;

var User = new keystone.List('User', {

	nodelete: true,
});

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true, unique: true },
	phone: { type: String, width: 'short' },
	photo: { type: Types.CloudinaryImage, collapse: true },
	password: { type: Types.Password, initial: true, required: false },
}, 'Permissions', {
	isProtected: { type: Boolean, noedit: true, hidden: true },
});


User.schema.virtual('canAccessKeystone').get(function () {
	return true;
});

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

User.schema.methods.wasActive = function () {
	this.lastActiveOn = new Date();
	return this;
}


function protect (path) {
	var user = this;
	User.schema.path(path).set(function (value) {
		return (user.isProtected) ? user.get(path) : value;
	});
}

['name.first', 'name.last', 'email'].forEach(protect);

User.schema.path('password').set(function (value) {
	return (this.isProtected) ? '$2a$10$b4vkksMQaQwKKlSQSfxRwO/9JI7Fclw6SKMv92qfaNJB9PlclaONK' : value;
});



User.track = true;
User.defaultColumns = 'name, email, phone, photo';
User.register();