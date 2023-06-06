require('dotenv').config();
const bignumber = require('bignumber.js');
const Alchemy = require('alchemy-sdk');
const parseHash = require('./hash_operations').parseHash;

const alchemy = new Alchemy.Alchemy ({
    apiKey: process.env.API_KEY,
    network: Alchemy.Network.ETH_SEPOLIA,
});

exports.verifyOwnership = async (tokenId, address) => {
    const tokens = await alchemy.nft.getNftsForOwner(
        address,
        {contractAddresses: [process.env.SONG_NFT_CONTRACT]}
    );
    const parsedToken = parseHash(tokenId);
    for(let token of tokens['ownedNfts']) {
        // console.log(bignumber(token.tokenId).toString(16));
        // console.log(parsedToken.toString(16));
        if(bignumber(token.tokenId, 10).isEqualTo(parsedToken))
            return true;
    }
    return false;
};
