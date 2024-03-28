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
    try {
      const res = await client.queryContractSmart(contractAddress, {
        trove: { user_addr },
      });
      return res;
    } catch (error) {
      return NextResponse.json({
        status: 400,
        msg: "There was a problem",
        error: error,
      });
    }
  };
  const getStake = async (user_addr: string) => {
    try {
      const res = await client.queryContractSmart(contractAddress, {
        stake: { user_addr },
      });
      return res;
    } catch (error) {
      return NextResponse.json({
        status: 400,
        msg: "There was a problem",
        error: error,
      });
    }
  };
  const username = process.env.NEXT_PUBLIC_POCKETBASE_CHECKER_ADMIN as string;
  const password = process.env
    .NEXT_PUBLIC_POCKETBASE_CHECKER_PASSWORD as string;
  let message = "";
  let calc = 0;
  try {
    const address = req.nextUrl.searchParams.get("id") as string;

    const login = await pb
      .collection("users")
      .authWithPassword(username, password);

    const user: any = await pb
      .collection("points")
      .getFirstListItem(`address = '${address}'`)
      .then((res) => res)
      .catch((err) => false);
    message = "get User";
    let troveRes = await getTrove(address);
    let stakeRes = await getStake(address);
    message = "get Trove and Stake";
    if (troveRes?.collateral_amounts && stakeRes?.amount) {
      calc =
        convertAmount(troveRes?.collateral_amounts[0]?.amount ?? 0, 18) * 80 +
        convertAmount(stakeRes?.amount ?? 0, 18);
    }
    message = "Calc";
    if (user) {
      let point = user?.point_number;
      message = "User point";
      if (
        new Date(user?.updated).getTime() <
        new Date().getTime() - 1000 * 60 * 60 * 24
      ) {
        const updatedUser = await pb.collection("points").update(user?.id, {
          point_number: point + calc,
        });
        point = point + calc;
        message = "Updated user point successfully";
      } else {
        //24 saat içinde daha önce güncellenmiş
        message = "User point is already updated in the last 24 hours";
      }
      return NextResponse.json({
        /* login: login, */
        user: {
          id: user?.id,
          address: user?.address,
          point: point,
        },
        message: message,
        trove: troveRes,
        stake: stakeRes,
        calc: calc,
        /* calcString: ` (${convertAmount(
          troveRes?.collateral_amounts[0]?.amount ?? 0,
          18
        )} * 80) + (${convertAmount(stakeRes?.amount ?? 0, 18)} * 1) = ${calc}`, */
      });
    } else {
      message = "Create User point";
      let create = await pb.collection("points").create({
        address: address,
        point_number: Number(calc),
      });
      return NextResponse.json({
        /* login: login, */
        user: {
          id: create.id,
          address: create.address,
          point: create.point_number,
        },
        message: "Created user point successfully",
        trove: troveRes,
        stake: stakeRes,
        calc: calc,
        /* calcString: ` (${convertAmount(
          troveRes?.collateral_amounts[0]?.amount ?? 0,
          18
        )} * 80) + (${convertAmount(stakeRes?.amount ?? 0, 18)} * 1) = ${calc}`, */
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 400,
      msg: "There was a problem",
      error: error,
      info: {
        username: username,
        password: password,
      },
      message: message,
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
