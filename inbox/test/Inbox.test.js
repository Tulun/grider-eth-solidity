const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

// Provider might change depending what network we point to on the blockchain.
const provider = ganache.provider();
// const provider = "https://ropsten.infura.io/v3/37016137b80649469d2b853488f76e4f";
const web3 = new Web3(provider);
 
let accounts, inbox;
const INITIAL_MESSAGE = "Hi there!"
 beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // Use one of the accounts to deploy.
  inbox =  await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: `0x${bytecode}`, arguments: [INITIAL_MESSAGE] })
    .send({ from : accounts[0], gas: "1000000" })

  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  })

  it('has a default message', async () => {
    // Read only
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE);
  });

  it('can change the message', async () => {
    // What account is paying for it?
    await inbox.methods.setMessage("Schmoopy").send({ from: accounts[0], gas: "1000000" })
    const message = await inbox.methods.message().call();
    assert.equal(message, "Schmoopy");
  })

})
