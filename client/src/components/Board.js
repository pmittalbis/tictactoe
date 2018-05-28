import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
// import { Query } from 'react-apollo';
import { addGameMutation, addPlayerMutation, updateGameMutation } from '../queries/queries.js';

class Board extends Component {
	constructor(props){
		super(props);
		this.state = {
			player1: 'X',
			player2: 'O',
			currentPlayer: 1
		}
	}
  componentDidMount(){
    this.addGame();
  }
  onButtonClick(e){
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
  checkRowMatches(currentInput){
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
	checkColumnMatches(currentInput){
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
  checkDiagonalMatches(currentInput){
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
  async addGame(){
    const game = await this.props.addGameMutation({
      variables: {
        player1: "",
        player2: ""
      }
    });
    let p1;
    console.log("Added game...");
    if (!game.data.addGame.player1 && !game.data.addGame.completed) {
      p1 = await this.props.addPlayerMutation({
        variables: {
          name: "Player1",
          gameID: game.data.addGame.id
        }
      });
      console.log("Added player1");

      //updating game with player1 id
      // console.log(game.data.addGame.id);
      // console.log(p1.data.addPlayer.id);
      this.props.updateGameMutation({
        variables: {
          id: game.data.addGame.id,
          player1: p1.data.addPlayer.id,
          player2: "p2",
          completed: false
        }
      });
      console.log('updating game with player1 id');
    } else {
      const p2 = await this.props.addPlayerMutation({
        variables: {
          name: "Player2",
          gameID: game.data.addGame.id
        }
      });
      console.log("Added player2");
      this.props.updateGameMutation({
        variables: {
          id: game.data.addGame.id,
          player1: p1.data.addPlayer.id,
          player2: p2.data.addPlayer.id,
          completed: true
        }
      });
      console.log('updating game with player1 id and player2 id');
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
  graphql(addGameMutation, { name: "addGameMutation" }),
  graphql(addPlayerMutation, { name: "addPlayerMutation" }),
  graphql(updateGameMutation, { name: "updateGameMutation" })
  )(Board);