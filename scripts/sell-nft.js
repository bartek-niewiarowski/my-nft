require("dotenv").config();
const ethers = require("ethers");
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const bignumber = require('bignumber.js');

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
// const provider = new ethers.providers.AlchemyProvider("sepolia", API_KEY);
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

exports.sellNFT = async (hash, price) => {
    let nftTxn = await myContract.putUpForSale(hash, price, {gasLimit: 100000});
    await nftTxn.wait();
}

exports.buyNFT = async (hash, price) => {
    let signer_alt = new ethers.Wallet(process.env.PRIVATE_KEY_2,  provider);
    let myContract_alt = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer_alt);
    let nftTxn = await myContract_alt.buyNFT(hash, {gasLimit: 100000, value: price});
    await nftTxn.wait();
}
