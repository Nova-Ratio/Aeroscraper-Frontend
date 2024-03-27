import GradientButton from '@/components/Buttons/GradientButton';
import StatisticCard from '@/components/Cards/StatisticCard';
import BorderedNumberInput from '@/components/Input/BorderedNumberInput';
import Text from '@/components/Texts/Text';
import { DefaultAssetByChainName } from '@/constants/assetConstants';
import { MANAGEMENT_FEE } from '@/constants/chainConstants';
import { useBalances } from '@/contexts/BalanceProvider';
import { usePageData } from '@/contexts/DashboardProvider';
import { useNotification } from '@/contexts/NotificationProvider';
import useAppContract from '@/contracts/app/useAppContract';
import { ChainName } from '@/enums/Chain';
import useChainAdapter from '@/hooks/useChainAdapter';
import { CollateralAsset } from '@/types/types';
import { convertAmount, AUSD_PRICE, getRatioColor } from '@/utils/contractUtils';
import { motion } from 'framer-motion';
import { isNil } from 'lodash';
import React, { FC, useMemo, useState } from 'react'
import { NumberFormatValues, NumericFormat } from 'react-number-format';

const CreateTrovePanel: FC = () => {
    const contract = useAppContract();
    const { balanceByDenom, refreshBalance } = useBalances();
    const { selectedChainName, basePrice } = useChainAdapter();
    const { pageData, getPageData } = usePageData();

    const [openTroveAmount, setOpenTroveAmount] = useState<number>(0);
    const [borrowAmount, setBorrowAmount] = useState<number>(0);

    // The purpose of using useState instead of constant value is to store the selected asset for future on multi collateral feature
    const [selectedAsset] = useState<CollateralAsset>(
        DefaultAssetByChainName[selectedChainName ?? ChainName.INJECTIVE]
    );

    const { addNotification, processLoading, setProcessLoading } = useNotification();

    const collacteralRatioCalculate = useMemo(
        () => Number(((openTroveAmount * (1 - MANAGEMENT_FEE)) || 0) * basePrice) / (borrowAmount || 0),
        [openTroveAmount, borrowAmount, basePrice]
    );

    const selectedMinCollateral = useMemo(() => {
        return pageData.minCollateralRatioByDenom[selectedAsset.denom] ?? 0;
    }, [selectedAsset, pageData.minCollateralRatioByDenom]);

    const collacteralRatio = isFinite(collacteralRatioCalculate) ? collacteralRatioCalculate : 0;

    const confirmDisabled = useMemo(
        () =>
            borrowAmount <= 0 ||
            openTroveAmount <= 0 ||
            /* collacteralRatio < 1.15 || */
            openTroveAmount >
            convertAmount(
                balanceByDenom[selectedAsset!.denom]?.amount ?? 0,
                selectedAsset!.decimal
            ) ||
            collacteralRatio < selectedMinCollateral - 0.00001,
        [
            openTroveAmount,
            borrowAmount,
            collacteralRatio,
            selectedMinCollateral,
            selectedAsset,
            balanceByDenom
        ]
    );

    const openTroveErrorText = useMemo(() =>
        (openTroveAmount <= 0 || borrowAmount <= 0) ?
            "Fill the both amounts."
            :
            openTroveAmount > convertAmount(balanceByDenom[selectedAsset!.denom]?.amount ?? 0, selectedAsset!.decimal) ?
                "Insufficient balance."
                :
                collacteralRatio < 1.15 ?
                    "Collateral ratio should be at least 115%."
                    :
                    collacteralRatio < (selectedMinCollateral - 0.00001) ?
                        `Collateral ratio should be at least ${selectedMinCollateral}.`
                        :
                        undefined,
        [
            openTroveAmount,
            borrowAmount,
            collacteralRatio,
            selectedMinCollateral,
            selectedAsset,
            balanceByDenom
        ]
    )

    const changeOpenTroveAmount = (values: NumberFormatValues) => {
        setOpenTroveAmount(Number(values.value));
    };

    const changeBorrowAmount = (values: NumberFormatValues) => {
        setBorrowAmount(Number(values.value));
    };

    const openTrove = async () => {
        try {
            setProcessLoading(true);

            const res = await contract.openTrove(
                openTroveAmount,
                borrowAmount,
                collacteralRatioCalculate,
                selectedAsset
            );

            addNotification({
                status: "success",
                directLink: res?.txHash,
                message: "Trove Opened",
            });
            getPageData();
            refreshBalance();
        } catch (err: any) {
            addNotification({
                message: JSON.stringify(err.message),
                status: "error",
                directLink: "",
            });
        } finally {
            setProcessLoading(false);
        }
    };

    return (
        <div>
            <Text size="3xl">Borrow aUSD</Text>
            <Text size="base" weight="font-regular" className="mt-1">
                Open a trove to borrow aUSD, Aeroscraper’s native stable coin.
            </Text>
            <div className="w-full bg-cetacean-dark-blue border backdrop-blur-[37px] border-white/10 rounded-xl md:rounded-2xl px-3 pt-4 pb-4 md:px-6 md:pt-8 flex flex-col gap-4 mt-6">
                <div className="flex items-end justify-between">
                    <div>
                        <Text size="sm" weight="mb-2">Collateral</Text>
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
                        value={openTroveAmount}
                        onValueChange={changeOpenTroveAmount}
                        containerClassName="h-10 text-end flex-1 ml-6"
                        bgVariant="blue"
                        className="text-end"
                    />
                </div>
                <div className="flex mt-1">
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
            <div className="w-full bg-cetacean-dark-blue border backdrop-blur-[37px] border-white/10 rounded-xl md:rounded-2xl px-3 pt-4 pb-3 md:px-6 md:py-8 flex flex-col gap-4 mt-6">
                <div className="flex items-end justify-between">
                    <div>
                        <Text size="sm" weight="mb-2">Borrow</Text>
                        <div className="flex items-center gap-2 mb-2">
                            <img alt="ausd" className="w-6 h-6" src="/images/token-images/ausd.svg" />
                            <Text size="base" weight="font-medium">aUSD</Text>
                        </div>
                    </div>
                    <BorderedNumberInput
                        value={borrowAmount}
                        onValueChange={changeBorrowAmount}
                        containerClassName="h-10 text-end flex-1 ml-6"
                        bgVariant="blue"
                        className="text-end"
                    />
                </div>
                <div className="flex mt-1">
                    <label className="font-regular text-xs md:text-base text-gray-300">
                        In Wallet:
                    </label>
                    <NumericFormat
                        value={Number(pageData.ausdBalance * AUSD_PRICE)}
                        thousandsGroupStyle="thousand"
                        thousandSeparator=","
                        fixedDecimalScale
                        decimalScale={2}
                        displayType="text"
                        renderText={(value) => {
                            return (
                                <p className="text-white font-regular text-xs md:text-base ml-3">
                                    {value} aUSD
                                </p>
                            );
                        }}
                    />
                </div>
            </div>
            <motion.div
                initial={{ y: 50, x: 50, opacity: 0.1 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                    delay: 0.1,
                }}
                className="grid grid-cols-2 md:grid-cols-3 content-center md:gap-16 mt-8"
            >
                <NumericFormat
                    value={Number(openTroveAmount * MANAGEMENT_FEE)}
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
                    isNumeric
                    description={`${borrowAmount} aUSD`}
                    className="w-full h-14"
                    tooltip="The total amount of aUSD you have borrowed"
                />
                <StatisticCard
                    title="Collateral Ratio"
                    description={`${(collacteralRatio * 100).toFixed(6)} %`}
                    descriptionColor={collacteralRatio > 0 ? getRatioColor(collacteralRatio * 100) : undefined}
                    className="w-full h-14"
                    tooltip="The ratio between the dollar value of the collateral and the debt (in aUSD) you are depositing."
                />
            </motion.div>
            <div className="flex items-center justify-end pr-4 gap-4 mt-10 md:mt-4">
                <GradientButton
                    loading={processLoading}
                    onClick={openTrove}
                    className="min-w-full md:min-w-[375px] h-11 "
                    rounded="rounded-lg"
                    disabled={confirmDisabled}
                    disabledText={openTroveErrorText}
                >
                    <Text>Confirm</Text>
                </GradientButton>
            </div>
        </div>
    )
}

export default CreateTrovePanel