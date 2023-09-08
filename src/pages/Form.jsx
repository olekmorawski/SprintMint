import { useState, useEffect } from "react";
import Web3 from "web3";
import Header from "../components/Header.jsx";
import axios from "axios";
import abi from "../../abis/contractAbi";

let web3;

const contractAddress = "0x64e2C361edB18972D6a82378a88533dd5D9B18b6";

const Form = () => {
  const [file, setFile] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [title, setTitle] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
        const contractInstance = new web3.eth.Contract(abi, contractAddress);
        setContract(contractInstance);
      } else {
        console.error("Ethereum provider not found");
      }
    };
    init();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected File:", selectedFile);
    setFile(selectedFile);
    const objectURL = URL.createObjectURL(selectedFile);
    setImgURL(objectURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    if (file) {
      try {
        const accounts = await web3.eth.getAccounts();
        console.log("File found, attempting to mint NFT...");

        // Upload the file to your backend first to get the metadata URI.
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        const response = await axios.post(
          "http://localhost:3000/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data && response.data.ipfsHash) {
          const metadataUri = `ipfs://${response.data.ipfsHash}`;
          // const gasEstimate = await contract.methods
          //   .mintNFT(accounts[0], metadataUri, title)
          //   .estimateGas({ from: accounts[0] });

          const txReceipt = await contract.methods
            .mintNFT(accounts[0], metadataUri, title)
            .send({ from: accounts[0], gas: 500000  });

          console.log("Minting Response:", txReceipt);
        }
      } catch (error) {
        console.error("Error during minting process:", error);
      }
    } else {
      console.error("No file selected");
    }
  };

  return (
    <>
      <Header />
      <div className="nftbg">
        <div className="newnft">
          <p className="p1">CREATE</p>
          <p className="p2"> &nbsp;NEW NFT</p>
        </div>
        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="file">Import file</label>
            <input
              type="file"
              name="file"
              id="file"
              onChange={handleFileChange}
            />
            <div className="photo_container">
              <img src={imgURL} alt="profile picture preview" />
            </div>
          </section>
          <section>
            <label htmlFor="title">NFT title</label>
            <input
              type="text"
              name="title"
              id="title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </section>
          <button type="submit" className="btn_NFT">
            <p className="btn_text_NFT">✨ Create Now ✨</p>
          </button>
        </form>
        <div className="bar">
          <p>Additional NFTs details</p>
          <div className="arrow"> </div>
        </div>
      </div>
    </>
  );
};

export default Form;
