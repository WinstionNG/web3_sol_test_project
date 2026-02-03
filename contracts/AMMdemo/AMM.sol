// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Token.sol";

contract AMM {
    Token public tokenA;
    Token public tokenB;
    Token public lpToken;

    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalLiquidity;

    mapping(address => uint256) public liquidity;

    constructor(address _tokenA, address _tokenB, address _lpToken) {
        tokenA = Token(_tokenA);
        tokenB = Token(_tokenB);
        lpToken = Token(_lpToken);
    }

    // 添加流动性
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        uint256 liquidityMinted;
        if (totalLiquidity == 0) {
            liquidityMinted = sqrt(amountA * amountB);
        } else {
            liquidityMinted = min((amountA * totalLiquidity) / reserveA, (amountB * totalLiquidity) / reserveB);
        }

        liquidity[msg.sender] += liquidityMinted;
        totalLiquidity += liquidityMinted;
        lpToken.mint(msg.sender, liquidityMinted);

        reserveA += amountA;
        reserveB += amountB;
    }

    // Swap A -> B
    function swapAForB(uint256 amountAIn) external {
        uint256 amountBOut = (amountAIn * reserveB) / (reserveA + amountAIn);
        tokenA.transferFrom(msg.sender, address(this), amountAIn);
        tokenB.transfer(msg.sender, amountBOut);

        reserveA += amountAIn;
        reserveB -= amountBOut;
    }

    // 工具函数
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function min(uint a, uint b) internal pure returns (uint) {
        return a < b ? a : b;
    }
}
