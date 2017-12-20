// under web3@1.0

const Web3 = require("web3");
const namehash = require("eth-ens-namehash");

const rpcEndpoint = "http://localhost:8545";
const web3 = new Web3(rpcEndpoint);

// parameters
const networkId = "777";
let accounts;
let contractOwner;
let domainOwner;
const domain = namehash("dapp-study.eth");

// contracts
const ENSArtifact = require("../build/contracts/ENS.json");
const FIFSRegistrarArtifact = require("../build/contracts/FIFSRegistrar.json");

const ENS = new web3.eth.Contract(ENSArtifact.abi, ENSArtifact.networks[ networkId ].address);
const FIFSRegistrar = new web3.eth.Contract(FIFSRegistrarArtifact.abi, FIFSRegistrarArtifact.networks[ networkId ].address);

const main = async () => {
  try {
    await loadAccounts();

    const r1 = await FIFSRegistrar.methods.register(namehash("dapp-study"), domainOwner)
      .send({ from: contractOwner });
  } catch (e) {
    console.error(e);
  }
};

main();

/**
 * Helper functions
 */
async function loadAccounts() {
  accounts = await web3.eth.getAccounts();
  contractOwner = accounts[ 0 ];
  domainOwner = accounts[ 1 ];
}
