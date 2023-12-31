import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const path = req.nextUrl.pathname;
  const parts = path.split("/");
  const zealyId = parts[4];

  const result = await fetch(`https://api.zealy.io/communities/aeroscraper/users/${zealyId}`, {
    headers: {
      "x-api-key": `${process.env.NEXT_PUBLIC_ZEALY_API_KEY}`
    },
    method: req.method
  });
  
  const data = await result.json();

  if (result.status !== 200) {
    return NextResponse.json({
      status: result.status,
      msg: "There was a problem"
    });
  } else {
    return NextResponse.json(data);
  }
}