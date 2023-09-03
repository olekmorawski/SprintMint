import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom'; 

const Home = () => {
  const navigate = useNavigate();

  const handleCreateNowClick = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          navigate('/form/'); 
        }
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      alert('MetaMask is not installed. Please consider installing it: https://metamask.io/');
    }
  };

  return (
    <>
      <div className="overlay">
        <Header />
        <div className="under_header">
          <div className="main_box">
            <div className="under_text">
              <p className="p1">CREATE UNIQUE</p>
              <p className="p2">&nbsp;NFTS</p>
            </div>

            <div className="img_box">
              <img
                src="styles/images/circle.png"
                alt="Circle"
                className="Circle"
              />
              <img
                src="styles/images/cards.png"
                alt="Cards"
                className="Cards"
              />
            </div>

            <div className="btn_und" onClick={handleCreateNowClick}>
              <p className="btn_text_und">✨ Create Now ✨</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
