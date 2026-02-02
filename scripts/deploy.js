const { ethers } = require("hardhat");

async function main() {
  const Hello = await ethers.getContractFactory("Hello");

  const hello = await Hello.deploy("Hello Web3 👋");

  await hello.deployed();

  console.log("Hello deployed to:", hello.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

