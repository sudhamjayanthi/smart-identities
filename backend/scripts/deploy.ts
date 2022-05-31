/* eslint-disable no-process-exit */
import { ethers } from "hardhat";

async function main() {
  const identityFactory = await ethers.getContractFactory("IdentityFactory");
  const identity = await identityFactory.deploy();
  await identity.deployed();

  console.log("Identity Factory deployed to:", identity.address);
}

const runMain = () => {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
};

runMain();
