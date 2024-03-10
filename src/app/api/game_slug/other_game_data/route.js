import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";

export async function POST(req) {
  // const auth = headers().get("Authorization") || "";
  const cookieStore = cookies();
  const auth = cookieStore.get('tokenCookie').value;
  try {
    const url ="https://api.igdb.com/v4/games";
    const {gameSlug} = await req.json();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID,
        'Authorization': auth,
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
