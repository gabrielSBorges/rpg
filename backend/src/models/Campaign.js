const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
	name: { type: String, required: true },
  master: { type: Object, required: true },
  record_sheet_id: { type: mongoose.Types.ObjectId, required: false,  },
  players: { type: Array, required: false },
});

module.exports = mongoose.model('Campaign', CampaignSchema);