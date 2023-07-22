import GradientButton from '@/components/Buttons/GradientButton';
import StatisticCard from '@/components/Cards/StatisticCard';
import InputLayout from '@/components/Input/InputLayout';
import { Modal } from '@/components/Modal/Modal';
import Text from '@/components/Texts/Text';
import Info from '@/components/Tooltip/Info';
import useAppContract from '@/contracts/app/useAppContract';
import { motion } from 'framer-motion';
import React, { FC, useMemo, useState } from 'react'
import { NumberFormatValues } from 'react-number-format/types/types';
import { PageData } from '../_types/types';
import OutlinedButton from '@/components/Buttons/OutlinedButton';
import BorderedContainer from '@/components/Containers/BorderedContainer';
import Accordion from '@/components/Accordion/Accordion';
import { useNotification } from '@/contexts/NotificationProvider';

enum TABS {
    COLLATERAL = 0,
    BORROWING
}

type Props = {
    open: boolean;
    onClose?: () => void;
    pageData: PageData;
}

const TroveModal: FC<Props> = ({ open, pageData, onClose }) => {
    const contract = useAppContract();

    const [openTroveAmount, setOpenTroveAmount] = useState<number>(0);
    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [borrowAmount, setBorrowAmount] = useState<number>(0);
    const [repayAmount, setRepayAmount] = useState<number>(0);

    const [selectedTab, setSelectedTab] = useState<TABS>(TABS.COLLATERAL);

    const [processLoading, setProcessLoading] = useState<boolean>(false);
    const { addNotification } = useNotification();

    const isTroveOpened = useMemo(() => pageData.ausdBalance > 0, [pageData]);

    const changeOpenTroveAmount = (values: NumberFormatValues) => {
        setOpenTroveAmount(Number(values.value));
    }

    const changeWithdrawAmount = (values: NumberFormatValues) => {
        setWithdrawAmount(Number(values.value));
    }

    const changeBarrowAmount = (values: NumberFormatValues) => {
        setBorrowAmount(Number(values.value));
    }

    const changeRepayAmount = (values: NumberFormatValues) => {
        setRepayAmount(Number(values.value));
    }

    const queryAddColletral = async () => {
        setProcessLoading(true);

        try {
            const res = await contract.addCollateral(openTroveAmount);

            addNotification({
                status: 'success',
                directLink: res?.transactionHash
            });
            setOpenTroveAmount(0);
        }
        catch (err) {
            console.error(err);

            addNotification({
                message: "",
                status: 'error',
                directLink: ""
            })
        }

        setProcessLoading(false);
    }

    const queryWithdraw = async () => {
        setProcessLoading(true);

        try {
            const res = await contract.removeCollateral(withdrawAmount);

            addNotification({
                status: 'success',
                directLink: res?.transactionHash
            });
            setWithdrawAmount(0);
        }
        catch (err) {
            console.error(err);

            addNotification({
                message: "",
                status: 'error',
                directLink: ""
            })
        }

        setProcessLoading(false);
    }

    const queryBorrow = async () => {
        setProcessLoading(true);

        try {
            const res = await contract.borrowLoan(borrowAmount);

            addNotification({
                status: 'success',
                directLink: res?.transactionHash
            });
            setWithdrawAmount(0);
        }
        catch (err) {
            console.error(err);

            addNotification({
                message: "",
                status: 'error',
                directLink: ""
            })
        }

        setProcessLoading(false);
    }

    const queryRepay = async () => {
        setProcessLoading(true);

        try {
            const res = await contract.repayLoan(repayAmount);

            addNotification({
                status: 'success',
                directLink: res?.transactionHash
            });
            setRepayAmount(0);
        }
        catch (err) {
            console.error(err);

            addNotification({
                message: "",
                status: 'error',
                directLink: ""
            })
        }

        setProcessLoading(false);
    }

    return (
        <Modal layoutId="trove" title="Trove" showModal={open} onClose={onClose}>
            {
                isTroveOpened ?
                    <>
                        <div className='flex items-center gap-6 pr-[30%]'>
                            <OutlinedButton containerClassName='w-[221px]' className='h-16' innerClassName={`${selectedTab === TABS.COLLATERAL ? "bg-opacity-0" : "bg-opacity-100"}`} onClick={() => setSelectedTab(TABS.COLLATERAL)}>
                                Collateral
                            </OutlinedButton>
                            <OutlinedButton containerClassName='w-[221px]' className='h-16' innerClassName={`${selectedTab === TABS.BORROWING ? "bg-opacity-0" : "bg-opacity-100"}`} onClick={() => setSelectedTab(TABS.BORROWING)}>
                                Borrowing
                            </OutlinedButton>
                        </div>
                        {
                            selectedTab === TABS.COLLATERAL ?
                                (
                                    <div className='flex flex-col'>
                                        <div className='flex mt-2'>
                                            <Accordion text='Trove Details'>
                                                <div className='grid grid-cols-2 gap-6 gap-y-4 p-4'>
                                                    <StatisticCard
                                                        title='Borrowing Fee'
                                                        description='X.XX AUSD (X.XX%)'
                                                        tooltip='This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free.'
                                                    />
                                                    <StatisticCard
                                                        title='Total Debt'
                                                        description='X.XXX.XXX AUSD'
                                                        tooltip='The total amount of AUSD your Trove will hold.'
                                                    />
                                                    <StatisticCard
                                                        title='Liquidation price'
                                                        description='-'
                                                        tooltip='The dollar value per unit of collateral at which your Trove will drop below a 110% Collateral Ratio and be liquidated. You should ensure you are comfortable with managing your position so that the price of your collateral never reaches this level.'
                                                    />
                                                    <StatisticCard
                                                        title='Collateral ratio'
                                                        description='-'
                                                        tooltip='The ratio between the dollar value of the collateral and the debt (in AUSD) you are depositing. While the Minimum Collateral Ratio is 110% during normal operation, it is recommended to keep the Collateral Ratio always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is recommended for additional safety.'
                                                    />
                                                </div>
                                            </Accordion>
                                        </div>
                                        <BorderedContainer containerClassName='mt-2' className='flex flex-col gap-2 p-4'>
                                            <InputLayout
                                                label='In Wallet'
                                                hintTitle="SEI"
                                                value={0}
                                            />
                                            <div className='flex items-center gap-4'>
                                                <InputLayout
                                                    label='Deposit Balance'
                                                    labelSize='sm'
                                                    hintTitle="SEI"
                                                    value={0}
                                                    className='w-[calc(50%-8px)]'
                                                />
                                                <InputLayout
                                                    label='New Deposit Balance'
                                                    labelSize='sm'
                                                    hintTitle="SEI"
                                                    value={0}
                                                    className='w-[calc(50%-8px)]'
                                                />
                                            </div>
                                        </BorderedContainer>
                                        <InputLayout label="Collateral" hintTitle="SEI" className='mt-2' value={openTroveAmount} onValueChange={changeOpenTroveAmount} hasPercentButton={{ max: true, min: false }} />
                                        <div className='pl-[10%] mt-2'>
                                            <InputLayout label="Borrow" hintTitle="AUSD" value={0} />
                                        </div>
                                        <div className='pl-[35%] mt-2'>
                                            <InputLayout label="Collateral" hintTitle="SEI" value={withdrawAmount} onValueChange={changeWithdrawAmount} hasPercentButton={{ max: false, min: false, custom: true }} customButtonText='Withdraw' customButtonOnClick={queryWithdraw} />
                                        </div>
                                        <div className="flex pr-[10%]">
                                            <GradientButton loading={processLoading} onClick={queryAddColletral} className="min-w-[221px] h-11 mt-4 ml-auto" rounded="rounded-lg">
                                                <Text>Deposit</Text>
                                            </GradientButton>
                                        </div>
                                    </div>
                                )
                                :
                                (
                                    <div className='flex flex-col'>
                                        <div className='flex mt-2'>
                                            <Accordion text='Trove Details'>
                                                <div className='grid grid-cols-2 gap-6 gap-y-4 p-4'>
                                                    <StatisticCard
                                                        title='Borrowing Fee'
                                                        description='X.XX AUSD (X.XX%)'
                                                        tooltip='This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free.'
                                                    />
                                                    <StatisticCard
                                                        title='Total Debt'
                                                        description='X.XXX.XXX AUSD'
                                                        tooltip='The total amount of AUSD your Trove will hold.'
                                                    />
                                                    <StatisticCard
                                                        title='Liquidation price'
                                                        description='-'
                                                        tooltip='The dollar value per unit of collateral at which your Trove will drop below a 110% Collateral Ratio and be liquidated. You should ensure you are comfortable with managing your position so that the price of your collateral never reaches this level.'
                                                    />
                                                    <StatisticCard
                                                        title='Collateral ratio'
                                                        description='-'
                                                        tooltip='The ratio between the dollar value of the collateral and the debt (in AUSD) you are depositing. While the Minimum Collateral Ratio is 110% during normal operation, it is recommended to keep the Collateral Ratio always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is recommended for additional safety.'
                                                    />
                                                </div>
                                            </Accordion>
                                        </div>
                                        <BorderedContainer containerClassName='mt-2' className='flex flex-col gap-2 p-4'>
                                            <InputLayout
                                                label='Borrowing Capacity'
                                                hintTitle="AUSD"
                                                value={0}
                                            />
                                            <div className='flex items-center gap-4'>
                                                <InputLayout
                                                    label='Borrowed Balance'
                                                    labelSize='sm'
                                                    hintTitle="AUSD"
                                                    value={0}
                                                    className='w-[calc(50%-8px)]'
                                                />
                                                <InputLayout
                                                    label='New Borrowed Balance'
                                                    labelSize='sm'
                                                    hintTitle="AUSD"
                                                    value={0}
                                                    className='w-[calc(50%-8px)]'
                                                />
                                            </div>
                                        </BorderedContainer>
                                        <InputLayout
                                            label="Borrow"
                                            hintTitle="AUSD"
                                            className='mt-2'
                                            value={borrowAmount}
                                            onValueChange={changeBarrowAmount}
                                            hasPercentButton={{ max: true, min: false }}
                                        />
                                        <div className='pl-[10%] mt-2'>
                                            <InputLayout
                                                label="Debt: 0 AUSD"
                                                hintTitle="AUSD"
                                                value={repayAmount}
                                                onValueChange={changeRepayAmount}
                                                hasPercentButton={{ custom: true, min: false, max: false }}
                                                customButtonText='Repay'
                                                customButtonOnClick={queryRepay}
                                            />
                                        </div>
                                        <div className="flex pr-[10%]">
                                            <GradientButton loading={processLoading} onClick={() => { queryBorrow(); }}className="min-w-[221px] h-11 mt-4 ml-auto" rounded="rounded-lg">
                                                <Text>Borrow</Text>
                                            </GradientButton>
                                        </div>
                                    </div>
                                )
                        }
                    </>
                    :
                    <div>
                        <Info message={"Collateral ratio must be at least 110%."} status={"normal"} />
                        <InputLayout label="Collateral" hintTitle="SEI" value={borrowAmount} onValueChange={changeBarrowAmount} hasPercentButton={{ max: true, min: false }} />
                        <InputLayout label="Borrow" hintTitle="AUSD" value={repayAmount} onValueChange={changeRepayAmount} className="mt-4 mb-6" />
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
                            <GradientButton className="min-w-[221px] h-11 mt-4 ml-auto" rounded="rounded-lg">
                                <Text>Confirm</Text>
                            </GradientButton>
                        </div>
                    </div>
            }
        </Modal>
    )
}

export default TroveModal