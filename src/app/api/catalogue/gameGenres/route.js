import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const url ="https://api.igdb.com/v4/genres";
    // const {quer, querTWO}= await req.json();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.CLIENT_ID,
        'Authorization': process.env.AUTHORIZATION,
        'Accept': 'application/json',
        "Content-Type": 'application/json',
      },
      body: `fields name, slug; limit 50;`,
    });

    const data = await response.json();
    return NextResponse.json(data);
    status:200;
  } catch (error) {
    console.error('Error fetching data:', error);
    status:500;
  }
}
