const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // 部署 Token
  const Token = await hre.ethers.getContractFactory("Token");
  const tokenA = await Token.deploy("Token A", "TKA");
  const tokenB = await Token.deploy("Token B", "TKB");
  await tokenA.deployed();
  await tokenB.deployed();

  // 部署 LP Token
  const LPToken = await hre.ethers.getContractFactory("LPToken");
  const lpToken = await LPToken.deploy();
  await lpToken.deployed();

  // 部署 AMM
  const AMM = await hre.ethers.getContractFactory("AMM");
  const amm = await AMM.deploy(tokenA.address, tokenB.address, lpToken.address);
  await amm.deployed();

  console.log("TokenA:", tokenA.address);
  console.log("TokenB:", tokenB.address);
  console.log("LPToken:", lpToken.address);
  console.log("AMM:", amm.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
