require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
});

const uploadFile = (path) => {
    let file = fs.createReadStream(path);
    pinata.pinFileToIPFS(file).then((result) => {
        //handle results here
        console.log(result);
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
}

const uploadMetadata = () => {
    let metadata = {
        "description": "foobar",
        "image": "https://gateway.pinata.cloud/ipfs/QmYsARNjjjYXnKiLJeKTTR6jp3cMRgZMDFdNEZWeC384yd",
        "name": "foobar test test"
    }
}