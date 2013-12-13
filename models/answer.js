/**
 * Answer model
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var commentSchema = new mongoose.Schema({ text: String, timestamp: String, userID: {type: ObjectId, ref: 'users'} }, { noId: true });
var answerSchema = new mongoose.Schema({
	translation 	: String,
	supplementary	: String,
	upvotes			: Number,
	downvotes		: Number,
	timestamp   	: String,
	comments		: [commentSchema]
});

module.exports = mongoose.model('answers', answerSchema);
