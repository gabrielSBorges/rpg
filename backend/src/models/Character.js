const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  attributes: { type: Object, required: true },
  record_sheet_id: { type: mongoose.Types.ObjectId, required: true },
  user_id: { type: mongoose.Types.ObjectId, required: true },
  campaign_id: { type: mongoose.Types.ObjectId, required: true },
});

module.exports = mongoose.model('Character', CharacterSchema);