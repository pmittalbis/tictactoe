const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new  Schema({
  name: String,
  gameID: Schema.Types.ObjectId,
});

module.exports = mongoose.model('Player', playerSchema);
