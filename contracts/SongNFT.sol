// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct LicenseInfo {
    bool isAvailable;
    uint256 price;
}

struct LicenseAvailability {
    LicenseInfo Private;
    LicenseInfo Public;
    LicenseInfo Modify;
}

struct PriceInfo {
    int PrivatePrice;
    int PublicPrice;
    int ModifyPrice;
}

contract SongNFT is ERC721URIStorage, Ownable {

    struct SongNFTStruct {
        uint256 id; // song hash
        string ipfsURI;  // URI to actual file uploaded to IPFS (for now not working)
        uint256 price;  // temporary price for ownership token
        LicenseAvailability licensingOptions;
    }

    mapping(uint256 => SongNFTStruct) private _songs;

    constructor() ERC721("SongNFT", "NFT") {}

    function mintNFT(address recipient, uint256 tokenId, string memory tokenURI, uint256 price, PriceInfo memory pricing)
        public
        onlyOwner
        returns (uint256)
    {
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        SongNFTStruct storage nft = _songs[tokenId];
        nft.id = tokenId;
        nft.ipfsURI = tokenURI;
        nft.price = price;

        LicenseAvailability memory licenseInfo = LicenseAvailability({
            Private : LicenseInfo(pricing.PrivatePrice >= 0, pricing.PrivatePrice >=0 ? uint256(pricing.PrivatePrice) : uint256(-pricing.PrivatePrice)),
            Public : LicenseInfo(pricing.PublicPrice >= 0, pricing.PublicPrice >=0 ? uint256(pricing.PublicPrice) : uint256(-pricing.PublicPrice)),
            Modify : LicenseInfo(pricing.ModifyPrice >= 0, pricing.ModifyPrice >=0 ? uint256(pricing.ModifyPrice) : uint256(-pricing.ModifyPrice))
        });

        nft.licensingOptions = licenseInfo;

        return tokenId;
    }

    function getTokenDetails(uint256 tokenId) public view returns (SongNFTStruct memory) {
        return _songs[tokenId];
    }

    function transfer(uint256 tokenId, address buyer) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Transfer must be initialized by owner!");
        _transfer(msg.sender, buyer, tokenId);
    }

    function setPrice(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Prices can only be changed by token owner!");
        SongNFTStruct storage nft = _songs[tokenId];
        nft.price = price;
    }

    function buyNFT(uint256 tokenId) public payable {
        SongNFTStruct storage nft = _songs[tokenId];
        address owner = ownerOf(tokenId);
        require(msg.value >= nft.price, "Not enough Ether sent!");
        require(msg.sender != owner, "Caller already owns this NFT!");

        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);
    }

    function getLicensingOptions(uint256 tokenId) public view returns (LicenseAvailability memory) {
        LicenseAvailability memory nftLicenses = _songs[tokenId].licensingOptions;
        return nftLicenses;
    }

    function getTokenOwner(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }
}
