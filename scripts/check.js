const hre = require("hardhat");

async function main() {
  console.log("ethers exists:", !!hre.ethers);
  const [signer] = await hre.ethers.getSigners();
  console.log("signer:", signer.address);
}

main();
