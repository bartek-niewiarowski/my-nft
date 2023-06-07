// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SongNFT.sol";

contract SongLicense is ERC721, Ownable {

    enum LicenseType {PUBLIC, PRIVATE, MOD}
    struct LicensingInfo {
        uint256 songId;
        LicenseType licenseType;
    }
    mapping(uint256 => LicensingInfo[]) private _songLicenses;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    SongNFT private songNFTContract;

    constructor(address target) ERC721("SongLicense", "NFT") { songNFTContract = SongNFT(target);}
//    constructor() ERC721("SongLicense", "NFT") { }

    function mintNFT(address recipient, uint256 songId, uint licenseType)
    public payable
    returns (uint256)
    {
        LicenseType license = LicenseType(licenseType);
        require(confirmLicenseAvailability(songId, license), "Given license type is not available for this song!");
        uint256 price = getLicensePrice(songId, license);
        require(price != 0, "Invalid price");
        require(msg.value >= price, "Not enough Ether sent!");
        address owner = songNFTContract.getTokenOwner(songId);
        payable(owner).transfer(msg.value);
        uint256 newId = _tokenIdCounter.current();
        _mint(recipient, newId);
        _tokenIdCounter.increment();

        LicensingInfo memory nft = LicensingInfo(songId, license);
        _songLicenses[songId].push(nft);

        return newId;
    }

    function confirmLicenseAvailability(uint256 songId, LicenseType license) internal view returns (bool check) {
        LicenseAvailability memory options = songNFTContract.getLicensingOptions(songId);
        if(license == LicenseType.PUBLIC) return options.Public.isAvailable;
        else if(license == LicenseType.PRIVATE) return options.Private.isAvailable;
        else if(license == LicenseType.MOD) return options.Modify.isAvailable;
        else return false;
    }

    function getLicensePrice(uint256 songId, LicenseType license) internal view returns (uint256 price) {
        LicenseAvailability memory options = songNFTContract.getLicensingOptions(songId);
        if(license == LicenseType.PUBLIC) return options.Public.price;
        else if(license == LicenseType.PRIVATE) return options.Private.price;
        else if(license == LicenseType.MOD) return options.Modify.price;
        else return 0;
    }

    function getTokenDetails(uint256 songId) public view returns (LicensingInfo[] memory) {
        return _songLicenses[songId];
    }
}

