import { chain, etherscanBlockExplorers } from "wagmi";

const CHAIN = chain.optimism;
const EXPLORER = etherscanBlockExplorers.optimism.url;
const FACTORY_ADDRESS = "0x3eB42604b82972477D36C8D4e4B026F37AeA70C1";

// const CHAIN = chain.optimismKovan;
// const EXPLORER = etherscanBlockExplorers.optimismKovan.url;
// const FACTORY_ADDRESS = "0x3c5bbd585e82948472ac8eb470BAC64F74067293";

// const CHAIN = chain.polygonMumbai;
// const EXPLORER = etherscanBlockExplorers.polygonMumbai.url;
// const FACTORY_ADDRESS = "0x3adF99a751732dd83E3C91f7Cd42e4180EE39101";

export { FACTORY_ADDRESS, CHAIN, EXPLORER };
