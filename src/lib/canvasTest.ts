async function loadCardImage(url: string) {
  await new Promise(resolve => setTimeout(resolve, 20));
  const path = url.replace(
  `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/`,
  ""
);

let response: Response;

try {
  response = await fetch(
    `/api/card-image?path=${encodeURIComponent(path)}`
  );
} catch (e) {
  console.error("fetch失敗", e);
  alert(`fetch失敗\n${path}\n\n${e}`);
  throw e;
}

  if (!response.ok) {
    throw new Error(`画像取得失敗: ${url}`);
  }

  const blob = await response.blob();

  const objectUrl = URL.createObjectURL(blob);

  try {
    const img = new Image();

    img.crossOrigin = "anonymous";

    await new Promise<void>((resolve, reject) => {

      img.onload = () => resolve();

      img.onerror = () => {
        reject(new Error(`画像読み込み失敗: ${url}`));
      };

      img.src = objectUrl;

    });

    return img;

  } finally {

    URL.revokeObjectURL(objectUrl);

  }
}

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

const startX = 20;

const columns = 9;

const rideWidth = 270;
const rideHeight = 370;

const mainCardWidth = 270;
const mainCardHeight = 370;

const gCardWidth = 270;
const gCardHeight = 370;

const gapX = 10;
const gapY = 10;

const finisherWidth = 310;
const finisherHeight = 210;
const finisherColumns = 8;
const rideBottom = 140 + rideHeight;
const mainTitleY = rideBottom + 60;
const startY = mainTitleY + 30;

const mainRows = Math.ceil(mainDeck.length / columns);
const mainHeight = mainRows * (mainCardHeight + gapY);

const gRows = Math.ceil(gDeck.length / columns);
const gHeight = gDeck.length > 0 ? gRows * (gCardHeight + gapY) : 0;
const finisherRows = Math.ceil(finisherDeck.length / finisherColumns);
const finisherHeightTotal =
  finisherDeck.length > 0
    ? finisherRows * (finisherHeight + gapY)
    : 0;

const totalHeight =
  rideBottom +
  120 +                      // ライド→メイン
  mainHeight +
  (gDeck.length > 0 ? 80 + gHeight : 0) +
  (finisherDeck.length > 0 ? 80 + finisherHeightTotal : 0) +
  15;                       // 一番下の余白

const img = await loadCardImage(
  `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${rideDeck[0].storage_image_url}`
);

alert(`${img.width} × ${img.height}`);

return; 

const canvas = document.createElement("canvas");
   canvas.width = 2600;
   canvas.height = totalHeight;

const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,
    canvas.width,
    canvas.height
    );
    
    ctx.fillStyle = "#000";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText("テストデッキ", 30, 60);

    ctx.font = "bold 36px sans-serif";
    ctx.fillText("ライドデッキ", 30, 120);

    ctx.font = "bold 36px sans-serif";
    ctx.fillText("メインデッキ", 30, mainTitleY);

let currentX = startX;
for (let i = 0; i < mainDeck.length; i++) {

  const group = mainDeck[i];
  const card = group.card;

  if (!card?.storage_image_url) continue;

const img = await loadCardImage(
  `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${card.storage_image_url}`
);

const col = i % columns;
const row = Math.floor(i / columns);
if (col === 0) currentX = startX;
const x = currentX;
const y = startY + row * (mainCardHeight + gapY);

const isHorizontal = img.width > img.height;

if (isHorizontal) {

  ctx.drawImage(
    img,
    x,
    y,
    mainCardHeight,
    mainCardWidth
  );
currentX += mainCardHeight + gapX;

} else {

  ctx.drawImage(
    img,
    x,
    y,
    mainCardWidth,
    mainCardHeight
  );
currentX += mainCardWidth + gapX;
}
ctx.fillStyle = "#000000";
if (isHorizontal) {

  ctx.fillRect(
    x + mainCardHeight - 60,
    y + mainCardWidth - 40,
    60,
    40
  );

} else {

  ctx.fillRect(
    x + mainCardWidth - 60,
    y + mainCardHeight - 40,
    60,
    40
  );

}
ctx.fillStyle = "#ffffff";
ctx.font = "bold 36px sans-serif";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

if (isHorizontal) {

  ctx.fillText(
    `×${group.count}`,
    x + mainCardHeight - 34,
    y + mainCardWidth - 18
  );

} else {

  ctx.fillText(
    `×${group.count}`,
    x + mainCardWidth - 34,
    y + mainCardHeight - 18
  );

}

ctx.textAlign = "start";
ctx.textBaseline = "alphabetic";
}


const mainBottom = startY + mainRows * (mainCardHeight + gapY);
let nextSectionY = mainBottom;
let imageBottom = mainBottom;

if (gDeck.length > 0) {
ctx.fillStyle = "#000";
ctx.font = "bold 36px sans-serif";
const gTitleY = mainBottom + 40;
const gStartY = gTitleY + 40;
ctx.fillText("Gデッキ", 30, gTitleY);

const gStartX = 20;
const gBottom = gStartY + gHeight;
nextSectionY = gBottom;
imageBottom = gBottom;
for (let i = 0; i < gDeck.length; i++) {

  const group = gDeck[i];
  const card = group.card;

  if (!card?.storage_image_url) continue;

const img = await loadCardImage(
  `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${card.storage_image_url}`
);

  const col = i % columns;
  const row = Math.floor(i / columns);

ctx.drawImage(
  img,
  gStartX + col * (gCardWidth + gapX),
  gStartY + row * (gCardHeight + gapY),
  gCardWidth,
  gCardHeight
);

  ctx.fillStyle = "#000";
  ctx.fillRect(
    gStartX + col * (gCardWidth + gapX) + gCardWidth - 60,
    gStartY + row * (gCardHeight + gapY) + gCardHeight - 40,
    60,
    40
  );

  ctx.fillStyle = "#fff";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    `×${group.count}`,
    gStartX + col * (gCardWidth + gapX) + gCardWidth - 34,
    gStartY + row * (gCardHeight + gapY) + gCardHeight - 18
  );

  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";
}
}

if (finisherDeck.length > 0) {
ctx.fillStyle = "#000";
ctx.font = "bold 36px sans-serif";
const finisherTitleY = nextSectionY + 5;
const finisherStartY = finisherTitleY + 20;

ctx.fillText("必殺技デッキ", 30, finisherTitleY);

const finisherStartX = 20;

for (let i = 0; i < finisherDeck.length; i++) {

  const group = finisherDeck[i];
  const card = group.card;

  if (!card?.storage_image_url) continue;

const img = await loadCardImage(
  `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${card.storage_image_url}`
);

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
  x + finisherWidth - 60,
y + finisherHeight - 40,
  60,
  40
);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

ctx.fillText(
  `×${group.count}`,
  x + finisherWidth - 34,
  y + finisherHeight - 18
);

  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";

const finisherBottom =
  finisherStartY +
  finisherRows * (finisherHeight + gapY);

imageBottom = finisherBottom; 
}
}
currentX = 20;
for (let i = 0; i < rideDeck.length; i++) {

  const card = rideDeck[i];

  if (!card?.storage_image_url) continue;

const img = await loadCardImage(
  `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${card.storage_image_url}`
);

const isHorizontal = img.width > img.height;
const x = currentX;
const y = 140;

if (isHorizontal) {

  ctx.drawImage(
    img,
    x,
    y,
    rideHeight,
    rideWidth
  );

  currentX += rideHeight + 5;

} else {

  ctx.drawImage(
    img,
    x,
    y,
    rideWidth,
    rideHeight
  );

  currentX += rideWidth + 5;

}

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