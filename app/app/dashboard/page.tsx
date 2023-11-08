'use client';

import GradientButton from "@/components/Buttons/GradientButton";
import WalletButton from "@/components/Buttons/WalletButton";
import StatisticCard from "@/components/Cards/StatisticCard";
import BorderedContainer from "@/components/Containers/BorderedContainer";
import ShapeContainer from "@/components/Containers/ShapeContainer";
import { InfoIcon, RightArrow } from "@/components/Icons/Icons";
import Text from "@/components/Texts/Text"
import { NumericFormat } from 'react-number-format'
import { PageData } from "./_types/types";
import { convertAmount } from "@/utils/contractUtils";
import { useWallet } from "@/contexts/WalletProvider";
import RedeemSide from "./_components/RedeemSide";
import Tooltip from "@/components/Tooltip/Tooltip";
import NotificationDropdown from "./_components/NotificationDropdown";
import { isNil } from "lodash";
import { ClientEnum } from "@/types/types";
import SeiDashboard from "./_chain/SeiDashboard";
import ArchwayDashboard from "./_chain/ArchwayDashboard";
import NeutronDashboard from "./_chain/NeutronDashboard";
import InjectiveDashboard from "./_chain/InjectiveDashboard";

export default function Dashboard() {
    const { balanceByDenom, baseCoin, walletType, clientType, refreshBalance } = useWallet();


    if (!isNil(clientType)) {
        if (clientType === ClientEnum.SEI) {
            return <SeiDashboard />
        }

        if (clientType === ClientEnum.ARCHWAY) {
            return <ArchwayDashboard />
        }

        if (clientType === ClientEnum.NEUTRON) {
            return <NeutronDashboard />
        }

        if (clientType === ClientEnum.INJECTIVE) {
            return <InjectiveDashboard />
        }
    }

    return (
        <div>
            <InjectiveDashboard />
            <div className="grid grid-cols-[1fr_439px] gap-6 overflow-hidden">
                <BorderedContainer containerClassName="w-full h-[122px]" className="px-8 py-6 flex justify-between items-center gap-2">
                    <div className="flex items-center gap-11">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                <img alt="ausd" className="w-10 h-10" src="/images/token-images/ausd.svg" />
                                <Text size="2xl">AUSD</Text>
                            </div>
                            <Text>$1.00</Text>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationDropdown />
                        <WalletButton
                            ausdBalance={0}
                            baseCoinBalance={!isNil(baseCoin) ? Number(convertAmount(balanceByDenom[baseCoin.denom]?.amount ?? 0, baseCoin.decimal)) : 0}
                            basePrice={0}
                        />
                    </div>
                </BorderedContainer>
                <RedeemSide pageData={{} as PageData} getPageData={() => { }} refreshBalance={refreshBalance} basePrice={0} />
                <BorderedContainer containerClassName="w-full mt-4" className="p-3">
                    <div className="w-full rounded-lg px-4 py-2">
                        <Text size="2xl" weight="font-normal">Aeroscraper Statics</Text>
                        <div className="flex flex-wrap justify-center gap-6 mt-2 px-4">
                            <StatisticCard
                                title="Management Fee"
                                description="0.5%"
                                className="w-[191px] h-14"
                                tooltip="This amount is deducted from the collateral amount as a management fee. There are no recurring fees for borrowing, which is thus interest-free."
                                tooltipPlacement="top"
                            />
                            <StatisticCard
                                title="TVL"
                                description={"-"}
                                className="w-[191px] h-14"
                                tooltip="The Total Value Locked (TVL) is the total value of sei locked as collateral in the system."
                                tooltipPlacement="top"
                            />
                            <StatisticCard
                                title="Troves"
                                description={"-"}
                                className="w-[191px] h-14"
                                tooltip="The total number of active Troves in the system."
                                tooltipPlacement="top"
                            />
                            <StatisticCard
                                title="AUSD Supply"
                                description={"-"}
                                className="w-[191px] h-14"
                                tooltip="The total AUSD minted by the Aeroscraper Protocol."
                                tooltipPlacement="top"
                            />
                            <StatisticCard
                                title="Liquidation Threshold"
                                description="115%"
                                className="w-[191px] h-14"
                                tooltip="Liquidation Threshold Ratio"
                                tooltipPlacement="top"
                            />
                            <StatisticCard
                                title="AUSD in Stability Pool"
                                tooltipPlacement="top"
                                description={"-"}
                                className="w-[191px] h-14"
                                tooltip="The total AUSD currently held in the Stability Pool."
                            />
                            <StatisticCard
                                title="Total Collateral Ratio"
                                tooltipPlacement="top"
                                description={"- %"}
                                className="w-[191px] h-14"
                                tooltip={`The ratio of the Dollar value of the entire system collateral at the current ${baseCoin?.name}:AUSD price, to the entire system debt.`}
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
                            value={0}
                            thousandsGroupStyle="thousand"
                            thousandSeparator=","
                            fixedDecimalScale
                            decimalScale={2}
                            displayType="text"
                            renderText={(value) =>
                                <Text weight="font-normal" className="mt-4">
                                    You haven’t borrowed any AUSD yet.
                                </Text>
                            }
                        />
                        <Text size="base" className="mt-2">
                            You can borrow AUSD by opening a Trove.
                        </Text>
                        <GradientButton
                            onClick={() => { }}
                            className="w-full max-w-[192px] 2xl:max-w-[221px] h-11 mt-6 2xl:mt-10 ml-auto 2xl:mx-auto"
                            rounded="rounded-lg"
                            disabled={isNil(baseCoin) || isNil(walletType)}
                        >
                            <Text>
                                Open Trove
                            </Text>
                        </GradientButton>
                    </div>
                </ShapeContainer>
                <ShapeContainer layoutId="stability-pool" className="flex-[3]" width="" height="">
                    <div className='flex flex-col w-full h-full'>
                        <div className="flex flex-row">
                            <Text size="3xl" weight="font-normal">Stability Pool</Text>
                            <Tooltip title={<Text size='base'>If the frame is glowing, you have a claimable reward.</Text>} width='w-[191px]'>
                                <InfoIcon className='text-white w-4 h-4' />
                            </Tooltip>
                        </div>
                        <NumericFormat
                            value={0}
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
                        <GradientButton
                            onClick={() => { }}
                            className="w-full max-w-[192px] 2xl:max-w-[221px] h-11 mt-6 2xl:mt-10 ml-auto"
                            rounded="rounded-lg"
                            disabled={isNil(baseCoin) || isNil(walletType)}
                        >
                            <Text>Enter</Text>
                        </GradientButton>
                    </div>
                </ShapeContainer>
                <ShapeContainer layoutId="risky-troves" className="flex-1 cursor-pointer" width="" height="">
                    <div onClick={() => { }} className="w-full h-full flex flex-wrap justify-center items-center">
                        <Text size="base" className="whitespace-nowrap">Risky Troves</Text>
                        <RightArrow width="24" height="24" />
                    </div>
                </ShapeContainer>
            </div>
        </div>
    )
}