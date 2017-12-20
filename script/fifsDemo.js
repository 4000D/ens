// under web3@1.0

const Web3 = require("web3");
const namehash = require("eth-ens-namehash");

const rpcEndpoint = "http://localhost:8545";
const web3 = new Web3(rpcEndpoint);

// parameters
const networkId = "777";
const domain = "4000d.eth";
let accounts;
let contractOwner;
let domainOwner;

// contracts
const ENSArtifact = require("../build/contracts/ENS.json");
const FIFSRegistrarArtifact = require("../build/contracts/FIFSRegistrar.json");
const PublicResolverArtifact = require("../build/contracts/PublicResolver.json");

const ens = new web3.eth.Contract(ENSArtifact.abi, ENSArtifact.networks[ networkId ].address);
const fifsRegistrar = new web3.eth.Contract(FIFSRegistrarArtifact.abi, FIFSRegistrarArtifact.networks[ networkId ].address);
const publicResolver = new web3.eth.Contract(PublicResolverArtifact.abi, PublicResolverArtifact.networks[ networkId ].address);

const main = async () => {
  try {
    await loadAccounts();
    logAddrs();
    await registerDomain(domain);
    await getAddr(domain);
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

async function registerDomain(domain) {
  console.log("\nregisterDomain");
  console.log(`register "${ domain } to ${ domainOwner }"`);

  const label = domain.split(".")[ 0 ];

  const labelHash = web3.utils.soliditySha3(label);
  const domainNamehash = namehash(domain);

  const r = await fifsRegistrar.methods.register(labelHash, domainOwner)
    .send({ from: contractOwner });

  console.log("register tx", r.transactionHash);

  const _domainOwner = await ens.methods.owner(domainNamehash).call();

  console.log("domainOwner", domainOwner);
  console.log("_domainOwner", _domainOwner);

  const r2 = await ens.methods.setResolver(publicResolver.address);

  const r3 = await publicResolver.methods.setAddr(domainNamehash, publicResolver.address)
    .send({ from: domainOwner });

  console.log("register public resolver to", publicResolver._address);

  console.log(`
domain \t ${ domain }

label \t ${ label }
labelHash \t ${ labelHash }
domainNamehash \t ${ domainNamehash }`);
}

async function getAddr(domain) {
  console.log("\ngetAddr");

  const domainNamehash = namehash(domain);

  const resolverAddr = await ens.methods.resolver(domainNamehash).call();

  console.log(`
resolverAddr \t ${ resolverAddr }`);

  const resolver = new web3.eth.Contract(PublicResolverArtifact.abi, resolverAddr);

  const addr = await resolver.methods.addr(domainNamehash).call();

  console.log(`
domain \t ${ domain }
domainNamehash \t ${ domainNamehash }
address of ${ domain } \t ${ addr }
`);
}

function logAddrs() {
  console.log(`
contract owner : ${ contractOwner }
domain owner : ${ domainOwner }

ENS: ${ ens._address }
FIFSRegistrar: ${ fifsRegistrar._address }
PublicResolver: ${ publicResolver._address }
`);
}
