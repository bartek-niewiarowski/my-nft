require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const ethers = require("ethers");

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
// const provider = new ethers.providers.AlchemyProvider("sepolia", API_KEY);
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);

const hashFile = (path, hashFunc="sha256") => {
  const hash = crypto.createHash(hashFunc);
  const file = fs.readFileSync(path);
  hash.update(file);
  return `0x${hash.digest("hex")}`;
}

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
console.log(JSON.stringify(provider), PRIVATE_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
const tokenUri = "https://gateway.pinata.cloud/ipfs/QmbZeEzdqQ52KHJ8piGXBoBsFGDQvSNZZ7QMjx2ZJCMCtn";

const mintNFT = async () => {
  const hash = hashFile("./test_files/test_photo.png");
  let nftTxn = await myContract.mintNFT(signer.address, hash, tokenUri);
  await nftTxn.wait();
  console.log(`NFT minted at https://sepolia.etherscan.io/tx/${nftTxn.hash}`);
}

mintNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
 
