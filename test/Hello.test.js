const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hello contract", function () {
  let Hello;
  let hello;
  let owner;
  let addr1;

  beforeEach(async function () {
    // 获取测试账户
    [owner, addr1] = await ethers.getSigners();

    // 获取合约工厂
    Hello = await ethers.getContractFactory("Hello");

    // 部署合约
    hello = await Hello.deploy("Hello World");

    await hello.deployed();
  });

  it("Should return the initial message", async function () {
    expect(await hello.getMessage()).to.equal("Hello World");
  });

  it("Should allow anyone to update the message", async function () {
    await hello.connect(addr1).setMessage("Hi Web3");

    expect(await hello.getMessage()).to.equal("Hi Web3");
  });
});
