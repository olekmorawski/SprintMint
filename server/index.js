import express from "express";
import cors from "cors";
import { create } from "kubo-rpc-client";
const PORT = 3000;
const app = express();

// Enable CORS for all routes
app.use(cors());

// Initialize Kubo RPC Client
let client;

(async () => {
  client = create();
})();

// Add a file to IPFS through Kubo RPC Client and return its CID
app.post("/add", async (req, res) => {
  try {
    const { cid } = await client.add("Hello world!");
    res.json({ cid: cid.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
