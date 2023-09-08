// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SimpleNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string) private _tokenTitles;

    event Minted(
        address indexed recipient,
        uint256 tokenId,
        string uri,
        string title
    );

    constructor() ERC721("SimpleNFT", "SNFT") {}

    function mintNFT(
        address recipient,
        string memory uri,
        string memory title
    ) external returns (uint256) {
        _tokenIds.increment();

        uint256 newNftTokenId = _tokenIds.current();
        _mint(recipient, newNftTokenId);
        _setTokenURI(newNftTokenId, uri);
        _tokenTitles[newNftTokenId] = title;

        emit Minted(recipient, newNftTokenId, uri, title);

        return newNftTokenId;
    }

    function getTokenTitle(
        uint256 tokenId
    ) external view returns (string memory) {
        return _tokenTitles[tokenId];
    }
}
