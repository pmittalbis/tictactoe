import Player from '../models/player.js';
import Game from '../models/game.js';
import { PubSub, withFilter } from 'graphql-subscriptions';
const pubsub = new PubSub();
const UPDATED_GAME = 'UPDATED_GAME';
export const resolvers = {
  Query: {
    player: (root, id) => {
      return Player.findById(id);
    },
    players: () => {
      return Player.find({});
    },
    game: (root, { id }) => {
      return Game.findById(id);
    },
    games: () => {
      return Game.find({});
    },
  },

  Mutation: {
    addGame: async (root, args) => {
      let pendingGame = await Game.findOne({ isPending: true }).sort({ '_id': -1 }).limit(1);
      if (pendingGame) {
        console.log("pendingGame",pendingGame);
        pubsub.publish(UPDATED_GAME, {
          gameUpdated: pendingGame
        });
        return pendingGame;
      } else {
        let game = new Game({
          player1: args.player1,
          player2: args.player2,
          isCompleted: false,
          isPending: true,
          moves: args.moves,
          currentPlayer: args.currentPlayer,
        });
        console.log("Game",game);
        pubsub.publish(UPDATED_GAME, {
          gameUpdated: game
        });
        return game.save();
      }
    },
    addPlayer: async (root, args) => {
      let player = new Player({
        name: args.name,
        gameID: args.gameID,
      });
      return player.save();
    },
    updateGame: async (root, args) => {
      let game = await Game.findOneAndUpdate({_id: args.id}, {
        player1: args.player1,
        player2: args.player2,
        moves: args.moves,
        isCompleted: args.isCompleted,
        isPending: args.isPending ,
        currentPlayer: args.currentPlayer,
      }, { new: true });
      pubsub.publish(UPDATED_GAME, {
        gameUpdated: game
      })
      return game;
    },
  },

  Subscription: {
    gameUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(UPDATED_GAME),
        (payload, variables) => {
          //console.log('payload == ', payload);
          return true
        }
      )
    },
  }
};