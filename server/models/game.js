const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const gameSchema = new  Schema({
	player1: Schema.Types.ObjectId,
	player2: Schema.Types.ObjectId,
});

module.exports = mongoose.model('Game', gameSchema);