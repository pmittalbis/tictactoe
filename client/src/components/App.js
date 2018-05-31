import React, { Component } from 'react';
import Board from './Board';
import Header from './Header';
import './App.css';

// eslint-disable-next-line prefer-stateless-function
class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Board />
      </div>
    );
  }
}

export default App;
