import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function POST(request: Request) {

console.log("R2 Upload API");

  const formData = await request.formData();

  const file = formData.get("file") as File;

  const productCode =
    formData.get("productCode") as string;

  const cardNo =
    formData.get("cardNo") as string;

  if (!file) {

    return NextResponse.json({
      success: false,
      error: "画像がありません",
    });

  }
const buffer =
  Buffer.from(await file.arrayBuffer());

const safeCardNo =
  cardNo.replace(/[\/\\:*?"<>|＋]/g, "_");

const fileName =
  `${productCode}/${safeCardNo.replace(productCode + "_", "")}.png`;

try {

  await r2.send(
    new PutObjectCommand({
      Bucket: "vg-card-images",
      Key: fileName,
      Body: buffer,
      ContentType: "image/png",
    })
  );

} catch (error) {

  console.log(error);

  return NextResponse.json({
    success: false,
    error,
  });

}

return NextResponse.json({
  success: true,
  path: fileName,
});

}