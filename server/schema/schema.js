const graphql = require('graphql');
const Player = require('../models/player.js');
const Game = require('../models/game.js');
const { PubSub } = 'graphql-subscriptions';
const { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const pubsub = new PubSub();
const UPDATED_GAME = 'updateGame';

const PlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    gameID: { type: GraphQLID },
    games: {
      type: GameType,
      resolve(parent, args){
        return Game.findById(parent.gameID);
      },
    },
  })
});

const GameType = new GraphQLObjectType({
  name: 'Game',
  fields: () => ({
    id: { type: GraphQLID },
    player1: { type: GraphQLID },
    player2: { type: GraphQLID },
    isCompleted: { type: GraphQLBoolean },
    isPending: { type: GraphQLBoolean },
    moves: { type: new GraphQLList(GraphQLString) },
    players: {
      type: new GraphQLList(PlayerType),
      resolve(parent, args){
        return Player.find({ gameID: parent.id});
      },
    }
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
      },
    },
    game: {
      type: GameType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args){
        return Game.findById(args.id);
      },
    },
    players: {
      type: new GraphQLList(PlayerType),
      resolve(parent, args){
        return Player.find({});
      },
    },
    games: {
      type: new GraphQLList(GameType),
      resolve(parent, args){
        return Game.find({});
      },
    },
    lastGame: {
      type: GameType,
      async resolve(parent, args){
        let lastGame = await Game.findOne().sort({ '_id': -1 }).limit(1);
        return lastGame;
      },
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
      resolve(parent, args) {
        let player = new Player({
          name: args.name,
          gameID: args.gameID
        });
        return player.save();
      },
    },
    addGame: {
      type: GameType,
      args: {
        player1: { type: GraphQLID },
        player2: { type: GraphQLID },
        isCompleted: { type :GraphQLBoolean },
        isPending: { type :GraphQLBoolean },
        moves: { type: new GraphQLList(GraphQLString) }
      },
      async resolve(parent, args){
        let pendingGame = await Game.findOne({ isPending: true }).sort({ '_id': -1 }).limit(1);
        if (pendingGame) {
          return pendingGame;
        } else {
          let game = new Game({
            player1: args.player1,
            player2: args.player2,
            isCompleted: false,
            isPending: true,
            moves: args.moves
          });
          return game.save();
        }
      },
    },
    updateGame: {
      type: GameType,
      args: {
        id: { type: GraphQLID },
        player1: { type: GraphQLID },
        player2: { type: GraphQLID },
        moves: { type: new GraphQLList(GraphQLString) },
        isCompleted: { type: GraphQLBoolean },
        isPending: { type: GraphQLBoolean },
      },
      async resolve(parent, args){
        let game = await Game.findOneAndUpdate({_id: args.id}, {
          player1: args.player1,
          player2: args.player2,
          moves: args.moves,
          isCompleted: args.isCompleted,
          isPending: args.isPending 
        }, { new: true });
        return game;
      },
    }
  }
});

const Subscription = new GraphQLObjectType({
  name: "Subscription",
  fields: {
    gameUpdated: {
      type: Game,
      subscribe: () => pubsub.asyncIterator(UPDATED_GAME)
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
  // subscription: Subscription,
});
