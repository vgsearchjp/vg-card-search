import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json(
      { error: "idがありません" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("decklog_transfer")
    .select("id, deck_data")
    .eq("id", id)
    .single();

  if (error) {
    return Response.json(
      { error: error.message },
      {
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "https://decklog.bushiroad.com",
        },
      }
    );
  }

  return Response.json(
    data,
    {
      headers: {
        "Access-Control-Allow-Origin": "https://decklog.bushiroad.com",
      },
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://decklog.bushiroad.com",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}