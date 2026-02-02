const hre = require("hardhat");

async function main() {
  const [owner, alice, bob] = await hre.ethers.getSigners();

  // 部署 ERC20
  const Token = await hre.ethers.getContractFactory("MyTokenToNFT");
  const token = await Token.deploy();
  await token.deployed();
  console.log("ERC20 deployed at:", token.address);

  // 给 Bob 一些 token
  await token.mint(bob.address, hre.ethers.utils.parseEther("100"));
  console.log("Bob received 100 MTK");

  // 部署 NFT
  const NFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT deployed at:", nft.address);

  // Alice mint NFT
  await nft.mint(alice.address);
  console.log("Alice minted tokenId 0");

  // 部署 Marketplace
  const Market = await hre.ethers.getContractFactory("Marketplace");
  const market = await Market.deploy();
  await market.deployed();
  console.log("Marketplace deployed at:", market.address);

  // Alice 授权 marketplace 操作她的 NFT
  await nft.connect(alice).setApprovalForAll(market.address, true);

  // Bob 授权 marketplace 扣 ERC20
  await token.connect(bob).approve(market.address, hre.ethers.utils.parseEther("50"));

  // Marketplace swap
  await market.swapNFTforToken(
    nft.address,
    0,
    alice.address,
    token.address,
    hre.ethers.utils.parseEther("50"),
    bob.address
  );

  console.log("Swap completed!");
  console.log("Bob owns NFT:", await nft.ownerOf(0) === bob.address);
  console.log("Alice token balance:", (await token.balanceOf(alice.address)).toString());
}

main().catch(console.error);
