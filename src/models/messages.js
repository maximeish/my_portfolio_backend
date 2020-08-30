import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	names: String,
	email: String,
	telephone: String,
	message: String,
	date_sent: String
});

module.exports = mongoose.model('Message', messageSchema);