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
    games: {
      type: GameType,
      resolve(parent, args){
        return Game.findById(parent.gameID);
      }
    }
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
      }
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
        player1: { type: GraphQLID },
        player2: { type: GraphQLID },
        isCompleted: { type :GraphQLBoolean },
        isPending: { type :GraphQLBoolean },
        moves: { type: new GraphQLList(GraphQLString) }
      },
      resolve(parent, args){
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
        // console.log("game id = " ,args.id);
        // console.log("player1 = " ,args.player1);
        // console.log("player2 = " ,args.player2);
        // console.log("isCompleted = " ,args.isCompleted);
        let game = await Game.findOneAndUpdate({_id: args.id}, {
          player1: args.player1,
          player2: args.player2,
          isCompleted: args.isCompleted,
          isPending: args.isPending 
        }, 
          (err) => {
            if (err) { console.log("Error in updating" , err); }
            console.log("updated games record");
          });
        return game;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
