export async function generateDeckImage({
  deckName,
  rideDeck,
  mainDeck,
  gDeck,
  finisherDeck,
}: {
  deckName: string;
  rideDeck: any[];
  mainDeck: any[];
  gDeck: any[];
  finisherDeck: any[];
}) {
  try {
    console.log("Canvas Test開始");

    const canvas = document.createElement("canvas");
   canvas.width = 2400;
   canvas.height = 2200;

    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,
    canvas.width,
    canvas.height
    );
    
    ctx.fillStyle = "#000";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("テストデッキ", 30, 60);

    ctx.font = "bold 30px sans-serif";
    ctx.fillText("ライドデッキ", 30, 110);

    ctx.font = "bold 30px sans-serif";
    ctx.fillText("メインデッキ", 30, 570);
    const startX = 20;
const startY = 620;

const columns = 9;
const cardWidth = 270;
const cardHeight = 370;
const gapX = 10;
const gapY = 10;
const finisherWidth = 310;
const finisherHeight = 210;
const finisherColumns = 8;

for (let i = 0; i < mainDeck.length; i++) {

  const group = mainDeck[i];
  const card = group.card;

  if (!card?.storage_image_url) continue;

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;

    img.src =
      `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${card.storage_image_url}`;
  });

  const col = i % columns;
  const row = Math.floor(i / columns);

  ctx.drawImage(
    img,
    startX + col * (cardWidth + gapX),
    startY + row * (cardHeight + gapY),
    cardWidth,
    cardHeight
  );
ctx.fillStyle = "#000000";
ctx.fillRect(
  startX + col * (cardWidth + gapX) + cardWidth - 48,
  startY + row * (cardHeight + gapY) + cardHeight - 32,
  44,
  28
);

ctx.fillStyle = "#ffffff";
ctx.font = "bold 20px sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillText(
  `×${group.count}`,
  startX + col * (cardWidth + gapX) + cardWidth - 26,
  startY + row * (cardHeight + gapY) + cardHeight - 18
);

ctx.textAlign = "start";
ctx.textBaseline = "alphabetic";
}

const mainRows = Math.ceil(mainDeck.length / columns);
const mainBottom = startY + mainRows * (cardHeight + gapY);
let nextSectionY = mainBottom;


if (gDeck.length > 0) {
ctx.fillStyle = "#000";
ctx.font = "bold 30px sans-serif";
ctx.fillText("Gデッキ", 30, mainBottom + 40);

const gStartX = 20;
const gStartY = mainBottom + 80;
const gRows = Math.ceil(gDeck.length / columns);
const gBottom = gStartY + gRows * (cardHeight + gapY);
nextSectionY = gBottom;
for (let i = 0; i < gDeck.length; i++) {

  const group = gDeck[i];
  const card = group.card;

  if (!card?.storage_image_url) continue;

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;

    img.src =
      `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${card.storage_image_url}`;
  });

  const col = i % columns;
  const row = Math.floor(i / columns);

  ctx.drawImage(
    img,
    gStartX + col * (cardWidth + gapX),
    gStartY + row * (cardHeight + gapY),
    cardWidth,
    cardHeight
  );

  ctx.fillStyle = "#000";
  ctx.fillRect(
    gStartX + col * (cardWidth + gapX) + cardWidth - 48,
    gStartY + row * (cardHeight + gapY) + cardHeight - 32,
    44,
    28
  );

  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    `×${group.count}`,
    gStartX + col * (cardWidth + gapX) + cardWidth - 26,
    gStartY + row * (cardHeight + gapY) + cardHeight - 18
  );

  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}
}

if (finisherDeck.length > 0) {
ctx.fillStyle = "#000";
ctx.font = "bold 30px sans-serif";
const finisherTitleY = nextSectionY + 40;

ctx.fillText("必殺技デッキ", 30, finisherTitleY);

const finisherStartX = 20;
const finisherStartY = nextSectionY + 80;

for (let i = 0; i < finisherDeck.length; i++) {

  const group = finisherDeck[i];
  const card = group.card;

  if (!card?.storage_image_url) continue;

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;

    img.src =
      `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${card.storage_image_url}`;
  });

 const col = i % finisherColumns;
 const row = Math.floor(i / finisherColumns);

const x = finisherStartX + col * (finisherWidth + gapX);
const y = finisherStartY + row * (finisherHeight + gapY);

ctx.drawImage(
  img,
  x,
  y,
  finisherWidth,
  finisherHeight
);

  ctx.fillStyle = "#000";
  ctx.fillRect(
  x + finisherWidth - 48,
y + finisherHeight - 32,
  44,
  28
);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

ctx.fillText(
  `×${group.count}`,
  x + finisherWidth - 26,
  y + finisherHeight - 18
);

  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}
}

for (let i = 0; i < rideDeck.length; i++) {

  const card = rideDeck[i];

  if (!card?.storage_image_url) continue;

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;

    img.src =
      `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${card.storage_image_url}`;
  });

 ctx.drawImage(
  img,
  20 + i * 275,
  140,
  270,
  370
);

}

    console.log("drawImage成功");

    canvas.toBlob((blob) => {
      console.log("toBlob", blob);

      if (!blob) {
        alert("blob生成失敗");
        return;
      }

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "test.png";
      a.click();
      URL.revokeObjectURL(a.href);

      alert("保存成功");
    });

  } catch (e) {
    console.error(e);
    alert(String(e));
  }
}