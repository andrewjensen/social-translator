//Load model
var Question	= require('../models/question.js');

/**
 * List all questions.
 * TODO: change to something more useful
 */
exports.list = function(req, res) {

	Question.find(function(err, questions) {

		if (err)
			res.send(err)

		res.json(questions); // return all questions in JSON format
	});

};
