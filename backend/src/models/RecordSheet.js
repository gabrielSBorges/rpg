const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const RecordSheetSchema = new mongoose.Schema({
	name: { type: String, required: true },
	header: { type: Array, required: true },
	sections: { type: Array, required: true },
	lists: { type: Array, required: true },
	public: { type: Boolean, required: true },
	rules_id: { type: ObjectId, required: false, default: null },
	user_id: { type: ObjectId, required: true }
});

module.exports = mongoose.model('RecordSheet', RecordSheetSchema);