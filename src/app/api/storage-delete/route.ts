import { NextResponse } from "next/server";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { supabaseAdmin } from "@/lib/supabase-admin";
export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);

  const productId = Number(
    searchParams.get("productId")
  );

  console.log("Storage削除開始");
  console.log("productId", productId);

  const { data: cards, error } =
  await supabaseAdmin
    .from("cards")
    .select("storage_image_url")
    .eq("product_id", productId)
    .not("storage_image_url", "is", null);

if (error) {

  return NextResponse.json({
    success: false,
    error,
  });

}

if (!cards || cards.length === 0) {

  return NextResponse.json({
    success: false,
    error: "削除対象がありません",
  });

}

console.log("削除対象", cards.length);
const files = cards.map(
  card => card.storage_image_url
);

try {
console.log("R2削除開始");
console.log(files);

  await r2.send(
    new DeleteObjectsCommand({
      Bucket: "vg-card-images",
      Delete: {
        Objects: files.map((file) => ({
          Key: file,
        })),
      },
    })
  );

console.log("R2削除成功");

} catch (error) {

  console.log(error);

  return NextResponse.json({
    success: false,
    error,
  });

}

const { error: updateError } =
  await supabaseAdmin
    .from("cards")
    .update({
      storage_image_url: null,
    })
    .eq("product_id", productId);

if (updateError) {

  return NextResponse.json({
    success: false,
    error: updateError,
  });

}

return NextResponse.json({
  success: true,
  deleted: files.length,
});
}