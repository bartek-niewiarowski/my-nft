require("dotenv").config();
const ethers = require("ethers");
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
// const provider = new ethers.providers.AlchemyProvider("sepolia", API_KEY);
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);

const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
const sellNFT = async (hash, price) => {
    let nftTxn = await myContract.putUpForSale(hash, price);
    await nftTxn.wait();
}
