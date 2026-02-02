const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloNFT", function () {
  let helloNFT;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const HelloNFT = await ethers.getContractFactory("HelloNFT");
    helloNFT = await HelloNFT.deploy();
    await helloNFT.deployed();
  });

  it("Should mint NFT to a user", async function () {
    await helloNFT.mint(addr1.address);
    expect(await helloNFT.ownerOf(0)).to.equal(addr1.address);
  });

  it("Should allow transfer by owner", async function () {
    await helloNFT.mint(owner.address);
    await helloNFT["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, 0);
    expect(await helloNFT.ownerOf(0)).to.equal(addr1.address);
  });

  it("mint 3 different NFTs", async function () {

    await helloNFT.mint(addr1.address);
    await helloNFT.mint(addr2.address);
    await helloNFT.mint(addr3.address);

    expect(await helloNFT.ownerOf(0)).to.equal(addr1.address);
    expect(await helloNFT.ownerOf(1)).to.equal(addr2.address);
    expect(await helloNFT.ownerOf(2)).to.equal(addr3.address);
  });

  it("approve and transfer by approved address", async function () {
    await helloNFT.mint(addr1.address);

    // addr1 approve addr2
    await helloNFT.connect(addr1).approve(addr2.address, 0);

    // addr2 transferFrom addr1 to addr3
    await helloNFT.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr1.address, addr3.address, 0);

    expect(await helloNFT.ownerOf(0)).to.equal(addr3.address);
  });

  it ("setApprovalForAll and transfer by operator", async function () {
    await helloNFT.mint(addr1.address);

    // addr1 设置 addr2 为 operator
    await helloNFT.connect(addr1).setApprovalForAll(addr2.address, true);

    // addr2 作为 operator 转移 NFT 从 addr1 到 addr3
    await helloNFT.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr1.address, addr3.address, 0);

    expect(await helloNFT.ownerOf(0)).to.equal(addr3.address);
  });

  it("setApprovalForAll multiple operators", async function () {
    await helloNFT.mint(addr1.address);

    // addr1 设置 addr2 为 operator
    await helloNFT.connect(addr1).setApprovalForAll(addr2.address, true);

    // addr1 设置 addr3 也为 operator
    await helloNFT.connect(addr1).setApprovalForAll(addr3.address, true);

    // addr2 可以转移 NFT
    await helloNFT.connect(addr2)["safeTransferFrom(address,address,uint256)"](
      addr1.address, 
      owner.address, 
      0
    );
    expect(await helloNFT.ownerOf(0)).to.equal(owner.address);

    // 再 mint 一个给 addr1
    await helloNFT.mint(addr1.address);

    // addr3 也可以转移 NFT
    await helloNFT.connect(addr3)["safeTransferFrom(address,address,uint256)"](
      addr1.address, 
      owner.address, 
      1
    );
    expect(await helloNFT.ownerOf(1)).to.equal(owner.address);
  });
});
