//Load model
var Tag = require('../models/tag.js');

/**
 * List all tags.
 * TODO: Change to something useful.
 */
 exports.list = function(req, res) {

 	Tag.find(function(err, tags) {

 		if (err)
 			res.send(err)

 		res.json(tags); // return all tags in JSON format
 	});
 };
