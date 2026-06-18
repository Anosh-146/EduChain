require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    amoy: {
      url: process.env.ALCHEMY_AMOY_URL,
      accounts: [process.env.WALLET_PRIVATE_KEY],
      chainId: 80002,
    }
  }
};
