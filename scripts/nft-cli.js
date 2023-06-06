const {verifyOwnership} = require('./check');
const {sellNFT, buyNFT} = require('./sell-nft')
const mint = require('./mint-nft').mint;
require('dotenv').config();
const bignumber = require('bignumber.js');

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
            console.log(`Putting NFT ${argv.tokenId} up for sale with a ${argv.price}WEI price tag`);
            sellNFT(argv.tokenId, argv.price)
                .then(console.log)
                .catch((err) => {
                    console.log(err.message);
                    process.exit(1);
                });
        }
    })
    .command({
        command: 'check <tokenId> <walletId>',
        aliases: ['check', 'chk'],
        desc: 'Check the price/status for the given NFT',
        builder: (yargs) => yargs.default('walletId', process.env.WALLET_2_ID),
        handler: (argv) => {
            argv.walletId = `0x${bignumber(argv.walletId).toString(16)}`;
            if(!argv.walletId.startsWith('0x')) {
                argv.walletId = `0x${argv.walletId}`;
            }
            console.log(`Checking listings for NFT ${argv.tokenId} and ${argv.walletId}`);
            verifyOwnership(argv.tokenId, argv.walletId)
                .then(console.log)
                .catch((err) => {
                    console.error(err);
                    process.exit(1);
                });
        }
    })
    .command({
        command: 'buy <tokenId> <walletId> [price]',
        aliases: ['buy'],
        desc: 'Buy the NFT by its ID',
        builder: (yargs) => yargs.coerce('price', parseInt).default('price', 0),
        handler: (argv) => {
            if(typeof argv.walletId === "number") {
                console.log('yay');
                argv.walletId = `0x${bignumber(argv.walletId).toString(16)}`;
            } if(!argv.walletId.startsWith('0x')) {
                argv.walletId = `0x${argv.walletId}`;
            }
            console.log(`Attempting to buy NFT ${argv.tokenId} for ${argv.price}WEI`);
            buyNFT(argv.tokenId, argv.price, argv.walletId)
                .then(console.log)
                .catch((err) => {
                    console.log(err.message);
                    process.exit(1);
                });
        }
    })
    .help()
    .demandCommand()
    .wrap(72)
    .argv
