const express = require("express");
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
  console.log("Storing file on IPFS");
  try {
    const imageResult = await pinata.pinFileToIPFS(bufferToStream(fileBuffer));
    const metadata = {
      title: title,
      image: `ipfs://${imageResult.IpfsHash}`,
    };
    const options = {
      pinataMetadata: {
        name: title,
      },
    };
    const metadataResult = await pinata.pinJSONToIPFS(metadata, options);
    return metadataResult.IpfsHash;
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    throw error;
  }
}

app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log("/api/mint route triggered");
  try {
    const fileBuffer = req.file.buffer;
    const title = req.body.title;
    console.log("Received file buffer:", fileBuffer);

    const ipfsHash = await storeOnIPFS(fileBuffer, title);
    console.log(`File stored on IPFS with hash: ${ipfsHash}`);

    res.status(200).send({ message: "File stored on IPFS", ipfsHash });
  } catch (error) {
    console.error("Error in /api/mint route:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
