import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Identity } from "../typechain";

const { expect } = require("chai");

describe("Identity contract", () => {
    let identity: Identity;

    let signers: SignerWithAddress[];
    let signer: SignerWithAddress;

    let owners: string[];
    let equities: number[];

    beforeEach(async () => {
        signers = await ethers.getSigners()
        signer = signers[0]

        owners = [signer.address, "0x799c7ab04cd4643dccea669fe08e15004630aa7c"]
        equities = [60, 40]

        const identityFactory = await ethers.getContractFactory("Identity");
        identity = await identityFactory.deploy(owners, equities)
    })

    it("Cashout native token", async function () {
        const randAmount = Math.floor(Math.random() * 10 + 1)
        console.log(randAmount)

        // send some ether to identity contract
        const t1 = await identity.fallback({ value: ethers.utils.parseEther(randAmount.toString()) })
        t1.wait()

        const oldOwnerBal = ethers.utils.formatEther(await ethers.provider.getBalance(owners[1]))

        // cashout identity
        const t2 = await identity.connect(signer).withdraw()
        t2.wait()

        // check that the identity has been emptied
        const balance = await ethers.provider.getBalance(identity.address)
        expect(balance).to.be.equal(ethers.utils.parseEther("0"))

        // check that the tokens are transferred according to the equities
        const ownerBal = await ethers.provider.getBalance(owners[1])
        expect(ownerBal).to.be.equal(ethers.utils.parseEther((oldOwnerBal + ((equities[1] / 100) * randAmount)).toString()))
    });
});