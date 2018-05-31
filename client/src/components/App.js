import React, { Component } from 'react';
import Board from './Board.js';
import Header from './Header.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
    		<Header/>
    		<Board/>
      </div>
    );
  }
}

export default App;
