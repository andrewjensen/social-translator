//Load model
var Answer	= require('../models/answer.js');

/**
 * List all answers.
 * TODO: change to something more useful
 */
exports.list = function(req, res) {

	Answer.find(function(err, answers) {

		if (err)
			res.send(err)

		res.json(answers); // return all answers in JSON format
	});

};
