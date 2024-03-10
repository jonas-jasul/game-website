
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
export async function POST(req) {
  // const headerslist = headers();
  // const auth = headers().get("X-Api-Authorization");
  // console.log("aurh", auth);
  // console.log('head list', headerslist);
  const cookieStore = cookies();
  const auth = cookieStore.get('tokenCookie').value;
  // console.log("auth cook", auth);

  try {
    const url = "https://api.igdb.com/v4/genres";
    // const {quer, querTWO}= await req.json();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Client-ID": process.env.NEXT_PUBLIC_CLIENT_ID,
        Authorization: auth,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: `fields name, slug; limit 50;`,
    });

    const data = await response.json();
    return NextResponse.json(data);
    status: 200;
  } catch (error) {
    console.error("Error fetching data:", error);
    status: 500;
  }
}
