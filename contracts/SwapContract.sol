// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DemoToken.sol";

contract SwapContract {
    DemoToken public token;

    constructor(address _token) {
        token = DemoToken(_token);
    }

    // 模拟 swap：把用户 token 转给自己
    function swap(uint256 _amount) public {
        // 需要用户先 approve
        token.transferFrom(msg.sender, address(this), _amount);
    }

    // 查询合约余额
    function balance() public view returns(uint256) {
        return token.balanceOf(address(this));
    }
}
