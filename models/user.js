/**
 * User model
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var hash = require('../util/hash.js');

var userSchema = new mongoose.Schema({
	firstName		: String,
	lastName		: String,
	email			: String,
	username		: String,
	salt			: String,
	hash			: String,
	nativeLanguage	: {type: ObjectId, ref: 'languages'},
	bio				: {type: String, default: ""},
	score			: {type: Number, default: 0},
	followers		: [{type: ObjectId, ref: 'users'}],
	followingUsers	: [{type: ObjectId, ref: 'users'}],
	followingTags	: [{type: ObjectId, ref: 'tags'}],
	languages       : [{type: ObjectId, ref: 'languages'}],
	questions		: [{type: ObjectId, ref: 'questions'}],
	answers			: [{type: ObjectId, ref: 'answers'}],
	facebook		: {
		id		: String,
		email	: String,
		name	: String
	}
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
				email : profile.emails[0].value,
				facebook : {
					id:    profile.id,
					email: profile.emails[0].value,
					name:  profile.displayName
				}
			}, function(err, user) {
				if(err) throw err;
				// if (err) return done(err);
				done(null, user);
			});
		}
	});	
}

module.exports = mongoose.model('users', userSchema);