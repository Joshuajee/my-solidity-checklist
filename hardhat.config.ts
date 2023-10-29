import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.19" },
      { version: "0.4.24" },
      { version: "0.4.8" },
    ],
    overrides: {
      "contracts/mocks/LinksToken.sol": {
        version: "0.4.8",
        settings: { }
      }
    }
  }
};

export default config;
