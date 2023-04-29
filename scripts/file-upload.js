require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);
const Data = require('dataclass').Data

class CIDs extends Data {
    fileCid
    metadataCid
}

const options = (name) => {
    return {
        pinataMetadata: { name: name },
        pinataOptions: { cidVersion: 0 },
    };
}

const uploadFile = (path, name) => {
    const file = fs.createReadStream(path);
    return pinata.pinFileToIPFS(file, options(name)).then((result) => {
        console.log('Success uploading file to Pinata, here\'s the result:');
        console.log(result);
        return result.IpfsHash;
    }).catch((err) => {
        console.log('Failed to upload given file to pinata!')
        console.log(err.message);
        return null;
    });
}

const uploadMetadata = (fileName, description, imageUri) => {
    const name = fileName.replace(/\..+$/, '.json');
    const metadata = {
        'description': description,
        'image': imageUri,
        'name': name,
    };
    return pinata.pinJSONToIPFS(metadata, options(name)).then((result) => {
        console.log('Successfully upload NFT metadata, here\'s the result:');
        console.log(result);
        return result.IpfsHash;
    }).catch((err) => {
        console.log('Failed to upload NFT metadata!');
        console.log(err.message);
        return null;
    });
}

exports.uploadNFT = async (path, description) => {
    // test authentication to Pinata
    pinata.testAuthentication().catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
    const [name] = path.match(/^(.+)\/([^\/]+)$/).slice(-1);
    let fileCid = await uploadFile(path, name);
    if(fileCid === null) return;
    let metadataCid = uploadMetadata(name, description, `ipfs://${fileCid}`);
    return CIDs.create({ fileCid: fileCid, metadataCid: metadataCid });
}
