import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { SocketAddress } from "net";
import { Identity, TestERC20, TestERC721 } from "../typechain";

const { expect } = require("chai");

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
        console.log("Deployed identity contract at ", identity.address)

        const ERC20Factory = await ethers.getContractFactory("TestERC20");
        ERC20 = await ERC20Factory.deploy();
        console.log("Deployed test ERC20 contract at ", ERC20.address)

        const ERC721Factory = await ethers.getContractFactory("TestERC721");
        ERC721 = await ERC721Factory.deploy();
        console.log("Deployed test ERC721 contract at ", ERC721.address)

        ERC20.mint(signer.address, 1000);
        console.log("Successfully minted 1000 ERC20 tokens to tester.")

        ERC721.safeMint(signer.address)
        console.log("Successfully minted a ERC721 to tester.")

        // console.log(ERC20.balanceOf(signer.address))
        // console.log(ERC20.balanceOf("0x799c7ab04cd4643dccea669fe08e15004630aa7c".toLowerCase()))
    })

    it.skip("getOwners", async function () {
        const _owners = await identity.getOwners()
        expect(_owners.map(a => a.toLowerCase())).to.have.same.members(owners)
    })

    it.skip("getEquitites", async function () {
        const _owners = await identity.getOwners()
        const _equities = await Promise.all(_owners.map(async _owner => {
            const _equity = await identity.equities(_owner);
            return _equity.toNumber()
        }))
        expect(_equities).to.have.same.members(equities)
    })

    it("transferNFT & hasNFT", async function () {
        await ERC721.approve(identity.address, 0)
        await identity.transferNFT(ERC721.address, 0)

        const nfts = await identity.getNfts()
        const hasNft = await identity.hasNft(ERC721.address, 0)

        expect(nfts.length).to.equal(1)
        expect(hasNft[0]).to.be.true // hasNft returns an array of [bool, time since the nft was sent (in block numbers)]
    })

    // it("acceptTokens", async function () {
    //     const _owners = await identity.connect(signer).acceptErc20("")

    //     const _tokens = await identity.getAcceptedTokens()
    //     expect(_tokens).to.have.same.members([])
    // })

    // it("Cashout native token", async function () {
    //     const randAmount = Math.floor(Math.random() * 10 + 1)
    //     console.log(randAmount)

    //     // send some ether to identity contract
    //     const t1 = await identity.fallback({ value: ethers.utils.parseEther(randAmount.toString()) })
    //     t1.wait()

    //     const oldOwnerBal = ethers.utils.formatEther(await ethers.provider.getBalance(owners[1]))

    //     // cashout identity
    //     const t2 = await identity.connect(signer).withdraw()
    //     t2.wait()

    //     // check that the identity has been emptied
    //     const balance = await ethers.provider.getBalance(identity.address)
    //     expect(balance).to.be.equal(ethers.utils.parseEther("0"))

    //     // check that the tokens are transferred according to the equities
    //     const ownerBal = await ethers.provider.getBalance(owners[1])
    //     expect(ownerBal).to.be.equal(ethers.utils.parseEther((oldOwnerBal + ((equities[1] / 100) * randAmount)).toString()))
    // });
});

// tests structure: 
// - withdraw (can be absctracted)
//     - send erc20
//     - send ether
//     - accept token
//     - finally cashout
// - destruct 
//     - above steps repeated
//     - but finally send erc721
//     - and call destruct instead of withdraw()