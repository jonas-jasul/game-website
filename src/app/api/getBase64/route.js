import { getPlaiceholder } from "plaiceholder";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { url } = await req.json();

        const buffer = await fetch(url).then(async (res) =>
            Buffer.from(await res.arrayBuffer())
        );

        const { base64 } = await getPlaiceholder(buffer);

        return NextResponse.json(base64);
    } catch (err) {
        console.log('plaiceholder error', err)
    }
};