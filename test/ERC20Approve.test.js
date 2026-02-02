const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC20WithApprove", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("ERC20WithApprove");
    token = await Token.deploy(1000n * 10n ** 18n); // 初始 1000 token
    await token.deployed();
  });

  it("Owner can transfer directly", async function () {
    await token.transfer(addr1.address, 100n * 10n ** 18n);
    expect(await token.balanceOf(addr1.address)).to.equal(100n * 10n ** 18n);
  });

  it("Owner can approve and spender can transferFrom", async function () {
    // Owner 授权 addr1 可以花 200 token
    await token.approve(addr1.address, 200n * 10n ** 18n);

    // addr1 真正动用授权
    await token.connect(addr1).transferFrom(owner.address, addr2.address, 150n * 10n ** 18n);

    expect(await token.balanceOf(addr2.address)).to.equal(150n * 10n ** 18n);
    expect(await token.allowance(owner.address, addr1.address)).to.equal(50n * 10n ** 18n);
  });

  it("Cannot transferFrom more than allowance", async function () {
    await token.approve(addr1.address, 100n * 10n ** 18n);

    await expect(
      token.connect(addr1).transferFrom(owner.address, addr2.address, 150n * 10n ** 18n)
    ).to.be.revertedWith("Allowance exceeded");
  });
});
