import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export async function GET(req: NextRequest) {

  const result = await fetch("https://db.aeroscraper.io/api/collections/"+process.env.NEXT_PUBLIC_WEBSITE_REF_COLLECTION_NAME as string+"/records?page=1&perPage=500&sort=-total", {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    method: req.method,
    cache: "no-cache"
  });

  const data = await result.json()

  if (result.status !== 200) {
    return NextResponse.json({
      status: result.status,
      msg: "There was a problem",
    });
  } else {
    return NextResponse.json(data);
  }
}
