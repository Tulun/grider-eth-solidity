import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: ""
  }

  async componentDidMount() {
    // Leave out from because of MetaMask injection.
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by: {this.state.manager}. <br />
          There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, "ether")} ether.
        </p>
      </div>
    );
  }
}

export default App;
