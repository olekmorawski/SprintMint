require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    "mantle-testnet": {
      url: "https://rpc.testnet.mantle.xyz",
      accounts: [process.env.PRIV_KEY],
    },
  }
};
