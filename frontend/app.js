
let provider, signer, amm, tokenA, tokenB, lpToken;

// 填写部署好的合约地址
const ammAddress = "PUT_AMM_ADDRESS_HERE";
const lpAddress = "PUT_LPTOKEN_ADDRESS_HERE";

const ammAbi = [
  "function swapAForB(uint256 amountAIn) external",
  "function addLiquidity(uint256 amountA, uint256 amountB) external",
  "function totalLiquidity() view returns(uint256)",
  "function liquidity(address) view returns(uint256)",
  "function tokenA() view returns(address)",
  "function tokenB() view returns(address)"
];

const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns(bool)",
  "function balanceOf(address owner) view returns(uint256)"
];

const lpAbi = [
  "function balanceOf(address owner) view returns(uint256)"
];

async function connectWallet() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  amm = new ethers.Contract(ammAddress, ammAbi, signer);
  const tokenAAddress = await amm.tokenA();
  const tokenBAddress = await amm.tokenB();

  tokenA = new ethers.Contract(tokenAAddress, erc20Abi, signer);
  tokenB = new ethers.Contract(tokenBAddress, erc20Abi, signer);
  lpToken = new ethers.Contract(lpAddress, lpAbi, signer);

  alert("Wallet connected!");
  updateLPBalance();
}

async function swap() {
  const amount = ethers.utils.parseUnits(document.getElementById("swapAmountA").value, 18);
  await tokenA.approve(amm.address, amount);
  await amm.swapAForB(amount);
  alert("Swap executed!");
  updateLPBalance();
}

async function addLiquidity() {
  const amountA = ethers.utils.parseUnits(document.getElementById("addAmountA").value, 18);
  const amountB = ethers.utils.parseUnits(document.getElementById("addAmountB").value, 18);
  await tokenA.approve(amm.address, amountA);
  await tokenB.approve(amm.address, amountB);
  await amm.addLiquidity(amountA, amountB);
  alert("Liquidity added!");
  updateLPBalance();
}

async function updateLPBalance() {
  const user = await signer.getAddress();
  const balance = await lpToken.balanceOf(user);
  document.getElementById("lpBalance").innerText = ethers.utils.formatUnits(balance, 18);
}

document.getElementById("connect").onclick = connectWallet;
document.getElementById("swapBtn").onclick = swap;
document.getElementById("addLiquidityBtn").onclick = addLiquidity;
