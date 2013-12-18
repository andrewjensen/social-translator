/**
 * User model
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var hash = require('../util/hash.js');

var userSchema = new mongoose.Schema({
	name			: {type: String, default: ""},
	email			: {type: String, default: ""},
	photoUrl		: {type: String, default: null},
	nativeLanguage	: {type: ObjectId, ref: 'languages', default: null},
	bio				: {type: String, default: ""},
	score			: {type: Number, default: 0},
	followers		: [{type: ObjectId, ref: 'users'}],
	followingUsers	: [{type: ObjectId, ref: 'users'}],
	followingTags	: [{type: ObjectId, ref: 'tags'}],
	languages		: [{type: ObjectId, ref: 'languages'}],
	questions		: [{type: ObjectId, ref: 'questions'}],
	answers			: [{type: ObjectId, ref: 'answers'}],
	facebook		: {
		id	: {type: Number, default: null}
	},
	accessToken		: {type: String, default: null}
});

userSchema.statics.findOrCreateFaceBookUser = function(profile, done) {
	console.log("DEBUG: findOrCreateFaceBookUser");
	var User = this;
	this.findOne({ 'facebook.id' : profile.id }, function(err, user) {
		if(err) throw err;
		// if (err) return done(err);
		if(user) {
			done(null, user);
		} else {
			User.create({
				email		: profile.emails[0].value,
				name		: profile.displayName,
				photoUrl	: profile.photos[0].value,
				facebook	: {
					id : profile.id
				}
			}, function(err, user) {
				if(err) throw err;
				// if (err) return done(err);
				done(null, user);
			});
		}
	});	
}

userSchema.statics.addAnswer = function(userID, answerID, callbackFunction) {
	//Make sure we have ObjectIds to work with.
	if (typeof(userID) == "string")
		userID = new ObjectId(userID);
	if (typeof(answerID) == "string")
		answerID = new ObjectId(answerID);

	//Push the data.
	this.update({_id : userID}, {$push: {answers: answerID}}, function(err, answerID){

		//Run the callback.
		callbackFunction(err, answerID);
	});
};

module.exports = mongoose.model('users', userSchema);