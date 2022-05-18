const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("deploy and test identities", async () => {
    it("create identity", async () => {
        const identitesFactory = await ethers.getContractFactory("Identities");
        const identities = await identitesFactory.deploy();
        await identities.deployed();
        
        let tx = await identities.createNewIdentity(["0xeCf76CC823Fd31C1E473cfD3D2ca04DD2f338Fe3"], [100]);
        await tx.wait();

        console.log(tx);
    }) 
});