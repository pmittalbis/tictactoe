import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
// import { Query } from 'react-apollo';
import { 
  addGameMutation,
  addPlayerMutation,
  updateGameMutation,
  getGamesQuery,
  getPlayersQuery,
  getGameQuery,
  getPlayerQuery
   } from '../queries/queries.js';

let addedGame;
let p1;
let p2;
let updatedGame;
class Board extends Component {
	constructor(props){
		super(props);
		this.state = {
			player1: 'X',
			player2: 'O',
			currentPlayer: 1,
      games: null,
      currentGame: {}
		}
	}

  componentDidMount() {
    this.addGame();
  }

  componentWillReceiveProps(nextProps) {
    this.getGames(nextProps);
  }

  async addGame() {
    // debugger
    addedGame = await this.props.addGameMutation({
      variables: {
        player1: null,
        player2: null,
        moves: [],
        isCompleted: false,
        isPending: true
      }
    });
    console.log("Added game...", addedGame.data.addGame.id);
  }

  async addPlayers() {
    // debugger
    if (this.state.games) {
      const pendingGame = await _.filter(this.state.games, { 'id': addedGame.data.addGame.id, 'isPending': true });
      this.setState({
        currentGame: pendingGame[0]
      });
      console.log("currentGame ", this.state.currentGame);
      console.log('pendingGame = ', pendingGame);
      if (!pendingGame[0].player1 && pendingGame[0].isPending) {
        p1 = await this.props.addPlayerMutation({
          variables: {
            name: "Player1",
            gameID: pendingGame[0].id
          }
        });
        console.log("Added player1 ", p1.data.addPlayer.id);
        updatedGame = await this.props.updateGameMutation({
          variables: {
            id: pendingGame[0].id,
            player1: p1.data.addPlayer.id,
            player2: null,
            moves: [],
            isCompleted: false,
            isPending: true
          }
        });
        this.setState({
        currentGame: updatedGame
      });
        console.log('updating game with player1 id', p1.data.addPlayer.id);
      } else if (!pendingGame[0].player2 && pendingGame[0].isPending) {
        p2 = await this.props.addPlayerMutation({
          variables: {
            name: "Player2",
            gameID: pendingGame[0].id
          }
        });
        console.log("Added player2 ", p2.data.addPlayer.id);
        updatedGame = await this.props.updateGameMutation({
          variables: {
            id: pendingGame[0].id,
            player1: p1.data.addPlayer.id,
            player2: p2.data.addPlayer.id,
            moves: [],
            isCompleted: false,
            isPending: false
          }
        });
        this.setState({
          currentGame: updatedGame
        });
        console.log('updating game with player1 id and player2 id ' , p2.data.addPlayer.id);
      }
    }
  }

  checkRowMatches(currentInput) {
  	let inputs = document.getElementsByTagName('input');
  	if (inputs[0].value === currentInput) {
  		if (inputs[1].value === currentInput) {
  			if (inputs[2].value === currentInput) {
  				alert('Player' + this.state.currentPlayer + ' wins!');
	  			return true;
  			}
  		}
  	} else if (inputs[3].value === currentInput) {
  		if (inputs[4].value === currentInput) {
  			if (inputs[5].value === currentInput) {
  				alert('Player' + this.state.currentPlayer + ' wins!');
	  			return true;
  			}
  		}
  	} else if (inputs[6].value === currentInput) {
  		if (inputs[7].value === currentInput) {
  			if (inputs[8].value === currentInput) {
  				alert('Player' + this.state.currentPlayer + ' wins!');
	  			return true;
  			}
  		}
  	}
  }

	checkColumnMatches(currentInput) {
  	let inputs = document.getElementsByTagName('input');
  	if (inputs[0].value === currentInput) {
  		if (inputs[3].value === currentInput) {
  			if (inputs[6].value === currentInput) {
  				alert('Player' + this.state.currentPlayer + ' wins!');
	  			return true;
  			}
  		}
  	} else if (inputs[1].value === currentInput) {
  		if (inputs[4].value === currentInput) {
  			if (inputs[7].value === currentInput) {
  				alert('Player' + this.state.currentPlayer + ' wins!');
	  			return true;
  			}
  		}
  	} else if (inputs[2].value === currentInput) {
  		if (inputs[5].value === currentInput) {
  			if (inputs[8].value === currentInput) {
  				alert('Player' + this.state.currentPlayer + ' wins!');
	  			return true;
  			}
  		}
  	}
  }

  checkDiagonalMatches(currentInput) {
  	let inputs = document.getElementsByTagName('input');
  	if (inputs[0].value === currentInput) {
  		if (inputs[4].value === currentInput) {
  			if (inputs[8].value === currentInput) {
  				alert('Player' + this.state.currentPlayer + ' wins!');
	  			return true;
  			}
  		}
  	} else if (inputs[2].value === currentInput) {
  		if (inputs[4].value === currentInput) {
  			if (inputs[6].value === currentInput) {
  				alert('Player' + this.state.currentPlayer + ' wins!');
	  			return true;
  			}
  		}
  	} else if (inputs[2].value === currentInput) {
  		if (inputs[5].value === currentInput) {
  			if (inputs[8].value === currentInput) {
  				alert('Player' + this.state.currentPlayer + ' wins!');
	  			return true;
  			}
  		}
  	}
  }

  async getGames(nextProps) {
    let gameList = await nextProps.getGamesQuery.games;
    console.log(await gameList);
    debugger
    await this.setState({
      games: gameList
    });
    //console.log(gameList);
    this.addPlayers();
  }

  onButtonClick(e) {
    if (e.target.value === '') {
      if (this.state.currentPlayer === 1) {
        e.target.value = this.state.player1;
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
          currentPlayer: 2
        });
      } else if (this.state.currentPlayer === 2) {
        e.target.value = this.state.player2;
        let isMatched = this.checkRowMatches(this.state.player2);
        if (isMatched) {
          return this.resetGame();
        }
        isMatched = this.checkColumnMatches(this.state.player2)
        if (isMatched) {
          return this.resetGame();
        }
        isMatched = this.checkDiagonalMatches(this.state.player2)
        if (isMatched) {
          return this.resetGame();
        }
        this.setState({
          currentPlayer: 1
        });
      }
    }
  }
  resetGame () {
  	let inputs = document.getElementsByTagName('input');
  	for (var i = 0; i < inputs.length; i++) {
  		inputs[i].value = '';
  	}
  	this.setState({
  		currentPlayer: 1
  	});
  }
  render() {
  	let player = 'Player' + this.state.currentPlayer;
    return (
    	<div>
    		<div className='col-md-4'>
    			<h3>Turn: {player}</h3>
    		</div>
    		<div className='col-md-4'>
	    		<div className='btn-group'>
	    			<input id='0' type='button' className='square' onClick={this.onButtonClick.bind(this)}/>
	    			<input id='1' type='button' className='square' onClick={this.onButtonClick.bind(this)}/>
	    			<input id='2' type='button' className='square' onClick={this.onButtonClick.bind(this)}/>
		      </div>
		      <div className=''>
						<input id='3' type='button' className='square' onClick={this.onButtonClick.bind(this)}/>
	    			<input id='4' type='button' className='square' onClick={this.onButtonClick.bind(this)}/>
	    			<input id='5' type='button' className='square' onClick={this.onButtonClick.bind(this)}/>
		      </div>
		      <div className=''>
						<input id='6' type='button' className='square' onClick={this.onButtonClick.bind(this)}/>
	    			<input id='7' type='button' className='square' onClick={this.onButtonClick.bind(this)}/>
	    			<input id='8' type='button' className='square' onClick={this.onButtonClick.bind(this)}/>
		      </div>
    		</div>
	      <div className='col-md-4'>
    		</div>
    	</div>
    );
  }
}

export default compose(
  graphql(getGamesQuery, { name: "getGamesQuery" }),
  graphql(getPlayersQuery, { name: "getPlayersQuery" }),
  //graphql(getGameQuery, { name: "getGameQuery" }),
  //graphql(getPlayerQuery, { name: "getPlayerQuery" }),
  graphql(addGameMutation, { name: "addGameMutation" }),
  graphql(addPlayerMutation, { name: "addPlayerMutation" }),
  graphql(updateGameMutation, { name: "updateGameMutation" })
  )(Board);