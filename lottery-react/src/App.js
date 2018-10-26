import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: ""
  }

  async componentDidMount() {
    // Leave out from because of MetaMask injection.
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    console.log('v', this.state.value);

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({ message: "You have been entered!" })
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success... "})
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: "Winner has been picked!"})
  }

  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by: {this.state.manager}. <br />
          There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, "ether")} ether.
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ETH to enter:</label>
            <input 
              type="text"
              onChange={event => this.setState({ value: event.target.value})}
              value={this.state.value}
            />
            <button type="submit">Enter</button>
          </div>
        </form>
        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <h3>
          {this.state.message}
        </h3>
      </div>
    );
  }
}

export default App;
