import { NextResponse } from "next/server";

const progressMap = new Map<
  number,
  {
    total: number;
    current: number;
    currentCard: string;
    finished: boolean;
  }
>();

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);

  const productId = Number(
    searchParams.get("productId")
  );

  return NextResponse.json(
    progressMap.get(productId) ?? {
      total: 0,
      current: 0,
      currentCard: "",
      finished: false,
    }
  );

}

export {
  progressMap
};