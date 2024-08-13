import { deployContract, getWallet, getProvider } from "./utils";
import * as ethers from "ethers";

export default async function () {
   await deployContract("CredenSure",[]);
  const paymaster = await deployContract("CredensurePaymaster");

  const paymasterAddress = await paymaster.getAddress();

  // Supplying paymaster with ETH
  console.log("Funding paymaster with ETH...");
  const wallet = getWallet();
  await (
    await wallet.sendTransaction({
      to: paymasterAddress,
      value: ethers.parseEther("0.08"),
    })
  ).wait();

  const provider = getProvider();
  const paymasterBalance = await provider.getBalance(paymasterAddress);
  console.log(`Paymaster ETH balance is now ${paymasterBalance.toString()}`);

  console.log(`Done!`);
}