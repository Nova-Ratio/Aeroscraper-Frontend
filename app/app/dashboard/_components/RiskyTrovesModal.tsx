import GradientButton from '@/components/Buttons/GradientButton';
import { Modal } from '@/components/Modal/Modal';
import { Table } from '@/components/Table/Table';
import { TableBodyCol } from '@/components/Table/TableBodyCol';
import { TableHeaderCol } from '@/components/Table/TableHeaderCol';
import Text from '@/components/Texts/Text';
import React, { FC, useCallback, useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format';
import { PageData } from '../_types/types';
import useAppContract from '@/contracts/app/useAppContract';
import { useNotification } from '@/contexts/NotificationProvider';
import { requestRiskyTroves } from '@/services/graphql';
import { RiskyTroves } from '@/types/types';
import { convertAmount, getRatioColor } from '@/utils/contractUtils';
import { getCroppedString } from '@/utils/stringUtils';
import SkeletonLoading from '@/components/Table/SkeletonLoading';
import { useWallet } from '@/contexts/WalletProvider';

type Props = {
    open: boolean;
    onClose?: () => void;
    pageData: PageData;
    getPageData: () => void;
    basePrice: number;
}

const RiskyTrovesModal: FC<Props> = ({ open, onClose, pageData, getPageData, basePrice }) => {
    const { baseCoin } = useWallet();
    const contract = useAppContract();
    const [loading, setLoading] = useState(false);
    const [processLoading, setProcessLoading] = useState<boolean>(false);
    const [riskyTroves, setRiskyTroves] = useState<RiskyTroves[]>([]);
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
            getRiskyTroves();
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

    const getRiskyTroves = useCallback(async () => {
        try {
            setLoading(true);
            const res = await requestRiskyTroves();
            const getTrovesPromises = res.troves.nodes.map<Promise<RiskyTroves>>(async item => {
                try {
                    const troveRes = await contract.getTroveByAddress(item.owner);
                    return {
                        owner: item.owner,
                        liquidityThreshold: item.liquidityThreshold,
                        collateralAmount: convertAmount(troveRes?.collateral_amount ?? 0),
                        debtAmount: convertAmount(troveRes?.debt_amount ?? 0)
                    }
                }
                catch (err) {
                    return {
                        owner: item.owner,
                        liquidityThreshold: item.liquidityThreshold,
                        collateralAmount: 0,
                        debtAmount: 0
                    }
                }
            })
            const data = await Promise.all(getTrovesPromises);
            setRiskyTroves(data);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }, [contract])

    useEffect(() => {
        getRiskyTroves();
    }, [getRiskyTroves])

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
                        listData={riskyTroves}
                        header={<div className="grid-cols-4 grid gap-5 lg:gap-0 mt-4">
                            <TableHeaderCol col={1} text="Owner" />
                            <TableHeaderCol col={1} text="Collateral" textCenter />
                            <TableHeaderCol col={1} text="Debt" textCenter />
                            <TableHeaderCol col={1} text="Coll. Ratio" />
                        </div>}
                        bodyCss='space-y-1 max-h-[350px] overflow-auto'
                        renderItem={(item: RiskyTroves) => {
                            return loading ?
                                <>
                                    {
                                        Array.from(Array(2).keys()).map(
                                            item => <SkeletonLoading key={item} height='h-5' />
                                        )
                                    }
                                </>
                                :
                                <div className="grid grid-cols-4">
                                    <TableBodyCol col={1} text="XXXXXX" value={
                                        <Text size='base' className='whitespace-nowrap'>{getCroppedString(item.owner, 6, 8)}</Text>
                                    } />
                                    <TableBodyCol col={1} text="XXXXXX" value={
                                        <NumericFormat
                                            value={item.collateralAmount}
                                            thousandsGroupStyle="thousand"
                                            thousandSeparator=","
                                            fixedDecimalScale
                                            decimalScale={2}
                                            displayType="text"
                                            renderText={(value) =>
                                                <Text size='base' responsive={false} className='whitespace-nowrap'>{value} {baseCoin?.name}</Text>
                                            }
                                        />} />
                                    <TableBodyCol col={1} text="XXXXXX" value={
                                        <NumericFormat
                                            value={item.debtAmount}
                                            thousandsGroupStyle="thousand"
                                            thousandSeparator=","
                                            fixedDecimalScale
                                            decimalScale={2}
                                            displayType="text"
                                            renderText={(value) =>
                                                <Text size='base' responsive={false} className='whitespace-nowrap'>{value} AUSD</Text>
                                            }
                                        />} />
                                    <TableBodyCol col={1} text="XXXXXX" value={
                                        <NumericFormat
                                            value={item.liquidityThreshold}
                                            thousandsGroupStyle="thousand"
                                            thousandSeparator=","
                                            fixedDecimalScale
                                            decimalScale={2}
                                            displayType="text"
                                            renderText={(value) =>
                                                <Text size='base' responsive={false} className='whitespace-nowrap' dynamicTextColor={getRatioColor(item.liquidityThreshold ?? 0)}>{Number(value ?? 0) * (basePrice ?? 0)}</Text>
                                            }
                                        />}
                                    />
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