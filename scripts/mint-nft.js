require('dotenv').config();
const fs = require('fs');
const crypto = require('crypto');
const ethers = require('ethers');
const upload  = require('./file-upload').uploadNFT;

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const contract = require('../artifacts/contracts/MyNFT.sol/MyNFT.json');
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const tokenUri = 'https://gateway.pinata.cloud/ipfs/QmUcYg1VzVtb7tnnPgW7QWf1mEXEoH6NkcM3o3cYvyiBmx'; // replace
const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const hashFile = (path, hashFunc='sha256') => {
  const hash = crypto.createHash(hashFunc);
  const file = fs.readFileSync(path);
  hash.update(file);
  return `0x${hash.digest('hex')}`;
}

const mintNFT = async (file) => {
  const hash = hashFile(file);
  let nftTxn = await myContract.mintNFT(signer.address, hash, tokenUri);
  await nftTxn.wait();
  console.log(`NFT minted at https://sepolia.etherscan.io/tx/${nftTxn.hash}`);
}

exports.mint = mintNFT;
// mintNFT('../test_files/three.xml')
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
 
