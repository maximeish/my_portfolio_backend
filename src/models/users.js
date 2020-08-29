import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userToken: String,
	username: String,
	email: String,
	password: String,
	role: String,
	subscribed: String,
	date_joined: String
});

module.exports = mongoose.model('User', userSchema);