import { NextResponse } from "next/server";
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

const { error: removeError } =
  await supabaseAdmin.storage
    .from("card-images")
    .remove(files);

if (removeError) {

  return NextResponse.json({
    success: false,
    error: removeError,
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