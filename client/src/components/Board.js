import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { notify } from 'react-notify-toast';
import {
  addGameMutation,
  addPlayerMutation,
  getLastGameQuery,
  updateGameMutation,
  gameUpdatedSubscription,
} from '../queries/queries';

const color = { background: '#f00', text: '#000' };
let moves;
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      button1Text: 'Waiting for Player1 to join',
      button2Text: 'Waiting for Player2 to join',
      currentGame: null,
      message: 'Waiting for Players to join the game...',
      player1: 'X',
      player2: 'O',
    };
    this.addGame = this.addGame.bind(this);
    this.checkDrawMatch = this.checkDrawMatch.bind(this);
    this.checkColumnMatches = this.checkColumnMatches.bind(this);
    this.checkDiagonalMatches = this.checkDiagonalMatches.bind(this);
    this.checkRowMatches = this.checkRowMatches.bind(this);
    this.onAddPlayer1Click = this.onAddPlayer1Click.bind(this);
    this.onAddPlayer2Click = this.onAddPlayer2Click.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.setupGame = this.setupGame.bind(this);
  }

  componentWillMount() {
    this.addGame();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.gameUpdatedSubscription !== nextProps.gameUpdatedSubscription) {
      nextProps.getLastGameQuery.subscribeToMore({
        document: gameUpdatedSubscription,
        variables: { },
        updateQuery: (prev, { subscriptionData}) => {
          if (!subscriptionData.data) {
            this.setState({
              currentGame: prev,
            });
            this.setupGame(this.state.currentGame);
            return;
          }
          const updatedRecord = subscriptionData.data.gameUpdated;
          this.setState({
            currentGame: updatedRecord,
          });
          this.setupGame(this.state.currentGame);
        },
      });
    }
  }

  async onAddPlayer1Click() {
    if (!this.state.currentGame.player1 && this.state.currentGame.isPending) {
      const p1 = await this.props.addPlayerMutation({
        variables: {
          name: 'Player1',
          gameID: this.state.currentGame.id,
        },
      });
      await this.updateGame(
        this.state.currentGame.id,
        p1.data.addPlayer.id,
        null,
        Array(9).fill(' '),
        false,
        true,
        this.state.currentGame.currentPlayer,
      );
    } else {
      this.setState({
        button1Text: 'Player1 Joined',
      });
    }
  }

  async onAddPlayer2Click() {
    if (!this.state.currentGame.player2 && this.state.currentGame.isPending) {
      const p2 = await this.props.addPlayerMutation({
        variables: {
          name: 'Player2',
          gameID: this.state.currentGame.id,
        },
      });
      await this.updateGame(
        this.state.currentGame.id,
        this.state.currentGame.player1,
        p2.data.addPlayer.id,
        Array(9).fill(' '),
        false,
        true,
        this.state.currentGame.currentPlayer,
      );
    } else {
      this.setState({
        button2Text: 'Player2 Joined',
        message: '',
      });
    }
  }

  async addGame() {
    const addedGame = await this.props.addGameMutation({
      variables: {
        player1: null,
        player2: null,
        moves: Array(9).fill(' '),
        isCompleted: false,
        isPending: true,
        currentPlayer: 1,
      },
    });
    await this.setState({
      currentGame: addedGame.data.addGame,
    });
    this.setupGame(this.state.currentGame);
  }

  async onButtonClick(e) {
    if (this.state.button1Text === 'Waiting for Player1 to join' || this.state.button2Text === 'Waiting for Player2 to join') {
      notify.show('Both Players need to join the game!', 'warning', 1000, color);
    } else
    if (e.target.value === ' ') {
      if (this.state.currentGame.currentPlayer === 1) {
        e.target.value = this.state.player1;
        const { id } = e.target;
        const tempArr = await [...this.state.currentGame.moves];
        tempArr.splice(id, 1, this.state.player1);
        moves = tempArr;
        await this.updateGame(
          this.state.currentGame.id,
          this.state.currentGame.player1,
          this.state.currentGame.player2,
          tempArr,
          this.state.currentGame.isCompleted,
          this.state.currentGame.isPending,
          2,
        );
        const isComplete = this.checkRowMatches(this.state.currentGame.moves, this.state.player1);
        !isComplete && this.checkColumnMatches(this.state.currentGame.moves, this.state.player1);
        !isComplete && this.checkDiagonalMatches(this.state.currentGame.moves, this.state.player1);
        !isComplete && this.checkDrawMatch(this.state.currentGame.moves);
      } else if (this.state.currentGame.currentPlayer === 2) {
        e.target.value = this.state.player2;
        const { id } = e.target;
        const tempArr = await [...this.state.currentGame.moves];
        tempArr.splice(id, 1, this.state.player2);
        moves = tempArr;
        await this.updateGame(
          this.state.currentGame.id,
          this.state.currentGame.player1,
          this.state.currentGame.player2,
          tempArr,
          this.state.currentGame.isCompleted,
          this.state.currentGame.isPending,
          1,
        );
        const isComplete = this.checkRowMatches(this.state.currentGame.moves, this.state.player2);
        !isComplete && this.checkColumnMatches(this.state.currentGame.moves, this.state.player2);
        !isComplete && this.checkDiagonalMatches(this.state.currentGame.moves, this.state.player2);
        !isComplete && this.checkDrawMatch(this.state.currentGame.moves);
      }
    }
    return true;
  }

  checkDrawMatch(moves) {
    let count = 0;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i] === 'X' || moves[i] === 'O') {
        count++;
      }
    }
    if (count === 9) {
      notify.show('Match draw!', 'success', 2000, color);
      this.updateGame(
        this.state.currentGame.id,
        this.state.currentGame.player1,
        this.state.currentGame.player2,
        moves,
        true,
        false,
        this.state.currentGame.currentPlayer,
      )
        .then(() => { this.addGame(); })
        .catch((err) => { console.log(err); });
    }
  }

  checkColumnMatches(moves, move) {
    if (moves[0] === move && moves[3] === move && moves[6] === move) {
      this.resetGame(this.state.currentGame.currentPlayer);
      return true;
    } else if (moves[1] === move && moves[4] === move && moves[7] === move) {
      this.resetGame(this.state.currentGame.currentPlayer);
      return true;
    } else if (moves[2] === move && moves[5] === move && moves[8] === move) {
      this.resetGame(this.state.currentGame.currentPlayer);
      return true;
    }
    return false;
  }

  checkDiagonalMatches(moves, move) {
    if (moves[0] === move && moves[4] === move && moves[8] === move) {
      this.resetGame(this.state.currentGame.currentPlayer);
      return true;
    } else if (moves[2] === move && moves[4] === move && moves[6] === move) {
      this.resetGame(this.state.currentGame.currentPlayer);
      return true;
    }
    return false;
  }

  checkRowMatches(moves, move) {
    if (moves[0] === move && moves[1] === move && moves[2] === move) {
      this.resetGame(this.state.currentGame.currentPlayer);
      return true;
    } else if (moves[3] === move && moves[4] === move && moves[5] === move) {
      this.resetGame(this.state.currentGame.currentPlayer);
      return true;
    } else if (moves[6] === move && moves[7] === move && moves[8] === move) {
      this.resetGame(this.state.currentGame.currentPlayer);
      return true;
    }
    return false;
  }

  async updateGame(id, player1, player2, moves, isCompleted, isPending, currentPlayer) {
    const data = await this.props.updateGameMutation({
      variables: {
        id,
        player1,
        player2,
        moves,
        isCompleted,
        isPending,
        currentPlayer,
      },
    });
    return data;
  }

  async resetGame(currentPlayer) {
    if (currentPlayer === 1) {
      notify.show('Player2 wins!', 'custom', 2000, color);
    } else {
      notify.show('Player1 wins!', 'custom', 2000, color);
    }
    this.updateGame(
      this.state.currentGame.id,
      this.state.currentGame.player1,
      this.state.currentGame.player2,
      moves,
      true,
      false,
      this.state.currentGame.currentPlayer,
    )
      .then(() => { this.addGame(); })
      .catch((err) => { console.log(err); });
  }

  setupGame(currentGame) {
    if (currentGame) {
      if (currentGame.player1) {
        this.setState({
          button1Text: 'Player1 Joined',
        });
      } else {
        this.setState({
          button1Text: 'Waiting for Player1 to join',
        });
      }
      if (currentGame.player2) {
        this.setState({
          button2Text: 'Player2 Joined',
        });
      } else {
        this.setState({
          button2Text: 'Waiting for Player2 to join',
        });
      }
      if (currentGame.player1 && currentGame.player2) {
        this.setState({
          message: '',
        });
      } else {
        this.setState({
          message: 'Waiting for Players to join the game...',
        });
      }
    }
  }

  render() {
    if (!this.state.currentGame) {
      return (
        <div className="container">
          <div className="col-md-4 text-center">
            <h3>Turn: Player1</h3>
            <br />
            <br />
            <input
              className="btn btn-info"
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
              <br />
              <h4>{this.state.message}</h4>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <br />
            <br />
            <br />
            <input
              className="btn btn-info"
              id="addPlayer2"
              type="button"
              onClick={this.onAddPlayer2Click}
              value={this.state.button2Text}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 text-center">
              <h3>Turn: Player{this.state.currentGame.currentPlayer}</h3>
              <br />
              <br />
              <input
                className="btn btn-info"
                id="addPlayer1"
                type="button"
                onClick={this.onAddPlayer1Click}
                value={this.state.button1Text}
              />
            </div>
            <div className="col-lg-4 col-md-6 text-center">
              <div className="btn-group">
                {
                  this.state.currentGame.moves.slice(0, 9).map((move, index) => {
                    return <input id={index} key={index} className="square" type="button" onClick={this.onButtonClick} value={move} />;
                  })
                }
                <br />
                <br />
                <h4>{this.state.message}</h4>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="my-align">
                <br />
                <br />
                <br />
                <input
                  className="btn btn-info"
                  id="addPlayer2"
                  type="button"
                  onClick={this.onAddPlayer2Click}
                  value={this.state.button2Text}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default compose(
  graphql(getLastGameQuery, { name: 'getLastGameQuery' }),
  graphql(addGameMutation, { name: 'addGameMutation' }),
  graphql(addPlayerMutation, { name: 'addPlayerMutation' }),
  graphql(updateGameMutation, { name: 'updateGameMutation' }),
  graphql(gameUpdatedSubscription, { name: 'gameUpdatedSubscription' }),
)(Board);
