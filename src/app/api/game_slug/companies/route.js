import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const url ="https://api.igdb.com/v4/involved_companies";
    const {gameId} = await req.json();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.CLIENT_ID,
        'Authorization': process.env.AUTHORIZATION,
        'Accept': 'application/json',
        "Content-Type": 'application/json',
      },
      body: `fields company, developer, game, porting, publisher, supporting, company.name; where game=${gameId};`,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
