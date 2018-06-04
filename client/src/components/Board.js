import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import {
  addGameMutation,
  addPlayerMutation,
  getLastGameQuery,
  updateGameMutation,
} from '../queries/queries';

let addedGame;
let moves;
let p1;
let p2;
let updatedGame1;
let updatedGame2;
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      button1Text: 'Waiting for Player1 to join',
      button2Text: 'Waiting for Player2 to join',
      currentGame: null,
      currentPlayer: 1,
      message: 'Waiting for Players to join the game...',
      player1: 'X',
      player2: 'O',
    };
    this.updateHandler = this.updateHandler.bind(this);
    this.addGame = this.addGame.bind(this);
    this.checkColumnMatches = this.checkColumnMatches.bind(this);
    this.checkDiagonalMatches = this.checkDiagonalMatches.bind(this);
    this.checkRowMatches = this.checkRowMatches.bind(this);
    this.onAddPlayer1Click = this.onAddPlayer1Click.bind(this);
    this.onAddPlayer2Click = this.onAddPlayer2Click.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  componentWillMount() {
    // debugger;
    this.addGame();
  }

  async onAddPlayer1Click() {
    if (!this.state.currentGame.player1 && this.state.currentGame.isPending) {
      p1 = await this.props.addPlayerMutation({
        variables: {
          name: 'Player1',
          gameID: this.state.currentGame.id,
        },
      });
      console.log('Added player1 ', p1.data.addPlayer.id);
      updatedGame1 = await this.updateGame(
        this.state.currentGame.id,
        p1.data.addPlayer.id,
        null,
        Array(9).fill(''),
        false,
        true,
      );
      await this.setState({
        currentGame: updatedGame1.data.updateGame,
        button1Text: 'Player1 Joined',
      });
    } else {
      this.setState({
        button1Text: 'Player1 Joined',
      });
    }
  }

  async onAddPlayer2Click() {
    // debugger;
    if (this.state.button1Text === 'Waiting for Player1 to join') {
      alert('Player1 must join first!!');
    } else
    if (!this.state.currentGame.player2 && this.state.currentGame.isPending) {
      p2 = await this.props.addPlayerMutation({
        variables: {
          name: 'Player2',
          gameID: this.state.currentGame.id,
        },
      });
      console.log('Added player2 ', p2.data.addPlayer.id);
      // debugger;
      updatedGame2 = await this.updateGame(
        this.state.currentGame.id,
        this.state.currentGame.player1,
        p2.data.addPlayer.id,
        Array(9).fill(''),
        false,
        true,
      );
      this.setState({
        currentGame: updatedGame2.data.updateGame,
        button2Text: 'Player2 Joined',
        message: '',
      });
    } else {
      this.setState({
        button2Text: 'Player2 Joined',
        message: '',
      });
    }
  }

  async addGame() {
    addedGame = await this.props.addGameMutation({
      variables: {
        player1: null,
        player2: null,
        moves: Array(9).fill(''),
        isCompleted: false,
        isPending: true,
      },
      refetchQueries: [{ query: getLastGameQuery }],
    });
    await this.setState({
      currentGame: addedGame.data.addGame,
    });
    console.log('Added game...', addedGame.data.addGame);
    console.log('currentGame...', this.state.currentGame);
  }

  async onButtonClick(e) {
    // debugger;
    if (this.state.button1Text === 'Waiting for Player1 to join' || this.state.button2Text === 'Waiting for Player2 to join') {
      alert('Both Players need to join the game!');
    } else
    if (e.target.value === '') {
      if (this.state.currentPlayer === 1) {
        e.target.value = this.state.player1;
        const { id } = e.target;
        const tempArr = await [...this.state.currentGame.moves];
        // debugger;
        tempArr.splice(id, 1, this.state.player1);
        console.log(tempArr);
        moves = tempArr;
        const updated = await this.updateGame(
          this.state.currentGame.id,
          this.state.currentGame.player1,
          this.state.currentGame.player2,
          tempArr,
          this.state.currentGame.isCompleted,
          this.state.currentGame.isPending,
        );
        await this.setState({
          currentGame: updated.data.updateGame,
        });
        let isMatched = this.checkRowMatches(this.state.player1);
        if (isMatched) {
          return this.resetGame();
        }
        isMatched = this.checkColumnMatches(this.state.player1);
        if (isMatched) {
          return this.resetGame();
        }
        isMatched = this.checkDiagonalMatches(this.state.player1);
        if (isMatched) {
          return this.resetGame();
        }
        this.setState({
          currentPlayer: 2,
        });
      } else if (this.state.currentPlayer === 2) {
        e.target.value = this.state.player2;
        const { id } = e.target;
        const tempArr = await [...this.state.currentGame.moves];
        tempArr.splice(id, 1, this.state.player2);
        console.log(tempArr);
        moves = tempArr;
        const updated = await this.updateGame(
          this.state.currentGame.id,
          this.state.currentGame.player1,
          this.state.currentGame.player2,
          tempArr,
          this.state.currentGame.isCompleted,
          this.state.currentGame.isPending,
        );
        this.setState({
          currentGame: updated.data.updateGame,
        });
        console.log('updated>>>>>', updated.data.updateGame);
        let isMatched = this.checkRowMatches(this.state.player2);
        if (isMatched) {
          return this.resetGame();
        }
        isMatched = this.checkColumnMatches(this.state.player2);
        if (isMatched) {
          return this.resetGame();
        }
        isMatched = this.checkDiagonalMatches(this.state.player2);
        if (isMatched) {
          return this.resetGame();
        }
        this.setState({
          currentPlayer: 1,
        });
      }
    }
    return true;
  }

  checkColumnMatches(move) {
    if (moves[0] === move && moves[3] === move && moves[6] === move) {
      alert('Player' + this.state.currentPlayer + ' wins!');
      this.resetGame();
      return true;
    } else if (moves[1] === move && moves[4] === move && moves[7] === move) {
      alert('Player' + this.state.currentPlayer + ' wins!');
      this.resetGame();
      return true;
    } else if (moves[2] === move && moves[5] === move && moves[8] === move) {
      alert('Player' + this.state.currentPlayer + ' wins!');
      this.resetGame();
      return true;
    }
    return false;
  }

  checkDiagonalMatches(move) {
    if (moves[0] === move && moves[4] === move && moves[8] === move) {
      alert('Player' + this.state.currentPlayer + ' wins!');
      this.resetGame();
      return true;
    } else if (moves[2] === move && moves[4] === move && moves[6] === move) {
      alert('Player' + this.state.currentPlayer + ' wins!');
      this.resetGame();
      return true;
    }
    return false;
  }

  checkRowMatches(move) {
    if (moves[0] === move && moves[1] === move && moves[2] === move) {
      alert('Player' + this.state.currentPlayer + ' wins!');
      this.resetGame();
      return true;
    } else if (moves[3] === move && moves[4] === move && moves[5] === move) {
      alert('Player' + this.state.currentPlayer + ' wins!');
      this.resetGame();
      return true;
    } else if (moves[6] === move && moves[7] === move && moves[8] === move) {
      alert('Player' + this.state.currentPlayer + ' wins!');
      this.resetGame();
      return true;
    }
    return false;
  }
  async updateGame(id, player1, player2, moves, isCompleted, isPending) {
    const data = await this.props.updateGameMutation({
      variables: {
        id,
        player1,
        player2,
        moves,
        isCompleted,
        isPending,
      },
      refetchQueries: [{ query: getLastGameQuery }],
    });
    console.log('updatedGame========', data.data);
    return data;
  }

  resetGame() {
    console.log(moves);
    this.props.updateGameMutation({
      variables: {
        id: this.state.currentGame.id,
        player1: this.state.currentGame.player1,
        player2: this.state.currentGame.player2,
        moves,
        isCompleted: true,
        isPending: false,
      },
    });
    window.location.reload();
  }

  render() {
    // debugger;
    const player = 'Player' + this.state.currentPlayer;
    return (
      <div>
        <div className="col-md-4">
          <h3>Turn: {player}</h3>
          <input
            id="addPlayer1"
            type="button"
            onClick={this.onAddPlayer1Click}
            value={this.state.button1Text}
          />
        </div>
        <div className="col-md-4">
          <div className="btn-group">
            <input id="0" className="square" type="button" onClick={this.onButtonClick} />
            <input id="1" className="square" type="button" onClick={this.onButtonClick} />
            <input id="2" className="square" type="button" onClick={this.onButtonClick} />
          </div>
          <div className="">
            <input id="3" className="square" type="button" onClick={this.onButtonClick} />
            <input id="4" className="square" type="button" onClick={this.onButtonClick} />
            <input id="5" className="square" type="button" onClick={this.onButtonClick} />
          </div>
          <div className="">
            <input id="6" className="square" type="button" onClick={this.onButtonClick} />
            <input id="7" className="square" type="button" onClick={this.onButtonClick} />
            <input id="8" className="square" type="button" onClick={this.onButtonClick} />
            <br />
            <h5>{this.state.message}</h5>
          </div>
        </div>
        <br />
        <br />
        <br />
        <input
          id="addPlayer2"
          type="button"
          onClick={this.onAddPlayer2Click}
          value={this.state.button2Text}
        />
        <div className="col-md-4" />
      </div>
    );
  }
}

export default compose(
  graphql(getLastGameQuery, { name: 'getLastGameQuery' }),
  graphql(addGameMutation, { name: 'addGameMutation' }),
  graphql(addPlayerMutation, { name: 'addPlayerMutation' }),
  graphql(updateGameMutation, { name: 'updateGameMutation' }),
)(Board);
