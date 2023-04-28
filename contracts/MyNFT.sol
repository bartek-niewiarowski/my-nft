// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {

    struct MyNFT {
        uint256 tokenId;
        string imageURI;
        uint256 price;
        bool upForSale;
    }
    mapping(uint256 => MyNFT) private _tokens;

    constructor() ERC721("MyNFT", "NFT") {}

    function mintNFT(address recipient, uint256 tokenId, string memory tokenURI, uint256 price)
        public
        onlyOwner
        returns (uint256)
    {

        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        MyNFT nft = MyNFT(tokenId, tokenURI, price, false);
        _tokens[tokenId] = nft;

        return tokenId;
    }

    function getTokenDetails(uint256 tokenId) public view returns (MyNFT memory) {
        return _tokens[tokenId];
    }

    function transfer(uint256 tokenId, address buyer) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Transfer must be initialized by owner!");
        _transfer(msg.sender, buyer, tokenId);
    }

    function setForSale(uint256 tokenId, bool setting) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can change MyNFT forSale status!");
        MyNFT memory nft = _tokens[tokenId];
        nft.upForSale = setting;
        _tokens[tokenId] = nft;
    }

    function setPrice(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Prices can only be changed by token owner!");
        MyNFT memory nft = _tokens[tokenId];
        nft.price = price;
        _tokens[tokenId] = nft;
    }

    function putUpForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "MyNTF can only be put up for sale by token owner!");
        MyNFT memory nft = _token[tokenId];
        nft.upForSale = true;
        nft.price = price;
        _tokens[tokenId] = nft;
    }

    function buyNFT(uint256 tokenId) public payable {
        MyNFT memory nft = _tokenDetails[tokenId];
        address owner = ownerOf(tokenId);
        require(nft.forSale, "MyNFT is not for sale!");
        require(msg.value >= nft.price, "Not enough Ether sent!");
        require(msg.sender != owner, "Caller already owns this NFT!");

        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);
        _tokenDetails[tokenId] = nft;
    }
}
