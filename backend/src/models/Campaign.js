const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const CampaignSchema = new mongoose.Schema({
	name: { type: String, required: true },
  master: { type: Object, required: true },
  record_sheet_id: { type: ObjectId, required: false, default: null },
  players: { type: Array, required: false, default: [] },
});

module.exports = mongoose.model('Campaign', CampaignSchema);