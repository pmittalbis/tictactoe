import Player from '../models/player.js';
import Game from '../models/game.js';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `
  type GameType {
    id: ID!,
    player1: ID,
    player2: ID,
    isCompleted: Boolean,
    isPending: Boolean,
    moves: [String],
    players: [PlayerType],
    currentPlayer: Int,
  }

  type PlayerType {
    id: ID!,
    name: String,
    gameID: ID,
    games: GameType,
  }

  type Query {
    game(id: ID!): GameType
    games: [GameType]
    player(id: ID!): PlayerType 
    players: [PlayerType]
    lastGame: GameType
  }

  type Mutation {
    addGame(player1: ID, player2: ID, isCompleted: Boolean, isPending: Boolean, moves: [String], currentPlayer: Int): GameType
    addPlayer(name: String, gameID: ID): PlayerType
    updateGame(id: ID!, player1: ID, player2: ID, isCompleted: Boolean, isPending: Boolean, moves: [String], currentPlayer: Int): GameType
  }

  type Subscription {
    gameUpdated: GameType
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
