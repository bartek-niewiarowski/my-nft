const deploy = async () => {
  const myNFTFactory = await ethers.getContractFactory("SongNFT");
  const myNFT = await myNFTFactory.deploy();
  console.log("Contract deployed to:", myNFT.address);
}

deploy()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
    
