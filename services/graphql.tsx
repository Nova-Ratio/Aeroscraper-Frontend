"use client";
import { ChainName } from "@/enums/Chain";
import {
  RiskyTrovesResponse,
  TotalTrovesResponse,
} from "@/types/types";
import { request, gql } from "graphql-request";

export default function graphql({
  selectedChainName = ChainName.SEI
}: {
  selectedChainName?: ChainName;
}) {
  const URL = (): string => {
    return process.env.NEXT_PUBLIC_INDEXER_DOMAIN as string;
  };

  const getRiskyTrovesQuery = gql`
          query {
            troves {
              nodes {
                owner
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
  const requestRiskyTroves = async (): Promise<RiskyTrovesResponse> => {
    return await request(URL(), getRiskyTrovesQuery);
  };

  const requestTotalTroves = async (): Promise<TotalTrovesResponse> => {
    return await request(URL(), getTotalTrovesQuery);
  };
  return {
    requestRiskyTroves,
    requestTotalTroves,
  };
}
