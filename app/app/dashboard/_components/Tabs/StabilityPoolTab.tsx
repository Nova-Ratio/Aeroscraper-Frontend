import GradientButton from "@/components/Buttons/GradientButton";
import Text from "@/components/Texts/Text";
import React, { FC, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { motion } from "framer-motion";
import useAppContract from "@/contracts/app/useAppContract";
import { useNotification } from "@/contexts/NotificationProvider";
import { PageData } from "../../_types/types";
import Checkbox from "@/components/Checkbox";
import BorderedNumberInput from "@/components/Input/BorderedNumberInput";
import { useBalances } from "@/contexts/BalanceProvider";

enum TABS {
  DEPOSIT = 0,
  WITHDRAW,
}

type Props = {
  pageData: PageData;
  getPageData: () => void;
};

const StabilityPoolTab: FC<Props> = ({ pageData, getPageData }) => {
  const { refreshBalance } = useBalances();
  const contract = useAppContract();
  const { addNotification, processLoading, setProcessLoading } =
    useNotification();

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.DEPOSIT);

  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [unstakeAmount, setUnstakeAmount] = useState<number>(0);

  const stakeDisabled = useMemo(
    () =>
      stakeAmount <= 0 ||
      stakeAmount > pageData.ausdBalance,
    [stakeAmount, pageData.ausdBalance]
  );

  const stakeErrorText = useMemo(() => (
    stakeAmount <= 0 ?
      "Enter the AUSD amount." :
      stakeAmount > pageData.ausdBalance ?
        "Insufficient AUSD balance." :
        undefined
  ), [stakeAmount, pageData.ausdBalance]);

  const unstakeDisabled = useMemo(
    () =>
      unstakeAmount <= 0 ||
      unstakeAmount > pageData.stakedAmount,
    [unstakeAmount, pageData.stakedAmount]
  );

  const unstakeErrorText = useMemo(() => (
    unstakeAmount <= 0 ?
      "Enter the AUSD amount." :
      unstakeAmount > pageData.stakedAmount ?
        "Insufficient AUSD balance." :
        undefined
  ), [unstakeAmount, pageData.stakedAmount]);

  const stakePool = async () => {
    setProcessLoading(true);

    try {
      const res = await contract.stake(stakeAmount);
      setStakeAmount(0);
      addNotification({
        status: "success",
        directLink: res?.transactionHash,
        message: `${stakeAmount} aUSD Staked to Stability Pool`,
      });
      getPageData();
      refreshBalance();
    } catch (err: any) {
      addNotification({
        message: JSON.stringify(err.message),
        status: "error",
        directLink: "",
      });
    }
    setProcessLoading(false);
  };

  const unStakePool = async () => {
    setProcessLoading(true);

    try {
      const res = await contract.unstake(unstakeAmount);

      setUnstakeAmount(0);
      addNotification({
        status: "success",
        directLink: res?.transactionHash,
        message: `${unstakeAmount} aUSD Unstaked from Stability Pool`,
      });
      getPageData();
      refreshBalance();

      if (unstakeAmount >= pageData.stakedAmount) {
        setSelectedTab(TABS.DEPOSIT);
      }
    } catch (err: any) {
      addNotification({
        message: JSON.stringify(err.message),
        status: "error",
        directLink: "",
      });
    }
    setProcessLoading(false);
  };

  return (
    <div className="overflow-hidden md:overflow-visible">
      <Text size="3xl">Add to stability pool to earn rewards</Text>
      <Text size="base" weight="font-regular" className="mt-1 mb-8">
        Deposit or Withdraw aUSD from your wallet to the Aeroscraper protocol to
        earn rewards.{" "}
      </Text>
      <div className="flex flex-col">
        {pageData.stakedAmount > 0 && (
          <Checkbox
            label={"Deposit"}
            checked={selectedTab === TABS.DEPOSIT}
            onChange={() => {
              setSelectedTab(TABS.DEPOSIT);
            }}
          />
        )}
        {selectedTab === TABS.DEPOSIT && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
          >
            <div className="w-full bg-cetacean-dark-blue border backdrop-blur-[37px] border-white/10 rounded-xl md:rounded-2xl px-3 pt-4 pb-3 md:px-6 md:py-8 flex flex-col gap-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    alt="ausd"
                    className="w-6 h-6"
                    src="/images/token-images/ausd-blue.svg"
                  />
                  <Text size="base" weight="font-medium">
                    aUSD
                  </Text>
                </div>
                <BorderedNumberInput
                  value={stakeAmount}
                  onValueChange={(e) => {
                    setStakeAmount(Number(e.value));
                  }}
                  containerClassName="h-10 text-end flex-1 ml-6"
                  bgVariant="blue"
                  className="text-end"
                />
              </div>
              <div className="flex justify-between mt-6">
                <div className="flex text-white">
                  <label className="font-regular text-xs md:text-base">
                    Pool Share:
                  </label>
                  <p className="font-regular text-sm md:text-base ml-3">
                    {pageData.poolShare || "0"}%
                  </p>
                </div>
                <NumericFormat
                  value={pageData.ausdBalance}
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                  fixedDecimalScale
                  decimalScale={2}
                  displayType="text"
                  renderText={(value) => (
                    <Text size="base" className="flex ml-2 gap-2">
                      Available Balance: {value} aUSD
                    </Text>
                  )}
                />
              </div>
            </div>
            <GradientButton
                disabled={stakeDisabled}
                disabledText={stakeErrorText}
                loading={processLoading}
                onClick={stakePool}
                className="w-full md:w-[374px] h-11 ml-auto mt-10"
                rounded="rounded-lg"
              >
                <Text>Deposit</Text>
              </GradientButton>
          </motion.div>
        )}
        {pageData.stakedAmount > 0 && (
          <Checkbox
            label={"Withdraw"}
            checked={selectedTab === TABS.WITHDRAW}
            onChange={() => {
              setSelectedTab(TABS.WITHDRAW);
            }}
            className="mt-8"
          />
        )}{" "}
        {selectedTab === TABS.WITHDRAW && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
          >
            <div className="w-full bg-cetacean-dark-blue border backdrop-blur-[37px] border-white/10 rounded-xl md:rounded-2xl px-3 pt-4 pb-3 md:px-6 md:py-8 flex flex-col gap-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    alt="ausd"
                    className="w-6 h-6"
                    src="/images/token-images/ausd-blue.svg"
                  />
                  <Text size="base" weight="font-medium">
                    aUSD
                  </Text>
                </div>
                <BorderedNumberInput
                  value={unstakeAmount}
                  onValueChange={(e) => {
                    setUnstakeAmount(Number(e.value));
                  }}
                  containerClassName="h-10 text-end flex-1 ml-6"
                  bgVariant="blue"
                  className="text-end"
                />
              </div>
              <div className="flex justify-between mt-6">
                <div className="flex text-white">
                  <label className="font-regular text-xs md:text-base">
                    Pool Share:
                  </label>
                  <p className="font-regular text-sm md:text-base ml-3">
                    {pageData.poolShare || "0"}%
                  </p>
                </div>
                <NumericFormat
                  value={pageData.stakedAmount}
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                  fixedDecimalScale
                  decimalScale={2}
                  displayType="text"
                  renderText={(value) => (
                    <Text size="base" className="flex ml-2 gap-2">
                      Available Balance: {value} aUSD
                    </Text>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-end pr-4 gap-4 mt-10 md:mt-4">
              <GradientButton
                disabled={unstakeDisabled}
                disabledText={unstakeErrorText}
                loading={processLoading}
                onClick={unStakePool}
                className="min-w-[240px] md:w-[374px] h-11 "
                rounded="rounded-lg"
              >
                <Text>Withdraw</Text>
              </GradientButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StabilityPoolTab;
