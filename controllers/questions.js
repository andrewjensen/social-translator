//Load model
var Question	= require('../models/question.js');

exports.translationPage = function(req, res) {

	var questionID = req.params.questionID;

	//TODO: plug into the MongoDB for this
	var question = {
		questionID	: questionID
	};

	var pageData = {
		title		: 'Question | Social Translator',
		question	: question
	};
	res.render('question', pageData);

};


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
