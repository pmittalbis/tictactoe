const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const gameSchema = new  Schema({
	player1: String,
	player2: String,
	completed: Boolean,
	moves: [String]
});

module.exports = mongoose.model('Game', gameSchema);