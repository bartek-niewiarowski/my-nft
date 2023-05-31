const crypto = require('crypto');
const fs = require('fs');
const bignumber = require('bignumber.js');

exports.hashFile = (path, hashFunc='sha256') => {
    const hash = crypto.createHash(hashFunc);
    hash.update(fs.readFileSync(path));
    return `0x${hash.digest('hex')}`;
}

exports.parseHash = (number) => {
    try {
        let base = number.startsWith('0x') ? 16 : 10;
        return bignumber(number, base);
    } catch (_) {
        return null;
    }
}