require("dotenv").config();

const bal = async (addy: string) =>  ethers.utils.formatEther(await ethers.provider.getBalance(addy));


async function main() {
    // const identitesFactory = await ethers.getContractFactory("Identities");
    // const identities = await identitesFactory.deploy();
    // await identities.deployed();

    // let tx = await identities.createNewIdentity(["0xeCf76CC823Fd31C1E473cfD3D2ca04DD2f338Fe3"], [100]);
    // tx.wait();

    // console.log(tx);

    const [ owner ] = await ethers.getSigners();
    const contract = await ethers.getContractAt("IdentityFactory", "0x0165878A594ca255338adfa4d48449f69242Eb8F");

    console.log(await bal(contract.address));

    await contract.recieve({ value: ethers.utils.parseEther('2', 'ether') });

    console.log(await bal(contract.address));
    await contract.withdraw()
    console.log(await bal(contract.address));
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
