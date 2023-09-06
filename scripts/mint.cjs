const hre = require("hardhat");
const axios = require("axios");

async function main(uri) {
  // Pass the URI as a parameter
  const [owner] = await hre.ethers.getSigners();
  const contractAddress = "0xc2efA79Fff659130D1ef28067670eb1ed970662c";

  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
  const simpleNFT = SimpleNFT.attach(contractAddress);

  // Upload to IPFS through Pinata
  const pinataApiKey = "ff6d3ff7737e8627277c";
  const pinataSecretApiKey =
    "462bb62848846981d6d23bcf21e527172d0d2d8bde7a71047d2c4b383dc88207";

  let cid;
  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        pinataContent: uri, // Use the passed URI instead of hardcoded content
      },
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );
    cid = response.data.IpfsHash;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return;
  }

  const ipfsUri = `ipfs://${cid}`;
  console.log("Minting NFT with URI:", ipfsUri);

  try {
    // Estimate gas
    const estimatedGas = await simpleNFT
      .connect(owner)
      .estimateGas.mintNFT(owner.address, ipfsUri);

    // Set min and max gas limits
    const minGasLimit = 30000;
    const maxGasLimit = 500000;

    // Use the estimated gas if it's within the min-max range, otherwise use the max limit
    const gasToUse =
      estimatedGas.gt(minGasLimit) && estimatedGas.lt(maxGasLimit)
        ? estimatedGas
        : maxGasLimit;

    // Send transaction
    const tx = await simpleNFT.connect(owner).mintNFT(owner.address, ipfsUri, {
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
