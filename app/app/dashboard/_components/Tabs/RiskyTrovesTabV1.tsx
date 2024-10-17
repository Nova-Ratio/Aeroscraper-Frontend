import GradientButton from "@/components/Buttons/GradientButton";
import SkeletonLoading from "@/components/Table/SkeletonLoading";
import { Table } from "@/components/Table/Table";
import { TableBodyCol } from "@/components/Table/TableBodyCol";
import { TableHeaderCol } from "@/components/Table/TableHeaderCol";
import { useNotification } from "@/contexts/NotificationProvider";
import useAppContract from "@/contracts/app/useAppContract";

import { RiskyTrovesModelV1 } from "@/types/types";
import {
  getIsInjectiveResponse,
  convertAmount,
  getRatioColor,
  getRequestAmount,
} from "@/utils/contractUtils";
import { getCroppedString } from "@/utils/stringUtils";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NumericFormat } from "react-number-format";
import { PageData } from "../../_types/types";
import Text from "@/components/Texts/Text";
import { RocketIcon } from "@/components/Icons/Icons";
import useChainAdapter from "@/hooks/useChainAdapter";
import { ChainName } from "@/enums/Chain";
import { isV2TroveResponse } from "@/contracts/app/types";
import { callLiquidate, fetchAllTroveOwnersAndNICR } from "@/evmContractInteractions/useAppContracts";
import OutlinedButton from "@/components/Buttons/OutlinedButton";

type Props = {
  getPageData: () => void;
  basePrice: number;
};

const RiskyTrovesTabV1: FC<Props> = ({ getPageData, basePrice }) => {
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const { baseCoin, selectedChainName = ChainName.INJECTIVE } = useChainAdapter();
  const contract = useAppContract();
  const [loading, setLoading] = useState(true);
  const [riskyTroves, setRiskyTroves] = useState<RiskyTrovesModelV1[]>([]);
  const { addNotification, setProcessLoading, processLoading } = useNotification();

  useEffect(() => {
    getRiskyTroves();
  }, []);

  const liquidateTroves = async (owner: string) => {
    try {
      setProcessLoading(true);

      const res: any = await contract.liquidateTroves(owner);
      if (!res?.txHash) {
        throw new Error(res);
      }
      addNotification({
        status: "success",
        directLink: res?.txHash,
        message: "Risky Troves Liquidated",
      });
      getPageData();
      getRiskyTroves();
    } catch (err) {
      console.error(err);
      addNotification({
        message: "",
        status: "error",
        directLink: "",
      });
    } finally {
      setProcessLoading(false);
    }
  };

  const getRiskyTroves = async () => {
    setLoading(true);
    try {
      const res = await fetchAllTroveOwnersAndNICR()
      setRiskyTroves(
        res.sort((a, b) => a.NICR - b.NICR).map(item => {
          const collateral = convertAmount(item.collateral, baseCoin?.ausdDecimal);
          const debt = convertAmount(item.debt, baseCoin?.ausdDecimal);
          const liq = Number(((collateral * basePrice) / debt) * 100)

          return {
            owner: item.owner,
            liquidityThreshold: liq,
            collateralAmount: collateral,
            debtAmount: debt
          }
        })
      );
    } catch (err) {
      console.error(err);
    } finally {        
      setLoading(false);
    }
  }

  return (
    <div>
      <Text size="3xl" className="mb-4">
        Liquidate Risky Troves
      </Text>

      <div className="-ml-4">
        <Table
          listData={riskyTroves}
          header={
            <div className="grid-cols-7 grid gap-5 lg:gap-0 mt-4 mr-6">
              <TableHeaderCol col={2} text="Owner" />
              <TableHeaderCol col={1} text="Collateral" textCenter />
              <TableHeaderCol col={1} text="Debt" textEnd />
              <TableHeaderCol col={2} text="Coll. Ratio" textEnd />
              <TableHeaderCol col={1} text="Action" textEnd />
            </div>
          }
          bodyCss="space-y-1 max-h-[350px] overflow-auto overflow-x-hidden"
          loading={loading}
          renderItem={(item: RiskyTrovesModelV1) => {
            return (
              <div className="grid grid-cols-7 gap-4 border-b border-white/10">
                <TableBodyCol
                  col={2}
                  text="XXXXXX"
                  value={
                    <Text
                      size="xs"
                      className="whitespace-nowrap text-start ml-4"
                    >
                      {getCroppedString(item.owner, 6, 8)}
                    </Text>
                  }
                />
                <TableBodyCol
                  col={1}
                  text="XXXXXX"
                  value={
                    <NumericFormat
                      value={item.collateralAmount}
                      thousandsGroupStyle="thousand"
                      thousandSeparator=","
                      fixedDecimalScale
                      decimalScale={2}
                      displayType="text"
                      renderText={(value) => (
                        <Text
                          size="xs"
                          responsive={true}
                          className="whitespace-nowrap"
                        >
                          {value} {baseCoin?.name}
                        </Text>
                      )}
                    />
                  }
                />
                <TableBodyCol
                  col={1}
                  text="XXXXXX"
                  value={
                    <NumericFormat
                      value={item.debtAmount}
                      thousandsGroupStyle="thousand"
                      thousandSeparator=","
                      fixedDecimalScale
                      decimalScale={2}
                      displayType="text"
                      renderText={(value) => (
                        <Text
                          size="xs"
                          responsive={true}
                          className="whitespace-nowrap"
                        >
                          {value} aUSD
                        </Text>
                      )}
                    />
                  }
                />
                <TableBodyCol
                  col={2}
                  text="XXXXXX"
                  value={
                    <NumericFormat
                      value={item.liquidityThreshold}
                      thousandsGroupStyle="thousand"
                      thousandSeparator=","
                      fixedDecimalScale
                      decimalScale={2}
                      displayType="text"
                      renderText={(value) =>
                        selectedChainName === ChainName.EVM ? (
                          <Text
                            size="xs"
                            responsive={true}
                            className="whitespace-nowrap text-end pr-10"
                            dynamicTextColor={getRatioColor(
                              item.liquidityThreshold
                            )}
                          >
                            {Number(item.liquidityThreshold ?? 0).toFixed(3)}%
                          </Text>
                        ) : (
                          <>
                            <Text
                              size="xs"
                              responsive={true}
                              className="whitespace-nowrap text-end pr-10"
                              dynamicTextColor={
                                getRatioColor(
                                  (item.liquidityThreshold ?? 0) *
                                  (basePrice ?? 0)
                                ) ?? 0
                              }
                            >
                              {Number(item.liquidityThreshold ?? 0).toFixed(3)}%
                            </Text>
                            <button className="bg-white p-2">add liq</button>
                          </>
                        )
                      }
                    />
                  }
                />
                <TableBodyCol
                  col={1}
                  text="XXXXXX"
                  value={
                    item.liquidityThreshold <= 115 ? (
                      <OutlinedButton
                        containerClassName="w-[80px] mx-auto shrink-0"
                        className="text-xs h-8"
                        onClick={() => liquidateTroves(item.owner)}
                        loading={processLoading}
                      >
                        Liquidate
                      </OutlinedButton>
                    ) : (
                      ""
                    )
                  }
                />
              </div>
            );
          }}
        />
      </div>
      {riskyTroves.length === 0 && !loading && (
        <div className="my-10">
          <RocketIcon className="w-5 h-5 text-red-500 mx-auto" />
          <Text size="base" className="whitespace-nowrap text-center mt-6">
            Risky troves list is empty
          </Text>
        </div>
      )}
      {/* <GradientButton
        disabled={riskyTroves.length === 0}
        className="w-full md:w-[374px] h-11 ml-auto mt-6"
        onClick={liquidateTroves}
        rounded="rounded-lg"
        loading={processLoading}
      >
        Liquidate Risky Troves
      </GradientButton> */}
    </div>
  );
};

export default RiskyTrovesTabV1;
