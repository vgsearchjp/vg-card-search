import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function GET(
  request: Request
) {
console.error("★★API開始★★");
  console.log(
  "request.url",
  request.url
);

const { searchParams } =
  new URL(request.url);

console.log(
  "search productId",
  searchParams.get("productId")
);

const productId =
  Number(
    searchParams.get("productId")
  );

const url =
searchParams.get("url");

console.log(
  "productId",
  productId
);

const expansion =
  new URL(url!).searchParams.get("expansion");

console.log("API開始");
console.log("expansion", expansion);

const cards: any[] = [];
  

  // 最初のページ
  const firstUrl =
    `https://cf-vanguard.com/cardlist/cardsearch/?expansion=${expansion}&view=image`;

  const firstHtml = await fetch(firstUrl).then((r) => r.text());
  console.log("firstHtml取得");

  const firstCards = [
    ...firstHtml.matchAll(
      /cardno=([^"&]+)[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]+)"/g
    ),
  ];

  firstCards.forEach((m) => {
    cards.push({
      card_no: m[1],
      image: m[2],
      name: m[3],
    });
  });

  for (let page = 2; page <= 20; page++) {
    const url =
      `https://cf-vanguard.com/cardlist/cardsearch_ex/?expansion=${expansion}&view=image&page=${page}`;

    const html = await fetch(url).then((r) => r.text());

    const matches = [
      ...html.matchAll(
        /cardno=([^"&]+)[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]+)"/g
      ),
    ];

    if (matches.length === 0) {
      break;
    }

    matches.forEach((m) => {
      cards.push({
        card_no: m[1],
        image: m[2],
        name: m[3],
      });
    });
  }

const cardDetails: any[] = [];

for (const card of cards) {

  console.log(
    "取得中",
    card.card_no
  );

  const detailUrl =
    `https://cf-vanguard.com/cardlist/?cardno=${encodeURIComponent(card.card_no)}&expansion=${expansion}&view=image`;

  const detailHtml =
    await fetch(detailUrl)
      .then((r) => r.text());

  const nation =
    detailHtml.match(
      /<div class="nation">(.*?)<\/div>/
    )?.[1];

  const race =
    detailHtml.match(
      /<div class="race">(.*?)<\/div>/
    )?.[1];

  const grade =
    detailHtml.match(
      /<div class="grade">グレード\s*([0-9]+)<\/div>/
    )?.[1];

  const power =
    detailHtml.match(
      /<div class="power">パワー\s*([0-9]+)/
    )?.[1];

  const critical =
    detailHtml.match(
      /<div class="critical">クリティカル\s*([0-9]+)/
    )?.[1];

  const shield =
    detailHtml.match(
      /<div class="shield">シールド\s*([0-9]+)/
    )?.[1];

  const rarity =
    detailHtml.match(
      /<div class="rarity">(.*?)<\/div>/
    )?.[1];

  const cardType =
    detailHtml.match(
      /<div class="type">(.*?)<\/div>/
    )?.[1];

  const skillIcon =
    detailHtml.match(
      /<div class="skill">(.*?)<\/div>/
    )?.[1];

  const cardText =
    detailHtml.match(
      /<div class="effect">(.*?)<\/div>/
    )?.[1];

  const flavorText =
    detailHtml.match(
      /<div class="flavor">(.*?)<\/div>/
    )?.[1];
  
 const illustrator =
  detailHtml.match(
    /<div class="illstrator">(.*?)<\/div>/
  )?.[1];

  const triggerType =
  detailHtml.match(
    /<div class="gift">(.*?)<\/div>/
  )?.[1];

  cardDetails.push({
  card_no: card.card_no,
  nation,
  race,
  grade,
  power,
  critical,
  shield,
  rarity,
  card_type: cardType,
  skill_icon: skillIcon,
  card_text: cardText,
  flavor_text: flavorText,
  illustrator,
  trigger_type: triggerType,
});
}

console.log(
  "詳細取得件数",
  cardDetails.length
);

let insertCount = 0;
let updateCount = 0;
let skipCount = 0;

const rows = cards.map((card, index) => {

  const detail =
    cardDetails.find(
      (d) => d.card_no === card.card_no
    );

  return {
  product_id: productId,
  card_no: card.card_no,
  card_name: card.name,
  image_url: `https://cf-vanguard.com${card.image}`,
  sort_order: index,

  nation: detail?.nation ?? null,
  race: detail?.race ?? null,
  grade: detail?.grade ?? null,
  power: detail?.power ?? null,
  critical: detail?.critical ?? null,
  shield: detail?.shield ?? null,
  rarity: detail?.rarity ?? null,

  card_type: detail?.card_type ?? null,
  skill_icon: detail?.skill_icon ?? null,
  card_text: detail?.card_text ?? null,
  flavor_text: detail?.flavor_text ?? null,
  illustrator:detail?.illustrator ?? null,
  trigger_type:detail?.trigger_type ?? null,
};
});

const { data: existingCards, error: loadError } =
  await supabaseAdmin
    .from("cards")
    .select("*")
    .eq("product_id", productId);

if (loadError) {

  return Response.json({
    success: false,
    error: loadError,
  });

}

for (const row of rows) {

  const data =
  existingCards?.find(
    card => card.card_no === row.card_no
  );

  if (data) {

 const isSame =
  data.card_name === row.card_name &&
  data.image_url === row.image_url &&
  data.nation === row.nation &&
  data.race === row.race &&
  Number(data.grade) === Number(row.grade) &&
  Number(data.power) === Number(row.power) &&
  Number(data.critical) === Number(row.critical) &&
  Number(data.shield) === Number(row.shield) &&
  data.rarity === row.rarity &&
  data.card_type === row.card_type &&
  data.skill_icon === row.skill_icon &&
  data.trigger_type === row.trigger_type &&
  data.card_text === row.card_text &&
  data.flavor_text === row.flavor_text &&
  data.illustrator === row.illustrator;

console.log("比較カード", row.card_no);

console.log("DB", {
  card_name: data.card_name,
  illustrator: data.illustrator,
  trigger_type: data.trigger_type,
  card_text: data.card_text,
});

console.log("取得", {
  card_name: row.card_name,
  illustrator: row.illustrator,
  trigger_type: row.trigger_type,
  card_text: row.card_text,
});

console.log("isSame", isSame);

if (!isSame) {

  console.log("差分あり", row.card_no);

  Object.keys(row).forEach((key) => {

    if ((data as any)[key] !== (row as any)[key]) {

      console.log(
  key,
  "DB:",
  (data as any)[key],
  typeof (data as any)[key],
  "取得:",
  (row as any)[key],
  typeof (row as any)[key]
);

    }

  });

}

if (isSame) {
  skipCount++;
  continue;
}

    const { error: updateError } =
      await supabaseAdmin
        .from("cards")
        .update(row)
        .eq("id", data.id);

    if (updateError) {
      return Response.json({
        success: false,
        error: updateError,
      });
    }
     updateCount++;

  } else {

    const { error: insertError } =
      await supabaseAdmin
        .from("cards")
        .insert(row);

    if (insertError) {
      return Response.json({
        success: false,
        error: insertError,
      });
    }
    insertCount++;
  }

}

return Response.json({
  success: true,
  count: rows.length,
  insertCount,
  updateCount,
  skipCount,
});
}