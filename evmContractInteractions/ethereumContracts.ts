import { Contract, ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import Web3, { providers } from 'web3';
import BorrowerOperationsAbi from "./ABI/BorrowerOperationAbi.json";
import TroveManagerAbi from "./ABI/TroveManagerAbi.json";
import StabilityPoolAbi from "./ABI/StabilityPoolAbi.json";

// declare global {
//     interface Window { ethereum: any; }
// }

export const callBorrowerOperationsContract = async () => {
    let ethereum = (window as any).ethereum;
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = BorrowerOperationsAbi;
    const BORROWER_OPERATIONS = process.env.NEXT_BORROWER_OPERATIONS_CONTRACT_ADDRESS as string;
    const myBorrowerOperationsContract = new ethers.Contract(BORROWER_OPERATIONS, abi, signer);
    const contractWithSigner = myBorrowerOperationsContract.connect(signer);
    return { contractWithSigner, BORROWER_OPERATIONS, abi };
};

export const callTroveManagerContract = async () => {
    let ethereum = (window as any).ethereum;
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = TroveManagerAbi;
    const TROVE_MANAGER = process.env.NEXT_TROVE_MANAGER_CONTRACT_ADDRESS as string;
    const myTroveManagerContract = new ethers.Contract(TROVE_MANAGER, abi, signer);
    const contractWithSigner = myTroveManagerContract.connect(signer);
    return { contractWithSigner, TROVE_MANAGER, abi };
};

export const callStabilityPoolContract = async () => {
    let ethereum = (window as any).ethereum;
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = StabilityPoolAbi;
    const STABILITY_POOL = process.env.NEXT_STABILITY_POOL_CONTRACT_ADDRESS as string;
    const myTroveManagerContract = new ethers.Contract(STABILITY_POOL, abi, signer);
    const contractWithSigner = myTroveManagerContract.connect(signer);
    return { contractWithSigner, STABILITY_POOL, abi };
};