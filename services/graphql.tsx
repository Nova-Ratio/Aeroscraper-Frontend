"use client";
import { ChainName } from "@/enums/Chain";
import {
  ICRGraphqlResponse,
  RiskyTrovesResponse,
  TotalTrovesResponse,
  redeemICRresponse,
} from "@/types/types";
import { request, gql } from "graphql-request";

export default function graphql({
  selectedChainName = ChainName.HEDERA
}: {
  selectedChainName?: ChainName;
}) {
  const URL = (): string => {
    switch (selectedChainName) {
      case ChainName.HEDERA:
        return process.env.NEXT_PUBLIC_INDEXER_INJ as string;
      default:
        return process.env.NEXT_PUBLIC_INDEXER_DOMAIN as string;
    }
  };

  const getRiskyTrovesQuery = gql`
          query {
            troves {
              nodes {
                owner
                collaterals
                debtAmount
              }
            }
          }
        `

  const getTotalTrovesQuery = gql`
    query {
      troves {
        totalCount
      }
    }
  `;

  const ICRQuery = gql`
  query FindBoundingNodes($input: Float!) {
    prevTrove: troves(
        filter: { ratio: { greaterThan: $input } }
        orderBy: RATIO_ASC
        first: 2
    ) {
        nodes {
            owner
            ratio
        } 
      }
    nextTrove: troves(
        filter: { ratio: { lessThan: $input } }
        orderBy: RATIO_DESC
        first: 2
    ) {
        nodes {
            owner
            ratio
        }
      }
  }
  `;

  const redeemICRQuery = gql`
  query {
    troves(orderBy: RATIO_ASC) {
        nodes {
            collaterals
            debtAmount
            owner
        }
    }
  }
`;

  const requestRiskyTroves = async (): Promise<RiskyTrovesResponse> => {
    return await request(URL(), getRiskyTrovesQuery);
  };

  const requestTotalTroves = async (): Promise<TotalTrovesResponse> => {
    return await request(URL(), getTotalTrovesQuery);
  };

  const requestICR = async (input: number): Promise<ICRGraphqlResponse> => {

    return await request(URL(), ICRQuery, { input });
  }

  const requestRedeemICR = async (): Promise<redeemICRresponse> => {
    return await request(URL(), redeemICRQuery);
  }

  return {
    requestRiskyTroves,
    requestTotalTroves,
    requestICR,
    requestRedeemICR
  };
}
