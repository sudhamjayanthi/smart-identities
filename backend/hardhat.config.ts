import { config as envconfig } from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";

envconfig();

const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYSCAN as string,
    },
  },
};

export default config;