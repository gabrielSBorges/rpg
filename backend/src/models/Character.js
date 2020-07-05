const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
	sections: { type: Array, required: true },
  user_id: { type: mongoose.Types.ObjectId, required: true },
  campaign_id: { type: mongoose.Types.ObjectId, required: true },
});

module.exports = mongoose.model('Character', CharacterSchema);