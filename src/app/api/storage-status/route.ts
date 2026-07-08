import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {

const { searchParams } = new URL(request.url);

const productId = Number(searchParams.get("productId"));

const { data, error } = await supabaseAdmin
.from("cards")
.select("storage_image_url")
.eq("product_id", productId);

if (error) {

return NextResponse.json({
success:false,
error,
});

}

const total = data.length;

const saved = data.filter(card => card.storage_image_url).length;

return NextResponse.json({
success:true,
saved,
total,
});

}