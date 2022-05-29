/* eslint-disable no-process-exit */
import { ethers } from "hardhat";

async function main() {
  const identityFactory = await ethers.getContractFactory("Identities");
  const identity = await identityFactory.deploy();
  await identity.deployed();

  console.log("Identities Generator deployed to:", identity.address);
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
