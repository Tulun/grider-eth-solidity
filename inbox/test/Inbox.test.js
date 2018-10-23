const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// Provider might change depending what network we point to on the blockchain.
const web3 = new Web3(ganache.provider());

 beforeEach(async () => {
  // Get a list of all accounts
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  // Use one of the accounts to deploy.
});

describe('Inbox', () => {
  it('deploys a contract', () => {

  })
})
