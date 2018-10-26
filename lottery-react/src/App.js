import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: ""
  }

  async componentDidMount() {
    // Leave out from because of MetaMask injection.
    const manager = await lottery.methods.manager().call();
    this.setState({ manager });
  }

  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>This contract is managed by: {this.state.manager}</p>
      </div>
    );
  }
}

export default App;
