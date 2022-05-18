async function main() {
    const identitesFactory = await ethers.getContractFactory("Identities");
    const identities = await identitesFactory.deploy();
    await identities.deployed();
    
    let tx = await identities.createNewIdentity(["0xeCf76CC823Fd31C1E473cfD3D2ca04DD2f338Fe3"], [100]);
    tx.wait();
    
    console.log(tx);
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
