import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Identity, TestERC20, TestERC721 } from "../typechain";

const chai = require("chai");
const expect = chai.expect;
chai.use(require('chai-as-promised'));

describe("Identity contract", () => {
    let identity: Identity;
    let ERC20: TestERC20;
    let ERC721: TestERC721;

    let signers: SignerWithAddress[];
    let signer: SignerWithAddress;

    let owners: string[];
    let equities: number[];

    beforeEach(async () => {
        signers = await ethers.getSigners()
        signer = signers[0]

        owners = [signer.address.toLowerCase(), "0x799c7ab04cd4643dccea669fe08e15004630aa7c".toLowerCase()]
        equities = [60, 40]

        const identityFactory = await ethers.getContractFactory("Identity");
        identity = await identityFactory.deploy(owners, equities)
        // console.log("Deployed identity contract at ", identity.address)

        const ERC20Factory = await ethers.getContractFactory("TestERC20");
        ERC20 = await ERC20Factory.deploy();
        // console.log("Deployed test ERC20 contract at ", ERC20.address)

        const ERC721Factory = await ethers.getContractFactory("TestERC721");
        ERC721 = await ERC721Factory.deploy();
        // console.log("Deployed test ERC721 contract at ", ERC721.address)
    })

    it("getOwners", async function () {
        const _owners = await identity.getOwners()
        expect(_owners.map(a => a.toLowerCase())).to.have.same.members(owners)
    })

    it("getEquitites", async function () {
        const _owners = await identity.getOwners()
        const _equities = await Promise.all(_owners.map(async _owner => {
            const _equity = await identity.equities(_owner);
            return _equity.toNumber()
        }))
        expect(_equities).to.have.same.members(equities)
    })

    it("transferNFT & hasNFT", async function () {
        await ERC721.safeMint(signer.address)
        // console.log("Successfully minted a ERC721 to tester.")

        await ERC721.approve(identity.address, 0)
        await identity.transferNFT(ERC721.address, 0)

        const nfts = await identity.getNfts()
        const hasNft = await identity.hasNft(ERC721.address, 0)

        expect(nfts.length).to.equal(1)
        expect(hasNft[0]).to.be.true // hasNft returns an array of [bool, time since the nft was sent (in block numbers)]
    })

    const sendAndAcceptTokens = async () => {
        await identity.fallback({ value: ethers.utils.parseEther("100.0") })
        expect(await ethers.provider.getBalance(identity.address)).to.equal(ethers.utils.parseEther("100"))
        // console.log("Successfully sent 100 ether to identity contract.")

        await ERC20.mint(identity.address, 100);
        expect(await ERC20.balanceOf(identity.address)).to.equal(100)
        // console.log("Successfully sent 100 ERC20 tokens to identity.")

        await identity.acceptErc20(ERC20.address)
        expect(await identity.getAcceptedTokens()).has.same.members([ERC20.address])
        // console.log("Successfully accepted ERC20 token.")

    }

    it("withdraw", async function () {
        await sendAndAcceptTokens()

        await identity.withdraw()

        // make sure identity has been emptied
        expect(await ethers.provider.getBalance(identity.address)).to.equal(ethers.utils.parseEther("0"))
        expect(await ERC20.balanceOf(identity.address)).to.equal(0)

        // make sure owner got the tokens properly 
        expect(await ethers.provider.getBalance(owners[1])).to.equal(ethers.utils.parseEther(equities[1].toString()))
        expect(await ERC20.balanceOf(owners[1])).to.equal(equities[1])

    });

    it("dis-integrate identity", async function () {
        await sendAndAcceptTokens();

        await ERC721.safeMint(signer.address)
        // console.log("Successfully minted a ERC721 to tester.")

        await ERC721.approve(identity.address, 0)
        await identity.transferNFT(ERC721.address, 0)

        const oldOwnerBal = await ethers.provider.getBalance(owners[1])

        // cashouts everything and destroys the contract
        await identity.disintegrate()

        // contract can no longer be called
        await expect(identity.getOwners()).to.eventually.be.rejectedWith("CALL_EXCEPTION");

        // contract has been cashed out
        expect(await ethers.provider.getBalance(identity.address)).to.equal(ethers.utils.parseEther("0"))
        expect(await ERC20.balanceOf(identity.address)).to.equal(0)
        expect(await ERC721.balanceOf(identity.address)).to.equal(0)

        const newOwnerBal = await ethers.provider.getBalance(owners[1])

        // owners got the tokens properly 
        expect(newOwnerBal.sub(oldOwnerBal)).to.equal(ethers.utils.parseEther(equities[1].toString()))

        expect(await ERC20.balanceOf(owners[0])).to.equal(equities[0])
        expect(await ERC20.balanceOf(owners[1])).to.equal(equities[1])

        expect(await ERC721.balanceOf(owners[0])).to.equal(1) // nft is sent by first owner, hence returned to
        expect(await ERC721.balanceOf(owners[1])).to.equal(0)
    });
});