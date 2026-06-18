async function main() {
  console.log("Deploying EduChainRegistry to Polygon Amoy...");
  const Contract = await ethers.getContractFactory("EduChainRegistry");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("✅ CONTRACT ADDRESS:", address);
  console.log("\nCopy this into backend/.env:");
  console.log(`CONTRACT_ADDRESS=${address}`);
}
main().catch(console.error);
