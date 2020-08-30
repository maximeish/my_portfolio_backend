import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: String,
	body: String,
	author: String,
	comments: [{
		_id: mongoose.Schema.Types.ObjectId,
		username: String,
		user_comment: String,
		date_posted: String,
		likes: Number,
		users_liked: { type : Array , "default" : [] }
	}],
	date_posted: String
});

module.exports = mongoose.model('Post', postSchema);