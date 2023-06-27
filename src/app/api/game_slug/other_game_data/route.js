import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const url ="https://api.igdb.com/v4/games";
    const {gameSlug} = await req.json();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.CLIENT_ID,
        'Authorization': process.env.AUTHORIZATION,
        'Accept': 'application/json',
        "Content-Type": 'application/json',
      },
      body: `fields name, slug, total_rating, cover.image_id, summary, genres.name, genres.slug, first_release_date, platforms.name, platforms.platform_logo;
      where slug="${gameSlug}";`,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
