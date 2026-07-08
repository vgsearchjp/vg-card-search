import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {

console.log("★★Storage API開始★★");

const { searchParams } = new URL(request.url);

const productId = Number(searchParams.get("productId"));

const productCode = searchParams.get("productCode");

console.log("productCode", productCode);

console.log("productId", productId);

const { data: cards, error } =
await supabaseAdmin
.from("cards")
.select("id,image_url,card_no")
.eq("product_id", productId)
.is("storage_image_url", null);

if (error) {
return NextResponse.json({
success:false,
error,
});
}

if (!cards || cards.length === 0) {
return NextResponse.json({
success:false,
error:"カードがありません",
});
}

console.log(cards);

let saved = 0;

let skip = 0;

let failed = 0;

const total = cards.length;

const batchSize = 10;

for (let i = 0; i < cards.length; i += batchSize) {

const batch = cards.slice(i, i + batchSize);

await Promise.all(
  batch.map(async (card) => {

    const imageResponse = await fetch(card.image_url);

    const imageBlob = await imageResponse.blob();

    const safeCardNo = card.card_no.replace(/[\/\\:*?"<>|＋]/g, "_");

    const fileName = `${productCode}/${safeCardNo.replace(productCode + "_", "")}.png`;

    console.log(fileName);

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from("card-images")
        .upload(fileName, imageBlob, { upsert: true });

    if (uploadError) {
      console.log(uploadError);
      failed++;
      return;
    }

    saved++;

    const { error: updateError } =
      await supabaseAdmin
        .from("cards")
        .update({ storage_image_url: fileName })
        .eq("id", card.id);

    if (updateError) {
      console.log(updateError);
      failed++;
      return;
    }

    console.log("DB更新成功", card.card_no);

  })
);

}

return NextResponse.json({
success: true,
productId,
productCode,
saved,
skip,
failed,
total,
});

}