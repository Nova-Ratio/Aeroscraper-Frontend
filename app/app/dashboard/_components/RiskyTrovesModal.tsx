import GradientButton from '@/components/Buttons/GradientButton';
import { Modal } from '@/components/Modal/Modal';
import { Table } from '@/components/Table/Table';
import { TableBodyCol } from '@/components/Table/TableBodyCol';
import { TableHeaderCol } from '@/components/Table/TableHeaderCol';
import Text from '@/components/Texts/Text';
import React, { FC, useState } from 'react'
import { NumericFormat } from 'react-number-format';
import { PageData } from '../_types/types';
import useAppContract from '@/contracts/app/useAppContract';
import { useNotification } from '@/contexts/NotificationProvider';

type Props = {
    open: boolean;
    onClose?: () => void;
    pageData: PageData;
    getPageData: () => void;
}

const RiskyTrovesModal: FC<Props> = ({ open, onClose, pageData, getPageData }) => {
    const contract = useAppContract();
    const [processLoading, setProcessLoading] = useState<boolean>(false);
    const { addNotification } = useNotification();

    const liquidateTrovesa = async () => {
        try {
            setProcessLoading(true);
            const res = await contract.liquidateTroves();
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
        finally {
            setProcessLoading(false);
        }
    }

    return (
        <Modal
            layoutId="risky-troves"
            title="Risky Troves"
            showModal={open}
            onClose={onClose}
        >
            <>
                <div className="-ml-10">
                    <Table
                        listData={new Array(7).fill('')}
                        header={<div className="grid-cols-4 grid gap-5 lg:gap-0 mt-4">
                            <TableHeaderCol col={1} text="Owner" />
                            <TableHeaderCol col={1} text="Collateral" />
                            <TableHeaderCol col={1} text="Debt" textCenter />
                            <TableHeaderCol col={1} text="Coll. Ratio" textCenter />
                            <TableHeaderCol col={1} text="" />
                        </div>}
                        renderItem={(item: any, index: number) => {
                            return <div className="grid grid-cols-4">
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
                            </div>
                        }} />
                </div>
                <div className='flex justify-center mt-4'>
                    <GradientButton
                        className='w-[221px] h-14'
                        onClick={liquidateTrovesa}
                        rounded="rounded-lg"
                        loading={processLoading}
                    >
                        Liquidate Risky Troves
                    </GradientButton>
                </div>
            </>
        </Modal>
    )
}

export default RiskyTrovesModal