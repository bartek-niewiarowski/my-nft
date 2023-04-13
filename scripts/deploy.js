const main = async () => {
  const myNFTFactory = await ethers.getContractFactory("MyNFT");
  const myNFT = await myNFTFactory.deploy();
  console.log("Contract deployed to:", myNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
    
