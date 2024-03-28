import { Contract, ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import StabilityPoolABI from "./ABI/StabilityPoolABI.json";
import AUSDTTokenABI from "./ABI/AUSDTTokenABI.json";
import PriceFeedABI from "./ABI/PriceFeedABI.json";
import SortedTrovesABI from "./ABI/SortedTrovesABI.json";
import BorrowerOperationsABI from "./ABI/BorrowerOperations.json";
import TroveManagerABI from "./ABI/TroveManager.json";




// declare global {
//     interface Window { ethereum: any; }
// }

const BORROWER_OPERATIONS = process.env.BORROWER_OPERATIONS_CONTRACT_ADDRESS as string; 
const TROVE_MANAGER = process.env.TROVE_MANAGER_CONTRACT_ADDRESS as string; 
const STABILITY_POOL = process.env.STABILITY_POOL_CONTRACT_ADDRESS as string; 
const SORTED_TROVES = process.env.SORTED_TROVES_CONTRACT_ADDRESS as string;  
const AUSDT_TOKEN = process.env.AUSDT_TOKEN_CONTRACT_ADDRESS as string;  
const PRICE_FEED = process.env.PRICE_FEED_CONTRACT_ADDRESS as string; 

export const callBorrowerOperationsContract = async () => {
    let ethereum = (window as any).ethereum;
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = BorrowerOperationsABI;
    const Address = "BORROWER_OPERATIONS_CONTRACT_ADDRESS";
    const myBorrowerOperationsContract = new ethers.Contract(Address, abi, signer);
    const contractWithSigner:any = myBorrowerOperationsContract.connect(signer);
    return { contractWithSigner, Address, abi };
  };

export const callTroveManagerContract = async () => {
    let ethereum = (window as any).ethereum;
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = TroveManagerABI;
    const Address = "TROVE_MANAGER_CONTRACT_ADDRESS";
    const myTroveManagerContract = new ethers.Contract(Address, abi, signer);
    const contractWithSigner:any = myTroveManagerContract.connect(signer);
    return { contractWithSigner, Address, abi };
  };

export const callStabilityPoolContract = async () => {
    let ethereum = (window as any).ethereum;
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = StabilityPoolABI;
    const Address = "STABILITY_POOL_CONTRACT_ADDRESS";
    const myStabilityPoolContract = new ethers.Contract(Address, abi, signer);
    const contractWithSigner:any = myStabilityPoolContract.connect(signer);
    return { contractWithSigner, Address, abi };
};

export const callSortedTrovesContract = async () => {
    let ethereum = (window as any).ethereum;
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = SortedTrovesABI;
    const Address = "SORTED_TROVES_CONTRACT_ADDRESS";
    const mySortedTrovesrContract = new ethers.Contract(Address, abi, signer);
    const contractWithSigner:any = mySortedTrovesrContract.connect(signer);
    return { contractWithSigner, Address, abi };
};

export const callAUSDTTokenContract = async () => {
    let ethereum = (window as any).ethereum;
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = AUSDTTokenABI;
    const Address = "AUSDT_TOKEN_CONTRACT_ADDRESS";
    const myAUSDTTokenContract = new ethers.Contract(Address, abi, signer);
    const contractWithSigner:any = myAUSDTTokenContract.connect(signer);
    return { contractWithSigner, Address, abi };
};

export const callPriceFeedContract = async () => {
    let ethereum = (window as any).ethereum;
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const abi = PriceFeedABI;
    const Address = "PRICE_FEED_CONTRACT_ADDRESS";
    const myPriceFeedContract = new ethers.Contract(Address, abi, signer);
    const contractWithSigner:any = myPriceFeedContract.connect(signer);
    return { contractWithSigner, Address, abi };
};







