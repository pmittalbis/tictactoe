import { gql } from 'apollo-boost';

// const getAuthorsQuery = gql`
// 	{
// 		authors{
// 			name
// 			id
// 		}
// 	}
// `
// const getBookQuery = gql`
// 	query($id: ID!){
// 		book(id: $id){
// 			name
// 			id
// 			genre
// 			author{
// 				id
// 				name
// 				age
// 				books{
// 					name
// 					id
// 				}
// 			}
// 		}
// 	}
// `

// const getBooksQuery = gql`
// 	{
// 		books{
// 			name
// 			id
// 		}
// 	}
// `
const addGameMutation = gql`
	mutation($player1: String, $player2: String) {
		addGame(player1: $player1, player2: $player2){
			id
			player1
			player2
		}
	}
`
const updateGameMutation = gql`
	mutation($id: ID!, $player1: String, $player2: String, $completed: Boolean) {
		updateGame(id: $id, player1: $player1, player2: $player2, completed: $completed){
			id
			player1
			player2
			completed
		}
	}
`

const addPlayerMutation = gql`
	mutation($name: String!, $gameID: ID!) {
		addPlayer(name: $name, gameID: $gameID){
			id
			name
			gameID
		}
	}
`
export { addGameMutation, addPlayerMutation, updateGameMutation };