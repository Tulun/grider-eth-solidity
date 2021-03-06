const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile");

let lottery;
let accounts;

beforeEach( async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
  it("Deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("Allows one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether")
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    console.log(accounts[0], players[0]);
    assert.equal(1,players.length);
  });

  it("Allows multiple accounts to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether")
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether")
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether")
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3 ,players.length);
  });
  
  it("Requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
      assert(false);
    } 
    catch (err) {
      console.log('err?', err);
      assert(err);
    }
  });

  it("Only manager can pick winner", async () => {
    let passed = true;
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether")
    });

    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      })
      passed = false;
    } 
    catch (err) {
      assert(err);
    }
    assert(passed);
  })

  it("Send money to the winner and resets the player array", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether")
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("2", "ether")
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("2", "ether")
    });

    // Wrote this myself: Actually test if there is a random winner.
    await lottery.methods.pickWinner().send({ from: accounts[0] })
    const initialBalance = web3.utils.toWei("100", "ether") / 10**18;

    // Gather all the promises, filter out for the true value.
    // This only seems to work with map and not find.
    const balances = (await Promise.all(accounts.map( async (acc, index) => {
      const currentBalance = await web3.eth.getBalance(acc) / 10**18;
      return currentBalance > initialBalance;
    }))).filter(x => x);

    assert(balances[0]);

    const players = await lottery.methods.getPlayers().call({ from: accounts[0] });

    assert.equal(0, players.length);
    // If looking to compare slightly amount of difference between balances for gas cost...
    /* 
      const initialBalance = await web3.eth.getBalance(accounts[0]);

      await lottery.methods.pickWinner().send({ from: accounts[0] });

      const finalBalance = await web3.eth.getBalance(accounts[0]);

      const difference = finalBalance - initialBalance;
      assert(difference > web3.utilts.toWei("1.8", "ether"));
    */
  })
});
