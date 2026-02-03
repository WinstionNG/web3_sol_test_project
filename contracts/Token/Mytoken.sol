// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MyToken {
    string public name = "MyToken";
    string public symbol = "MTK";
    uint8 public decimals = 18;

    uint256 public totalSupply;

    mapping(address => uint256) private balances;

    function balanceOf(address user) public view returns (uint256) {
        return balances[user];
    }

    function mint(address to, uint256 amount) public {
        balances[to] += amount;
        totalSupply += amount;
    }

    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Not enough balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}
