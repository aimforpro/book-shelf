import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const display = parseInt(searchParams.get("display") || "10");
  const start = parseInt(searchParams.get("start") || "1");

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Naver API credentials are missing" }, { status: 500 });
  }

  const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&display=${display}&start=${start}`;
  console.log("Naver API URL:", url); // 디버깅 로그 추가

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Naver book data:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}