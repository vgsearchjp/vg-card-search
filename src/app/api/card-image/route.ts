import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "path required" }, { status: 400 });
    }

    const result = await client.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: path,
      })
    );

    if (!result.Body) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const buffer = Buffer.from(await result.Body.transformToByteArray());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": result.ContentType || "image/png",
        "Cache-Control": "public,max-age=31536000",
      },
    });

  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "failed" },
      { status: 500 }
    );
  }
}