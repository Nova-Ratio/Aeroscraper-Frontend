import { RiskyTrovesResponse } from '@/types/types';
import { request, gql } from 'graphql-request'

const URL = process.env.NEXT_PUBLIC_INDEXER_DOMAIN as string;

const getRiskyTrovesQuery = gql`
query {
    troves {
        nodes {
            owner
            liquidityThreshold
        }
    }
}
`

export const requestRiskyTroves = async (): Promise<RiskyTrovesResponse> => {
    return await request(URL, getRiskyTrovesQuery);
}