// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./LPToken.sol";

contract SimpleAMM {
    IERC20 public tokenA;
    IERC20 public tokenB;
    LPToken public lpToken;

    uint256 public reserveA;
    uint256 public reserveB;

    uint256 public constant FEE_RATE = 3; // 0.3%
    uint256 public constant FEE_DENOMINATOR = 1000;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        lpToken = new LPToken();
    }

    // 添加流动性（demo 版，不发 LP token）
    function addLiquidity(uint256 amountA, uint256 amountB) external {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        uint256 liquidity;
        uint256 totalSupply = lpToken.totalSupply();

        if (totalSupply == 0) {
            liquidity = Math.sqrt(amountA * amountB);
        } else {
            liquidity = Math.min(
                (amountA * totalSupply) / reserveA,
                (amountB * totalSupply) / reserveB
            );
        }

        lpToken.mint(msg.sender, liquidity);

        reserveA += amountA;
        reserveB += amountB;
    }

    function removeLiquidity(uint256 lpAmount) external {
        uint256 totalSupply = lpToken.totalSupply();

        uint256 amountA = reserveA * lpAmount / totalSupply;
        uint256 amountB = reserveB * lpAmount / totalSupply;

        lpToken.burn(msg.sender, lpAmount);

        reserveA -= amountA;
        reserveB -= amountB;

        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);
    }


    // x * y = k
    function swapAForB(uint256 amountAIn) external {
       tokenA.transferFrom(msg.sender, address(this), amountAIn);

        uint256 amountInWithFee =
            amountAIn * (FEE_DENOMINATOR - FEE_RATE) / FEE_DENOMINATOR;

        uint256 amountBOut =
            (reserveB * amountInWithFee) / (reserveA + amountInWithFee);

        reserveA += amountAIn;
        reserveB -= amountBOut;

        tokenB.transfer(msg.sender, amountBOut);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }
}
