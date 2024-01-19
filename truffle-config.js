require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { INFURA_API_KEY, MNEMONIC } = process.env;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: "8545", // 7545 for Ganache UI
      network_id: "*",
    },
    sepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_KEY),
      network_id: 11155111, // Sepolia's network ID
      gas: 4465030, // Adjust the gas limit as per your requirements
      gasPrice: 10000000000, // Set the gas price to an appropriate value
      confirmations: 2, // Set the number of confirmations needed for a transaction
      timeoutBlocks: 200, // Set the timeout for transactions
      skipDryRun: true, // Skip the dry run option
      networkCheckTimeout: 10000,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/truffle_abis",
  compilers: {
    solc: {
      version: "0.8.20",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};