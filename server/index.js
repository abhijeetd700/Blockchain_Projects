const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "d59fe36c16f1df3b738f84d0a94e858c29a5bfc9": 100,
  "8750bb212d15b1afcf5b6e1eb4d3c13ba60fde7d": 50,
  "f82a2870c8f2c7e892be54dc6be9f3c55a5bc18e": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount,signedTransaction,recoveryBit,hashAmount } = req.body;

  let sender = ''
  let hashAmtArr = Object.values(hashAmount)
  let signedTransactionArr = Object.values(signedTransaction)

  const hashAmtUint8Arr = new Uint8Array(hashAmtArr);
  const signedTransactionUint8Arr = new Uint8Array(signedTransactionArr);
  
  // Recover the valid public key/ wallet address of the sender from the signed transaction 
  const publicKey = secp.recoverPublicKey(hashAmtUint8Arr, signedTransactionUint8Arr, recoveryBit);
  const walletAddress = toHex(publicKey.slice(-20))
  
  // Checking for valid public key/ wallet address generated from private key
  if(walletAddress in balances){
    sender = walletAddress
  }
  else{
    console.log('Invalid Sender')
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
