async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");

  const simpleNFT = await SimpleNFT.deploy({
    gasLimit: 30000000,
  });

  await simpleNFT.deployed();

  console.log("SimpleNFT deployed to:", simpleNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
