import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import {
  addGameMutation,
  addPlayerMutation,
  updateGameMutation,
  getLastGameQuery,
} from '../queries/queries';

let addedGame;
let p1;
let p2;
let updatedGame1;
let updatedGame2;
let temp;

// eslint-disable-next-line prefer-stateless-function
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player1: 'X',
      player2: 'O',
      currentPlayer: 1,
      games: null,
      currentGame: null,
    };
    this.addPlayers = this.addPlayers.bind(this);
    this.addGame = this.addGame.bind(this);
    this.getGames = this.getGames.bind(this);
    this.checkRowMatches = this.checkRowMatches.bind(this);
    this.checkColumnMatches = this.checkColumnMatches.bind(this);
    this.checkDiagonalMatches = this.checkDiagonalMatches.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentWillMount() {
    debugger;
    this.addGame();
    // this.getGames();
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props);
    debugger;
    console.log('"in receive propss=====', this.state.currentGame);
    if (this.props !== nextProps) {
      if (!this.state.currentGame.player1 || !this.state.currentGame.player1) {
        this.addPlayers(nextProps);
      }
    }
  }

  // UNSAFE_componentWillUpdate(nextProps, nextState) {
  //   console.log("in will update=1=======", this.state);
  //   console.log("in will update==2======", nextState);
  // }
  async addPlayers() {
    if (this.state.currentGame) {
      // const pendingGame = await _.filter(this.state.games, { 'id': addedGame.data.addGame.id, 'isPending': true });
      // this.setState({
      //   currentGame: pendingGame[0]
      // });
      console.log('currentGame ', this.state.currentGame);
      // console.log('pendingGame = ', pendingGame);
      if (!this.state.currentGame.player1 && this.state.currentGame.isPending) {
        p1 = await this.props.addPlayerMutation({
          variables: {
            name: 'Player1',
            gameID: this.state.currentGame.id,
          },
        });
        console.log('Added player1 ', p1.data.addPlayer.id);
        updatedGame1 = await this.props.updateGameMutation({
          variables: {
            id: this.state.currentGame.id,
            player1: p1.data.addPlayer.id,
            player2: null,
            moves: Array(9).fill(''),
            isCompleted: false,
            isPending: true,
          },
        });
        console.log('updatedGame1========', updatedGame1);
        await this.setState({
          currentGame: updatedGame1.data.updateGame,
        });
        console.log('updating game with player1 id', p1.data.addPlayer.id);
      } else if (!this.state.currentGame.player2 && this.state.currentGame.isPending) {
        p2 = await this.props.addPlayerMutation({
          variables: {
            name: 'Player2',
            gameID: this.state.currentGame.id,
          },
        });
        console.log('Added player2 ', p2.data.addPlayer.id);
        debugger;
        updatedGame2 = await this.props.updateGameMutation({
          variables: {
            id: this.state.currentGame.id,
            player1: p1.data.addPlayer.id,
            player2: p2.data.addPlayer.id,
            moves: Array(9).fill(''),
            isCompleted: false,
            isPending: false,
          },
        });
        console.log('updateGame>>>>>', updatedGame2);
        this.setState({
          currentGame: updatedGame2.data.updateGame,
        });
        console.log('Updating game with player1 id and player2 id ', p2.data.addPlayer.id);
      }
    }
  }

  checkRowMatches(currentInput) {
    // let inputs = document.getElementsByTagName('input');
    const inputs = temp;
    if (inputs[0] === currentInput) {
      if (inputs[1] === currentInput) {
        if (inputs[2] === currentInput) {
          alert('Player' + this.state.currentPlayer + ' wins!');
          return true;
        }
      }
    } else if (inputs[3] === currentInput) {
      if (inputs[4] === currentInput) {
        if (inputs[5] === currentInput) {
          alert('Player' + this.state.currentPlayer + ' wins!');
          return true;
        }
      }
    } else if (inputs[6] === currentInput) {
      if (inputs[7] === currentInput) {
        if (inputs[8] === currentInput) {
          alert('Player' + this.state.currentPlayer + ' wins!');
          return true;
        }
      }
    }
  }

  checkColumnMatches(currentInput) {
    // let inputs = document.getElementsByTagName('input');
    let inputs = temp;
    if (inputs[0] === currentInput) {
      if (inputs[3] === currentInput) {
        if (inputs[6] === currentInput) {
          alert('Player' + this.state.currentPlayer + ' wins!');
          return true;
        }
      }
    } else if (inputs[1] === currentInput) {
      if (inputs[4] === currentInput) {
        if (inputs[7] === currentInput) {
          alert('Player' + this.state.currentPlayer + ' wins!');
          return true;
        }
      }
    } else if (inputs[2] === currentInput) {
      if (inputs[5] === currentInput) {
        if (inputs[8] === currentInput) {
          alert('Player' + this.state.currentPlayer + ' wins!');
          return true;
        }
      }
    }
  }

  checkDiagonalMatches(currentInput) {
    // let inputs = document.getElementsByTagName('input');
    const inputs = temp;
    if (inputs[0] === currentInput) {
      if (inputs[4] === currentInput) {
        if (inputs[8] === currentInput) {
          alert('Player' + this.state.currentPlayer + ' wins!');
          return true;
        }
      }
    } else if (inputs[2] === currentInput) {
      if (inputs[4] === currentInput) {
        if (inputs[6] === currentInput) {
          alert('Player' + this.state.currentPlayer + ' wins!');
          return true;
        }
      }
    } else if (inputs[2] === currentInput) {
      if (inputs[5] === currentInput) {
        if (inputs[8] === currentInput) {
          alert('Player' + this.state.currentPlayer + ' wins!');
          return true;
        }
      }
    }
  }

  async getGames() {
    // debugger;
    const gameList = await this.props.getGamesQuery.games;
    console.log('gameList ', gameList);
    await this.setState({
      games: gameList,
    });
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
    });
    this.setState({
      currentGame: addedGame.data.addGame,
    });
    console.log('Added game...', addedGame.data.addGame);
    console.log('currentGame...', this.state.currentGame);
  }

  async onButtonClick(e) {
    if (e.target.value === '') {
      if (this.state.currentPlayer === 1) {
        e.target.value = this.state.player1;
        let id = e.target.id;
        let tempArr = await [...this.state.currentGame.moves];
        debugger;
        tempArr.splice(id, 1, this.state.player1);
        console.log(tempArr);
        temp = tempArr;
        const updated = await this.props.updateGameMutation({
          variables: {
            id: this.state.currentGame.id,
            player1: this.state.currentGame.player1,
            player2: this.state.currentGame.player2,
            moves: tempArr,
            isCompleted: this.state.currentGame.isCompleted,
            isPending: this.state.currentGame.isPending,
          },
        });
        await this.setState({
          currentGame: updated.data.updateGame,
        });
        console.log('updated>>>>>', updated.data.updateGame);
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
        const id = e.target.id;
        let tempArr = await [...this.state.currentGame.moves];
        tempArr.splice(id, 1, this.state.player2);
        console.log(tempArr);
        temp = tempArr;
        const updated = await this.props.updateGameMutation({
          variables: {
            id: this.state.currentGame.id,
            player1: this.state.currentGame.player1,
            player2: this.state.currentGame.player2,
            moves: tempArr,
            isCompleted: this.state.currentGame.isCompleted,
            isPending: this.state.currentGame.isPending,
          },
        });
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
  }

  resetGame() {
    const inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }
    this.setState({
      currentPlayer: 1,
    });
  }

  render() {
    const player = 'Player' + this.state.currentPlayer;
    // console.log('currentGame after update2: ', this.state.currentGame);
    console.log("games state = ", this.state.gameList);
    return (
      <div>
        <div className="col-md-4">
          <h3>Turn: {player}</h3>
        </div>
        <div className="col-md-4">
          <div className="btn-group">
            <input id="0" type="button" className="square" onClick={this.onButtonClick} />
            <input id="1" type="button" className="square" onClick={this.onButtonClick} />
            <input id="2" type="button" className="square" onClick={this.onButtonClick} />
          </div>
          <div className="">
            <input id="3" type="button" className="square" onClick={this.onButtonClick} />
            <input id="4" type="button" className="square" onClick={this.onButtonClick} />
            <input id="5" type="button" className="square" onClick={this.onButtonClick} />
          </div>
          <div className="">
            <input id="6" type="button" className="square" onClick={this.onButtonClick} />
            <input id="7" type="button" className="square" onClick={this.onButtonClick} />
            <input id="8" type="button" className="square" onClick={this.onButtonClick} />
          </div>
        </div>
        <div className="col-md-4" />
      </div>
    );
  }
}

export default compose(
  graphql(getLastGameQuery, { name: 'getLastGameQuery' }),
  //  graphql(getPlayersQuery, { name: 'getPlayersQuery' }),
  //  graphql(getGameQuery, { name: 'getGameQuery' }),
  //  graphql(getPlayerQuery, { name: 'getPlayerQuery' }),
  graphql(addGameMutation, { name: 'addGameMutation' }),
  graphql(addPlayerMutation, { name: 'addPlayerMutation' }),
  graphql(updateGameMutation, { name: 'updateGameMutation' }),
)(Board);
