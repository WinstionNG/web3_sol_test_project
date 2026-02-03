// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleAMM {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    // 添加流动性（demo 版，不发 LP token）
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        reserveA += amountA;
        reserveB += amountB;
    }

    // x * y = k
    function swapAForB(uint256 amountAIn) external {
        tokenA.transferFrom(msg.sender, address(this), amountAIn);

        uint256 amountBOut = (reserveB * amountAIn) / (reserveA + amountAIn);

        reserveA += amountAIn;
        reserveB -= amountBOut;

        tokenB.transfer(msg.sender, amountBOut);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }
}
