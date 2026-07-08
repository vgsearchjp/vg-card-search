import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import sharp from "sharp";

export async function GET(request: Request) {

  console.log("★★画像圧縮API開始★★");

  const { searchParams } = new URL(request.url);

  const productId = Number(
    searchParams.get("productId")
  );

  console.log("productId", productId);

  const { data: cards, error } =
  await supabaseAdmin
    .from("cards")
    .select("id,card_no,storage_image_url")
    .eq("product_id", productId)
    .not("storage_image_url", "is", null);

if (error) {

  return NextResponse.json({
    success: false,
    error,
  });

}

console.log("取得件数", cards?.length);


if (!cards || cards.length === 0) {

  return NextResponse.json({
    success: false,
    error: "画像がありません",
  });

}

const targetCards =
  cards.filter(
    card =>
      card.storage_image_url
        ?.toLowerCase()
        .endsWith(".png")
  );

const skipCount =
  cards.length -
  targetCards.length;

let successCount = 0;
let failedCount = 0;

let beforeTotal = 0;
let afterTotal = 0;

for (const card of targetCards) {

console.log("圧縮開始", card.card_no);

const { data: imageData, error: downloadError } =
  await supabaseAdmin.storage
    .from("card-images")
    .download(card.storage_image_url);

if (downloadError) {

  console.log(downloadError);

  failedCount++;

  continue;

}

console.log("画像取得成功");
console.log("サイズ", imageData.size);
console.log("タイプ", imageData.type);
beforeTotal += imageData.size;

const originalBuffer =
  Buffer.from(
    await imageData.arrayBuffer()
  );

const jpegBuffer =
  await sharp(originalBuffer)
    .jpeg({
      quality: 50,
    })
    .toBuffer();

console.log(
  "変換後サイズ",
  jpegBuffer.length
);
const jpgFileName =
  card.storage_image_url.replace(
    /\.png$/i,
    ".jpg"
  );

const { error: uploadError } =
  await supabaseAdmin.storage
    .from("card-images")
    .upload(
      jpgFileName,
      jpegBuffer,
      {
        contentType: "image/jpeg",
        upsert: true,
      }
    );

if (uploadError) {

  console.log(uploadError);

  return NextResponse.json({
    success: false,
    error: uploadError,
  });

}

console.log("JPEG保存成功");
console.log(jpgFileName);
const { error: updateError } =
  await supabaseAdmin
    .from("cards")
    .update({
      storage_image_url: jpgFileName,
    })
    .eq("id", card.id);

if (updateError) {

  return NextResponse.json({
    success: false,
    error: updateError,
  });

}

console.log("DB更新成功");
const { error: removeError } =
  await supabaseAdmin.storage
    .from("card-images")
    .remove([
      card.storage_image_url,
    ]);

if (removeError) {

  return NextResponse.json({
    success: false,
    error: removeError,
  });

}

console.log("PNG削除成功");
successCount++;
afterTotal += jpegBuffer.length;

}
return NextResponse.json({
  success: true,
  total: cards.length,
  successCount,
  failedCount,
  skipCount,
  before: beforeTotal,
  after: afterTotal,
  saved: beforeTotal - afterTotal,
});

}