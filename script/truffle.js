namehash = require("eth-ens-namehash");

sha3 = new (require("web3"))().utils.soliditySha3;

contractOwner = web3.eth.accounts[ 0 ];
domainOwner = web3.eth.accounts[ 1 ];

eth = web3.eth;

subdomain = "4000d";
subdomainNameHash = namehash(subdomain);
subdomainHash = sha3(subdomain);

ENS.deployed().then(i => ens = i);
FIFSRegistrar.deployed().then(i => fifsRegistrar = i);
PublicResolver.deployed().then(i => publicResolver = i);

fifsRegistrar.register(subdomainHash, domainOwner);

ens.setResolver(subdomainNameHash, publicResolver.address);
