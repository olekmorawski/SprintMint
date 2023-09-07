const express = require("express");
const multer = require("multer");
const hre = require("hardhat");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());

async function mintNFT(fileBuffer) {
  const [owner] = await hre.ethers.getSigners();
  const contractAddress = "0x73ba4C37CE620CE4F7883ED4FCDF289c5448628B";
  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
  const simpleNFT = SimpleNFT.attach(contractAddress);

  const formData = new FormData();
  formData.append("file", fileBuffer, { filename: "file.png" });

  const pinataApiKey = "ff6d3ff7737e8627277c";
  const pinataSecretApiKey =
    "462bb62848846981d6d23bcf21e527172d0d2d8bde7a71047d2c4b383dc88207";

  let cid;
  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
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
    console.error("Error Details:", error.message); // Log the error message
    console.error("Error Stack Trace:", error.stack); // Log the stack trace
  }
}

app.post("/api/mint", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    console.log("Received file buffer:", fileBuffer); // Log the received file buffer
    await mintNFT(fileBuffer);
    console.log("Minting completed successfully");
    res.status(200).send("NFT Minted Successfully");
  } catch (error) {
    console.error("Error in /api/mint route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
