import GradientButton from "@/components/Buttons/GradientButton";
import Text from "@/components/Texts/Text";
import { useNotification } from "@/contexts/NotificationProvider";
import useAppContract from "@/contracts/app/useAppContract";
import { getIsInjectiveResponse } from "@/utils/contractUtils";
import { PageData } from "../../_types/types";
import { useBalances } from "@/contexts/BalanceProvider";
type Props = {
    pageData?: PageData;
    getPageData?: () => void;
    basePrice?: number;
  };
export default function MintTap({
    pageData,
    getPageData,
    basePrice
}:Props) {
  const { addNotification, processLoading, setProcessLoading } =
    useNotification();
    const {refreshBalance} = useBalances();
  const contract = useAppContract();
  async function Mint() {
    try {
      setProcessLoading(true);
      const res: any = await contract.mint();
      console.log(res);

      addNotification({
        status: "success",
        directLink: getIsInjectiveResponse(res)
          ? res?.txHash
          : res?.transactionHash,
        message: `Mint Success`,
      });

      refreshBalance();
    } catch (error) {
      console.log(error);
      addNotification({
        message: JSON.stringify(err.message),
        status: "error",
        directLink: "",
      });
    } finally {
      setProcessLoading(false);
    }
  }
  
  return (
    <div className="overflow-hidden md:overflow-visible w-full h-full justify-between text-white flex flex-col items-center gap-32 ">
      <div className="w-full gap-1 flex flex-col">
        <h2 className="text-3xl font-medium">Faucet AST</h2>
        <p className="text-base">
          Mint AST and use your minted token on the Xion chain
        </p>
      </div>
      <GradientButton
        loading={processLoading}
        onClick={Mint}
        className="min-w-full md:min-w-[375px] h-11 "
        rounded="rounded-lg"
        disabled={processLoading}
        disabledText={""}
      >
        <Text>Faucet</Text>
      </GradientButton>
    </div>
  );
}
