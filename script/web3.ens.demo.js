// in truffle environment

namehash = require("eth-ens-namehash");

eth = web3.eth;
sha3 = web3.sha3;

contractOwner = web3.eth.accounts[ 0 ];
domainOwner = web3.eth.accounts[ 1 ];

subdomain = "4000d";
subdomainHash = sha3(subdomain);
subdomainNameHash = namehash('4000d.eth');

ENS.deployed().then(i => ens = i);
FIFSRegistrar.deployed().then(i => fifsRegistrar = i);
PublicResolver.deployed().then(i => publicResolver = i);

// register '4000d.eth' with `domainOwner`
fifsRegistrar.register(subdomainHash, domainOwner);

ens.owner(subdomainNameHash);

ens.setResolver(subdomainNameHash, publicResolver.address, { from: domainOwner });

ens.records(subdomainNameHash)

publicResolver.setAddr(subdomainNameHash, domainOwner, { from: domainOwner });

// get address of '4000d.eth'
domain = '4000d.eth';
domainNamehash = namehash(domain);

resolverAddr = ens.resolver(domainNamehash)


    .then(_resolverAddr => resolverAddr = _resolverAddr)
    .then(() => PublicResolver.at(resolverAddr))
    .then(resolver => resolver.at(resolverAddr).addr(domainNamehash))
}
