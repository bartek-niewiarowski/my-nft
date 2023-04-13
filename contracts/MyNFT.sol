// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {

    constructor() ERC721("MyNFT", "NFT") {}

    function mintNFT(address recipient, uint256 tokenId, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {

        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }
}

