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
      image: `ipfs://${imageResult.IpfsHash}`,
    };
    const metadataResult = await pinata.pinJSONToIPFS(metadata, options);
    return metadataResult.IpfsHash;
  } catch (error) {
    console.log("IPFS Upload Error:", error);
  }
}

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const title = req.body.title;
    const ipfsHash = await storeOnIPFS(fileBuffer, title);
    res.status(200).send({ message: "File stored on IPFS", ipfsHash });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
