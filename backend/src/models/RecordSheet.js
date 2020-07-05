const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const RecordSheetSchema = new mongoose.Schema({
	name: { type: String, required: true },
	sections: { type: Array, required: true },
	public: { type: Boolean, required: true },
	user_id: { type: ObjectId, required: true }
});

module.exports = mongoose.model('RecordSheet', RecordSheetSchema);