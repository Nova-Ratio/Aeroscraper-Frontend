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
import { useNotification } from '@/contexts/NotificationProvider';
import { useWallet } from '@/contexts/WalletProvider';
import { convertAmount } from '@/utils/contractUtils';

enum TABS {
    COLLATERAL = 0,
    BORROWING
}

type Props = {
    open: boolean;
    onClose?: () => void;
    pageData: PageData;
    getPageData: () => void;
}

const TroveModal: FC<Props> = ({ open, pageData, onClose, getPageData }) => {
    const contract = useAppContract();
    const { balanceByDenom } = useWallet();
    const [openTroveAmount, setOpenTroveAmount] = useState<number>(0);
    const [borrowAmount, setBorrowAmount] = useState<number>(0);
    const [collateralAmount, setCollateralAmount] = useState<number>(0);
    const [borrowingAmount, setBorrowingAmount] = useState<number>(0);

    const [selectedTab, setSelectedTab] = useState<TABS>(TABS.COLLATERAL);

    const [processLoading, setProcessLoading] = useState<boolean>(false);
    const { addNotification } = useNotification();

    const isTroveOpened = useMemo(() => pageData.collateralAmount > 0, [pageData]);

    const changeOpenTroveAmount = (values: NumberFormatValues) => {
        setOpenTroveAmount(Number(values.value));
    }

    const changeBorrowAmount = (values: NumberFormatValues) => {
        setBorrowAmount(Number(values.value));
    }

    const changeCollateralAmount = (values: NumberFormatValues) => {
        setCollateralAmount(Number(values.value));
    }

    const changeBorrowingAmount = (values: NumberFormatValues) => {
        setBorrowingAmount(Number(values.value));
    }

    const queryAddColletral = async () => {
        setProcessLoading(true);

        try {
            const res = await contract.addCollateral(collateralAmount);

            addNotification({
                status: 'success',
                directLink: res?.transactionHash
            });
            getPageData();
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
            const res = await contract.removeCollateral(collateralAmount);

            addNotification({
                status: 'success',
                directLink: res?.transactionHash
            });
            getPageData();
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
            const res = await contract.borrowLoan(borrowingAmount);

            addNotification({
                status: 'success',
                directLink: res?.transactionHash
            });
            getPageData();
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
            const res = await contract.repayLoan(borrowingAmount);

            addNotification({
                status: 'success',
                directLink: res?.transactionHash
            });
            getPageData();
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

    const openTrove = async () => {
        try {
            setProcessLoading(true);

            const res = await contract.openTrove(openTroveAmount, borrowAmount);

            addNotification({
                status: 'success',
                directLink: res?.transactionHash
            });
            getPageData();
        }
        catch (err) {
            addNotification({
                message: "",
                status: 'error',
                directLink: ""
            })
        }
        finally {
            setProcessLoading(false);
        }
    }

    return (
        <Modal processLoading={processLoading} layoutId="trove" title="Trove" showModal={open} onClose={onClose}>
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
                                        <BorderedContainer containerClassName='mt-2' className='flex flex-col gap-2 p-2'>
                                            <InputLayout
                                                label='In Wallet'
                                                hintTitle="SEI"
                                                value={Number(convertAmount(balanceByDenom['usei']?.amount ?? 0)).toFixed(2)}
                                                bgVariant='transparent'
                                                inputClassName='w-full pr-[20%] text-end'
                                                disabled
                                            />
                                            <InputLayout
                                                label='In Trove Balance'
                                                hintTitle="SEI"
                                                value={pageData.collateralAmount}
                                                bgVariant='transparent'
                                                inputClassName='w-full pr-[20%] text-end'
                                                disabled
                                            />
                                        </BorderedContainer>
                                        <InputLayout label="Collateral" hintTitle="SEI" className='mt-2' value={collateralAmount} onValueChange={changeCollateralAmount} maxButtonClick={() => setCollateralAmount(Number(convertAmount(balanceByDenom['usei']?.amount ?? 0)))} hasPercentButton={{ max: true, min: false }} />
                                        <div className='grid grid-cols-2 gap-6 gap-y-4 p-4'>
                                            <StatisticCard
                                                title='Borrowing Fee'
                                                description='0 AUSD (0%)'
                                                tooltip='This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free.'
                                            />
                                            <StatisticCard
                                                title='Total Debt'
                                                description={`${pageData.debtAmount} AUSD`}
                                                tooltip='The total amount of AUSD your Trove will hold.'
                                            />
                                            <StatisticCard
                                                title='Liquidation price'
                                                description={Number([(pageData.debtAmount * 115) / (pageData.collateralAmount * 100)]).toFixed(2).toString()}
                                                tooltip='The dollar value per unit of collateral at which your Trove will drop below a 115% Collateral Ratio and be liquidated. You should ensure you are comfortable with managing your position so that the price of your collateral never reaches this level.'
                                            />
                                            <StatisticCard
                                                title='Collateral ratio'
                                                description={`${Number((pageData.collateralAmount * 2 ) / pageData.debtAmount * 100).toFixed(2)} %`}
                                                tooltip='The ratio between the dollar value of the collateral and the debt (in AUSD) you are depositing. While the Minimum Collateral Ratio is 115% during normal operation, it is recommended to keep the Collateral Ratio always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is recommended for additional safety.'
                                            />
                                        </div>
                                        <div className="flex items-center justify-end pr-4 gap-4">
                                            <OutlinedButton loading={processLoading} onClick={queryWithdraw} className="min-w-[201px] h-11">
                                                <Text>Withdraw</Text>
                                            </OutlinedButton>
                                            <GradientButton loading={processLoading} onClick={queryAddColletral} className="min-w-[201px] h-11" rounded="rounded-lg">
                                                <Text>Deposit</Text>
                                            </GradientButton>
                                        </div>
                                    </div>
                                )
                                :
                                (
                                    <div className='flex flex-col'>
                                        <BorderedContainer containerClassName='mt-2' className='flex flex-col gap-2 p-2'>
                                            <InputLayout
                                                label='Borrowing Capacity'
                                                hintTitle="AUSD"
                                                value={((pageData.collateralAmount * 2 * 100) / 115).toFixed(2)}
                                                bgVariant='transparent'
                                                inputClassName='w-full pr-[25%] text-end'
                                                disabled
                                            />
                                            <InputLayout
                                                label='Debt'
                                                hintTitle="AUSD"
                                                value={`${pageData.debtAmount} AUSD`}
                                                bgVariant='transparent'
                                                inputClassName='w-full pr-[25%] text-end'
                                                disabled
                                            />
                                        </BorderedContainer>
                                        <InputLayout label="Borrow-Repay" hintTitle="AUSD" className='mt-2' value={borrowingAmount} onValueChange={changeBorrowingAmount} hasPercentButton={{ max: false, min: false }} />
                                        <div className='grid grid-cols-2 gap-6 gap-y-4 p-4'>
                                            <StatisticCard
                                                title='Borrowing Fee'
                                                description='0 AUSD (0%)'
                                                tooltip='This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free.'
                                            />
                                            <StatisticCard
                                                title='Liquidation price'
                                                description={Number([(pageData.debtAmount * 115) / (pageData.collateralAmount * 100)]).toFixed(2).toString()}
                                                tooltip='The dollar value per unit of collateral at which your Trove will drop below a 115% Collateral Ratio and be liquidated. You should ensure you are comfortable with managing your position so that the price of your collateral never reaches this level.'
                                            />
                                            <StatisticCard
                                                title='Collateral ratio'
                                                description={`${Number((pageData.collateralAmount * 2 ) / pageData.debtAmount * 100).toFixed(2)} %`}
                                                tooltip='The ratio between the dollar value of the collateral and the debt (in AUSD) you are depositing. While the Minimum Collateral Ratio is 115% during normal operation, it is recommended to keep the Collateral Ratio always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is recommended for additional safety.'
                                            />
                                        </div>
                                        <div className="flex items-center justify-end pr-4 gap-4">
                                            <OutlinedButton loading={processLoading} onClick={queryRepay} className="min-w-[201px] h-11">
                                                <Text>Repay</Text>
                                            </OutlinedButton>
                                            <GradientButton loading={processLoading} onClick={queryBorrow} className="min-w-[201px] h-11" rounded="rounded-lg">
                                                <Text>Borrow</Text>
                                            </GradientButton>
                                        </div>
                                    </div>
                                )
                        }
                    </>
                    :
                    <div>
                        <Info message={"Collateral ratio must be at least 115%."} status={"normal"} />
                        <InputLayout label="Collateral" hintTitle="SEI" value={openTroveAmount} onValueChange={changeOpenTroveAmount} hasPercentButton={{ max: true, min: false }} />
                        <InputLayout label="Borrow" hintTitle="AUSD" value={borrowAmount} onValueChange={changeBorrowAmount} className="mt-4 mb-6" />
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
                                description="0 AUSD"
                                className="w-full h-14 col-span-6"
                                tooltip="An amount set aside to cover the liquidator’s gas costs if your Trove needs to be liquidated. The amount increases your debt and is refunded if you close your Trove by fully paying off its net debt."
                            />
                            <StatisticCard
                                title="Borrowing Fee"
                                description="0 AUSD (0%)"
                                className="w-full h-14 col-span-6"
                                tooltip="This amount is deducted from the borrowed amount as a one-time fee. There are no recurring fees for borrowing, which is thus interest-free."
                            />
                            <StatisticCard
                                title="Total debt"
                                description={`${pageData.debtAmount} AUSD`}
                                className="w-full h-14 col-span-6"
                                tooltip="The total amount of AUSD your Trove will hold."
                            />
                            <StatisticCard
                                title="Liquidation price"
                                description={Number([(pageData.debtAmount * 115) / (pageData.collateralAmount * 100)]).toFixed(2).toString()}
                                className="w-full h-14 col-span-6"
                                tooltip="The dollar value per unit of collateral at which your Trove will drop below a 115% Collateral Ratio and be liquidated. You should ensure you are comfortable with managing your position so that the price of your collateral never reaches this level.."
                            />
                            <StatisticCard
                                title="Collateral ratio"
                                description={`${Number((pageData.collateralAmount * 2 ) / pageData.debtAmount * 100).toFixed(2)} %`}
                                className="w-full h-14 col-span-6 col-start-4"
                                tooltip="The ratio between the dollar value of the collateral and the debt (in AUSD) you are depositing. While the Minimum Collateral Ratio is 115% during normal operation, it is recommended to keep the Collateral Ratio always above 150% to avoid liquidation under Recovery Mode. A Collateral Ratio above 200% or 250% is recommended for additional safety."
                            />
                        </motion.div>
                        <div className="flex flex-row ml-auto gap-3 mt-6 w-3/4">
                            <GradientButton loading={processLoading} onClick={openTrove} className="min-w-[221px] h-11 mt-4 ml-auto" rounded="rounded-lg">
                                <Text>Confirm</Text>
                            </GradientButton>
                        </div>
                    </div>
            }
        </Modal>
    )
}

export default TroveModal