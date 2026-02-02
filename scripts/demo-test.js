const { ethers } = require("hardhat");

async function main() {
  const [owner, user] = await ethers.getSigners();

  // 1️⃣ 部署 DemoToken
  const Token = await ethers.getContractFactory("DemoToken");
  const token = await Token.deploy();
  await token.deployed();
  console.log("Token deployed at:", token.address);

  // 2️⃣ owner mint 给 user 1000 token
  await token.mint(user.address, 1000n * 10n ** 18n);
  console.log("User balance after mint:", (await token.balanceOf(user.address)).toString());

  // 3️⃣ 部署 SwapContract
  const Swap = await ethers.getContractFactory("SwapContract");
  const swap = await Swap.deploy(token.address);
  await swap.deployed();
  console.log("SwapContract deployed at:", swap.address);

  // 4️⃣ 用户 approve SwapContract 允许花 300 token
  await token.connect(user).approve(swap.address, 300n * 10n ** 18n);
  console.log("User approved 300 tokens to SwapContract");

  // 5️⃣ SwapContract 调用 transferFrom，用户 swap 200 token
  await swap.connect(user).swap(200n * 10n ** 18n);
  console.log("SwapContract balance after swap:", (await token.balanceOf(swap.address)).toString());
  console.log("User balance after swap:", (await token.balanceOf(user.address)).toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
