const graphql = require('graphql');
const Player = require('../models/player.js');
const Game = require('../models/game.js');
const _ = require('lodash');

const { 
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLInt,
	GraphQLList,
	GraphQLID,
	GraphQLNonNull,
	GraphQLBoolean
	 } = graphql;

const PlayerType = new GraphQLObjectType({
	name: 'Player',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		gameID: { type: GraphQLID },
		// author: {
		// 	type: AuthorType,
		// 	resolve(parent, args){
		// 		return Author.findById(parent.authorID);
		// 	}
		// }	
	})
});

const GameType = new GraphQLObjectType({
	name: 'Game',
	fields: () => ({
		id: { type: GraphQLID },
		player1: { type: GraphQLID },
		player2: { type: GraphQLID },
		completed: { type: GraphQLBoolean },
		moves: { type: new GraphQLList(GraphQLString) }
		// books: {
		// 	type: new GraphQLList(BookType),
		// 	resolve(parent, args){
		// 		return Book.find({ authorID: parent.id});
		// 	}
		// }
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		player: {
			type: PlayerType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args){
				return Player.findById(args.id);
			}
		},
		game: {
			type: GameType,
			args: { id: { type: GraphQLID }},
			resolve(parent, args){
				return Game.findById(args.id);
			}
		},
		players: {
			type: new GraphQLList(PlayerType),
			resolve(parent, args){
				return Player.find({});
			}
		},
		games: {
			type: new GraphQLList(GameType),
			resolve(parent, args){
				return Game.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addPlayer: {
			type: PlayerType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				gameID: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parent, args){
				let player = new Player({
					name: args.name,
					gameID: args.gameID
				});
				return player.save();
			}
		},
		addGame: {
			type: GameType,
			args: {
				player1: { type: GraphQLString },
				player2: { type: GraphQLString },
				completed: { type :GraphQLBoolean },
				moves: { type: new GraphQLList(GraphQLString) }
			},
			resolve(parent, args){
				let game = new Game({
					player1: args.player1,
					player2: args.player2,
					completed: false,
					moves: []
				});
				return game.save();
			}
		},
		updateGame: {
			type: GameType,
			args: {
				id: { type: GraphQLID },
				player1: { type: GraphQLString },
				player2: { type: GraphQLString },
				completed: { type: GraphQLBoolean }
			},
			async resolve(parent, args){
				console.log("game id = " ,args.id);
				console.log("player1 = " ,args.player1);
				console.log("player2 = " ,args.player2);
				console.log("completed = " ,args.completed);
				let game = await Game.findOneAndUpdate({id: args.id}, {player1: args.player1, player2: args.player2, completed: true}, 
					(err) => {
						if (err) { console.log("Error in updating" ,err); }
						console.log("updated record");
					});
				// let game = await Game.findOne({id: args.id});
				// // console.log(game);
				// if (game) { throw new Error(`Could not find game with id ${id}`); }
				// game.player1 = args.player1,
				// game.player2 = args.player2,
				// game.completed = true
				// return game.update();
				console.log(game);
				return game;
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
