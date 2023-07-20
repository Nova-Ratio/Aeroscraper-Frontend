'use client';

import GradientButton from "@/components/Buttons/GradientButton";
import WalletButton from "@/components/Buttons/WalletButton";
import OutlinedButton from "@/components/Buttons/OutlinedButton";
import StatisticCard from "@/components/Cards/StatisticCard";
import BorderedContainer from "@/components/Containers/BorderedContainer";
import ShapeContainer from "@/components/Containers/ShapeContainer";
import { RightArrow } from "@/components/Icons/Icons";
import InputLayout from "@/components/Input/InputLayout";
import { Modal } from "@/components/Modal/Modal";
import { Table } from "@/components/Table/Table";
import { TableBodyCol } from "@/components/Table/TableBodyCol";
import { TableHeaderCol } from "@/components/Table/TableHeaderCol";
import Text from "@/components/Texts/Text"
import Info from "@/components/Tooltip/Info";
import Tooltip from "@/components/Tooltip/Tooltip";
import Link from "next/link";
import { useState } from "react";
import { NumericFormat } from 'react-number-format'
import { motion } from "framer-motion";
import { useNotification } from "@/contexts/NotificationProvider";

export default function Dashboard() {

    const { addNotification } = useNotification();

    const [troveModal, setTroveModal] = useState(false);
    const [stabilityModal, setStabilityModal] = useState(false);
    const [riskyModal, setRiskyModal] = useState(false);

    return (
        <div>
            <BorderedContainer className="w-full px-8 py-6 flex justify-between items-center gap-2">
                <div className="flex items-center gap-11">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <img alt="ausd" className="w-10 h-10" src="/images/ausd.svg" />
                            <Text size="2xl">AUSD</Text>
                        </div>
                        <Text>$0.976923</Text>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <img alt="ausd" className="w-10 h-10" src="/images/atom.svg" />
                            <Text size="2xl">ATOM</Text>
                        </div>
                        <Text>$0.976923</Text>
                    </div>
                </div>
                <WalletButton />
            </BorderedContainer>
            <BorderedContainer className="w-full p-3 mt-4">
                <div className="w-full rounded-lg px-4 py-2">
                    <Text size="2xl" weight="font-normal">Aeroscraper Statics</Text>
                    <div className="flex flex-wrap justify-center gap-6 mt-2 px-24">
                        <StatisticCard
                            title="Borrowing Fee"
                            description="X.XX%"
                            className="w-[191px] h-14"
                            tooltip="The Borrowing Fee is a one-off fee charged as a percentage of the borrowed amount (in AUSD) and is part of a Trove's debt. The fee varies between 0.5% and 5% depending on AUSD redemption volumes."
                        />
                        <StatisticCard
                            title="TVL"
                            description="XXXK ATOM ($XXXM)"
                            className="w-[191px] h-14"
                            tooltip="The Total Value Locked (TVL) is the total value of Atom locked as collateral in the system, given in AUSD and ATOM."
                        />
                        <StatisticCard
                            title="Troves"
                            description="X.XXX"
                            className="w-[191px] h-14"
                            tooltip="The total number of active Troves in the system."
                        />
                        <StatisticCard
                            title="AUSD supply"
                            description="XXXM"
                            className="w-[191px] h-14"
                            tooltip="The total AUSD minted by the Liquity Protocol."
                        />
                        <StatisticCard
                            title="Kickback Rate"
                            description="XXX%"
                            className="w-[191px] h-14"
                            tooltip="A rate between 0 and 100% set by the Frontend Operator that determines the fraction of ATOM that will be paid out as a kickback to the Stability Providers using the frontend."
                        />
                        <StatisticCard
                            title="AUSD in Stability Pool"
                            description="XXXM (XX.X%)"
                            className="w-[191px] h-14"
                            tooltip="The total AUSD currently held in the Stability Pool, expressed as an amount and a fraction of the AUSD supply."
                        />
                        <StatisticCard
                            title="Total Collateral Ratio"
                            description="XXX.X%"
                            className="w-[191px] h-14"
                            tooltip="The ratio of the Dollar value of the entire system collateral at the current ATOM:AUSD price, to the entire system debt."
                        />
                    </div>
                </div>
            </BorderedContainer>
            <div key={"stability-pool"} className="flex items-center">
                <ShapeContainer layoutId="trove" className="flex-[3]" width="" height="">
                    <div className='flex flex-col w-full h-full'>
                        <Text size="3xl" weight="font-normal">Trove</Text>
                        <Text weight="font-normal" className="mt-4">You haven’t borrowed any AUSD yet.</Text>
                        <Text size="base" className="mt-2">You can borrow AUSD by opening a Trove.</Text>
                        <GradientButton onClick={() => { setTroveModal(true); }} className="w-full max-w-[192px] 2xl:max-w-[221px] h-11 mt-6 2xl:mt-10 ml-auto 2xl:mx-auto" rounded="rounded-lg">
                            <Text>Open Trove</Text>
                        </GradientButton>
                    </div>
                </ShapeContainer>
                <ShapeContainer layoutId="stability-pool" className="flex-[3]" width="" height="">
                    <div className='flex flex-col w-full h-full'>
                        <Text size="3xl" weight="font-normal">Stability Pool</Text>
                        <Text weight="font-normal" className="mt-4">You have no AUSD in the Stability Pool.</Text>
                        <Text size="base" className="mt-2">You can earn AUSD rewards by deposting AUSD.</Text>
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

            <Modal layoutId="trove" title="Trove" showModal={troveModal} onClose={() => { setTroveModal(false); }}>
                <div>
                    <Info message={"Collateral ratio must be at least 110%."} status={"normal"} />
                    <InputLayout label="Collateral" hintTitle="ATOM" value={0} hasPercentButton={{ max: true, min: false }} />
                    <InputLayout label="Borrow" hintTitle="AUSD" value={0} className="mt-4 mb-6" />
                    <motion.div
                        initial={{ y: 200, x: 200, opacity: 0.1 }}
                        animate={{ y: 0, x: 0, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 25,
                            delay: 0.1
                        }}
                        className="grid grid-cols-12 content-center gap-6 mt-2">
                        <StatisticCard
                            title="Liquidation Reserve"
                            description="XXX AUSD"
                            className="w-full h-14 col-span-6"
                            tooltip="An amount set aside to cover the liquidator’s gas costs if your Trove needs to be liquidated. The amount increases your debt and is refunded if you close your Trove by fully paying off its net debt."
                        />
                        <StatisticCard
                            title="Borrowing Fee"
                            description="X.XX AUSD (X.XX%)"
                            className="w-full h-14 col-span-6"
                            tooltip="This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free."
                        />
                        <StatisticCard
                            title="Total debt"
                            description="X.XXX,XX AUSD"
                            className="w-full h-14 col-span-6"
                            tooltip="The total amount of AUSD your Trove will hold."
                        />
                        <StatisticCard
                            title="Liquidation price"
                            description="$XXXXXXX.XX"
                            className="w-full h-14 col-span-6"
                            tooltip="The dollar value per unit of collateral at which your Trove will drop below a 110% Collateral Ratio and be liquidated. You should ensure you are comfortable with managing your position so that the price of your collateral never reaches this level.."
                        />
                        <StatisticCard
                            title="Collateral ratio"
                            description="X.XX%"
                            className="w-full h-14 col-span-6 col-start-4"
                            tooltip="The ratio between the dollar value of the collateral and the debt (in AUSD) you are depositing. While the Minimum Collateral Ratio is 110% during normal operation, it is recommended to keep the Collateral Ratio always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is recommended for additional safety."
                        />
                    </motion.div>
                    <div className="flex flex-row ml-auto gap-3 mt-6 w-3/4">
                        <GradientButton onClick={() => { addNotification({ message: "", status: "success" }); }} className="min-w-[221px] h-11 mt-4 ml-auto" rounded="rounded-lg">
                            <Text>Confirm</Text>
                        </GradientButton>
                    </div>
                </div>
            </Modal>

            <Modal key="stability-pool" layoutId="stability-pool" title="Stability Pool" showModal={stabilityModal} onClose={() => { setStabilityModal(false); }}>
                <div className="-ml-4">
                    <Info message={"Enter the amount of AUSD you'd like to deposit."} status={"normal"} />
                    <div className="flex flex-row w-1/2 ml-10 gap-6 mt-6 mb-10">
                        <GradientButton className="min-w-[221px] h-16 mt-4" rounded="rounded-lg">
                            <Text>Deposit</Text>
                        </GradientButton>
                        <OutlinedButton className="min-w-[221px] h-16 mt-4">
                            <Text>Withdraw</Text>
                        </OutlinedButton>
                    </div>
                    <InputLayout label="Deposit" hintTitle="AUSD" value={0} hasPercentButton={{ max: true, min: false }} />
                    <InputLayout label="Pool Share" hintTitle="%" value={0} className="mt-4 mb-6" />
                    <GradientButton className="min-w-[221px] h-11 mt-6 ml-auto" rounded="rounded-lg">
                        <Text>Confirm</Text>
                    </GradientButton>
                </div>
            </Modal>

            <Modal layoutId="risky-troves" title="Risky Troves" showModal={riskyModal} onClose={() => { setRiskyModal(false); }}>
                <div className="-ml-10">
                    <Table
                        listData={new Array(7).fill('')}
                        header={<div className="grid-cols-5 grid gap-5 lg:gap-0 mt-4">
                            <TableHeaderCol col={1} text="Owner" />
                            <TableHeaderCol col={1} text="Collateral" />
                            <TableHeaderCol col={1} text="Debt" textCenter />
                            <TableHeaderCol col={1} text="Coll. Ratio" textCenter />
                            <TableHeaderCol col={1} text="" />
                        </div>}
                        renderItem={(item: any, index: number) => {
                            return <div className="grid grid-cols-5">
                                <TableBodyCol col={1} text="XXXXXX" value={
                                    <Text size='base' className='whitespace-nowrap'>arch1zrm...6tzx </Text>
                                } />
                                <TableBodyCol col={1} text="XXXXXX" value={
                                    <NumericFormat
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator=","
                                        fixedDecimalScale
                                        decimalScale={2}
                                        displayType="text"
                                        renderText={(value) =>
                                            <Text size='base' responsive={false} className='whitespace-nowrap'>XX.XXXX</Text>
                                        }
                                    />} />
                                <TableBodyCol col={1} text="XXXXXX" value={
                                    <NumericFormat
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator=","
                                        fixedDecimalScale
                                        decimalScale={2}
                                        displayType="text"
                                        renderText={(value) =>
                                            <Text size='base' responsive={false} className='whitespace-nowrap'>XX.XXXX</Text>
                                        }
                                    />} />
                                <TableBodyCol col={1} text="XXXXXX" value={
                                    <NumericFormat
                                        thousandsGroupStyle="thousand"
                                        thousandSeparator=","
                                        fixedDecimalScale
                                        decimalScale={2}
                                        displayType="text"
                                        renderText={(value) =>
                                            <Text size='base' responsive={false} className='whitespace-nowrap text-green-500'>XX.XXXX%</Text>
                                        }
                                    />} />
                                <TableBodyCol col={1} text="XXXXX" value={
                                    <GradientButton className="w-[120px] h-8 py-0" rounded="rounded-2xl">
                                        <Text>Liquidate</Text>
                                    </GradientButton>
                                } />
                            </div>
                        }} />
                </div>
            </Modal>
        </div>
    )
}