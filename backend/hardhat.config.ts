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
    koptimism: {
      url: "https://kovan.optimism.io/",
      accounts: [process.env.PRIVATE_KEY as string],
    },
    hardhat: {
      // forking: {
      //   url: "https://polygon-mumbai.g.alchemy.com/v2/GMWseXL8mbgbjSdFRglCqZKSj4z9qhgx",
      //   blockNumber: 26784156,
      // }
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYSCAN as string,
      optimisticKovan: process.env.OPTIMISM_ETHERSCAN as string,
    },
  },
};

export default config;
