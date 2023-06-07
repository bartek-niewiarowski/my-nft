require('dotenv').config()
const deploy = async (contractName, addr = '') => {
  const myNFTFactory = await ethers.getContractFactory(contractName);
  const myNFT = contractName === 'SongLicense' ? await myNFTFactory.deploy(process.env.SONG_NFT_CONTRACT) : await myNFTFactory.deploy();
  console.log("Contract deployed to:", myNFT.address);
}


const contractName = 'SongLicense'; //'SongNFT';
deploy(contractName)
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

