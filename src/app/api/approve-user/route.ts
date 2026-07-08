import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {

  const { userId } = await request.json();

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      status: "approved",
    })
    .eq("id", userId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });

}