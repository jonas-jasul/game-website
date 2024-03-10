import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";

export async function POST(req) {
  try {
    // const auth = headers().get("Authorization") || "";
    const cookieStore = cookies();
    const auth = cookieStore.get('tokenCookie').value;
    const url ="https://api.igdb.com/v4/covers";
    const {imageIDsJoined, pageSize} = await req.json();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID,
        'Authorization': auth,
        'Accept': 'application/json',
        "Content-Type": 'application/json',
      },
      body: `fields game, image_id; where game= (${imageIDsJoined}); limit ${pageSize};`,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
