require("dotenv").config();
const ethers = require("ethers");
const contract = require("../artifacts/contracts/SongNFT.sol/SongNFT.json");
const parseHash = require('./hash_operations').parseHash;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.SONG_NFT_CONTRACT;
const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);

exports.checkLicensing = async (hash) => {
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    const parsedId = parseHash(hash).toString(10);
    let nftTxn = await myContract.getLicensingOptions(parsedId, {gasLimit: 100000});
    return {
        'private': nftTxn.Private,
        'public': nftTxn.Public,
        'modify': nftTxn.Modify
    }
}

exports.tokenDetails = async(hash) => {
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    const parsedId = parseHash(hash).toString(10);
    let nftTxn = await myContract.getTokenDetails(parsedId, {gasLimit: 100000});
    return nftTxn.id.toHexString();
}

// exports.checkLicensing('81113887926496370108094136735208310240630533625817621055747211475411604639272').then(console.log).catch(console.error);
exports.tokenDetails('81113887926496370108094136735208310240630533625817621055747211475411604639272').then(console.log).catch(console.error);
