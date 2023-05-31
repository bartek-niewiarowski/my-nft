require('dotenv').config();
const bignumber = require('bignumber.js');
const Alchemy = require('alchemy-sdk');
const parseHash = require('hash_operations').parseHash;

const alchemy = new Alchemy.Alchemy ({
    apiKey: process.env.API_KEY,
    network: Alchemy.Network.ETH_SEPOLIA,
});

exports.verifyOwnership = async (tokenId, address) => {
    const tokens = await alchemy.nft.getNftsForOwner(address);
    const parsedToken = parseHash(tokenId);
    for(let nft of tokens['ownedNfts']) {
        if(bignumber(nft.tokenId, 10).isEqualTo(parsedToken))
            return true;
    }
    return false;
};
