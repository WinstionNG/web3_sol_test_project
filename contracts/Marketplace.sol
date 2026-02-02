// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./MyNFT.sol";
import "./MyTokenToNFT.sol";

contract Marketplace {
    function swapNFTforToken(
        address nftAddress,
        uint256 tokenId,
        address seller,
        address erc20Address,
        uint256 price,
        address buyer
    ) external {
        MyNFT nft = MyNFT(nftAddress);
        MyTokenToNFT erc20 = MyTokenToNFT(erc20Address);
        // 扣除 ERC20 token
        require(
            erc20.transferFrom(buyer, seller, price),
            "ERC20 transfer failed"
        );

        // 转 NFT 给 buyer
        nft.safeTransferFrom(seller, buyer, tokenId);
    }
}
