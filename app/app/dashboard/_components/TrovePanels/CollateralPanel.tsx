import GradientButton from '@/components/Buttons/GradientButton'
import OutlinedButton from '@/components/Buttons/OutlinedButton'
import StatisticCard from '@/components/Cards/StatisticCard'
import BorderedNumberInput from '@/components/Input/BorderedNumberInput'
import Text from '@/components/Texts/Text'
import Tooltip from '@/components/Tooltip/Tooltip'
import { DefaultAssetByChainName } from '@/constants/assetConstants'
import { MANAGEMENT_FEE } from '@/constants/chainConstants'
import { useBalances } from '@/contexts/BalanceProvider'
import { usePageData } from '@/contexts/DashboardProvider'
import { useNotification } from '@/contexts/NotificationProvider'
import useAppContract from '@/contracts/app/useAppContract'
import { ChainName } from '@/enums/Chain'
import useChainAdapter from '@/hooks/useChainAdapter'
import { CollateralAsset } from '@/types/types'
import { convertAmount, getRatioColor } from '@/utils/contractUtils'
import { motion } from 'framer-motion'
import { isNil } from 'lodash'
import React, { FC, useMemo, useState } from 'react'
import { NumberFormatValues, NumericFormat } from 'react-number-format'

const CollateralPanel: FC = () => {
    const contract = useAppContract();
    const { balanceByDenom, refreshBalance } = useBalances();
    const { selectedChainName, basePrice } = useChainAdapter();
    const { pageData, getPageData } = usePageData();

    const [collateralAmount, setCollateralAmount] = useState<number>(0);

    // The purpose of using useState instead of constant value is to store the selected asset for future on multi collateral feature
    const [selectedAsset] = useState<CollateralAsset>(
        DefaultAssetByChainName[selectedChainName ?? ChainName.NIBIRU]
    );

    const { addNotification, processLoading, setProcessLoading } = useNotification();

    const selectedCollateral = useMemo(() => {
        return (
            pageData.collateralAmountsByDenom[selectedAsset.denom] ?? {
                denom: selectedAsset.denom,
                amount: 0,
            }
        );
    }, [selectedAsset, pageData.collateralAmountsByDenom]);

    const selectedMinCollateral = useMemo(() => {
        return pageData.minCollateralRatioByDenom[selectedAsset.denom] ?? 0;
    }, [selectedAsset, pageData.minCollateralRatioByDenom]);

    const depositCollRatio = useMemo(() => {
        const ratio = Number((selectedCollateral.amount + (collateralAmount * (1 - MANAGEMENT_FEE))) * basePrice) / (pageData.debtAmount);
        return isFinite(ratio) ? ratio : 0;
    }, [selectedCollateral, collateralAmount, basePrice, pageData.debtAmount])

    const withdrawCollRatio = useMemo(() => {
        const ratio = Number((selectedCollateral.amount - (collateralAmount)) * basePrice) / (pageData.debtAmount);
        return isFinite(ratio) && ratio > 0 ? ratio : 0;
    }, [selectedCollateral, collateralAmount, basePrice, pageData.debtAmount])

    const withdrawDisabled = useMemo(
        () =>
            collateralAmount <= 0 ||
            selectedCollateral.amount < collateralAmount,
        [collateralAmount, selectedCollateral]
    );

    const withdrawErrorText = useMemo(() =>
        collateralAmount <= 0 ?
            "Enter the ARCH amount." :
            selectedCollateral.amount < collateralAmount ?
                "Insufficient in trove ARCH balance." :
                undefined,
        [collateralAmount, selectedCollateral]
    )

    const depositDisabled = useMemo(
        () =>
            collateralAmount <= 0 ||
            Number(
                convertAmount(
                    balanceByDenom[selectedAsset.denom]?.amount ?? 0,
                    selectedAsset.decimal
                )
            ) < collateralAmount,
        [collateralAmount, selectedAsset, balanceByDenom]
    );

    const depositErrorText = useMemo(() =>
        collateralAmount <= 0 ?
            "Enter the ARCH amount." :
            Number(
                convertAmount(
                    balanceByDenom[selectedAsset.denom]?.amount ?? 0,
                    selectedAsset.decimal
                )
            ) < collateralAmount ?
                "Insufficient ARCH balance." :
                undefined,
        [collateralAmount, selectedAsset, balanceByDenom]
    )

    const changeCollateralAmount = (values: NumberFormatValues) => {
        setCollateralAmount(Number(values.value));
    };

    const queryAddColletral = async () => {
        setProcessLoading(true);

        try {
            const res = await contract.addCollateral(
                collateralAmount,
                depositCollRatio,
                selectedAsset
            );

            addNotification({
                status: "success",
                directLink: res?.transactionHash,
                message: `${collateralAmount} ${selectedAsset?.shortName} Collateral Added`,
            });
            getPageData();
            refreshBalance();
            setCollateralAmount(0);
        } catch (err: any) {
            addNotification({
                message: JSON.stringify(err.message),
                status: "error",
                directLink: "",
            });
        }

        setProcessLoading(false);
    };

    const queryWithdraw = async () => {
        setProcessLoading(true);

        try {
            const res = await contract.removeCollateral(
                collateralAmount,
                withdrawCollRatio,
                selectedAsset
            );

            addNotification({
                status: "success",
                directLink: res?.transactionHash,
                message: `${collateralAmount} ${selectedAsset?.shortName} Collateral Removed`,
            });
            getPageData();
            refreshBalance();
            setCollateralAmount(0);
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
            className="flex flex-col mt-6"
        >
            <div className="w-full bg-cetacean-dark-blue border backdrop-blur-[37px] border-white/10 rounded-xl md:rounded-2xl px-3 pt-4 pb-3 md:px-6 md:py-8 flex flex-col gap-4 md:mt-6">
                <div className="flex items-center md:items-end justify-between">
                    <div>
                        {!isNil(selectedAsset) ? (
                            <div className="flex items-center gap-2">
                                <img alt="token" src={selectedAsset.imageURL} className="w-6 h-6" />
                                <Text size="base" weight="font-medium">{selectedAsset.shortName}</Text>
                            </div>
                        ) : (
                            <Text size="2xl" weight="font-medium" className="flex-1 text-center">
                                -
                            </Text>
                        )}
                    </div>
                    <BorderedNumberInput
                        value={collateralAmount}
                        onValueChange={changeCollateralAmount}
                        containerClassName="h-10 text-end flex-1 ml-6"
                        bgVariant="blue"
                        className="text-end"
                    />
                </div>
                <div className="flex justify-between md:mt-6">
                    <div className="flex">
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
                    <div className="flex">
                        <label className="font-regular text-xs md:text-base text-gray-300">
                            In Trove Balance:
                        </label>
                        <NumericFormat
                            value={selectedCollateral.amount}
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
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-20 md:gap-6 gap-y-4 mt-4 md:mt-0 md:p-4">
                <NumericFormat
                    value={Number(collateralAmount * MANAGEMENT_FEE)}
                    thousandsGroupStyle="thousand"
                    thousandSeparator=","
                    fixedDecimalScale
                    decimalScale={3}
                    displayType="text"
                    renderText={(value) => (
                        <StatisticCard
                            title="Management Fee"
                            description={`${value} ${selectedAsset?.shortName ?? ""} (0.5%)`}
                            tooltip="This amount is deducted from the collateral amount as a management fee. There are no recurring fees for borrowing, which is thus interest-free."
                        />
                    )}
                />

                <StatisticCard
                    title="Total Debt"
                    description={`${pageData.debtAmount < 0.001 ? "< 0.000" : pageData.debtAmount} aUSD`}
                    tooltip="The total amount of aUSD you have borrowed"
                />
                <StatisticCard
                    title="Collateral Ratio"
                    description={`${(selectedMinCollateral * 100).toFixed(3)} %`}
                    descriptionColor={selectedMinCollateral > 0 ? getRatioColor(selectedMinCollateral * 100) : undefined}
                    tooltip="The ratio between the dollar value of the collateral and the debt (in aUSD) you are depositing."
                />
            </div>
            <div className="flex items-center justify-end pr-4 gap-4 mt-10 md:mt-4">
                <Tooltip
                    active={!withdrawDisabled}
                    title={
                        <Text size="base" className='whitespace-nowrap'>
                            New Collateral Ratio will be {withdrawCollRatio * 100}%
                        </Text>
                    }
                    width="w-fit"
                >
                    <OutlinedButton
                        disabled={withdrawDisabled}
                        disabledText={withdrawErrorText}
                        loading={processLoading}
                        onClick={queryWithdraw}
                        className="min-w-[136px] md:min-w-[201px] h-11"
                    >
                        <Text>Withdraw</Text>
                    </OutlinedButton>
                </Tooltip>
                <Tooltip
                    active={!depositDisabled}
                    title={
                        <Text size="base" className='whitespace-nowrap'>
                            New Collateral Ratio will be {depositCollRatio * 100}%
                        </Text>
                    }
                    width="w-fit"
                >
                    <GradientButton
                        disabled={depositDisabled}
                        disabledText={depositErrorText}
                        loading={processLoading}
                        onClick={queryAddColletral}
                        className="min-w-[176px] md:min-w-[374px] h-11"
                        rounded="rounded-lg"
                    >
                        <Text>Deposit</Text>
                    </GradientButton>
                </Tooltip>
            </div>
        </motion.div>
    )
}

export default CollateralPanel