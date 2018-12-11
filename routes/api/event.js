var keystone = require('keystone');
var Event = keystone.List('Event');
var newEvent = new Event.model(req.body);
module.exports = function (req, res) {
  if (!req.body.name || !req.body.startTime || !req.body.endTime) {
    return res.send({ status: 'incomplete data set' });
  }



};

Event.updateItem(newEvent, req.body, function (error) {
  res.locals.enquirySubmitted = true;
  if (error) res.locals.saveError = true;
  res.render('addEvent');
});