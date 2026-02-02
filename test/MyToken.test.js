const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let token;
  let owner, user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy();
    await token.deployed();
  });

  it("mint should increase balance", async function () {
    await token.mint(owner.address, 100);

    expect(await token.balanceOf(owner.address)).to.equal(100);
  });

  it("transfer should move token", async function () {
    await token.mint(owner.address, 100);

    await token.transfer(user1.address, 40);

    expect(await token.balanceOf(user1.address)).to.equal(40);
  });
});
