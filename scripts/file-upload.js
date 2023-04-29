require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

const uploadFile = (path, name) => {
    const file = fs.createReadStream(path);
    const options = {
        pinataMetadata: {
            name: name,
        },
        pinataOptions: {
            cidVersion: 0,
        },
    };
    return pinata.pinFileToIPFS(file, options).then((result) => {
        console.log('Success uploading file to Pinata, here\'s the result:');
        console.log(result);
        return result.IpfsHash;
    }).catch((err) => {
        //handle error here
        console.log('Failed to upload given file to pinata!')
        console.log(err);
        return null;
    });
}

const uploadMetadata = (fileName, description, imageUri) => {
    const name = fileName.replace(/\..+$/, '.json');
    const metadata = {
        'description': description,
        // 'image': 'https://gateway.pinata.cloud/ipfs/QmYsARNjjjYXnKiLJeKTTR6jp3cMRgZMDFdNEZWeC384yd',
        'image': imageUri,
        'name': name,
    }
    const options = {
        pinataMetadata: {
            name: name,
        },
        pinataOptions: {
            cidVersion: 0,
        }
    };
    console.log(imageUri);
    return pinata.pinJSONToIPFS(metadata, options).then((result) => {
        //handle results here
        console.log('Successfully upload NFT metadata, here\'s the result:');
        console.log(result);
        return result.IpfsHash;
    }).catch((err) => {
        //handle error here
        console.log('Failed to upload NFT metadata!');
        console.log(err);
        return null;
    });
}

exports.uploadNFT = async (path, description) => {
    // test authentication to Pinata
    pinata.testAuthentication().catch((err) => {
        process.exit(0);
        console.log(err);
        return null;
    });

    const [name] = path.match(/^(.+)\/([^\/]+)$/).slice(-1);
    let res = await uploadFile(path, name);
    if(res === null) return;
    uploadMetadata(name, description, `ipfs://${res}`);
}
