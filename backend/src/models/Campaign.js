const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
	name: { type: String, required: true },
  players: { type: Array, required: false },
  record_sheet_id: { type: mongoose.Types.ObjectId, required: false,  },
  master_id: { type: mongoose.Types.ObjectId, required: true },
  masterData: { type: Object, required: true },
});

module.exports = mongoose.model('Campaign', CampaignSchema);