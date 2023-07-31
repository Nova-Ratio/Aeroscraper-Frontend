'use client';

import GradientButton from "@/components/Buttons/GradientButton";
import WalletButton from "@/components/Buttons/WalletButton";
import StatisticCard from "@/components/Cards/StatisticCard";
import BorderedContainer from "@/components/Containers/BorderedContainer";
import ShapeContainer from "@/components/Containers/ShapeContainer";
import { Logo, RedeemIcon, RightArrow } from "@/components/Icons/Icons";
import Text from "@/components/Texts/Text"
import { useCallback, useEffect, useMemo, useState } from "react";
import { NumericFormat } from 'react-number-format'
import TroveModal from "./_components/TroveModal";
import useAppContract from "@/contracts/app/useAppContract";
import { PageData } from "./_types/types";
import { convertAmount, getValueByRatio } from "@/utils/contractUtils";

import StabilityPoolModal from "./_components/StabilityPoolModal";
import OutlinedButton from "@/components/Buttons/OutlinedButton";
import BorderedNumberInput from "@/components/Input/BorderedNumberInput";
import RiskyTrovesModal from "./_components/RiskyTrovesModal";
import { useWallet } from "@/contexts/WalletProvider";

export default function Dashboard() {
    const { balanceByDenom } = useWallet();
    const [troveModal, setTroveModal] = useState(false);
    const [stabilityModal, setStabilityModal] = useState(false);
    const [riskyModal, setRiskyModal] = useState(false);
    const [redeemAmount, setRedeemAmount] = useState(0);
    const [pageData, setPageData] = useState<PageData>({
        collateralAmount: 0,
        debtAmount: 0,
        ausdBalance: 0,
        stakedAmount: 0,
        totalCollateralAmount: 0,
        totalDebtAmount: 0,
        totalAusdSupply: 0,
        totalStakedAmount: 0,
        poolShare: 0
    })

    const [processLoading, setProcessLoading] = useState<boolean>(false);

    const isTroveOpened = useMemo(() => pageData.collateralAmount > 0, [pageData]);

    const contract = useAppContract();

    const getPageData = useCallback(async () => {
        try {
            const [
                troveRes,
                ausdBalanceRes,
                stakeRes,
                totalStakeRes,
                totalCollateralRes,
                totalDebtRes,
                ausdInfoRes
            ] = await Promise.all([
                contract.getTrove(),
                contract.getAusdBalance(),
                contract.getStake(),
                contract.getTotalStake(),
                contract.getTotalCollateralAmount(),
                contract.getTotalDebtAmount(),
                contract.getAusdInfo()
            ])

            setPageData({
                collateralAmount: convertAmount(troveRes?.collateral_amount ?? 0),
                debtAmount: convertAmount(troveRes?.debt_amount ?? 0),
                ausdBalance: convertAmount(ausdBalanceRes?.balance ?? 0),
                stakedAmount: convertAmount(stakeRes?.amount ?? 0),
                totalCollateralAmount: convertAmount(totalCollateralRes ?? 0),
                totalDebtAmount: convertAmount(totalDebtRes ?? 0),
                totalAusdSupply: convertAmount(ausdInfoRes?.total_supply ?? 0),
                totalStakedAmount: convertAmount(totalStakeRes ?? 0),
                poolShare: Number(Number(stakeRes?.percentage).toFixed(2))
            })
        }
        catch (err) {
            console.error(err);

            setPageData({
                collateralAmount: 0,
                debtAmount: 0,
                ausdBalance: 0,
                stakedAmount: 0,
                totalCollateralAmount: 0,
                totalDebtAmount: 0,
                totalAusdSupply: 0,
                totalStakedAmount: 0,
                poolShare: 0
            })
        }
    }, [contract])

    const redeem = async () => {
        try {
            setProcessLoading(true);
            await contract.redeem(redeemAmount);
            getPageData();
        }
        catch (err) {
            console.error(err);
        }

        setProcessLoading(false);
    }

    useEffect(() => {
        getPageData();
    }, [getPageData])

    return (
        <div>
            <div className="grid grid-cols-[1fr_439px] gap-6">
                <BorderedContainer containerClassName="w-full h-[122px]" className="px-8 py-6 flex justify-between items-center gap-2">
                    <div className="flex items-center gap-11">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                <img alt="ausd" className="w-10 h-10" src="/images/ausd.svg" />
                                <Text size="2xl">AUSD</Text>
                            </div>
                            <Text>$1</Text>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                <img alt="ausd" className="w-10 h-10" src="/images/sei.png" />
                                <Text size="2xl">SEI</Text>
                            </div>
                            <Text>$2</Text>
                        </div>
                    </div>
                    <WalletButton ausdBalance={pageData.ausdBalance} seiBalance={Number(convertAmount(balanceByDenom['usei']?.amount ?? 0))} />
                </BorderedContainer>
                <BorderedContainer containerClassName="w-full h-full row-span-2" className="px-4 py-6 flex flex-col justify-center items-center">
                    <div className="relative w-full bg-dark-purple rounded-lg p-2 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <NumericFormat
                                value={pageData.ausdBalance}
                                thousandsGroupStyle="thousand"
                                thousandSeparator=","
                                fixedDecimalScale
                                decimalScale={2}
                                displayType="text"
                                renderText={(value) =>
                                    <Text size="base">
                                        Available <span className="font-medium">${value} AUSD</span>
                                    </Text>
                                }
                            />
                            <div className="flex items-center gap-2">
                                <OutlinedButton containerClassName="w-[61px] h-6" onClick={() => { setRedeemAmount(pageData.ausdBalance) }}>
                                    Max
                                </OutlinedButton>
                                <OutlinedButton containerClassName="w-[61px] h-6" onClick={() => { setRedeemAmount(getValueByRatio(pageData.ausdBalance, 0.5)) }}>
                                    Half
                                </OutlinedButton>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Logo width="40" height="40" />
                                <Text size="2xl" weight="font-medium">AUSD</Text>
                            </div>
                            <BorderedNumberInput
                                value={redeemAmount}
                                onValueChange={e => setRedeemAmount(Number(e.value))}
                                containerClassName="h-10"
                                className="w-[262px] text-end"
                            />
                        </div>
                        <RedeemIcon height="48" width="48" className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[40px]" />
                    </div>
                    <div className="w-full bg-dark-purple rounded-lg px-2 py-7 flex items-center justify-between mt-8">
                        <div className="flex items-center gap-2">
                            <img alt="sei" src="/images/sei.png" className="w-10 h-10" />
                            <Text size="2xl" weight="font-medium">SEI</Text>
                        </div>
                        <BorderedNumberInput
                            value={0}
                            containerClassName="h-10"
                            className="w-[262px] text-end"
                            disabled
                        />
                    </div>
                    <GradientButton
                        loading={processLoading}
                        className="w-[221px] h-11 mt-7"
                        rounded="rounded-lg"
                        onClick={redeem}
                    >
                        Redeem
                    </GradientButton>
                </BorderedContainer>
                <BorderedContainer containerClassName="w-full mt-4" className="p-3">
                    <div className="w-full rounded-lg px-4 py-2">
                        <Text size="2xl" weight="font-normal">Aeroscraper Statics</Text>
                        <div className="flex flex-wrap justify-center gap-6 mt-2 px-4">
                            <StatisticCard
                                title="Borrowing Fee"
                                description="0%"
                                className="w-[191px] h-14"
                                tooltip="The Borrowing Fee is a one-off fee charged as a percentage of the borrowed amount (in AUSD) and is part of a Trove's debt."
                            />
                            <StatisticCard
                                title="TVL"
                                description={`${Number(pageData.totalCollateralAmount + pageData.totalStakedAmount).toFixed(2)} SEI`}
                                className="w-[191px] h-14"
                                tooltip="The Total Value Locked (TVL) is the total value of sei locked as collateral in the system."
                            />
                            <StatisticCard
                                title="Troves"
                                description="-"
                                className="w-[191px] h-14"
                                tooltip="The total number of active Troves in the system."
                            />
                            <StatisticCard
                                title="AUSD supply"
                                description={Number(pageData.totalAusdSupply).toFixed(2).toString()}
                                className="w-[191px] h-14"
                                tooltip="The total AUSD minted by the Liquity Protocol."
                            />
                            <StatisticCard
                                title="Liquidation Threshold"
                                description="115%"
                                className="w-[191px] h-14"
                                tooltip="Liquidation Threshold Ratio"
                            />
                            <StatisticCard
                                title="AUSD in Stability Pool"
                                description={Number(pageData.totalStakedAmount).toFixed(2).toString()}
                                className="w-[191px] h-14"
                                tooltip="The total AUSD currently held in the Stability Pool."
                            />
                            <StatisticCard
                                title="Total Collateral Ratio"
                                description={`${Number((pageData.totalCollateralAmount * 2 ) / pageData.totalAusdSupply * 100).toFixed(2)} %`}
                                className="w-[191px] h-14"
                                tooltip="The ratio of the Dollar value of the entire system collateral at the current SEI:AUSD price, to the entire system debt."
                            />
                        </div>
                    </div>
                </BorderedContainer>
            </div>
            <div key={"stability-pool"} className="flex items-center">
                <ShapeContainer layoutId="trove" className="flex-[3]" width="" height="">
                    <div className='flex flex-col w-full h-full'>
                        <Text size="3xl" weight="font-normal">Trove</Text>
                        <NumericFormat
                            value={pageData.debtAmount}
                            thousandsGroupStyle="thousand"
                            thousandSeparator=","
                            fixedDecimalScale
                            decimalScale={2}
                            displayType="text"
                            renderText={(value) =>
                                <Text weight="font-normal" className="mt-4">
                                    {
                                        isTroveOpened ?
                                            `You borrowed ${value} AUSD`
                                            :
                                            "You haven’t borrowed any AUSD yet."
                                    }
                                </Text>
                            }
                        />
                        <Text size="base" className="mt-2">
                            {
                                isTroveOpened ?
                                    "You can see your trove in here."
                                    :
                                    "You can borrow AUSD by opening a Trove."
                            }
                        </Text>
                        <GradientButton onClick={() => { setTroveModal(true); }} className="w-full max-w-[192px] 2xl:max-w-[221px] h-11 mt-6 2xl:mt-10 ml-auto 2xl:mx-auto" rounded="rounded-lg">
                            <Text>
                                {
                                    isTroveOpened ?
                                        "Show my Trove"
                                        :
                                        "Open Trove"
                                }
                            </Text>
                        </GradientButton>
                    </div>
                </ShapeContainer>
                <ShapeContainer layoutId="stability-pool" className="flex-[3]" width="" height="">
                    <div className='flex flex-col w-full h-full'>
                        <Text size="3xl" weight="font-normal">Stability Pool</Text>
                        <NumericFormat
                            value={pageData.stakedAmount}
                            thousandsGroupStyle="thousand"
                            thousandSeparator=","
                            fixedDecimalScale
                            decimalScale={2}
                            displayType="text"
                            renderText={(value) =>
                                <Text weight="font-normal" className="mt-4">
                                    You have {Number(value) > 0 ? value : "no"} AUSD in the Stability Pool.
                                </Text>
                            }
                        />
                        {pageData.stakedAmount <= 0 && <Text size="base" className="mt-2">You can earn AUSD rewards by deposting AUSD.</Text>}
                        <GradientButton onClick={() => { setStabilityModal(true); }} className="w-full max-w-[192px] 2xl:max-w-[221px] h-11 mt-6 2xl:mt-10 ml-auto" rounded="rounded-lg">
                            <Text>Enter</Text>
                        </GradientButton>
                    </div>
                </ShapeContainer>
                <ShapeContainer layoutId="risky-troves" className="flex-1 cursor-pointer" width="" height="">
                    <div onClick={() => { setRiskyModal(true); }} className="w-full h-full flex flex-wrap justify-center items-center">
                        <Text size="base" className="whitespace-nowrap">Risky Troves</Text>
                        <RightArrow width="24" height="24" />
                    </div>
                </ShapeContainer>
            </div>

            <TroveModal
                open={troveModal}
                onClose={() => { setTroveModal(false); }}
                pageData={pageData}
                getPageData={getPageData}
            />

            {stabilityModal &&
                <StabilityPoolModal
                    open={stabilityModal}
                    onClose={() => { setStabilityModal(false); }}
                    pageData={pageData}
                    getPageData={getPageData}
                />
            }

            {
                riskyModal &&
                <RiskyTrovesModal
                    open={riskyModal}
                    onClose={() => { setRiskyModal(false); }}
                    pageData={pageData}
                    getPageData={getPageData}
                />
            }
        </div>
    )
}