const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
require('dotenv').config()

const ropsten = `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`;
const provider = new HDWalletProvider(
  process.env.WORDS,
  ropsten
);

const web3 = new Web3(provider);
const GWEI_TO_WEI = 10**9;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('attempting to deploy from account', accounts[0]);
  const count = await web3.eth.getTransactionCount(accounts[0]);
  const nonce = await web3.utils.toHex(count);
  console.log('c', count, 'nonce', nonce);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: `0x${bytecode}`, arguments: ["You suck McBain"] })
    .send({ 
      gas: "280868", 
      // gasPrice: 5 * GWEI_TO_WEI, 
      from: accounts[0],
      // nonce
    });

  console.log('instance of contract', result);
};

deploy();