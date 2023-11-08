"use client";
import {
  ClientEnum,
  RiskyTrovesResponse,
  TotalTrovesResponse,
} from "@/types/types";
import { request, gql } from "graphql-request";
import { useEffect } from "react";

export default function Deneme({clientType = "INJECTIVE"} : {clientType: string}) {

  
  

  const URL = (): string => {
    switch (clientType) {
      case ClientEnum.ARCHWAY:
        return process.env.NEXT_PUBLIC_INDEXER_ARCH as string;
      case ClientEnum.SEI:
        return process.env.NEXT_PUBLIC_INDEXER_DOMAIN as string;
      case ClientEnum.NEUTRON:
        return process.env.NEXT_PUBLIC_INDEXER_NEUTRON as string;
      case ClientEnum.INJECTIVE:
        return process.env.NEXT_PUBLIC_INDEXER_INJ as string;
      default:
        return process.env.NEXT_PUBLIC_INDEXER_DOMAIN as string;
    }
  };

  const getRiskyTrovesQuery =
    clientType === ClientEnum.INJECTIVE
      ? gql`
          query {
            troves {
              nodes {
                owner
              }
            }
          }
        `
      : gql`
          query {
            troves {
              nodes {
                owner
                liquidityThreshold
              }
            }
          }
        `;

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
