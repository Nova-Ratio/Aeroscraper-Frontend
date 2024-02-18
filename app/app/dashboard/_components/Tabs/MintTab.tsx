import GradientButton from "@/components/Buttons/GradientButton";
import Text from "@/components/Texts/Text";
import { useNotification } from "@/contexts/NotificationProvider";
import useAppContract from "@/contracts/app/useAppContract";
import { convertAmount, getIsInjectiveResponse } from "@/utils/contractUtils";
import { PageData } from "../../_types/types";
import { useBalances } from "@/contexts/BalanceProvider";
import { useEffect, useState } from "react";
import useChainAdapter from "@/hooks/useChainAdapter";
import { NumericFormat } from "react-number-format";
import { CollateralAsset } from "@/types/types";
import { ChainName } from "@/enums/Chain";
import { DefaultAssetByChainName } from "@/constants/assetConstants";
type Props = {
  pageData?: PageData;
  getPageData?: () => void;
  basePrice?: number;
};
export default function MintTap({ pageData, getPageData, basePrice }: Props) {
  const { addNotification, processLoading, setProcessLoading } =
    useNotification();
  const { address } = useChainAdapter();
  const contract = useAppContract();
  const { balanceByDenom, refreshBalance } = useBalances();
  const { selectedChainName, selectedAppVersion } = useChainAdapter();
  const [selectedAsset, setSelectedAsset] = useState<CollateralAsset>(
    DefaultAssetByChainName[selectedChainName ?? ChainName.XION]
  );
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
      let time = new Date().getTime() + 86400000;
      localStorage.setItem(
        `mintExp${address}`,
        JSON.stringify({
          time,
          address,
        })
      );
      setExpTime(time);
      refreshBalance();
    } catch (error: any) {
      console.log(error);
      addNotification({
        message: JSON.stringify(error?.message),
        status: "error",
        directLink: "",
      });
    } finally {
      setProcessLoading(false);
    }
  }
  const [expTime, setExpTime] = useState<number | null>(null); //86400000 24 hours
  console.log("expTime", expTime);

  const [getTime, setGetTime] = useState<number>(new Date().getTime());

  useEffect(() => {
    let localTime = localStorage.getItem(`mintExp${address}`);
    if (localTime) {
      let parsed: any = JSON.parse(localTime);
      if (address === parsed?.address) {
        setExpTime(parseInt(parsed?.time));
      }
    }
    //if (localTime && parseInt(localTime) < new Date().getTime()) {}
    const interval = setInterval(() => {
      setGetTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden md:overflow-visible w-full h-full justify-between text-white flex flex-col items-center gap-32 ">
      <div className="w-full gap-1 flex flex-col">
        <h2 className="text-3xl font-medium">AST Faucet</h2>
        <p className="text-base">
          Mint AST and use your minted token on the XION testnet
        </p>
      </div>
      <GradientButton
        loading={processLoading}
        onClick={Mint}
        className="min-w-full md:min-w-[375px] h-11 "
        rounded="rounded-lg"
        disabled={
          processLoading || (expTime && getTime < expTime) ? true : false
        }
        disabledText={""}
      >
        {expTime && getTime < expTime ? (
          <Text>
            {`You can faucet again in ${new Date(expTime - getTime)
              .toISOString()
              .substr(11, 8)}`}
          </Text>
        ) : (
          <Text>Faucet</Text>
        )}
      </GradientButton>
      <div className="flex mt-1 w-full justify-end">
        <label className="font-regular text-xs md:text-base text-gray-300">
          In Wallet:
        </label>
        <NumericFormat
          value={Number(
            convertAmount(
              balanceByDenom[selectedAsset.denom]?.amount ?? 0,
              selectedAsset.decimal
            )
          ).toFixed(6)}
          thousandsGroupStyle="thousand"
          thousandSeparator=","
          fixedDecimalScale
          decimalScale={4}
          displayType="text"
          renderText={(value) => (
            <p className="text-white font-regular text-xs md:text-base ml-3">
              {value} {selectedAsset.shortName}
            </p>
          )}
        />
      </div>
    </div>
  );
}
