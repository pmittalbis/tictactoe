import { gql } from 'apollo-boost';

const getGameQuery = gql`
  query($id: ID!){
    game(id: $id){
      id
      player1
      player2
      moves
      isCompleted
      isPending
      currentPlayer
      players {
        id
        name
        gameID
      }
    }
  }
`;

const getLastGameQuery = gql`
  query{
    lastGame{
      id
      player1
      player2
      moves
      isCompleted
      isPending
      currentPlayer
      players {
        id
        name
        gameID
      }
    }
  }
`;

const getPlayerQuery = gql`
  query($id: ID!){
    player(id: $id){
      id
      name
      gameID
      games {
        id
        player1
        player2
        moves
        isCompleted
        isPending
        currentPlayer
      }
    }
  }
`;

const getGamesQuery = gql`
  query{
    games{
      id
      player1
      player2
      moves
      isCompleted
      isPending
      currentPlayer
      players {
        id
        name
        gameID
      }
    }
  }
`;

const getPlayersQuery = gql`
  query{
    players{
      id
      name
      gameID
      games {
        id
        player1
        player2
        moves
        isCompleted
        isPending
        currentPlayer
      }
    }
  }
`;

const addGameMutation = gql`
  mutation($player1: ID, $player2: ID, $isCompleted: Boolean, $moves: [String], $isPending: Boolean, $currentPlayer: Int) {
    addGame(player1: $player1, player2: $player2, isCompleted: $isCompleted, moves: $moves, isPending: $isPending, currentPlayer: $currentPlayer){
      id
      player1
      player2
      moves
      isCompleted
      isPending
      currentPlayer
    }
  }
`;

const updateGameMutation = gql`
  mutation($id: ID!, $player1: ID, $player2: ID, $isCompleted: Boolean, $moves: [String], $isPending: Boolean, $currentPlayer: Int) {
    updateGame(id: $id, player1: $player1, player2: $player2, isCompleted: $isCompleted, moves: $moves, isPending: $isPending, currentPlayer: $currentPlayer){
      id
      player1
      player2
      moves
      isCompleted
      isPending
      currentPlayer
    }
  }
`;

const addPlayerMutation = gql`
  mutation($name: String!, $gameID: ID!) {
    addPlayer(name: $name, gameID: $gameID){
      id
      name
      gameID
    }
  }
`;

const gameUpdatedSubscription = gql`
  subscription {
    gameUpdated { 
      id
      player1
      player2
      moves
      isCompleted
      isPending
      currentPlayer
    }
  }
`;

export {
  getGamesQuery,
  getPlayersQuery,
  getGameQuery,
  getPlayerQuery,
  addGameMutation,
  addPlayerMutation,
  updateGameMutation,
  getLastGameQuery,
  gameUpdatedSubscription,
};
