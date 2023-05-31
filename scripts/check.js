require('dotenv').config();
const bignumber = require('bignumber.js');
const Alchemy = require('alchemy-sdk');

const alchemy = new Alchemy.Alchemy ({
    apiKey: process.env.API_KEY,
    network: Alchemy.Network.ETH_SEPOLIA,
});

exports.verifyOwnership = async (tokenId, address) => {
    const nfts = await alchemy.nft.getNftsForOwner(address);
    for(let nft of nfts['ownedNfts']) {
        // console.log(nft);
        if(bignumber(nft.tokenId, 10).isEqualTo(bignumber(tokenId, 16)))
            return true;
    }
    return false;
};

// exports.verifyOwnership = verifyOwnership;
// works :D
// verifyOwnership('0486b31d357dbc8cfbf3dfcba97382d1901eb2646454efd5590a0f42234d6840', '0xCed7C68AdcE859d655CE1d4d51d7c36F68B4024E').then(console.log)