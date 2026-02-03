// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPToken is ERC20 {
    address public amm;

    constructor() ERC20("LP Token", "LP") {
        amm = msg.sender;
    }

    modifier onlyAMM() {
        require(msg.sender == amm, "Not AMM");
        _;
    }

    function mint(address to, uint256 amount) external onlyAMM {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyAMM {
        _burn(from, amount);
    }
}
