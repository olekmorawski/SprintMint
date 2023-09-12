const express = require("express");
const axios = require("axios");
const multer = require("multer");
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

async function storeOnIPFS(fileBuffer, title) {
  try {
    const options = {
      pinataMetadata: {
        name: title, // This is the filename
      },
    };
    const imageResult = await pinata.pinFileToIPFS(
      bufferToStream(fileBuffer),
      options
    );
    const metadata = {
      title: title,
      image: `https://gateway.pinata.cloud/ipfs/${imageResult.IpfsHash}`,
    };
    const metadataResult = await pinata.pinJSONToIPFS(metadata, options);
    return metadataResult.IpfsHash;
  } catch (error) {
    console.log("IPFS Upload Error:", error);
  }
}
const ipfsHashes = [];

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const title = req.body.title;
    const ipfsHash = await storeOnIPFS(fileBuffer, title);
    ipfsHashes.push(ipfsHash);
    res.status(200).send({ message: "File stored on IPFS", ipfsHash });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/get-ipfs", async (req, res) => {
  if (ipfsHashes.length === 0) {
    return res.status(404).send("No IPFS Hash Found");
  }
  const getLastestHash = ipfsHashes[ipfsHashes.length - 1];
  try {
    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${getLastestHash}`
    );
    const metadata = response.data;
    res.status(200).send({ ipfsHash: getLastestHash, metadata });
  } catch (error) {
    console.error("Error fetching metadata from IPFS:", error);
    res.status(500).send("Failed to fetch metadata from IPFS.");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
