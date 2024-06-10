import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = "edge";
export async function GET(req: NextRequest, res: NextApiResponse) {
    const owner = req.nextUrl.searchParams.get("owner") || "" as string
    const graphqlUrl = process.env.NEXT_PUBLIC_INDEXER_DOMAIN as string;
    const query = `
    query {
      troves {
        nodes {
          owner
        }
      }
    }
  `;

    try {
        const response = await fetch(graphqlUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const data = await response.json();
        const owners = data.data.troves.nodes.map((node: any) => node.owner);
        const isOwnerInList = owners.includes(owner);

        return NextResponse.json({ isOwnerInList });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'An error occurred.' });
    }
}