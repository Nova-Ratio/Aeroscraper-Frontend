// Next.js Edge API Routes: https://nextjs.org/docs/pages/building-your-application/routing/api-routes#edge-api-routes

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export const config = {
  runtime: "edge",
};


export default async function handle(req: NextRequest) {
  const countryCode = req.headers.get('cf-ipcountry') || 'Unknown'; 

  return NextResponse.json({countryCode });
}
