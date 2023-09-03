import React, { useState } from 'react';
import Web3 from 'web3';
import { create } from 'ipfs-http-client';
import Header from '../components/Header.jsx';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
const web3 = new Web3(Web3.givenProvider);

const Form = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const uploadToIpfs = async (file) => {
    const added = await ipfs.add(file);
    return added.path;
  };

  const mintNFT = async (uri) => {
    const accounts = await web3.eth.getAccounts();
    const abi = "contract-abi.json"; // Your Contract ABI
    const contractAddress = '0xc2efA79Fff659130D1ef28067670eb1ed970662c';
    const contract = new web3.eth.Contract(abi, contractAddress);
    
    try {
      await contract.methods.mintNFT(accounts[0], uri).send({ from: accounts[0] });
      console.log(`Minted successfully`);
    } catch (error) {
      console.error('Minting failed', error);
    }
  };

  const handleSubmit = async () => {
    const imageIpfsPath = await uploadToIpfs(file);
    const metadata = {
      title,
      image: `ipfs://${imageIpfsPath}`,
    };
    const metadataIpfsPath = await uploadToIpfs(JSON.stringify(metadata));
    await mintNFT(`ipfs://${metadataIpfsPath}`);
  };

  return (
    <>
      <Header />
      <div className="nftbg">
        <div className="newnft">
          <p className="p1">CREATE</p>
          <p className="p2"> &nbsp;NEW NFT</p>
        </div>
        <form>
          <section>
            <label htmlFor="file">Import file</label>
            <input type="file" name="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
            <div className="photo_container">
              <img src="" alt="profile picture preview" />
            </div>
          </section>
          <section>
            <label htmlFor="title">NFT title</label>
            <input type="text" name="title" id="title" onChange={(e) => setTitle(e.target.value)} />
          </section>
        </form>
        <div className="bar">
          <p>Additional NFT’s details</p>
          <div className="arrow"> </div>
        </div>
        <div className="btn_NFT" onClick={handleSubmit}>
          <p className="btn_text_NFT">✨ Create Now ✨</p>
        </div>
      </div>
    </>
  );
};

export default Form;
