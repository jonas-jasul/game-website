import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const auth_key = searchParams.get('auth_key');
    const text = searchParams.get('text');
    const url = `https://api-free.deepl.com/v2/translate?auth_key=${auth_key}&text=${text}&target_lang=lt`
    const res = await fetch(url);
    const data = await res.json();
    const decodedData = decodeURIComponent(data.translations[0].text);
    return NextResponse.json({
        translations: [{
            detected_source_language: data.translations[0].detected_source_language,
            text: decodedData,
        }]
    });
}
