require("dotenv").config();
const ethers = require("ethers");
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const parseHash = require('./hash_operations').parseHash;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);

exports.sellNFT = async (hash, price) => {
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    const parsedId = parseHash(hash).toString(10);
    let nftTxn = await myContract.putUpForSale(parsedId, price, {gasLimit: 100000});
    await nftTxn.wait();
}

exports.buyNFT = async (hash, price, targetWallet) => {
    const parsedId = parseHash(hash).toString(10);
    let signer_alt = new ethers.Wallet(targetWallet,  provider);
    let myContract_alt = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer_alt);
    let nftTxn = await myContract_alt.buyNFT(parsedId, {gasLimit: 100000, value: price});
    await nftTxn.wait();
}
