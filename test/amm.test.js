const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple AMM", function () {
  let tokenA, tokenB, amm;
  let owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const TokenA = await ethers.getContractFactory("TokenA");
    const TokenB = await ethers.getContractFactory("TokenB");

    tokenA = await TokenA.deploy();
    tokenB = await TokenB.deploy();

    const AMM = await ethers.getContractFactory("SimpleAMM");
    amm = await AMM.deploy(tokenA.address, tokenB.address);

    // owner 添加流动性
    await tokenA.approve(amm.address, ethers.utils.parseEther("1000"));
    await tokenB.approve(amm.address, ethers.utils.parseEther("1000"));
    await amm.addLiquidity(
      ethers.utils.parseEther("1000"),
      ethers.utils.parseEther("1000")
    );

    // 给 user 一点 TokenA
    await tokenA.transfer(user.address, ethers.utils.parseEther("100"));
  });

  it("user swap TokenA for TokenB", async function () {
    await tokenA.connect(user).approve(
      amm.address,
      ethers.utils.parseEther("10")
    );

    await amm.connect(user).swapAForB(
      ethers.utils.parseEther("10")
    );

    const balanceB = await tokenB.balanceOf(user.address);
    expect(balanceB).to.be.gt(0);
  });
});
