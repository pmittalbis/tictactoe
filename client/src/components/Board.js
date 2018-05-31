import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import _ from 'lodash';
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
let updatedGame1;
let updatedGame2;
let temp;
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
    this.addPlayers = this.addPlayers.bind(this);
    this.addGame = this.addGame.bind(this);
    this.getGames = this.getGames.bind(this);
    this.checkRowMatches = this.checkRowMatches.bind(this);
    this.checkColumnMatches = this.checkColumnMatches.bind(this);
    this.checkDiagonalMatches = this.checkDiagonalMatches.bind(this);
	}

  componentDidMount() {
    this.addGame();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.getGames(nextProps);
    }
  }

  async addGame() {
    // debugger
    addedGame = await this.props.addGameMutation({
      variables: {
        player1: "5b0e95bc1d512433c4a08959",
        player2: "5b0e95bc1d512433c4a08959",
        moves: ['t', 't', 't', 't', 't', 't', 't', 't', 't'],
        isCompleted: false,
        isPending: true
      }
    });
    console.log("Added game...", addedGame.data.addGame.moves);
  }

  async addPlayers() {
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
        updatedGame1 = await this.props.updateGameMutation({
          variables: {
            id: pendingGame[0].id,
            player1: p1.data.addPlayer.id,
            player2: null,
            moves: Array(9).fill(''),
            isCompleted: false,
            isPending: true
          }
        });
        this.setState({
          currentGame: updatedGame1.data.updateGame
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
        debugger
        updatedGame2 = await this.props.updateGameMutation({
          variables: {
            id: pendingGame[0].id,
            player1: p1.data.addPlayer.id,
            player2: p2.data.addPlayer.id,
            moves: Array(9).fill(''),
            isCompleted: false,
            isPending: false
          }
        });
        console.log("updateGame>>>>>",updatedGame2);
        this.setState({
          currentGame: updatedGame2.data.updateGame
        });
        console.log('Updating game with player1 id and player2 id ' , p2.data.addPlayer.id);
      }
    }
  }

  checkRowMatches(currentInput) {
    // let inputs = document.getElementsByTagName('input');
  	let inputs = temp;
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
  	let inputs = temp;
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

  async getGames(nextProps) {
    let gameList = await nextProps.getGamesQuery.games;
    console.log("gameList ", gameList);
    await this.setState({
      games: gameList
    });
    this.addPlayers();
  }

  async onButtonClick(e) {
    // if (e.target.value === '') {
    //   if (this.state.currentPlayer === 1) {
    //     e.target.value = this.state.player1;
    //     this.setState({
    //       currentPlayer: 2
    //     });
    //     var id = e.target.id;
    //     //code for updating games.moves with each move
    //     console.log(this.state.currentGame);
    //     // var temp = await this.state.currentGame.moves;
    //     temp.splice(id, 1, this.state.player1);
    //     console.log('temp = ', temp);
    //   //   await this.props.updateGameMutation({
    //   //   variables: {
    //   //     id: this.state.currentGame.id,
    //   //     player1: this.state.currentGame.player1,
    //   //     player2: this.state.currentGame.player2,
    //   //     moves: temp,
    //   //     isCompleted: this.state.currentGame.isCompleted,
    //   //     isPending: this.state.currentGame.isPending
    //   //   }
    //   // });
    //     console.log('Moves: ', this.state.currentGame.moves);
    //     }
    //     let isMatched = this.checkRowMatches(this.state.player1);
    //     if (isMatched) {
    //       return this.resetGame();
    //     }
    //     isMatched = this.checkColumnMatches(this.state.player1);
    //     if (isMatched) {
    //       return this.resetGame();
    //     }
    //     isMatched = this.checkDiagonalMatches(this.state.player1);
    //     if (isMatched) {
    //       return this.resetGame();
    //     }
        
    //     debugger;
    //   } else if (this.state.currentPlayer === 2) {
    //     e.target.value = this.state.player2;
    //     console.log(this.state.currentPlayer);
    //     let isMatched = this.checkRowMatches(this.state.player2);
    //     if (isMatched) {
    //       return this.resetGame();
    //     }
    //     isMatched = this.checkColumnMatches(this.state.player2)
    //     if (isMatched) {
    //       return this.resetGame();
    //     }
    //     isMatched = this.checkDiagonalMatches(this.state.player2)
    //     if (isMatched) {
    //       return this.resetGame();
    //     }
    //     this.setState({
    //       currentPlayer: 1
    //     });
    //   }
    // }
    if (e.target.value === '') {
      if (this.state.currentPlayer === 1) {
        e.target.value = this.state.player1;
        var id = e.target.id;
        let tempArr = await this.state.currentGame.moves;
        let newArr = tempArr;
        tempArr = newArr;
        debugger;
        tempArr.splice(id, 1, this.state.player1);
        temp = tempArr;
        const updated = await this.props.updateGameMutation({
          variables: {
            id: this.state.currentGame.id,
            player1: this.state.currentGame.player1,
            player2: this.state.currentGame.player2,
            moves: tempArr,
            isCompleted: this.state.currentGame.isCompleted,
            isPending: this.state.currentGame.isPending
          }
        });
        this.setState({
          currentGame: updated.data.updateGame
        });
        console.log(updated.data.updateGame);
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
        var id = e.target.id;
        let tempArr = await this.state.currentGame.moves;
        let newArr = tempArr;
        tempArr = newArr;
        temp = tempArr;
        tempArr.splice(id, 1, this.state.player2);
        const updated = await this.props.updateGameMutation({
          variables: {
            id: this.state.currentGame.id,
            player1: this.state.currentGame.player1,
            player2: this.state.currentGame.player2,
            moves: tempArr,
            isCompleted: this.state.currentGame.isCompleted,
            isPending: this.state.currentGame.isPending
          }
        });
        this.setState({
          currentGame: updated.data.updateGame
        });
        console.log(updated.data.updateGame);        let isMatched = this.checkRowMatches(this.state.player2);
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
    // console.log('currentGame after update2: ', this.state.currentGame);
    console.log("games state = ", this.state.gameList)
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