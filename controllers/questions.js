//Load model
var Question = require('../models/question.js');

exports.translationPage = function(req, res) {

	var questionID = req.params.questionID;

	console.log('questionID: ' + questionID);
	
	Question.findOne({_id: questionID}, function(err, question) {
		if (err)
			res.send(err);	//TODO: handle error better
		console.log('hello world');
		console.log(question);

		var pageData = {
			title		: 'Question | Social Translator',
			question	: question
		};
		res.render('question', pageData);

	});

};



/***********************************
 * API Calls */

/**
 * List all questions.
 * TODO: change to something more useful
 */
exports.list = function(req, res) {

	Question.find(function(err, questions) {

		if (err)
			res.send(err)

		res.json(questions);
	});

};
