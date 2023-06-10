require('dotenv').config();
const ethers= require('ethers');
const contract = require('../../artifacts/contracts/SongLicense.sol/SongLicense.json');
const bignumber = require('bignumber.js');
const Alchemy = require('alchemy-sdk');
const alchemy = new Alchemy.Alchemy ({
    apiKey: process.env.API_KEY,
    network: Alchemy.Network.ETH_SEPOLIA,
});

const [ API_URL, CONTRACT_ADDRESS ] = [ process.env.API_URL, process.env.SONG_LICENSE_CONTRACT ];
const provider = new ethers.providers.JsonRpcProvider(API_URL);


exports.buyLicense = async (songId, licenseType, buyerKey, price) => {
    const signer = new ethers.Wallet(buyerKey, provider);
    const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    let licenseTxn = await myContract.mintNFT(signer.address, songId, licenseType, {value: price, gasLimit: 10e6});
    await licenseTxn.wait();
        console.log(`Song License minted at https://sepolia.etherscan.io/tx/${licenseTxn.hash}`);
}

exports.checkLicenses = async (songId) => {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    let licenseTxn = await myContract.getTokenDetails(songId, {gasLimit: 10e6});
    // await licenseTxn.wait();
    console.log(licenseTxn);
}

exports.verifyLicense = async (walletId, songId, license = 0) => {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    return await myContract.verifyLicenseOwnership(songId, walletId, license, {gasLimit: 10e6});
}

// exports.verifyLicense(process.env.WALLET_ID, `0x${bignumber('0xB354D56808039B9E75ADB6A0EFF1A898578A3B0C3935FA4CE68A2868AD988E28', 16).toString(16)}`).then(console.log).catch(err => {console.error(err); process.exit(1);}); // false
// exports.verifyLicense(process.env.WALLET_2_ID, `0x${bignumber('0xB354D56808039B9E75ADB6A0EFF1A898578A3B0C3935FA4CE68A2868AD988E28', 16).toString(16)}`).then(console.log).catch(err => {console.error(err); process.exit(1);}); // true
// exports.verifyLicense(process.env.WALLET_2_ID, `0x${bignumber('0xB354D56808039B9E75ADB6A0EFF1A898578A3B0C3935FA4CE68A2868AD988E28', 16).toString(16)}`, 1).then(console.log).catch(err => {console.error(err); process.exit(1);}); // false


exports.checkLicenses(`0x${bignumber('0xB354D56808039B9E75ADB6A0EFF1A898578A3B0C3935FA4CE68A2868AD988E28', 16).toString(16)}`).catch(err => {console.error(err); process.exit(1);});
// exports.buyLicense(
//     `0x${bignumber('0xB354D56808039B9E75ADB6A0EFF1A898578A3B0C3935FA4CE68A2868AD988E28', 16).toString(16)}`,
//     0,
//     process.env.PRIVATE_KEY_2,
//     3
// ).then(console.log).catch(err => {console.error(err); process.exit(1); })