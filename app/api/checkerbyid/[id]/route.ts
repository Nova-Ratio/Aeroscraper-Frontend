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
  let collateralamount = 0;
  let stakeamount = 0;
  let updated = false;
  let point = 0;
  const ref = req.nextUrl.searchParams.get("ref") as string;
  const address = req.nextUrl.searchParams.get("id") as string;
  try {
    const login = await pb
      .collection("users")
      .authWithPassword(username, password);

    const user: any = await pb
      .collection("points")
      .getFirstListItem(`address = '${address}'`)
      .then((res) => res)
      .catch((err) => false);

    const leaderBoard: any = await pb
      .collection("leaderboard")
      .getFirstListItem(`address = '${address}'`)
      .then((res) => true)
      .catch((err) => false);
    if (!leaderBoard) {
      await pb
        .collection("leaderboard")
        .create({
          address: address,
          xp: 0,
        })
        .then((res) => res)
        .catch((err) => false);
    }
    message = "get User";
    let troveRes = await getTrove(address);
    let stakeRes = await getStake(address);
    message = "get Trove and Stake";
    if (troveRes?.collateral_amounts && stakeRes?.amount) {
      collateralamount = convertAmount(
        troveRes?.collateral_amounts[0]?.amount ?? 0,
        18
      );
      stakeamount = convertAmount(stakeRes?.amount ?? 0, 18);
      calc = collateralamount * 80 + stakeamount * 1;
      updated = true;
    }
    message = "Calc";
    if (user) {
      point = user?.point_number || 0;
      message = "User point";
      if (
        new Date(user?.updated).getTime() <
        new Date().getTime() - 1000 * 60 * 60 * 24
      ) {
        if (user?.first_trove) {
          point = point + calc;
          const updatedUser = await pb.collection("points").update(user?.id, {
            point_number: point,
            collateralamount: collateralamount * 80 + user?.collateralamount,
            stakeamount: stakeamount * 1 + user?.stakeamount,
          });
        } else {
          let firt_trove = calc > 0;
          point = point + calc + (user.referralCode && firt_trove ? 100 : 0);
          const updatedUser = await pb.collection("points").update(user?.id, {
            point_number: point,
            collateralamount: collateralamount * 80 + user?.collateralamount,
            stakeamount: stakeamount * 1 + user?.stakeamount,
            first_trove: firt_trove,
          });
          if (user.referralCode) {
            const updateref = await pb
              .collection("points")
              .update(user.referralCode, {
                point_number: user?.point_number + 100,
              });
          }
        }
        updated = true;
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
          ref: ref,
        },
        message: message,
        trove: troveRes,
        stake: stakeRes,
        calc: calc,
        updated: updated,
        /* calcString: ` (${convertAmount(
          troveRes?.collateral_amounts[0]?.amount ?? 0,
          18
        )} * 80) + (${convertAmount(stakeRes?.amount ?? 0, 18)} * 1) = ${calc}`, */
      });
    } else {
      message = "Create User point";
      let create = await pb.collection("points").create({
        address: address,
        point_number: ref && Number(calc),
        collateralamount: collateralamount * 80,
        stakeamount: stakeamount * 1,
        referralCode: ref,
      });
      if (ref) {
        let get = await pb.collection("points").getOne(ref);
        let update = await pb.collection("points").update(ref, {
          referrals: [...get.referrals, create.id],
        });
      }
      updated = true;
      return NextResponse.json({
        /* login: login, */
        user: {
          id: create.id,
          address: create.address,
          point: create.point_number,
          ref: ref,
        },
        message: "Created user point successfully",
        trove: troveRes,
        stake: stakeRes,
        calc: calc,
        updated: updated,
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
        ref: ref,
        /* username: username,
        password: password, */
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
