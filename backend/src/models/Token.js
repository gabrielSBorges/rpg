const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const TokenSchema = new mongoose.Schema({
	token: { type: String, required: true },
	user_id: { type: ObjectId, required: true}
});

module.exports = mongoose.model('Token', TokenSchema);