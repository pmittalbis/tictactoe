const graphql = require('graphql');
const Player = require('../models/player.js');
const Game = require('../models/game.js');

const { 
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLInt,
	GraphQLList,
	GraphQLID,
	GraphQLNonNull
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
				player1: { type: new GraphQLNonNull(GraphQLID) },
				player2: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve(parent, args){
				let game = new Game({
					player1: args.player1,
					player2: args.player2
				});
				return game.save();
			}
		},
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
