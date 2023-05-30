const {verifyOwnership} = require("./check");
const mint = require('./mint-nft').mint;
require('dotenv').config();

require('yargs/yargs')(process.argv.slice(2))
    .command({
        command: 'mint <file> [desc]',
        aliases: ['mint', 'mnt'],
        desc: 'Mint a new NFT for the given file',
        builder: (yargs) => yargs.default('desc', ''),
        handler: (argv) => {
            console.log(`Minting new NFT for file ${argv.file} with description: ${argv.desc}`);
            mint(argv.file)
              .then(() => process.exit(0))
              .catch((err) => {
                console.log(err.message);
                process.exit(1);
              });
        }
    })
    .command({
        command: 'sell <tokenId> [price]',
        aliases: ['sell', 'sl'],
        desc: 'Put the NFT up for sale with the given price',
        builder: (yargs) => yargs.coerce('price', parseInt).default('price', 1),
        handler: (argv) => {
            console.log(`Putting NFT ${argv.tokenId} up for sale with a ${argv.price}ETH price tag`);
            // add proper handling
        }
    })
    .command({
        command: 'check <tokenId> [walletId]',
        aliases: ['check', 'chk'],
        desc: 'Check the price/status for the given NFT',
        builder: (yargs) => yargs.default('walletId', process.env.WALLET_ID),
        handler: (argv) => {
            console.log(`Checking listings for NFT ${argv.tokenId}`);
            verifyOwnership(argv.tokenId, argv.walletId).then(console.log);
        }
    })
    .command({
        command: 'buy <tokenId> [price]',
        aliases: ['buy'],
        desc: 'Buy the NFT by its ID',
        builder: (yargs) => yargs.coerce('price', parseInt).default('price', 0),
        handler: (argv) => {
            console.log(`Attempting to buy NFT ${argv.tokenId} for ${argv.price}ETH`);
            // add proper handling
        }
    })
    .help()
    .demandCommand()
    .wrap(72)
    .argv
/*
    Mint new nft:
        action: mint
        file: required path
        price: (opt) initial price
    Put up for sale:
        action: sell
        tokenId: id of token to sell
        price: price
   Check price/status:
        action: check
        tokenId: id of token to check
   Buy:
        action: buy
        tokenId: id of token to buy
        price: your bid
 */