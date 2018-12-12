var moment = require('moment');
var _ = require('underscore');
var hbs = require('handlebars');
var keystone = require('keystone');
var cloudinary = require('cloudinary');


var linkTemplate = _.template('<a href="<%= url %>"><%= text %></a>');
var scriptTemplate = _.template('<script src="<%= src %>"></script>');
var cssLinkTemplate = _.template('<link href="<%= href %>" rel="stylesheet">');

module.exports = function () {

	var _helpers = {};

	_helpers.ifeq = function (a, b, options) {
		if (a == b) { 
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	};



	_helpers.date = function (context, options) {
		if (!options && context.hasOwnProperty('hash')) {
			options = context;
			context = undefined;

			if (this.publishedDate) {
				context = this.publishedDate;
			}
		}

		
		context = context === null ? undefined : context;

		var f = options.hash.format || 'MMM Do, YYYY';
		var timeago = options.hash.timeago;
		var date;

		
		if (timeago) {
			date = moment(context).fromNow();
		} else {
			date = moment(context).format(f);
		}
		return date;
	};


	_helpers.categoryList = function (categories, options) {
		var autolink = _.isString(options.hash.autolink) && options.hash.autolink === 'false' ? false : true;
		var separator = _.isString(options.hash.separator) ? options.hash.separator : ', ';
		var prefix = _.isString(options.hash.prefix) ? options.hash.prefix : '';
		var suffix = _.isString(options.hash.suffix) ? options.hash.suffix : '';
		var output = '';

		function createTagList (tags) {
			var tagNames = _.pluck(tags, 'name');

			if (autolink) {
				return _.map(tags, function (tag) {
					return linkTemplate({
						url: ('/blog/' + tag.key),
						text: _.escape(tag.name),
					});
				}).join(separator);
			}
			return _.escape(tagNames.join(separator));
		}

		if (categories && categories.length) {
			output = prefix + createTagList(categories) + suffix;
		}
		return new hbs.SafeString(output);
	};


	_helpers.isAdminEditorCSS = function (user, options) {
		var output = '';
		if (typeof (user) !== 'undefined' && user.isAdmin) {
			output = cssLinkTemplate({
				href: '/keystone/styles/content/editor.min.css',
			});
		}
		return new hbs.SafeString(output);
	};


	_helpers.isAdminEditorJS = function (user, options) {
		var output = '';
		if (typeof (user) !== 'undefined' && user.isAdmin) {
			output = scriptTemplate({
				src: '/keystone/js/content/editor.js',
			});
		}
		return new hbs.SafeString(output);
	};

	_helpers.adminEditableUrl = function (user, options) {
		var rtn = keystone.app.locals.editable(user, {
			list: 'Post',
			id: options,
		});
		return rtn;
	};


	_helpers.cloudinaryUrl = function (context, options) {

	
		if (!options && context.hasOwnProperty('hash')) {
		
			options = context;
		
			context = this;
		}

	
		context = context === null ? undefined : context;

		if ((context) && (context.public_id)) {
			options.hash.secure = keystone.get('cloudinary secure') || false;
			var imageName = context.public_id.concat('.', context.format);
			return cloudinary.url(imageName, options.hash);
		}
		else {
			return null;
		}
	};

	_helpers.postUrl = function (postSlug, options) {
		return ('/blog/post/' + postSlug);
	};

	_helpers.pageUrl = function (pageNumber, options) {
		return '/blog?page=' + pageNumber;
	};

	
	_helpers.categoryUrl = function (categorySlug, options) {
		return ('/blog/' + categorySlug);
	};

	
	_helpers.ifHasPagination = function (postContext, options) {

		if (_.isUndefined(postContext)) {
			return options.inverse(this);
		}
		if (postContext.next || postContext.previous) {
			return options.fn(this);
		}
		return options.inverse(this);
	};

	_helpers.paginationNavigation = function (pages, currentPage, totalPages, options) {
		var html = '';

		_.each(pages, function (page, ctr) {
			
			var pageText = page;
			
			var isActivePage = ((page === currentPage) ? true : false);
			
			var liClass = ((isActivePage) ? ' class="active"' : '');

			
			if (page === '...') {
				
				page = ((ctr) ? totalPages : 1);
			}

			var pageUrl = _helpers.pageUrl(page);
		
			html += '<li' + liClass + '>' + linkTemplate({ url: pageUrl, text: pageText }) + '</li>\n';
		});
		return html;
	};

	_helpers.paginationPreviousUrl = function (previousPage, totalPages) {
		if (previousPage === false) {
			previousPage = 1;
		}
		return _helpers.pageUrl(previousPage);
	};

	
	_helpers.paginationNextUrl = function (nextPage, totalPages) {
		if (nextPage === false) {
			nextPage = totalPages;
		}
		return _helpers.pageUrl(nextPage);
	};



	_helpers.flashMessages = function (messages) {
		var output = '';
		for (var i = 0; i < messages.length; i++) {

			if (messages[i].title) {
				output += '<h4>' + messages[i].title + '</h4>';
			}

			if (messages[i].detail) {
				output += '<p>' + messages[i].detail + '</p>';
			}

			if (messages[i].list) {
				output += '<ul>';
				for (var ctr = 0; ctr < messages[i].list.length; ctr++) {
					output += '<li>' + messages[i].list[ctr] + '</li>';
				}
				output += '</ul>';
			}
		}
		return new hbs.SafeString(output);
	};


	
	_helpers.underscoreFormat = function (obj, underscoreMethod) {
		return obj._[underscoreMethod].format();
	};

	return _helpers;
};