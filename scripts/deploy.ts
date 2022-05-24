import { ethers } from "hardhat";

async function main() {
  const identityFactory = await ethers.getContractFactory("IdentityFactory");
  // const identity = await identityFactory.deploy();
  const identity = await identityFactory.deploy(["0xeCf76CC823Fd31C1E473cfD3D2ca04DD2f338Fe3", "0x799c7Ab04CD4643DcCEA669Fe08E15004630aA7C"], [50, 50]);
  await identity.deployed();

  // console.log("Identities Generator deployed to:", identity.address);
  console.log("Identity deployed to:", identity.address);
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
