import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    return NextResponse.json({
      success: true,
      message: "API接続成功",
      body,
    });

  } catch (e) {

    return NextResponse.json(
      {
        success: false,
        message: "APIエラー",
      },
      {
        status: 500,
      }
    );

  }

}