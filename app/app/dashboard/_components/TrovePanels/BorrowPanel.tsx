import GradientButton from '@/components/Buttons/GradientButton';
import OutlinedButton from '@/components/Buttons/OutlinedButton';
import StatisticCard from '@/components/Cards/StatisticCard';
import BorderedNumberInput from '@/components/Input/BorderedNumberInput';
import Text from '@/components/Texts/Text';
import { DefaultAssetByChainName } from '@/constants/assetConstants';
import { useBalances } from '@/contexts/BalanceProvider';
import { usePageData } from '@/contexts/DashboardProvider';
import { useNotification } from '@/contexts/NotificationProvider';
import useAppContract from '@/contracts/app/useAppContract';
import { ChainName } from '@/enums/Chain';
import useChainAdapter from '@/hooks/useChainAdapter';
import { CollateralAsset } from '@/types/types';
import { getRatioColor } from '@/utils/contractUtils';
import { motion } from 'framer-motion';
import React, { FC, useMemo, useState } from 'react'
import { NumberFormatValues, NumericFormat } from 'react-number-format';

const BorrowPanel: FC = () => {
    const contract = useAppContract();
    const { refreshBalance } = useBalances();
    const { selectedChainName, basePrice } = useChainAdapter();
    const { pageData, getPageData } = usePageData();

    const [borrowingAmount, setBorrowingAmount] = useState<number>(0);

    // The purpose of using useState instead of constant value is to store the selected asset for future on multi collateral feature
    const [selectedAsset] = useState<CollateralAsset>(
        DefaultAssetByChainName[selectedChainName ?? ChainName.INJECTIVE]
    );

    const { addNotification, processLoading, setProcessLoading } = useNotification();

    const selectedCollateral = useMemo(() => {
        if (ChainName.XION === selectedChainName) {
            return (
                pageData.collateralAmountsByDenom[selectedAsset?.cw20Denom || selectedAsset.denom] ?? {
                    denom: selectedAsset.cw20Denom,
                    amount: 0,
                }
            );
        } else {
            return (
                pageData.collateralAmountsByDenom[selectedAsset.denom] ?? {
                    denom: selectedAsset.denom,
                    amount: 0,
                }
            );
        }
    }, [selectedAsset, pageData.collateralAmountsByDenom]);

    const borrowCollRatio = useMemo(() => {

        const ratio = Number(selectedCollateral.amount * basePrice) / Number(pageData.debtAmount + borrowingAmount);
        return isFinite(ratio) ? ratio : 0;
    }, [selectedCollateral, borrowingAmount, basePrice, pageData.debtAmount])

    const repayCollRatio = useMemo(() => {
        const ratio = Number(selectedCollateral.amount * basePrice) / Number(pageData.debtAmount - borrowingAmount);
        return isFinite(ratio) && ratio > 0 ? ratio : 0;
    }, [selectedCollateral, borrowingAmount, basePrice, pageData.debtAmount])

    const borrowDisabled = useMemo(
        () =>
            borrowingAmount <= 0 ||
            borrowingAmount >
            (selectedCollateral.amount * basePrice * 100) / 115 -
            pageData.debtAmount,
        [borrowingAmount, pageData, selectedCollateral, basePrice]
    );

    const borrowErrorText = useMemo(() =>
        borrowingAmount <= 0 ?
            "Enter the amount." :
            borrowingAmount >
                (selectedCollateral.amount * basePrice * 100) / 115 -
                pageData.debtAmount ?
                "Insufficient borrowing capacity." :
                undefined,
        [borrowingAmount, pageData, selectedCollateral, basePrice]
    )

    const repayDisabled = useMemo(
        () =>
            borrowingAmount <= 0 ||
            borrowingAmount >
            (selectedChainName === ChainName.XION ? 99999999 : 999) ||
            borrowingAmount > pageData.debtAmount ||
            borrowingAmount > pageData.ausdBalance,
        [borrowingAmount, pageData]
    );

    const repayErrorText = useMemo(() =>
        borrowingAmount <= 0 ?
            "Enter the amount." :
            (borrowingAmount > pageData.debtAmount || borrowingAmount > pageData.ausdBalance) ?
                "Insufficient aUSD balance." :
                undefined,
        [borrowingAmount, pageData]
    )

    const changeBorrowingAmount = (values: NumberFormatValues) => {
        setBorrowingAmount(Number(values.value));
    };

    const queryBorrow = async () => {
        setProcessLoading(true);

        try {
            const res = await contract.borrowLoan(borrowingAmount, borrowCollRatio);

            addNotification({
                status: "success",
                directLink: res?.transactionHash,
                message: `${borrowingAmount} aUSD Borrowed`,
            });
            getPageData();
            refreshBalance();
            setBorrowingAmount(0);
        } catch (err: any) {
            addNotification({
                message: JSON.stringify(err.message),
                status: "error",
                directLink: "",
            });
        }

        setProcessLoading(false);
    };

    const queryRepay = async () => {
        setProcessLoading(true);

        try {
            const isAllAmount = borrowingAmount >= pageData.debtAmount;
            const res = await contract.repayLoan(borrowingAmount, repayCollRatio, isAllAmount);

            addNotification({
                status: "success",
                directLink: res?.transactionHash,
                message: `${borrowingAmount} aUSD Repayed`,
            });

            if (borrowingAmount >= pageData.debtAmount) {
                setTimeout(() => {
                    addNotification({ status: "success", message: `Trove Closed` });
                }, 1000);
            }

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

    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3, ease: "easeIn" }}
            className="flex flex-col"
        >
            <div className="w-full bg-cetacean-dark-blue border backdrop-blur-[37px] border-white/10 rounded-xl md:rounded-2xl px-3 pt-4 pb-3 md:px-6 md:py-8 flex flex-col gap-4 mt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img alt="ausd" className="w-6 h-6" src="/images/token-images/ausd-blue.svg" />
                        <Text size="base" weight="font-medium">aUSD</Text>
                    </div>
                    <BorderedNumberInput
                        value={borrowingAmount}
                        onValueChange={changeBorrowingAmount}
                        containerClassName="h-10 text-end flex-1 ml-6"
                        bgVariant="blue"
                        className="text-end"
                    />
                </div>
                <div className="flex justify-between md:mt-6">
                    <div className="flex">
                        <label className="font-regular text-[10px] md:text-base text-gray-300">
                            In Wallet:
                        </label>
                        <NumericFormat
                            value={pageData.ausdBalance}
                            thousandsGroupStyle="thousand"
                            thousandSeparator=","
                            fixedDecimalScale
                            decimalScale={2}
                            displayType="text"
                            renderText={(value) => {
                                return (
                                    <p className="text-white font-regular text-xs md:text-base ml-1 md:ml-3">
                                        {value} aUSD
                                    </p>
                                );
                            }}
                        />
                    </div>

                    <div className="flex">
                        <label className="font-regular text-[10px] md:text-base text-gray-300">
                            Borrowing Capacity:
                        </label>
                        n
                        <NumericFormat
                            value={
                                ((selectedCollateral.amount ?? 0) * basePrice * 100) /
                                115 -
                                pageData.debtAmount
                            }
                            thousandsGroupStyle="thousand"
                            thousandSeparator=","
                            fixedDecimalScale
                            decimalScale={2}
                            displayType="text"
                            renderText={(value) => (
                                <p className="text-white font-regular text-xs md:text-base ml-1 md:ml-3">
                                    {value} aUSD
                                </p>
                            )}
                        />
                    </div>
                    <div className="flex">
                        <label className="font-regular text-[10px] md:text-base text-gray-300">
                            Debt:
                        </label>
                        <NumericFormat
                            value={pageData.debtAmount}
                            thousandsGroupStyle="thousand"
                            thousandSeparator=","
                            fixedDecimalScale
                            decimalScale={2}
                            displayType="text"
                            renderText={(value) => (
                                <p className="text-white font-regular text-xs md:text-base ml-1 md:ml-3">{`${value} aUSD`}</p>
                            )}
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 gap-y-4 p-4">
                <div></div>
                <div></div>
                <StatisticCard
                    title="Collateral Ratio"
                    description={`${(pageData.baseMinCollateralRatio * 100).toFixed(6)} %`}
                    descriptionColor={pageData.baseMinCollateralRatio > 0 ? getRatioColor(pageData.baseMinCollateralRatio * 100) : undefined}
                    tooltip="The ratio between the dollar value of the collateral and the debt (in aUSD) you are depositing."
                />
            </div>
            <div className="flex items-center justify-end pr-4 gap-4 mt-6">
                <OutlinedButton
                    disabled={repayDisabled}
                    disabledText={repayErrorText}
                    loading={processLoading}
                    onClick={queryRepay}
                    className="min-w-[142px] md:min-w-[201px] h-11"
                >
                    <Text>Repay</Text>
                </OutlinedButton>
                <GradientButton
                    disabled={borrowDisabled}
                    disabledText={borrowErrorText}
                    loading={processLoading}
                    onClick={queryBorrow}
                    className="min-w-[176px] md:min-w-[375px] h-11"
                    rounded="rounded-lg"
                >
                    <Text>Borrow</Text>
                </GradientButton>
            </div>
        </motion.div>
    )
}

export default BorrowPanel