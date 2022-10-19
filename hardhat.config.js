require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.4",
  networks: {
    arbitrum: {
      url: " https://rinkeby.arbitrum.io/rpc",
      accounts: ["d9b2cc0ac15b59fd6d94eb25744013a8514d79c16f897c3204063c88434c5668"]
    },
    hardhat: {
      allowUnlimitedContractSize: true
    },
    dexit: {
      url: "http://192.168.0.155:8545",
      accounts: ["d9b2cc0ac15b59fd6d94eb25744013a8514d79c16f897c3204063c88434c5668", "ccb72c8d81be977c2f08b6d1d194d54211565c12cdc153098e65fa1d6f81490f", "9907d6cbcd288ae32f9a92a3b592506fddc1e054412fc18f433bb37ad0e62980", "88a3247e47698cfff2be1c9daa6b86698b8864a50d73cdd4b472ac2d11fa2773", "af1ce27ab113653e6d8813963bf2fddb4ce72a1f7a1b407ee520726a3c2e4d74"],
      gasPrice: 8000000000,
      gas: 2100000
    },
  },
  allowUnlimitedContractSize: true,
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  // contractSizer: {
  //   alphaSort: true,
  //   disambiguatePaths: false,
  //   runOnCompile: true,
  //   strict: true,
  // }
}

