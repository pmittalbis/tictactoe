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

class Boards extends Component {
	constructor(props){
		super(props);
		this.state = {
			player1: 'X',
			player2: 'O',
			currentPlayer: 1,
      games: null,
      currentGame: {}
		}
    // this.addPlayers = this.addPlayers.bind(this);
    // this.addGame = this.addGame.bind(this);
    // this.getGames = this.getGames.bind(this);
    // this.checkRowMatches = this.checkRowMatches.bind(this);
    // this.checkColumnMatches = this.checkColumnMatches.bind(this);
    // this.checkDiagonalMatches = this.checkDiagonalMatches.bind(this);
	}
	async onButtonClick(e) {
    if (e.target.value === '') {
      if (this.state.currentPlayer === 1) {
        e.target.value = this.state.player1;
        var id = e.target.id;
   		  console.log(this.state.currentGame);
        var temp = await this.state.currentGame.moves;
        temp.splice(id, 1, this.state.player1);
        console.log('temp = ', temp);
        await this.props.updateGameMutation({
        variables: {
          id: this.state.currentGame.id,
          player1: this.state.currentGame.player1,
          player2: this.state.currentGame.player2,
          moves: ['1', '1', '1', '1', '1', '1', '1', '1', '1'],
          isCompleted: this.state.currentGame.isCompleted,
          isPending: this.state.currentGame.isPending
        }
      });

        console.log('Moves: ', this.state.currentGame.moves);
  //     updatedGame = await this.props.updateGameMutation({
  //       variables: {
  //         id: this.state.currentGame.id,
  //         player1: this.state.currentGame.player1,
  //         player2: this.state.currentGame.player2,
  //         moves: ['', '', '', '', '', '', '', '', ''],
  //         isCompleted: this.state.currentGame.isCompleted,
  //         isPending: this.state.currentGame.isPending
        }
  //     });
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
  //     this.setState({
  //       currentPlayer: 2
  //     });
  //   } else if (this.state.currentPlayer === 2) {
  //     e.target.value = this.state.player2;
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
    // if (e.target.value === '') {
    //   if (this.state.currentPlayer === 1) {
    //     e.target.value = this.state.player1;
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
    //     this.setState({
    //       currentPlayer: 2
    //     });
    //   } else if (this.state.currentPlayer === 2) {
    //     e.target.value = this.state.player2;
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
    }
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
export default Boards