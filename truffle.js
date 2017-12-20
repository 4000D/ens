var TestRPC = require('ethereumjs-testrpc');

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4500000,
      gasPrice: 20e9,
    },
    'dev.fifs': {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    'dev.auction': {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    test: {
      provider: TestRPC.provider(), // in-memory TestRPC provider
      network_id: "*" // Match any network id
    }
  }
};
