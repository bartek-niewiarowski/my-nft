require('dotenv').config();
const hashFile = require('./hash_operations').hashFile;
const ethers= require('ethers');
const contract = require('../artifacts/contracts/SongNFT.sol/SongNFT.json');
const upload = require('./file-upload').uploadNFT;


const [ API_URL, PRIVATE_KEY, CONTRACT_ADDRESS ] = [ process.env.API_URL, process.env.PRIVATE_KEY, process.env.SONG_NFT_CONTRACT ];
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const mintNFT = async (file, description = '', licensePricing) => {
  const hash = hashFile(file);
  // needs tokenUri from upload
  const cids = await upload(file, description);
  if(cids === undefined) return;
  const pricing = {
    PrivatePrice: licensePricing[0],
    PublicPrice: licensePricing[1],
    ModifyPrice: licensePricing[2],
  }
  const tokenUri = `https://gateway.pinata.cloud/ipfs/${cids.metadataCid}`;
  let nftTxn = await myContract.mintNFT(signer.address, hash, tokenUri, 0, pricing);
  await nftTxn.wait();
  console.log(`Song NFT minted at https://sepolia.etherscan.io/tx/${nftTxn.hash}`);
}

exports.mint = mintNFT;
