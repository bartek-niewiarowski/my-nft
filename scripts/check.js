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

exports.verifyOwnership('81113887926496370108094136735208310240630533625817621055747211475411604639272', '0xCed7C68AdcE859d655CE1d4d51d7c36F68B4024E').then(console.log);
exports.verifyOwnership('81113887926496370108094136735208310240630533625817621055747211475411604639272', '0x9Aadb41b89f2987478aCd7AaCc8F57Ba31fA2B41').then(console.log);
