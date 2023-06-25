import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const url ="https://api.igdb.com/v4/games/count";
    const {countQuery} = await req.json();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.CLIENT_ID,
        'Authorization': process.env.AUTHORIZATION,
        'Accept': 'application/json',
        "Content-Type": 'application/json',
      },
      body: countQuery,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
