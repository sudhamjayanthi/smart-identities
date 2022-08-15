---
title: Contracts
---

## Documentation

The contracts are self-explanatory & can be found in the [backend](https://github.com/sudhamjayanthi/smart-identities/tree/master/backend) folder.

## Deployed Addresses

Contracts deployed on optimism mainnet are being used in frontend.

You can also interact with the contracts deployed on optimism kovan and polygon mumbai using _etherscan interface_ for testing.

1. Optimism Mainnet - [0x3eB42604b82972477D36C8D4e4B026F37AeA70C1](https://optimistic.etherscan.io/address/0x3eb42604b82972477d36c8d4e4b026f37aea70c1)
2. Optimism Kovan - [0x3c5bbd585e82948472ac8eb470BAC64F74067293](https://kovan-optimistic.etherscan.io/address/0x3c5bbd585e82948472ac8eb470BAC64F74067293)
3. Polygon Mumbai - [0x3adF99a751732dd83E3C91f7Cd42e4180EE39101](https://mumbai.polygonscan.com/address/0x3adF99a751732dd83E3C91f7Cd42e4180EE39101)

## File Structure

### contracts

Contains the contracts written in solidity.

### scripts

Contains a `deploy.ts` script to deploy the contract

### test

Contains basic tests (using ethers and chai) for the `Identity` contract to make sure things don't mess up on mainnet.

## Setting up locally

1. Clone the repo

   ```bash
       git clone https://github.com/sudhamjayanthi/smart-identities.git
   ```

2. Go to backend directory

   ```bash
       cd backend
   ```

3. Install dependencies

   ```bash
       yarn install
   ```

That's all, you're good to go! You can start editing the contracts.

### Running tests

Run the tests to make sure your changes haven't messed up other functionality.

```bash
    npx hardhat test
```

### Deploying contract

Once you are ready to deploy the contract.

1. Setup your .env from this [example](https://github.com/sudhamjayanthi/smart-identities/blob/master/backend/.example.env)
2. Run the deploy command

   ```bash
       npx hardhat run scripts/deploy.ts --network <network-name>
   ```

And boom    , it's deployed. The deployed address will logged to your console.
