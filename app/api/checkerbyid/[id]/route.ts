import pb from "@/lib/pocketbase";
import { convertAmount } from "@/utils/contractUtils";
//@ts-ignore
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";
export async function GET(req: NextRequest) {
  const RPC_URL = process.env.NEXT_PUBLIC_INJECTIVE_PRIV_RPC as string;
  const client = await CosmWasmClient.connect(RPC_URL);
  const contractAddress = process.env
    .NEXT_PUBLIC_INJECTIVE_CONTRACT_ADDRESS as string;
  const getTrove = async (user_addr: string) => {
    const res = await client.queryContractSmart(contractAddress, {
      trove: { user_addr },
    });
    return res;
  };

  const getStake = async (user_addr: string) => {
    const res = await client.queryContractSmart(contractAddress, {
      stake: { user_addr },
    });
    return res;
  };
  const username = process.env.NEXT_PUBLIC_POCKETBASE_CHECKER_ADMIN as string;
  const password = process.env
    .NEXT_PUBLIC_POCKETBASE_CHECKER_PASSWORD as string;
  try {
    const id = req.nextUrl.searchParams.get("id") as string;

    const login = await pb
      .collection("users")
      .authWithPassword(username, password);
    const user = await pb.collection("points").getOne(id);
    if (user) {
      let troveRes = await getTrove(user.address);
      let stakeRes = await getStake(user.address);
      let calc =
        (convertAmount(troveRes?.collateral_amounts[0]?.amount ?? 0, 18) * 2 +
        convertAmount(stakeRes?.amount ?? 0, 18) * Number(stakeRes?.percentage))/10;
      return NextResponse.json({
        user: user,
        trove: troveRes,
        stake: stakeRes,
        calc: calc,
        calcString: ` (${convertAmount(
          troveRes?.collateral_amounts[0]?.amount ?? 0,
          18
        )} * 2) + (${convertAmount(stakeRes?.amount ?? 0, 18)} * ${
          stakeRes?.percentage
        }) / 10 = ${calc}`,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 400,
      msg: "There was a problem",
      /* error: error, */
    });
  }

  /* const result = await fetch(`https://api.zealy.io/communities/aeroscraper/users/${zealyId}`, {
    headers: {
      "x-api-key": `${process.env.NEXT_PUBLIC_ZEALY_API_KEY}`,
      "Access-Control-Allow-Origin": "*",
    },
    method: req.method
  });
  
  const data = await result.json();
console.log(data);

  if (result.status !== 200) {
    return NextResponse.json({
      status: result.status,
      msg: "There was a problem"
    });
  } else {
    return NextResponse.json(data);
  } */
}
