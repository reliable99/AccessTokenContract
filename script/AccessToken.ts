const hre = require("hardhat");

async function main() {
  const AccessControlledToken = await hre.ethers.getContractFactory("AccessControlledToken");
  const accessControlledToken = await AccessControlledToken.deploy();

  console.log("AccessControlledToken deployed to:", accessControlledToken.target);

  const addr = "0x2546BcD3c84621e976D8185a91A922aE77ECEc30 "
  const receiver = "00x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"

  const newAdmin = await accessControlledToken.addAdmin(addr);
  await newAdmin.wait();
  const testMint = await accessControlledToken.mint(addr, 100);
  await testMint.wait();
  const userBalance = await accessControlledToken.balanceOf(addr);
  console.log("User balance: ", userBalance.toString());

  const transferToken = await accessControlledToken.transfer(receiver, 50);
  await transferToken.wait();
  const userBalance2 = await accessControlledToken.balanceOf(addr);
  console.log("User balance: ", userBalance2.toString());

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});