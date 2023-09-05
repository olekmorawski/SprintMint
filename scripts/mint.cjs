const hre = require("hardhat");
const { create } = require("kubo-rpc-client");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  // Replace with your deployed contract address
  const contractAddress = "0xc2efA79Fff659130D1ef28067670eb1ed970662c";

  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
  const simpleNFT = SimpleNFT.attach(contractAddress);

  // Initialize Kubo RPC client
  const kuboClient = create();

  // Replace this with the actual content you want to upload to IPFS
  const content = "Your content here";

  // Upload to IPFS through Kubo RPC
  const { cid } = await kuboClient.add(content);
  const uri = `ipfs://${cid}`;

  console.log("Minting NFT with URI: ", uri);

  try {
    // Estimate gas
    const estimatedGas = await simpleNFT
      .connect(owner)
      .estimateGas.mintNFT(owner.address, uri);

    // Set min and max gas limits
    const minGasLimit = 21000;
    const maxGasLimit = 500000;

    // Use the estimated gas if it's within the min-max range, otherwise use the max limit
    const gasToUse =
      estimatedGas.gt(minGasLimit) && estimatedGas.lt(maxGasLimit)
        ? estimatedGas
        : maxGasLimit;

    // Send transaction
    const tx = await simpleNFT.connect(owner).mintNFT(owner.address, uri, {
      gasLimit: gasToUse,
    });
    await tx.wait();

    console.log(
      `NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/${tx.hash}`
    );
  } catch (error) {
    console.error("Minting failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
