import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import img from "/styles/images/logo.png";

const Header = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          navigate("/form");
        }
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      alert(
        "MetaMask is not installed. Please consider installing it: https://metamask.io/"
      );
    }
    setIsWalletConnected(true);
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    provider = null;
  };

  return (
    <div className="header">
      <div className="logo_container">
        <img src={img} alt="Our Logo" className="logo" />
      </div>
      <div className="box_header">
        <Link to="/marketplace">
          <div className="header_nav">
            <p className="nav_text">Marketplace</p>
          </div>
        </Link>
        <Link to="/projects">
          <div className="header_nav">
            <p className="nav_text">Projects</p>
          </div>
        </Link>
        <Link to="/discord">
          <div className="header_nav">
            <p className="nav_text">Discord</p>
          </div>
        </Link>
        <Link to="/about">
          <div className="header_nav">
            <p className="nav_text">About</p>
          </div>
        </Link>
      </div>
      <div
        className="btn_nav"
        onClick={isWalletConnected ? disconnectWallet : connectWallet}>
        <p className="btn_text">
          {isWalletConnected ? "Disconnect" : "✨Create Now✨"}
        </p>
      </div>
    </div>
  );
};

export default Header;
