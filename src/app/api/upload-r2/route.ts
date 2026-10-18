import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const path = formData.get("path") as string | null;

    if (!file || !path) {
      return NextResponse.json(
        { error: "file または path がありません" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await r2.send(
      new PutObjectCommand({
        Bucket: "vg-card-images",
        Key: path,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return NextResponse.json({
      success: true,
      path,
      url: `${process.env.R2_PUBLIC_URL}/${path}`,
    });

  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "アップロード失敗" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { path } = await req.json();

    if (!path || typeof path !== "string") {
      return NextResponse.json(
        { error: "path がありません" },
        { status: 400 }
      );
    }

    // 仮カード画像の保存先以外は削除させない
    if (!path.startsWith("temporary-cards/")) {
      return NextResponse.json(
        { error: "削除対象のパスが不正です" },
        { status: 400 }
      );
    }

    await r2.send(
      new DeleteObjectCommand({
        Bucket: "vg-card-images",
        Key: path,
      })
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "画像削除失敗" },
      { status: 500 }
    );
  }
}