async function main() {
  const [owner] = await hre.ethers.getSigners();

  // Replace with your deployed contract address
  const contractAddress = "0xc2efA79Fff659130D1ef28067670eb1ed970662c";

  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
  const simpleNFT = SimpleNFT.attach(contractAddress);

  // Mint a new NFT
  const uri = "ipfs://QmSC8wGPQJCsG4EZLNasqJvBcAW78XSUK8JWeGrU8C5XGR"; 

  try {
    // Estimate gas
    const gasEstimate = await simpleNFT.connect(owner).estimateGas.mintNFT(owner.address, uri);

    // Send transaction
    const tx = await simpleNFT.connect(owner).mintNFT(owner.address, uri, {
      gasLimit: gasEstimate,
    });
    await tx.wait();

    console.log(`NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/${tx.hash}`);
  } catch (error) {
    console.error('Minting failed:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
