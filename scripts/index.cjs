const express = require("express");
const multer = require("multer");
const hre = require("hardhat");
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK(
  "ff6d3ff7737e8627277c",
  "462bb62848846981d6d23bcf21e527172d0d2d8bde7a71047d2c4b383dc88207"
);
const { Readable } = require("stream");
const cors = require("cors");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

function bufferToStream(buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

async function mintNFT(fileBuffer) {
  console.log("MintNFT function started");
  const [owner] = await hre.ethers.getSigners();
  console.log("Owner's Address:", owner.address);
  const contractAddress = "0x227d23545A2B53dEF6A9e68402482534Fd9cb961";
  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
  const simpleNFT = SimpleNFT.attach(contractAddress);
  const fileStream = bufferToStream(fileBuffer);
  let cid;

  try {
    const options = {
      pinataMetadata: {
        name: "MyNFTName",
      },
    };
    const result = await pinata.pinFileToIPFS(fileStream, options);
    cid = result.IpfsHash;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    return;
  }
  const ipfsUri = `ipfs://${cid}`;
  console.log("Minting NFT with URI:", ipfsUri);
  try {
    console.log("Trying to mint NFT...");

    const estimatedGas = await simpleNFT
      .connect(owner)
      .estimateGas.mintNFT(owner.address, ipfsUri);

    console.log("Estimated Gas:", estimatedGas.toString());

    const minGasLimit = 30000000;
    const maxGasLimit = 50000000;

    const gasToUse =
      estimatedGas.gt(minGasLimit) && estimatedGas.lt(maxGasLimit)
        ? estimatedGas
        : maxGasLimit;

    console.log("Gas for the transaction:", gasToUse.toString());

    console.log("Waiting for transaction to go through...");

    const tx = await simpleNFT.connect(owner).mintNFT(owner.address, ipfsUri, {
      gasLimit: gasToUse,
    });

    const receipt = await tx.wait();

    if (receipt.status === 0) {
      console.error("Transaction failed.");
      throw new Error("The transaction was reverted.");
    }

    console.log(
      `NFT Minted! Check it out at: https://explorer.testnet.mantle.xyz/tx/${tx.hash}`
    );
  } catch (error) {
    console.error("Minting failed:", error);
  }
}

app.post("/api/mint", upload.single("file"), async (req, res) => {
  console.log("/api/mint route triggered");
  try {
    const fileBuffer = req.file.buffer;
    console.log("Received file buffer:", fileBuffer);
    await mintNFT(fileBuffer);
    console.log("Minting completed successfully");
    res.status(200).send("NFT Minted Successfully");
  } catch (error) {
    console.error("Error in /api/mint route:", error);
    res.status(500).send("Internal Server Error");
  }
  console.log("Minting completed successfully");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
