var keystone = require('keystone');
var importRoutes = keystone.importer(__dirname);

var routes = {
  views: importRoutes('./views'),
  api: importRoutes('./api'),
};

exports = module.exports = function (app) {
  app.get('/', routes.views.index)
};

exports = module.exports = function (app) {
    app.get('/', routes.views.index)
    app.get('/add-event', routes.views.addEvent)
    app.post('/api/event', routes.api.event.post);
  };

  module.exports = function (req, res) {
    if (!req.body.name || !req.body.startTime || !req.body.endTime) {
        return res.sendError('incomplete data set');
      }
};