const { toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

const privateKey = secp.utils.randomPrivateKey();

// Last 20 bytes of public key is actual wallet address used in etherum blockchain
const publicKey = secp.getPublicKey(privateKey).slice(-20);

console.log(toHex(privateKey))
console.log(toHex(publicKey))
