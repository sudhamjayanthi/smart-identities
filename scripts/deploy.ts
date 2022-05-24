import { ethers } from "hardhat";

async function main() {
  // const [s1, s2] = await ethers.getSigners()

  const identityFactory = await ethers.getContractFactory("Identities");
  // const identityFactory = await ethers.getContractFactory("IdentityFactory");
  const identity = await identityFactory.deploy();
  // const identity = await identityFactory.deploy([s1.address,s2.address],[50,50]);
  await identity.deployed();

  console.log("Identities Generator deployed to:", identity.address);
  // console.log("Identity deployed to:", identity.address);

  // console.log("Contract Balance : ",  ethers.utils.formatEther(await ethers.provider.getBalance(identity.address)));

  // console.log("funding contract..")
  // await identity.fallback({ value: ethers.utils.parseEther("0.1") });
  // console.log("Contract Balance : ", ethers.utils.formatEther(await ethers.provider.getBalance(identity.address)));

  // // const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, ethers.getDefaultProvider());
  // const signerAddress = s1.address;
  // // const signerAddress = await signer.getAddress();

  // console.log("Initial wallet bal: ", ethers.utils.formatEther(await ethers.provider.getBalance(signerAddress)));

  // console.log("withdrawing..")

  // const data = await identity.connect(s1).callStatic.withdraw();
  // console.log(data.map(n => ethers.utils.formatEther(n))); 

  // console.log("Wallet bal: ", ethers.utils.formatEther(await ethers.provider.getBalance(signerAddress)));
  // console.log("Contract Balance : ", ethers.utils.formatEther(await ethers.provider.getBalance(identity.address)));

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
