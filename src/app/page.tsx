"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  saveCardsCache,
  getCardsCache,
  deleteCardsCache,
  saveAllCardsCache,
  getAllCardsCache,
  deleteAllCardsCache,
} from "@/lib/indexedDb";
import { v4 as uuidv4 } from "uuid";
import { toPng } from "html-to-image";
import DeckImageForSave from "@/components/DeckImageForSave";
import { FiArrowLeft } from "react-icons/fi";
import { generateDeckImage } from "@/lib/canvasTest";

export default function Home() {
  const isIOS =
  typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod/.test(navigator.userAgent);
  const deckImageRef = useRef<HTMLDivElement>(null);
  const saveImageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [normalRarity, setNormalRarity] = useState("");
  const [parallelRarity, setParallelRarity] = useState("");
  const [officialUrl, setOfficialUrl] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("");
  const [registrationApproval, setRegistrationApproval] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  

const [cardNo, setCardNo] = useState("");
const [cardName, setCardName] = useState("");
const [rarity, setRarity] = useState("");
const [imageUrl, setImageUrl] = useState("");
const [cards, setCards] = useState<any[]>([]);
const [deckSearchCards, setDeckSearchCards] = useState<any[]>([]);
const [rarityView, setRarityView] = useState<  "all" | "normal" | "parallel">("all");
const [searchNo, setSearchNo] = useState("");
const [searchName, setSearchName] = useState("");
const [searchRarity, setSearchRarity] = useState("");
const [searchGrade,setSearchGrade]=useState("");
const [searchTrigger,setSearchTrigger]=useState("");
const [searchParallel,setSearchParallel]=useState("");
const [rarityList, setRarityList] = useState<string[]>([]);
const [imageFile, setImageFile] = useState<File | null>(null);
const [activeTab, setActiveTab] = useState("manage");
const [deckView, setDeckView] = useState("list");
const [deckName, setDeckName] = useState("");
const [savingDeckImage, setSavingDeckImage] = useState(false);
const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
const [showSaveImage, setShowSaveImage] = useState(false);
const [previewImage, setPreviewImage] = useState<string | null>(null);
const [selectedDeck, setSelectedDeck] =useState<any>(null);
const [hideSameCard, setHideSameCard] = useState(false);
const [deckNation, setDeckNation] =useState("");
const [includeNationless, setIncludeNationless] = useState(false);
const [decks, setDecks] = useState<any[]>([]);
const [deckSearch, setDeckSearch] =useState("");
const [deckRideG3Images,setDeckRideG3Images] = useState<any>({});
const [rideG3, setRideG3] = useState<any>(null);
const [rideG2, setRideG2] = useState<any>(null);
const [rideG1, setRideG1] = useState<any>(null);
const [rideG0, setRideG0] = useState<any>(null);
const [rideGenerator, setRideGenerator] = useState<any>(null);
const [rideSelectMode, setRideSelectMode] =useState<
    "g3" |
    "g2" |
    "g1" |
    "g0" |
    "generator" |
    null
  >(null);
const [deckMode, setDeckMode] = useState<
  "ride" |
  "main" |
  "gdeck"
| "finisher" 
>("ride");
const loadCardById = async (
  cardId: number
) => {
  const { data, error } =
    await supabase
      .from("cards")
      .select("*")
      .eq("id", cardId)
      .single();
  if (error) {
    console.log(error);
    return null;
  }
  return data;
};
const refreshDeckCards = async (cards: any[]) => {if (!cards || cards.length === 0) return [];
const ids = [...new Set(cards.map(card => card.id).filter(Boolean))];
const { data, error } = await supabase
    .from("cards")
    .select("*")
    .in("id", ids);
     if (error || !data) {
    console.log(error);
    return cards;
  }
const map = new Map(data.map(card => [card.id, card]));return cards.map(card => map.get(card.id) || card);};
const [mainDeck, setMainDeck] = useState<any[]>([]);
const [gDeck, setGDeck] = useState<any[]>([]);
const [finisherDeck, setFinisherDeck] = useState<any[]>([]);
const mainDeckGrouped =Object.values(mainDeck.reduce((acc: any, card: any) => {const key =`${card.card_name}_${card.card_no}`;if (!acc[key]) {acc[key] = 
{card,count: 0};}acc[key].count++;return acc;},{}));
const displayMainDeckGrouped = [
...mainDeckGrouped.filter((item:any)=>Number(item.card.grade)===3 &&item.card.card_type==="ノーマルユニット"),
...mainDeckGrouped.filter((item:any)=>Number(item.card.grade)===2 &&item.card.card_type==="ノーマルユニット"),
...mainDeckGrouped.filter((item:any)=>Number(item.card.grade)===1 &&item.card.card_type==="ノーマルユニット"),
...mainDeckGrouped.filter((item:any)=>Number(item.card.grade)===0 &&item.card.card_type==="ノーマルユニット"),
...mainDeckGrouped.filter((item:any)=>Number(item.card.grade)===0 &&item.card.card_type==="トリガーユニット" &&item.card.trigger_type==="クリティカルトリガー＋10000"),
...mainDeckGrouped.filter((item:any)=>Number(item.card.grade)===0 &&item.card.card_type==="トリガーユニット" &&item.card.trigger_type==="ドロートリガー＋10000"),
...mainDeckGrouped.filter(
(item:any)=>
Number(item.card.grade)===0 &&
item.card.card_type==="トリガーユニット" &&
item.card.trigger_type==="フロントトリガー＋10000"
),

...mainDeckGrouped.filter(
(item:any)=>
Number(item.card.grade)===0 &&
item.card.card_type==="トリガーユニット" &&
item.card.trigger_type==="スタンドトリガー＋10000"
),

...mainDeckGrouped.filter(
(item:any)=>
Number(item.card.grade)===0 &&
item.card.card_type==="トリガーユニット" &&
item.card.trigger_type==="ヒールトリガー＋10000"
),

...mainDeckGrouped.filter(
(item:any)=>
Number(item.card.grade)===0 &&
item.card.card_type==="トリガーユニット" &&
item.card.trigger_type==="オーバートリガー＋100000000"
),

...mainDeckGrouped.filter(
(item:any)=>
item.card.card_type==="ノーマルオーダー"
),

...mainDeckGrouped.filter(
(item:any)=>
item.card.card_type==="ブリッツオーダー"
),

...mainDeckGrouped.filter(
(item:any)=>
item.card.card_type==="セットオーダー"
)

];



const gDeckGrouped: any[] =
Object.values(
  gDeck.reduce(
    (acc: any, card: any) => {
      const key = `${card.card_name}_${card.card_no}`;

      if (!acc[key]) {
        acc[key] = {
          card,
          count: 0
        };
      }

      acc[key].count++;

      return acc;
    },
    {}
  )
) as any[];

const finisherDeckGrouped: any[] =
Object.values(
  finisherDeck.reduce(
    (acc: any, card: any) => {
      const key = `${card.card_name}_${card.card_no}`;

      if (!acc[key]) {
        acc[key] = {
          card,
          count: 0
        };
      }

      acc[key].count++;

      return acc;
    },
    {}
  )
) as any[];


const addToMainDeck = (card:any) => {

const sameCards=
mainDeck.filter(
(c)=>
c.card_name===
card.card_name
);

if(sameCards.length>=4){
return;
}

setMainDeck([
...mainDeck,
card
]);

};

const getDeckCount=(card:any)=>{
return mainDeck.filter(
(c)=>
c.card_no===card.card_no
).length;
};

const addToGDeck = (card: any) => {
  const sameCards =
    gDeck.filter(
      (c) =>
        c.card_name ===
        card.card_name
    );
  if (
    sameCards.length >= 4
  ) {
    return;
  }
  setGDeck([
    ...gDeck,
    card
  ]);
};

const addToFinisherDeck = (card:any)=>{

if(finisherDeck.length >= 16){
return;
}

const count =
finisherDeck.filter(
(c:any)=>c.card_name===card.card_name
).length;

if(count>=2){
return;
}

setFinisherDeck([
...finisherDeck,
card
]);

};

const removeFromFinisherDeck=(cardNo:string)=>{
const index=finisherDeck.findIndex(card=>card.card_no===cardNo);
if(index===-1)return;
const newDeck=[...finisherDeck];
newDeck.splice(index,1);
setFinisherDeck(newDeck);
};

const removeFromMainDeck=(
cardNo:string
)=>{
  const index =
    mainDeck.findIndex(
      (c) =>
        c.card_no===cardNo
    );
  if (index === -1) {
    return;
  }
  const newDeck =
    [...mainDeck];

  newDeck.splice(
    index,
    1
  );
  setMainDeck(newDeck);
};

const removeFromGDeck = (
  cardNo: string
) => {
  const index =
    gDeck.findIndex(
      (c) =>
        c.card_no === cardNo
    );

  if (index === -1) {
    return;
  }

  const newDeck = [...gDeck];

  newDeck.splice(
    index,
    1
  );

  setGDeck(newDeck);
};

const getGDeckCount = (card:any) => {return gDeck.filter((c)=>c.card_no===card.card_no).length;};
const getFinisherDeckCount=(card:any)=>{return finisherDeck.filter((c)=>c.card_no===card.card_no).length;};
const [productCodeSearch, setProductCodeSearch] = useState("");
const [productNameSearch, setProductNameSearch] = useState("");
const [selectedHomeProduct,setSelectedHomeProduct] = useState<any>(null);
const [homeSearch,setHomeSearch] = useState("");
const [cardSearch,setCardSearch] = useState("");
const [homeRarity,setHomeRarity] = useState("");
const [searchNation, setSearchNation] = useState("");
const [nationList, setNationList] = useState<string[]>([]);
const [searchCardType,setSearchCardType]=useState("");
const [homeView, setHomeView] = useState("products");
const [selectedHomeCard, setSelectedHomeCard] = useState<any>(null);
const [ownedCount, setOwnedCount] = useState(0);
const [shortageCount, setShortageCount] = useState(0);
const [collectionData, setCollectionData] = useState<any>(null);
const [memo, setMemo] = useState("");
const [favorite, setFavorite] = useState(false);
const [wanted, setWanted] = useState(false);
const [favoriteCards, setFavoriteCards] = useState<any[]>([]);
const [wantedCards, setWantedCards] = useState<any[]>([]);
const [pressTimer, setPressTimer] =useState<NodeJS.Timeout | null>(null);
const [copied, setCopied] = useState(false);
const [cardType, setCardType] = useState("");
const [nation, setNation] = useState("");
const [race, setRace] = useState("");
const [grade, setGrade] = useState("");
const [power, setPower] = useState("");
const [critical, setCritical] = useState("");
const [shield, setShield] = useState("");
const [skillIcon, setSkillIcon] = useState("");
const [cardText, setCardText] = useState("");
const [flavorText, setFlavorText] = useState("");
const [triggerType, setTriggerType] = useState("");
const [illustrator, setIllustrator] = useState("");
const [allNormalRarities,setAllNormalRarities]=useState<string[]>([]);
const [allParallelRarities,setAllParallelRarities]=useState<string[]>([]);
const [zoomCard,setZoomCard] =useState<any>(null);
const [showDeckModal, setShowDeckModal] = useState(false);
const [deckImagesLoaded, setDeckImagesLoaded] = useState(false);
const [newPassword,setNewPassword] =useState("");
const [previousTab, setPreviousTab] =useState("");
const [confirmPassword,setConfirmPassword] =useState("");
const [showDeckButton, setShowDeckButton] = useState(false);
const [homeCardType, setHomeCardType] = useState("");
const [homeGrade, setHomeGrade] = useState("");
const [homeTrigger, setHomeTrigger] = useState("");
const [isSearchResult, setIsSearchResult] = useState(false);
const [importResults, setImportResults] =useState<Record<number,{insert: number;update: number;skip: number;}>>({});
const [storageResults, setStorageResults] = useState<Record<number,{saved:number;skip:number;failed:number;total:number;}>>({});
const [showStorageStatus, setShowStorageStatus] = useState<Record<number, boolean>>({});
const [storageLoading, setStorageLoading] = useState(false);
const [storageMessage, setStorageMessage] = useState("");
const [storageProgress, setStorageProgress] = useState({
  total: 0,
  current: 0,
  currentCard: "",
});
const [imageMode, setImageMode] = useState<"storage" | "url">("storage");
useEffect(() => {
  const saved = localStorage.getItem("imageMode");

  if (saved === "storage" || saved === "url") {
    setImageMode(saved);
  }
}, []);

useEffect(() => {
  localStorage.setItem("imageMode", imageMode);
}, [imageMode]);
const APP_TITLE = "VGカード検索 ";
const FloatingBackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="fixed bottom-5 left-5 z-50 md:hidden
               w-12 h-12 rounded-full
               flex items-center justify-center"
    style={{
      background: "rgba(80, 80, 80, 0.60)",
      border: "1px solid rgba(255,255,255,0.18)",
      boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
    }}
  >
    <FiArrowLeft
      size={18}
      color="#fff"
      strokeWidth={2.4}
    />
  </button>
);

const getCardImage = (card: any) => {

  if (!card) {
    return "";
  }

  // URL方式
  if (imageMode === "url") {
    return card.image_url || "";
  }

  // Storage方式
  if (card.storage_image_url) {
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${card.storage_image_url}`;
}

  // Storage画像がまだ無い場合は公式URL
  return card.image_url || "";

};

  const editProduct = (product: any) => {
  setEditingProductId(product.id);
  setProductCode(product.product_code || "");
  setProductName(product.product_name || "");
  setNormalRarity(product.normal_rarity || "");
  setParallelRarity(product.parallel_rarity || "");
  setOfficialUrl(product.official_url || "");
};
const resetProductForm = () => {
  setEditingProductId(null);
  setProductCode("");
  setProductName("");
  setNormalRarity("");
  setParallelRarity("");
  setOfficialUrl("");
};

const autoImportCards = async (product: any) => {

  if (!product.official_url) {
    alert("公式URLが登録されていません");
    return;
  }

const apiUrl =`/api/card-import?url=${encodeURIComponent(product.official_url)}&productId=${product.id}`;

const result =await fetch(apiUrl);

const data =await result.json();

setImportResults((prev) => ({
  ...prev,
  [product.id]: {
    insert: data.insertCount,
    update: data.updateCount,
    skip: data.skipCount,
  },
}));
await deleteCardsCache(product.id);
await deleteAllCardsCache();

await loadCards(String(product.id));
};

const saveImagesToStorage = async (product: any) => {
  if (!product.official_url) {
    alert("公式URLが登録されていません");
    return;
  }
if (process.env.NODE_ENV === "production") {

  if (process.env.NODE_ENV === "production") {

  const ok = confirm(
`${product.product_code} の画像をCloudflare R2へ保存します。

この処理には数分かかる場合があります。

開始しますか？`
  );

  if (!ok) return;

}

}

let timer: ReturnType<typeof setInterval> | undefined;

if (process.env.NODE_ENV === "production") {

  setStorageLoading(true);

  timer = setInterval(async () => {

    const response = await fetch(
      `/api/progress?productId=${product.id}`
    );

    const progress = await response.json();

    setStorageProgress(progress);

    if (progress.finished && timer) {

      clearInterval(timer);

    }

  }, 500);

}

setStorageMessage(
  "Cloudflare R2へ画像を保存しています..."
);
try {
const result = await fetch(`/api/storage-import?productId=${product.id}&productCode=${encodeURIComponent(product.product_code)}`);

const data = await result.json();

console.log(data);

setStorageResults((prev) => ({
  ...prev,
  [product.id]: {
    saved: data.saved,
    skip: data.skip,
    failed: data.failed,
    total: data.total,
  },
}));
await loadCards(product.id);

if (process.env.NODE_ENV === "production") {

  alert(
`${product.product_code}

Cloudflare R2への保存が完了しました。

対象：${data.total}枚
保存：${data.saved}枚
失敗：${data.failed}枚`
  );

}

} finally {

  if (process.env.NODE_ENV === "production") {

  setStorageLoading(false);

}

  setStorageProgress({
    total: 0,
    current: 0,
    currentCard: "",
  });

}

};

const deleteStorageImages = async (product: any) => {

  const ok = confirm(
    `${product.product_code} のStorage画像を削除しますか？`
  );

  if (!ok) return;

  const response = await fetch(
    `/api/storage-delete?productId=${product.id}`
  );

  const data = await response.json();

  if (!data.success) {
    alert("削除に失敗しました");
    console.log(data);
    return;
  }

  alert(`${data.deleted}枚削除しました`);

  await loadCards(product.id);
  loadProducts();

};


const deleteProduct = async (id: number) => {
  const ok = confirm("この商品を削除しますか？");

  if (!ok) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("削除失敗");
    return;
  }

  alert("削除成功");

  loadProducts();
};
const moveProductUp = async (product: any) => {
  const currentIndex =
  products.findIndex(
    (p) => p.id === product.id
  );

const target =
  products[currentIndex - 1];

  if (!target) return;

  await supabase
    .from("products")
    .update({ sort_order: target.sort_order })
    .eq("id", product.id);

  await supabase
    .from("products")
    .update({ sort_order: product.sort_order })
    .eq("id", target.id);

  loadProducts();
};

const moveProductDown = async (product: any) => {
  const currentIndex =
  products.findIndex(
    (p) => p.id === product.id
  );

const target =
  products[currentIndex + 1];

if (!target) return;

  if (!target) return;

  await supabase
    .from("products")
    .update({ sort_order: target.sort_order })
    .eq("id", product.id);

  await supabase
    .from("products")
    .update({ sort_order: product.sort_order })
    .eq("id", target.id);

  loadProducts();
};
const saveProduct = async () => {
  let error;
    if (editingProductId) {
  const result = await supabase
    .from("products")
    .update({
     product_code: productCode,
     product_name: productName,
     normal_rarity: normalRarity,
     parallel_rarity: parallelRarity,
     official_url: officialUrl,
   })
    .eq("id", editingProductId);

  error = result.error;
} else {
  const result = await supabase
    .from("products")
    .insert([
{
  product_code: productCode,
  product_name: productName,
  normal_rarity: normalRarity,
  parallel_rarity: parallelRarity,
  official_url: officialUrl,
  sort_order: products.length,
}
]);

  error = result.error;
}

    if (error) {
      console.log(error);
      alert("保存失敗");
      return;
    }

setEditingProductId(null);

setProductCode("");
setProductName("");
setNormalRarity("");
setParallelRarity("");
setOfficialUrl("");

loadProducts();
  };

const saveCard = async () => {
    if (!selectedProductId) {
  alert("商品を選択してください");
  return;
}
const selectedProduct =
  products.find(
    (p) => p.id === Number(selectedProductId)
  );

if (!selectedProduct) {

  alert("商品が見つかりません");

  return;

}
  let finalImageUrl = imageUrl;
  let storageImageUrl = "";
  if (imageFile) {

  const formData = new FormData();

  formData.append("file", imageFile);

  formData.append(
    "productCode",
    selectedProduct.product_code
  );

  formData.append(
    "cardNo",
    cardNo
  );

  const response = await fetch(
    "/api/r2-upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const result =
    await response.json();

  if (!result.success) {

    console.log(result);

    alert("画像アップロード失敗");

    return;

  }

  finalImageUrl =
    `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${result.path}`;
storageImageUrl = result.path;
}

  let error;

  if (editingId) {

    const result = await supabase
      .from("cards")
      .update({
       product_id: Number(selectedProductId),
       card_no: cardNo,
       card_name: cardName,
       rarity: rarity,
       image_url: finalImageUrl,
       storage_image_url: storageImageUrl,
       card_type: cardType,
       nation: nation,
       race: race,
       grade: Number(grade) || null,
       power: Number(power) || null,
       critical: Number(critical) || null,
       shield: Number(shield) || null,
       skill_icon: skillIcon,
       card_text: cardText,
       flavor_text: flavorText,
       trigger_type: triggerType,
       illustrator: illustrator,
})
      .eq("id", editingId);

    error = result.error;
  } else {
    const result = await supabase
      .from("cards")
      .insert([
  {
  product_id: Number(selectedProductId),
  card_no: cardNo,
  card_name: cardName,
  rarity: rarity,
  image_url: finalImageUrl,
  storage_image_url: storageImageUrl,
  sort_order: cards.length,
  card_type: cardType,
  nation: nation,
  race: race,
  grade: Number(grade) || null,
  power: Number(power) || null,
  critical: Number(critical) || null,
  shield: Number(shield) || null,
  skill_icon: skillIcon,
  card_text: cardText,
  flavor_text: flavorText,
  trigger_type: triggerType,
  illustrator: illustrator,
},
]);

    error = result.error;
  }

  if (error) {
    console.log(error);
    alert("カード保存失敗");
    return;
  }

  setCardNo("");
  setCardName("");
  setRarity("");
  setImageUrl("");
  setEditingId(null);
  setImageFile(null);
  setCardType("");
  setNation("");
  setRace("");
  setGrade("");
  setPower("");
  setCritical("");
  setShield("");
  setSkillIcon("");
  setCardText("");
  setFlavorText("");
  setTriggerType("");
  setIllustrator("");

await deleteCardsCache(Number(selectedProductId));
await deleteAllCardsCache();

await loadCards(selectedProductId);
};
  
const loadProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order");

  if (error) {
    console.log(error);
    return;
  }

  setProducts(data || []);

  let from = 0;
const size = 1000;

const result: Record<number, {
  saved: number;
  skip: number;
  failed: number;
  total: number;
}> = {};

while (true) {

  const { data: storageCards, error: storageError } = await supabase
    .from("cards")
    .select("product_id,storage_image_url")
    .range(from, from + size - 1);

  if (storageError) {

    console.log(storageError);
    break;

  }

  if (!storageCards || storageCards.length === 0) {

    break;

  }

  for (const card of storageCards) {

    if (!result[card.product_id]) {

result[card.product_id] = {
  saved: 0,
  skip: 0,
  failed: 0,
  total: 0,
};

    }

    result[card.product_id].total++;

    if (card.storage_image_url) {

      result[card.product_id].saved++;

    }

  }

  if (storageCards.length < size) {

    break;

  }

  from += size;

}

setStorageResults(result);

  const normalList=[
    ...new Set(
      (data||[])
      .flatMap(p=>
        (p.normal_rarity||"")
        .split(",")
        .map((r:string)=>r.trim())
      )
      .filter(Boolean)
    )
  ];

  const parallelList=[
    ...new Set(
      (data||[])
      .flatMap(p=>
        (p.parallel_rarity||"")
        .split(",")
        .map((r:string)=>r.trim())
      )
      .filter(Boolean)
    )
  ];

  setAllNormalRarities(normalList);
  setAllParallelRarities(parallelList);
};

const loadAllCardsCache = async () => {


const cache = await getAllCardsCache();

if (cache && cache.length === 0) {
  await deleteAllCardsCache();
}

if (cache && cache.length > 0) {
  return cache;
}

const { data, error } = await supabase
  .from("cards")
  .select(`
    *,
    products (
      sort_order
    )
  `)
  .order("sort_order", {
    referencedTable: "products",
  })
  .order("sort_order");

alert(`Supabase:${data?.length ?? 0} Error:${error ? "YES" : "NO"}`);

  if (error) {

    console.log(error);

    return [];

  }



await saveAllCardsCache(data || []);

return data || [];

};

const filterDeckCards = (
  cards: any[],
  nation: string,
  cardType: string,
  grade: string,
  rarity: string,
  parallel: string,
  keyword: string,
  include: boolean,
  trigger: string,
  mode: string
) => {

  let result = [...cards];

  if (include) {
    result = result.filter(
      card => card.nation === nation || card.nation === "-"
    );
  } else {
    result = result.filter(
      card => card.nation === nation
    );
  }

  if (keyword) {
    const word = keyword.toLowerCase();

    result = result.filter(card =>
      card.card_name.toLowerCase().includes(word) ||
      card.card_no.toLowerCase().includes(word)
    );
  }

  if (cardType) {
    result = result.filter(
      card => card.card_type === cardType
    );
  }

if (!cardType) {

  if (mode === "main" || mode === "ride") {
    result = result.filter(card =>
      card.card_type !== "必殺技" &&
      card.card_type !== "Gユニット" &&
      card.card_type !== "その他" &&
      card.card_type !== "ライドデッキクレスト"
    );
  }

  if (mode === "gdeck") {
    result = result.filter(
      card => card.card_type === "Gユニット"
    );
  }

  if (mode === "finisher") {
    result = result.filter(
      card => card.card_type === "必殺技"
    );
  }

}

  if (grade) {
    result = result.filter(
      card => card.grade === Number(grade)
    );
  }

  if (rarity) {
    result = result.filter(
      card => card.rarity === rarity
    );
  }

  if (trigger) {
    result = result.filter(
      card => card.trigger_type === trigger
    );
  }

  if (parallel === "normal") {
    result = result.filter(
      card => allNormalRarities.includes(card.rarity)
    );
  }

  if (parallel === "parallel") {
    result = result.filter(
      card => allParallelRarities.includes(card.rarity)
    );
  }

  result.sort((a, b) => {

    if (a.products.sort_order !== b.products.sort_order) {
      return a.products.sort_order - b.products.sort_order;
    }

    return a.sort_order - b.sort_order;

  });

  return result;

};

const loadCards = async (productId?: string) => {
  if (productId) {
  const cache = await getCardsCache(Number(productId));

  if (cache) {
    setCards(cache);
  }
}
  let query = supabase
    .from("cards")
    .select(`
  *,
  card_collection (*),
  products (*)
`)
    .order("sort_order");

  if (productId) {
    query = query.eq("product_id", Number(productId));
  }

  const { data, error } = await query;

  if (error) {
    console.log(error);
    return;
  }

if (productId && data) {
  await saveCardsCache(Number(productId), data);
}

  setCards(data || []);
};

const searchProductsByCard = async () => {

  // キーワードが空なら常に全商品表示
  if (!cardSearch.trim()) {
    loadProducts();
    return;
  }

  // 商品一覧画面のみで使用
  if (homeView !== "products") {
    return;
  }

  const keyword = cardSearch.trim();

  const { data: cardData, error } = await supabase
    .from("cards")
    .select("product_id")
    .or(
      `card_name.ilike.%${keyword}%,card_no.ilike.%${keyword}%,card_type.ilike.%${keyword}%,nation.ilike.%${keyword}%,race.ilike.%${keyword}%,card_text.ilike.%${keyword}%`
    );

  if (error) {
    console.log(error);
    return;
  }

  const productIds = [
    ...new Set(
      (cardData || []).map(
        (card: any) => card.product_id
      )
    )
  ];

  if (productIds.length === 0) {
    setProducts([]);
    return;
  }

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .order("sort_order");

  setProducts(productsData || []);
};

const searchCards = async () => {

  const keyword = cardSearch.trim();

  let query = supabase
  .from("cards")
  .select(`
    *,
    card_collection (*),
    products (*)
  `, { count: "exact" })
  if (keyword) {

query = query.or(
  [
    `card_name.ilike.%${keyword}%`,
    `card_no.ilike.%${keyword}%`,
    `card_type.ilike.%${keyword}%`,
    `nation.ilike.%${keyword}%`,
    `race.ilike.%${keyword}%`,
    `card_text.ilike.%${keyword}%`
  ].join(",")
);

}

if (searchNation){
    query=query.eq("nation",searchNation);
}

if (homeCardType) {
    query = query.eq("card_type", homeCardType);
}

if (homeGrade) {
  query = query.eq("grade", Number(homeGrade));
}

if (homeRarity) {
  query = query.eq("rarity", homeRarity);
}

if (homeTrigger) {
  query = query.eq("trigger_type", homeTrigger);
}

const { data, error, count } =
  await query
    .order("sort_order", {
      foreignTable: "products",
      ascending: true,
    })
    .order("sort_order", {
      ascending: true,
    })
    .range(0, 5000);

  if (error) {
    console.log(error);
    return;
  }

  const sortedCards = [...(data || [])].sort((a: any, b: any) => {
    

  // 商品順（数字が小さい＝新しい）
  const product = (a.products?.sort_order ?? 999999) - (b.products?.sort_order ?? 999999);

  if (product !== 0) {
    return product;
  }

  // 同じ商品の中はカード順
  return (a.sort_order ?? 999999) - (b.sort_order ?? 999999);

});

  setCards(sortedCards);

  setSelectedHomeProduct({
  product_code: "検索結果",
  product_name: keyword || "絞り込み検索"
});
  setIsSearchResult(true);
  setHomeView("cards");

};

const resequenceCards = async () => {

  const { data, error } = await supabase
    .from("cards")
    .select("id, card_no, sort_order")
    .eq(
      "product_id",
      Number(selectedProductId)
    )
    .order("sort_order");

  if (error || !data) {
    return;
  }

  for (let i = 0; i < data.length; i++) {


    await supabase
      .from("cards")
      .update({
        sort_order: i,
      })
      .eq("id", data[i].id);
  }
};

const loadCollection = async (
  cardId: number
) => {
  const { data, error } =
  await supabase
    .from("card_collection")
    .select("*")
    .eq("card_id", cardId)
    .eq("user_id", user?.id)
    .maybeSingle();

  if (error) {
    setOwnedCount(0);
    setCollectionData(null);
    return;
  }

  setCollectionData(data);

  if (!data) {
  setOwnedCount(0);
  setShortageCount(0);
  setFavorite(false);
  setWanted(false);
  return;
}
  setOwnedCount(data.owned_count || 0);
  setShortageCount(data.shortage_count || 0);
  setFavorite(data.favorite || false);
  setWanted(data.wanted || false);
  setMemo(data.memo || "");
};
const loadFavoriteCards = async () => {
  const { data, error } = await supabase
    .from("card_collection")
    .select(`
     *,
     cards (*)
  `)
    .eq("favorite", true);

  if (error) {
    console.log(error);
    return;
  }

  setFavoriteCards(data || []);
};
const loadWantedCards = async () => {
  const { data, error } = await supabase
    .from("card_collection")
    .select(`
      *,
      cards (*)
    `)
    .eq("wanted", true);

  if (error) {
    console.log(error);
    return;
  }

  setWantedCards(data || []);
};

const loadDecks = async () => {

  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .order(
      "created_at",
      { ascending: false }
    );

  if (error) {
    console.log(
      "DECK LOAD ERROR",
      error
    );
    return;
  }

  console.log(
    "DECKS",
    data
  );

  setDecks(data || []);

const imageMap: any = {};

for (const deck of data || []) {

  if (!deck.ride_g3) {
    continue;
  }

  const {
    data: card
  } = await supabase
    .from("cards")
    .select("image_url")
    .eq(
      "id",
      deck.ride_g3
    )
    .single();

  if (card) {

    imageMap[deck.id] =getCardImage(card);

  }

}

setDeckRideG3Images(
  imageMap
);
};

const loadPendingUsers = async () => {

  const response = await fetch("/api/pending-users");

  if (!response.ok) {
    return;
  }

  const data = await response.json();

  console.log("pendingUsers取得", data);

  setPendingUsers(data);

};

const loadNations = async () => {
  

  const { data, error } =
    await supabase
  .from("cards")
  .select("nation")
  .range(0, 5000);

  if (error) {
    console.log(
      "NATION LOAD ERROR",
      error
    );
    return;
  }

  const nations =
    [...new Set(

      (data || [])
        .map(
          (card) => card.nation
        )
        .filter(Boolean)

    )]
    .sort();

  console.log(
  "RAW NATION DATA",
  data
);

console.log(
  "NATIONS",
  nations
);

setNationList(
  nations
);

};

const loadAllRarities = async () => {
const { data, error } = await supabase
  .from("products")
  .select("normal_rarity, parallel_rarity");
if(error){console.log(error);return;}
const priority = ["RRR","RR","R","C"];

const all = [
  ...new Set(
    (data ?? [])
      .flatMap(product => [
        ...(product.normal_rarity?.split(",") ?? []),
        ...(product.parallel_rarity?.split(",") ?? [])
      ])
      .map(r => r.trim())
      .filter(Boolean)
  )
];

const list = [
  ...priority.filter(r => all.includes(r)),
  ...all.filter(r => !priority.includes(r)).sort()
];
setRarityList(list);
};

const loadAllNations = async () => {

const data = await loadAllCardsCache();

const list = [
  ...new Set(
    (data ?? [])
      .map((card) => card.nation)
      .filter(Boolean)
  ),
];

setNationList(list);

};

const loadNationCards = async (
  nation: string,
  cardType?: string,
  grade?: string,
  rarity?: string,
  parallel?: string,
  keyword?: string,
  include?: boolean,
  trigger?: string
) => {

const type = cardType ?? searchCardType;
const g = grade ?? searchGrade;
const r = rarity ?? searchRarity;
const p = parallel ?? searchParallel;
const k = keyword ?? cardSearch;
const i = include ?? includeNationless;
const t = trigger ?? searchTrigger;

const cards = await loadAllCardsCache();

const data = filterDeckCards(
  cards,
  nation,
  type,
  g,
  r,
  p,
  k,
  i,
  t,
  deckMode
);
setTimeout(() => {
  setDeckSearchCards(data);
}, 0);

return;

};

const resetDeckFilters = () => {
setSearchCardType("");
setSearchGrade("");
setSearchRarity("");
setSearchTrigger("");
setSearchParallel("");

loadNationCards(deckNation,"","","","");
};

const saveDeck = async () => {
  if (!deckName.trim()) {
    return;
  }
if (mainDeck.length !== 50) {
  alert(
    `メインデッキが50枚ではありません (${mainDeck.length}/50)`
  );
}
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    console.log(
      "USER NOT FOUND"
    );
    return;
  }
  if (selectedDeck) {
  const { data, error } =
    await supabase
      .from("decks")
      .update({
       deck_name: deckName,
       nation: deckNation,

      ride_g3: rideG3?.id ?? null,
      ride_g2: rideG2?.id ?? null,
      ride_g1: rideG1?.id ?? null,
      ride_g0: rideG0?.id ?? null,
      ride_generator:
      rideGenerator?.id ?? null,

      main_deck: mainDeck,
      g_deck: gDeck,
      finisher_deck: finisherDeck,
})
      .eq(
        "id",
        selectedDeck.id
      )
      .select();

  console.log(
    "UPDATE RESULT",
    data,
    error
  );

  if (error) {
    console.log(
      "DECK UPDATE ERROR",
      error
    );
    return;
  }
} else {

  const { error } =
    await supabase
      .from("decks")
      .insert([
{
      user_id: user.id,

      deck_name: deckName,
      nation: deckNation,

      ride_g3: rideG3?.id ?? null,
      ride_g2: rideG2?.id ?? null,
      ride_g1: rideG1?.id ?? null,
      ride_g0: rideG0?.id ?? null,
      ride_generator:
      rideGenerator?.id ?? null,

     main_deck: mainDeck,
     g_deck: gDeck,
     finisher_deck: finisherDeck
}
])

  if (error) {
    console.log(
      "DECK SAVE ERROR",
      error
    );
    return;
  }

}

  console.log(
    "DECK SAVED"
  );

  setDeckName("");

  setDeckName("");

await loadDecks();

setRideG3(null);
setRideG2(null);
setRideG1(null);
setRideG0(null);
setRideGenerator(null);

setMainDeck([]);
setGDeck([]);
setFinisherDeck([]);

setSelectedDeck(null);
setDeckNation("");

setDeckView("list");

  setDeckView("list");

};

const deleteDeck = async (
  deckId: number
) => {

  const ok = confirm(
    "このデッキを削除しますか？"
  );

  if (!ok) {
    return;
  }

  const {
  data,
  error
} = await supabase
  .from("decks")
  .delete()
  .eq("id", deckId)
  .select();

console.log(
  "DELETE DATA",
  data
);

console.log(
  "DELETE ERROR",
  error
);

console.log(
  "DELETE RESULT",
  error
);

if (error) {
  console.log(error);
  alert("削除失敗");
  return;
}

 alert("削除しました");

await loadDecks();

};

const copyDeck = async (
  deck: any
) => {

  const { error } =
    await supabase
      .from("decks")
      .insert({

        user_id:deck.user_id,

        deck_name: `${deck.deck_name}(コピー)`,

        nation:deck.nation,

        ride_g3:deck.ride_g3,

        ride_g2:deck.ride_g2,

        ride_g1:deck.ride_g1,

        ride_g0:deck.ride_g0,

        ride_generator:deck.ride_generator,

        main_deck:deck.main_deck,

        g_deck:deck.g_deck,

        finisher_deck: deck.finisher_deck  

      });

  if (error) {

    console.log(error);

    alert("コピー失敗");

    return;

  }

  alert("コピーしました");

  loadDecks();

};

const searchDeckCards = async () => {

  if (!cardSearch.trim()) {
    return;
  }

  const keyword = cardSearch.trim();

 let query = supabase
  .from("cards")
  .select(`
    *,
    products (
      sort_order
    )
  `)
  .eq("nation", deckNation)
  .or(`card_name.ilike.%${keyword}%,card_no.ilike.%${keyword}%`);
  if(searchCardType){query=query.eq("card_type",searchCardType);}

if (deckMode === "ride") {

  if (rideSelectMode === "g3") {
    query = query.eq("grade", 3);
  }

  if (rideSelectMode === "g2") {
    query = query.eq("grade", 2);
  }

  if (rideSelectMode === "g1") {
    query = query.eq("grade", 1);
  }

  if (rideSelectMode === "g0") {
    query = query.eq("grade", 0);
  }

}

if (deckMode === "gdeck") {
  query = query.eq(
    "card_type",
    "Gユニット"
  );
}

if(deckMode==="finisher"){
query=query.eq("card_type","必殺技");
}

if(searchParallel==="normal"){
  query=query.in(
    "rarity",
    allNormalRarities
  );
}

if(searchParallel==="parallel"){
  query=query.in(
    "rarity",
    allParallelRarities
  );
}

if (rideSelectMode === "generator") {

  const { data, error } =
    await supabase
      .from("cards")
      .select("*")
      .eq(
        "card_type",
        "ライドデッキクレスト"
      )
      .order("sort_order");

  if (error) {
    console.log(error);
    return;
  }

  setDeckSearchCards(data || []);
  return;
}

const cards = await loadAllCardsCache();

let data = filterDeckCards(
  cards,
  deckNation,
  searchCardType,
  "",
  "",
  searchParallel,
  keyword,
  false,
  "",
  deckMode
);
if (deckMode === "ride") {

  if (rideSelectMode === "g3") {
    data = data.filter(card => card.grade === 3);
  }

  if (rideSelectMode === "g2") {
    data = data.filter(card => card.grade === 2);
  }

  if (rideSelectMode === "g1") {
    data = data.filter(card => card.grade === 1);
  }

  if (rideSelectMode === "g0") {
    data = data.filter(card => card.grade === 0);
  }

}

if (deckMode === "gdeck") {
  data = data.filter(card => card.card_type === "Gユニット");
}

if (deckMode === "finisher") {
  data = data.filter(card => card.card_type === "必殺技");
}

  console.log(
  "MODE",
  rideSelectMode
);

console.log(
  "NATION",
  deckNation
);

console.log(
  "RESULT",
  data
);

if (data) {
 data.sort((a: any, b: any) => {

  const productA = a.products?.sort_order ?? 999999;
  const productB = b.products?.sort_order ?? 999999;

  if (productA !== productB) {
    return productA - productB;
  }

  return (a.sort_order ?? 0) - (b.sort_order ?? 0);

});

}
setDeckSearchCards(data);

};


const saveCollection = async (
  cardId: number,
  updates: any
) => {

  const { data, error } =
  await supabase
    .from("card_collection")
    .select("*")
    .eq("card_id", cardId)
    .eq("user_id", user?.id)
    .maybeSingle();

  if (!data) {

    const result = await supabase
      .from("card_collection")
      .insert({card_id: cardId,user_id: user?.id,...updates,});

  } else {

    const result = await supabase
      .from("card_collection")
      .update(updates)
　　　.eq("card_id", cardId)
　　　.eq("user_id", user?.id);

  }

  loadCollection(cardId);
};

const deleteCard = async (id: number) => {
  const ok = confirm("このカードを削除しますか？");

  if (!ok) return;

  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("削除失敗");
    return;
  }

  alert("削除成功");

  await resequenceCards();

await deleteCardsCache(Number(selectedProductId));
await deleteAllCardsCache();

loadCards(selectedProductId);
};

const moveCard = async (
  currentId: number,
  targetId: number,
  currentOrder: number,
  targetOrder: number
) => {
  await supabase
    .from("cards")
    .update({ sort_order: targetOrder })
    .eq("id", currentId);

  await supabase
    .from("cards")
    .update({ sort_order: currentOrder })
    .eq("id", targetId);

await deleteCardsCache(Number(selectedProductId));
await deleteAllCardsCache();

await loadCards(selectedProductId);
};

const saveDeckImage = async () => {
console.log(displayMainDeckGrouped[0]);
  const blob = await generateDeckImage({
  deckName,
  rideDeck: [
    rideG3,
    rideG2,
    rideG1,
    rideG0,
    rideGenerator,
  ].filter(Boolean),
  mainDeck: displayMainDeckGrouped,
  gDeck: gDeckGrouped,
  finisherDeck: finisherDeckGrouped,
});

const dataUrl = URL.createObjectURL(blob);

if (isIOS) {

  setPreviewImage(dataUrl);

} else {

  const link = document.createElement("a");

  link.download = `${deckName || "デッキ"}.png`;
  link.href = dataUrl;
  link.click();

  URL.revokeObjectURL(dataUrl);

}

};

const signUp = async () => {

  console.log("registrationApproval =", registrationApproval);

  const {
    data,
    error
  } = await supabase.auth.signUp({

    email: loginEmail,
    password: loginPassword,

  });

  if (error) {

    alert(error.message);
    return;

  }

  if (data.user) {

    await supabase
  .from("profiles")
  .insert([

    {
      id: data.user.id,
      email: data.user.email,
      role: "user",
      status: registrationApproval
        ? "pending"
        : "approved",
    },

  ]);

  }

  alert("登録申請を受け付けました");

};
const logout = async () => {

  await supabase.auth.signOut();

  setUser(null);

  alert("ログアウトしました");

};

const changePassword = async () => {

  if (!newPassword) {
    alert("新しいパスワードを入力してください");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("確認用パスワードが一致しません");
    return;
  }

  const { error } =
    await supabase.auth.updateUser({
      password: newPassword,
    });

  if (error) {
    alert(error.message);
    return;
  }

  alert("パスワードを変更しました");

  setNewPassword("");
  setConfirmPassword("");

};

const signIn = async () => {

   alert("signIn開始");

  const { error } =
    await supabase.auth.signInWithPassword({

      email: loginEmail,
      password: loginPassword,

    });

  if (error) {
    alert(error.message);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  setUser(user);

  const { data: profile } = await supabase
  .from("profiles")
  .select("status")
  .eq("id", user?.id)
  .single();

if (profile?.status === "pending") {

  await supabase.auth.signOut();

  setUser(null);

  alert("このアカウントは管理者の承認待ちです。");

  return;

}

  alert("ログイン成功");

};

const saveRegistrationSetting = async () => {
  const { data, error } = await supabase
  .from("settings")
  .update({
    registration_approval: registrationApproval,
  })
  .eq("id", 1)
  .select();

  if (error) {
    alert("保存失敗");
    console.log(error);
    return;
  }

  alert("登録受付設定を保存しました");

};

const approveUser = async (userId: string) => {

  const response = await fetch("/api/approve-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  });

  if (!response.ok) {
    alert("承認に失敗しました");
    return;
  }

  alert("承認しました");

  loadPendingUsers();

};

useEffect(() => {

  const getUser = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    const { data: setting } = await supabase
  .from("settings")
  .select("registration_approval")
  .eq("id", 1)
  .single();

if (setting) {
  setRegistrationApproval(setting.registration_approval);
}

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    setRole(data?.role || "");

  };

  getUser();

loadProducts();
loadAllRarities();
loadAllNations();
searchProductsByCard();
loadDecks();
loadPendingUsers();
}, []);

useEffect(() => {

const handleBack = () => {

 if (homeView === "detail") {

  if (previousTab === "favorite") {

  setActiveTab("favorite");
  setHomeView("products");
  setSelectedHomeCard(null);

  } else if (previousTab === "wanted") {

  setActiveTab("wanted");
  setHomeView("products");
  setSelectedHomeCard(null);

  } else {

    setHomeView("cards");
    setSelectedHomeCard(null);

  }

} else if (homeView === "cards") {

  if (isSearchResult) {

    setCards([]);
    setSelectedHomeProduct(null);
    setIsSearchResult(false);
    setHomeView("products");

  } else {

    setHomeView("products");
    setSelectedHomeProduct(null);

  }

}

};

  window.addEventListener(
    "popstate",
    handleBack
  );

  return () => {

    window.removeEventListener(
      "popstate",
      handleBack
    );

  };

}, [homeView, previousTab]);

useEffect(() => {

  const handleScroll = () => {

    const searchResult =
      document.getElementById(
        "search-result"
      );

    if (!searchResult) return;

    const rect =
      searchResult.getBoundingClientRect();

    setShowDeckButton(
      rect.top < window.innerHeight
    );

  };

  window.addEventListener(
    "scroll",
    handleScroll
  );

  handleScroll();

  return () => {

    window.removeEventListener(
      "scroll",
      handleScroll
    );

  };

}, []);

useEffect(() => {

  if (!user) {

    const protectedTabs = [
      "favorite",
      "wanted",
      "deck",
      "mypage",
      "manage",
    ];

    if (protectedTabs.includes(activeTab)) {
      setActiveTab("home");
    }

    return;
  }

  if (activeTab === "manage" && role !== "admin") {
    setActiveTab("home");
  }

}, [activeTab, user, role]);

useEffect(() => {

  setSearchCardType("");
  setSearchGrade("");
  setSearchRarity("");
  setSearchTrigger("");
  setSearchParallel("");

  loadNationCards(
    deckNation,
    "",
    "",
    "",
    "",
    "",
    includeNationless,
    ""
  );

}, [deckMode]);

/*
useEffect(() => {

  if (!showDeckModal) {
    setDeckImagesLoaded(false);
    return;
  }

  const cards = [
    rideG3,
    rideG2,
    rideG1,
    rideG0,
    rideGenerator,

    ...displayMainDeckGrouped.map((item: any) => item.card),

    ...gDeckGrouped.map((item: any) => item.card),

    ...finisherDeckGrouped.map((item: any) => item.card),
  ].filter(Boolean);

  Promise.all(
    cards.map(card => {
      return new Promise<void>((resolve) => {

        const img = new Image();

        img.onload = () => resolve();
        img.onerror = () => resolve();

        img.src = getCardImage(card);

      });
    })
  ).then(() => {

    setDeckImagesLoaded(true);

  });

}, [
  showDeckModal,
  rideG3,
  rideG2,
  rideG1,
  rideG0,
  rideGenerator,
  displayMainDeckGrouped,
  gDeckGrouped,
  finisherDeckGrouped,
]);
*/

const shopCardName =
  selectedHomeCard?.card_name || "";

const encodedCardName =
  encodeURIComponent(shopCardName);

const copyCardName = () => {

  navigator.clipboard.writeText(
    selectedHomeCard?.card_name || ""
  );

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 1000);

};

const displayDeckSearchCards = hideSameCard
  ? Array.from(

      deckSearchCards.reduce((map, card) => {

        const isIconCard =
          /【.*アイコン】/.test(card.card_text ?? "");

        const iconMatch =(card.card_text ?? "").match(/【(.+?アイコン)】/);

       const key =isIconCard? `icon-${iconMatch?.[1] ?? card.card_name}`: card.card_name;

       const current = map.get(key);

        if (!current) {
          map.set(key, card);
          return map;
        }
       
        const normalRarity =
        allNormalRarities.includes(card.rarity);

        const currentNormalRarity =
        allNormalRarities.includes(current.rarity);

        const currentOrder =
          current.products?.sort_order ?? 999999;

        const newOrder =
          card.products?.sort_order ?? 999999;

        if (normalRarity &&!currentNormalRarity) {map.set(key, card);}else if (normalRarity === currentNormalRarity &&newOrder > currentOrder) {
          map.set(key, card);
          }

        return map;

      }, new Map<string, any>()).values()

    )
  : deckSearchCards;

return (
  <main className="overflow-x-hidden">


{storageLoading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    <div className="bg-white rounded-lg shadow-lg p-6 w-[420px]">

      <div className="text-xl font-bold text-center">
        Cloudflare R2へ保存中
      </div>

      <div className="mt-4 text-center">
        {storageMessage}
      </div>

      <div className="mt-6 w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-3 bg-blue-500 transition-all duration-300"
          style={{
            width:
              storageProgress.total === 0
                ? "0%"
                : `${storageProgress.current / storageProgress.total * 100}%`,
          }}
        />
      </div>

      <div className="mt-3 text-center font-bold">
        {storageProgress.current} / {storageProgress.total}
      </div>

      <div className="mt-2 text-center text-sm text-gray-600 break-all">
        {storageProgress.currentCard}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        このまま画面を閉じないでください。
      </div>

    </div>

  </div>
)}
   <div className="w-full overflow-x-hidden">

<div className="bg-slate-900 text-white">
  <div
className="text-center py-3 text-2xl md:text-3xl font-bold cursor-pointer"
onClick={()=>{
window.location.reload();
}}
>
{APP_TITLE}
</div>
  {!user && (

  <div className="bg-gray-200 p-4 flex flex-col gap-2">

    <input
      type="email"
      placeholder="メールアドレス"
      value={loginEmail}
      onChange={(e) =>
        setLoginEmail(e.target.value)
      }
      className="border p-2 bg-white text-black"
    />

    <input
      type="password"
      placeholder="パスワード"
      value={loginPassword}
      onChange={(e) =>
        setLoginPassword(e.target.value)
      }
      className="border p-2 bg-white text-black"
    />

    <button
      onClick={signUp}
      className="border px-4 py-2 bg-white text-black"
    >
      新規登録
    </button>

   <button
  type="button"
  onClick={signIn}
  className="border px-4 py-2 bg-white text-black"
>
  ログイン
</button>

</div>
)}

{/*
{user && (

  <div className="bg-gray-200 p-4 flex flex-col md:flex-row gap-4 items-center">

    <div className="text-black text-center md:text-left break-all">
      ログイン中：
      {user.email}
    </div>

    <button
      onClick={logout}
      className="border px-4 py-2 bg-red-500 text-white w-full md:w-auto"
    >
      ログアウト
    </button>

  </div>

)}
*/}

{user && (
<div className="bg-slate-800 p-2">

<div className="hidden md:flex flex-wrap gap-2">

<button 　
onClick={() => { setActiveTab("home"); 
setHomeView("products");
setSelectedHomeProduct(null);
setSelectedHomeCard(null); }} 
className="bg-white text-black py-2 px-6 border hover:bg-gray-200" > 

カード一覧 
</button> 

<button 
onClick={() => { 
setActiveTab("favorite");
 setHomeView("products"); 
setSelectedHomeProduct(null);
 setSelectedHomeCard(null); 
loadFavoriteCards(); }} 
className="bg-white text-black py-2 px-6 border hover:bg-gray-200" > 

お気に入り 
</button>

<button
onClick={() => {
setActiveTab("wanted");
setHomeView("products");
setSelectedHomeProduct(null);
setSelectedHomeCard(null);
loadWantedCards();
}}
className="bg-white text-black py-2 px-6 border hover:bg-gray-200">

欲しいもの
</button>

<button
onClick={() => {
setActiveTab("deck");
setDeckView("list");
setHomeView("products");
setSelectedHomeProduct(null);
setSelectedHomeCard(null);
}}
className="bg-white text-black py-2 px-6 border hover:bg-gray-200">



デッキ
</button>

<button
onClick={() => {
window.open(
"https://cf-vanguard.com/cardlist/",
"_blank"
);
}}
className="bg-white text-black py-2 px-6 border hover:bg-gray-200">


公式
</button>

<button
onClick={() => {
setActiveTab("mypage");
setHomeView("products");
setSelectedHomeProduct(null);
setSelectedHomeCard(null);
}}
className="bg-white text-black py-2 px-6 border hover:bg-gray-200"
>
マイページ
</button>

{role === "admin" && (

<button
onClick={() => {
setActiveTab("manage");
setHomeView("products");
setSelectedHomeProduct(null);
setSelectedHomeCard(null);
}}
className="bg-white text-black py-2 px-6 border hover:bg-gray-200"
>
管理
</button>

)}
</div>


<div className="md:hidden">

<div className="grid grid-cols-3 gap-2">
<button
  　onClick={() => {
    setActiveTab("home");
    setHomeView("products");
    setSelectedHomeProduct(null);
    setSelectedHomeCard(null);
  }}
  className="bg-white text-black py-2 px-2 text-sm md:text-base whitespace-nowrap border hover:bg-gray-200">
  カード一覧
</button>
<button
  onClick={() => {
    setActiveTab("favorite");
    setHomeView("products");
    setSelectedHomeProduct(null);
    setSelectedHomeCard(null);
    loadFavoriteCards();
  }}
  className="bg-white text-black py-2 px-2 text-sm md:text-base whitespace-nowrap border hover:bg-gray-200">
  お気に入り
</button>

   <button
   onClick={() => {
    setActiveTab("wanted");
    setHomeView("products");
    setSelectedHomeProduct(null);
    setSelectedHomeCard(null);
    loadWantedCards();
}}
className="bg-white text-black py-2 px-2 text-sm md:text-base whitespace-nowrap border hover:bg-gray-200">
  欲しいもの
</button>
</div>

{role === "admin" ? (

<div className="flex gap-2 mt-2">

  <button
    onClick={() => {
      setActiveTab("deck");
      setDeckView("list");
      setHomeView("products");
      setSelectedHomeProduct(null);
      setSelectedHomeCard(null);
    }}
    className="bg-white text-black py-2 px-2 text-sm md:text-base whitespace-nowrap border hover:bg-gray-200"
  >
    　デッキ　
  </button>

  <button
    onClick={() => {
      window.open(
        "https://cf-vanguard.com/cardlist/",
        "_blank"
      );
    }}
    className="bg-white text-black py-2 px-2 text-sm md:text-base whitespace-nowrap border hover:bg-gray-200"
  >
    　公式　
  </button>

  <button
    onClick={() => {
      setActiveTab("mypage");
      setHomeView("products");
      setSelectedHomeProduct(null);
      setSelectedHomeCard(null);
    }}
    className="bg-white text-black py-2 px-2 text-sm md:text-base whitespace-nowrap border hover:bg-gray-200"
  >
     マイページ 
  </button>

  <button
    onClick={() => {
      setActiveTab("manage");
      setHomeView("products");
      setSelectedHomeProduct(null);
      setSelectedHomeCard(null);
    }}
    className="bg-white text-black py-2 px-2 text-sm md:text-base whitespace-nowrap border hover:bg-gray-200"
  >
    　管理　
  </button>

</div>

) : (

<div className="grid grid-cols-3 gap-2 mt-2">

  <button
    onClick={() => {
      setActiveTab("deck");
      setDeckView("list");
      setHomeView("products");
      setSelectedHomeProduct(null);
      setSelectedHomeCard(null);
    }}
    className="bg-white text-black py-2 px-2 text-sm md:text-base whitespace-nowrap border hover:bg-gray-200"
  >
    デッキ
  </button>

  <button
    onClick={() => {
      window.open(
        "https://cf-vanguard.com/cardlist/",
        "_blank"
      );
    }}
    className="bg-white text-black py-2 px-2 text-sm md:text-base whitespace-nowrap border hover:bg-gray-200"
  >
    公式
  </button>

  <button
    onClick={() => {
      setActiveTab("mypage");
      setHomeView("products");
      setSelectedHomeProduct(null);
      setSelectedHomeCard(null);
    }}
    className="bg-white text-black py-2 px-2 text-sm md:text-base whitespace-nowrap border hover:bg-gray-200"
  >
    マイページ
  </button>

</div>

)}
</div>

</div>
)}
</div>

<div className="p-1 md:p-6">
  
</div>

<div className="max-w-full px-4">

{user &&
activeTab === "favorite" && (

<div>

  <h2 className="text-3xl font-bold mb-6">
    お気に入り一覧
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-10 gap-4">

    {favoriteCards.map((item) => (
  <div
    key={item.id}
    className="border rounded p-3 bg-white cursor-pointer"
    onClick={() => {

  setPreviousTab("favorite");

  window.history.pushState(
    { view: "favorite-detail" },
    "",
    ""
  );
  setSelectedHomeCard(item.cards);
  loadCollection(item.cards.id);
  setHomeView("detail");
  setActiveTab("home");
  window.scrollTo({
  top: 0,
  behavior: "instant"
});

}}
  >
    {item.cards?.image_url && (
      <img
        src={getCardImage(item.cards)}
        alt=""
        className="w-full"
      />
    )}

    <div className="text-sm mt-1">
  所持：{item.owned_count || 0}
</div>

<div className="text-sm">
  不足：{item.shortage_count || 0}
</div>
  </div>
))}

  </div>

</div>

)}

{user &&
activeTab === "wanted" && (

<div>

  <h2 className="text-3xl font-bold mb-6">
    欲しいもの一覧
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-10 gap-4">

    {wantedCards.map((item) => (

      <div
        key={item.id}
        className="border rounded p-3 bg-white cursor-pointer"
        onClick={() => {

  setPreviousTab("wanted");

  window.history.pushState(
  { view: "wanted-detail" },
  "",
    ""
);
  setSelectedHomeCard(item.cards);
  loadCollection(item.cards.id);
  setHomeView("detail");
  setActiveTab("home");
　window.scrollTo({
  top: 0,
  behavior: "instant"
});
}}
      >

        {item.cards?.image_url && (
          <img
            src={getCardImage(item.cards)}
            alt=""
            className="w-full"
          />
        )}

        <div className="text-sm mt-1">
         所持：{item.owned_count || 0}
        </div>

        <div className="text-sm">
         不足：{item.shortage_count || 0}
        </div>

      </div>

    ))}

   </div>

</div>

)}

{user &&
activeTab === "deck" && (

<div>

  {deckView === "list" && (

    <>

      <h2 className="text-2xl md:text-4xl font-bold">
          デッキ一覧
      </h2>
      <div className="mb-4">

  <input
    type="text"
    value={deckSearch}
    onChange={(e) =>
      setDeckSearch(
        e.target.value
      )
    }
    placeholder="デッキ検索"
    className="
      border
      rounded
      p-3
      w-[300px]
    "
  />

</div>

      <button
  onClick={() => {

setSelectedDeck(null);
setDeckName("");
setDeckNation("");

setRideG3(null);
setRideG2(null);
setRideG1(null);
setRideG0(null);
setRideGenerator(null);

setMainDeck([]);
setGDeck([]);
setFinisherDeck([]);

setDeckView("edit");

  }}
className="bg-blue-500 text-white px-4 py-3 text-lg md:px-4 md:py-2 md:text-2xl rounded"
>
  ＋ 新規デッキ
</button>

<div className="mt-6 grid grid-cols-2 md:flex md:flex-wrap gap-4 w-full">

  {decks
  .filter((deck) =>
    deck.deck_name
      ?.toLowerCase()
      .includes(
        deckSearch.toLowerCase()
      )
  )
  .map((deck) => (

  <div
  key={deck.id}
  className="
relative
border
rounded
p-2
bg-white
cursor-pointer
hover:bg-gray-100

w-full
md:w-[320px]

flex
flex-col
md:flex-row

items-center
md:items-start

gap-2

h-[120px]
md:h-[150px]
"
    
onClick={async () => {

setCardSearch("");
setSearchCardType("");
setSearchGrade("");
setSearchRarity("");
setSearchTrigger("");
setSearchParallel("");

setSelectedDeck(deck);

setDeckName(
deck.deck_name
);

setSelectedDeck(deck);

setDeckNation(
deck.nation || ""
);
await loadNationCards(
deck.nation || "",
"",
"",
"",
"",
""
);

setTimeout(()=>{
loadNationCards(
deck.nation || ""
);
},0);


 // loadNationCards(
// deck.nation || ""
// );

const g3Card =
  await loadCardById(
    deck.ride_g3
  );

const g2Card =
  await loadCardById(
    deck.ride_g2
  );

const g1Card =
  await loadCardById(
    deck.ride_g1
  );

const g0Card =
  await loadCardById(
    deck.ride_g0
  );

const generatorCard =
  await loadCardById(
    deck.ride_generator
  );

setRideG3(
  g3Card
);

setRideG2(
  g2Card
);

setRideG1(
  g1Card
);

setRideG0(
  g0Card
);

setRideGenerator(
  generatorCard
);

const refreshedMainDeck = await refreshDeckCards(deck.main_deck || []);
const refreshedGDeck = await refreshDeckCards(deck.g_deck || []);
const refreshedFinisherDeck = await refreshDeckCards(deck.finisher_deck || []);

setMainDeck(refreshedMainDeck);
setGDeck(refreshedGDeck);
setFinisherDeck(refreshedFinisherDeck);

setDeckView("edit");

}}
  >

  <div className="flex gap-4 w-full">

  <img
    src={deckRideG3Images[deck.id]}
    alt=""
    className="
      w-[70px]
      h-[95px]
      md:w-[90px]
      md:h-[120px]
      object-cover
      border
      rounded
      shrink-0
    "
  />

  <div className="flex-1">

    <div
className="
  font-bold
  text-xs
  md:text-xl
  break-words
  leading-tight
"
>
  {deck.deck_name}
</div>

  </div>

</div>

<button
  onClick={(e) => {

    e.stopPropagation();

    copyDeck(deck);

  }}
  className="
  absolute
  bottom-2
  md:bottom-3
  right-12
  text-blue-500
  text-lg
  font-bold
"
>
  ⧉
</button>

<button
  onClick={(e) => {

    e.stopPropagation();

    deleteDeck(deck.id);

  }}
  className="
  absolute
  bottom-2
  md:bottom-3
  right-4
  text-red-500
  text-xl
  font-bold
"
>
  ×
</button>

  </div>

))}

</div>

    </>

  )}

  {deckView === "edit" && (

    <>
<div className="flex flex-col md:flex-row gap-6 items-start">

<div className="flex-1">

  <div className="flex flex-row gap-3 mb-6 items-center flex-wrap">

        <input
          className="border p-3 w-full md:w-[300px]"
          placeholder="デッキ名"
          value={deckName}
          onChange={(e) =>
            setDeckName(e.target.value)
          }
        />

<button
  onClick={saveDeck}
  className="bg-green-600 text-white w-[80px] h-[50px] rounded shrink-0"
>
  保存
</button>

<button
  onClick={() => {
    setDeckView("list");
  }}
  className="bg-gray-500 text-white w-[70px] h-[50px] rounded shrink-0"
>
  戻る
</button>

</div>

      <div className="mb-6">

        <div className="font-bold mb-2">
          国家選択
        </div>

        <select
          className="border p-3 w-[300px]"
          value={deckNation}
          onChange={(e)=>{
　　　　　setDeckNation(e.target.value);
　　　　　loadNationCards(e.target.value);}}
        >

          <option value="">
            国家を選択
          </option>

          {nationList.map(
            (nation) => (

              <option
                key={nation}
                value={nation}
              >
                {nation}
              </option>

            )
          )}

        </select>
        <div className="mt-2 mb-4 flex items-center gap-2">
  <input
  type="checkbox"
  id="includeNationless"
  checked={includeNationless}
  onChange={(e) => {
    const checked = e.target.checked;

    setIncludeNationless(checked);

    loadNationCards(
      deckNation,
      searchCardType,
      searchGrade,
      searchRarity,
      searchParallel,
      cardSearch,
      checked
    );
  }}
/>

<label
    htmlFor="includeNationless"
    className="cursor-pointer"
  >
    無国家も表示
  </label>
<label className="flex items-center gap-2 mt-2">

<input
type="checkbox"
checked={hideSameCard}
onChange={(e)=>{
setHideSameCard(e.target.checked);
}}
/>
同名カードを非表示
</label>


</div>

</div>


<div className="mb-4">

  <div className="font-bold mb-2">
    デッキ選択
  </div>

  <div className="flex gap-2">

<button
onClick={() => {

setDeckMode("ride");
setRideSelectMode(null);
setCardSearch("");


}}
className={`border px-4 py-2 ${
deckMode==="ride"
? "bg-blue-500 text-white"
: "bg-white"
}`}
>
ライドデッキ
</button>

<button
onClick={() => {

setDeckMode("main");
setCardSearch("");

}}
className={`border px-2 py-2 border rounded text-sm ${
  deckMode === "main"
    ? "bg-blue-500 text-white"
    : "bg-white"
}`}
>
  メインデッキ
</button>

<button
onClick={() => {

setDeckMode("gdeck");
setCardSearch("");

}}
className={`border px-2 py-2 border rounded text-sm ${
deckMode === "gdeck"
? "bg-blue-500 text-white"
: "bg-white"
}`}
>
Gデッキ
</button>

<button
onClick={() => {

setDeckMode("finisher");
setCardSearch("");

}}
className={`border px-4 py-2 ${
deckMode==="finisher"
? "bg-blue-500 text-white"
: ""
}`}
>
必殺技デッキ
</button>

</div>

</div>



{deckMode === "ride" && (

<div className="mb-6">

<div className="font-bold mb-2">
    ライドデッキ
  </div>

  <div className="flex gap-2 flex-wrap">

    <div
  onClick={() => {

  setRideSelectMode("g3");

  loadNationCards(
    deckNation,
    "",
    "3",
    "",
    "",
    ""
  );

}}
  className={`border rounded w-[55px] h-[45px] overflow-hidden cursor-pointer ${
   rideSelectMode === "g3"
  ? "bg-yellow-300"
  : "bg-white"
  }`}
>

  <div
  className="
    w-full
    h-full
    flex
    items-center
    justify-center
    font-bold
  "
>
  G3
</div>
</div>

    <div
 onClick={() => {

  setRideSelectMode("g2");

  loadNationCards(
    deckNation,
    "",
    "2",
    "",
    "",
    ""
  );

}}
  className={`border rounded w-[55px] h-[45px] overflow-hidden cursor-pointer ${
    rideSelectMode === "g2"
  ? "bg-yellow-300"
  : "bg-white"
  }`}
>
  <div
  className="
    w-full
    h-full
    flex
    items-center
    justify-center
    font-bold
  "
>
  G2
</div>
</div>

   <div
  onClick={() => {

  setRideSelectMode("g1");

  loadNationCards(
    deckNation,
    "",
    "1",
    "",
    "",
    ""
  );

}}
  className={`border rounded w-[55px] h-[45px] overflow-hidden cursor-pointer ${
    rideSelectMode === "g1"
  ? "bg-yellow-300"
  : "bg-white"
  }`}
>
  <div
  className="
    w-full
    h-full
    flex
    items-center
    justify-center
    font-bold
  "
>
  G1
</div>
</div>

    <div
  onClick={() => {

  setRideSelectMode("g0");

  loadNationCards(
    deckNation,
    "",
    "0",
    "",
    "",
    ""
  );

}}
  className={`border rounded w-[55px] h-[45px] overflow-hidden cursor-pointer ${
    rideSelectMode === "g0"
  ? "bg-yellow-300"
  : "bg-white"
  }`}
>
  <div
  className="
    w-full
    h-full
    flex
    items-center
    justify-center
    font-bold
  "
>
  G0
</div>
</div>

    <div
 onClick={async () => {

setRideSelectMode("generator");

const { data,error } =
await supabase
.from("cards")
.select("*")
.eq(
  "card_type",
  "ライドデッキクレスト"
)
.order("sort_order");

if(error){
  console.log(error);
  return;
}

setDeckSearchCards(
  data || []
);

}}
  className={`border rounded w-[55px] h-[45px] overflow-hidden cursor-pointer ${
    rideSelectMode === "generator"
  ? "bg-yellow-300"
  : "bg-white"
  }`}
>

  <div
  className="
    w-full
    h-full
    flex
    items-center
    justify-center
    font-bold
  "
>
  GEN
</div>

</div>

<div className="mb-4 text-blue-600 font-bold">

  {rideSelectMode === "g3" &&
    "G3選択中"}

  {rideSelectMode === "g2" &&
    "G2選択中"}

  {rideSelectMode === "g1" &&
    "G1選択中"}

  {rideSelectMode === "g0" &&
    "G0選択中"}

  {rideSelectMode ===
    "generator" &&
    "ジェネレーター選択中"}

</div>

   </div>

</div>

)}

<div className="flex flex-col md:flex-row gap-4"></div>

<div className="flex-1">

<div className="flex flex-wrap gap-2">

  <input
type="text"
value={cardSearch}
onChange={(e)=>{
const value=e.target.value;
setCardSearch(value);

loadNationCards(
deckNation,
searchCardType,
searchGrade,
searchRarity,
searchParallel,
value
);
}}

placeholder="カード検索"
className="flex-1 border p-2"
/>

  <button
    onClick={() => {

      setCardSearch("");

      setDeckSearchCards([]);

    }}
    className="bg-red-500 text-white px-4 rounded"
  >
    ×
  </button>

  <button
    onClick={searchDeckCards}
    className="bg-blue-500 text-white px-6"
  >
    検索
  </button>

</div>

<div className="flex gap-4 mt-4 flex-wrap">

<select value={searchCardType}onChange={(e)=>{const value = e.target.value;setSearchCardType(value);loadNationCards(deckNation,value,searchGrade,searchRarity,searchParallel,cardSearch,includeNationless);}}className="border p-2 w-[165px]">
<option value="">カードタイプ</option>
<option value="ノーマルユニット">ノーマルユニット</option>
<option value="トリガーユニット">トリガーユニット</option>
<option value="Gユニット">Gユニット</option>
<option value="ノーマルオーダー">ノーマルオーダー</option>
<option value="ブリッツオーダー">ブリッツオーダー</option>
<option value="セットオーダー">セットオーダー</option>
<option value="トリガーオーダー">トリガーオーダー</option>
<option value="ライドデッキクレスト">ライドデッキクレスト</option>
<option value="必殺技">必殺技</option>
<option value="その他">その他</option>
</select>

<select value={searchGrade} onChange={(e)=>{const value=e.target.value;setSearchGrade(value);loadNationCards(deckNation,searchCardType,value);}}
className="border p-2 w-[120px]">
<option value="">グレード</option>
<option value="0">G0</option>
<option value="1">G1</option>
<option value="2">G2</option>
<option value="3">G3</option>
<option value="4">G4</option>
<option value="5">G5以上</option>
</select>

<select value={searchRarity} onChange={(e)=>{const value=e.target.value;setSearchRarity(value);loadNationCards(deckNation,searchCardType,searchGrade,value);}} 
className="border p-2 w-[140px]">
<option value="">レアリティ</option>
{rarityList.map((r)=>(
<option key={r} value={r}>{r}</option>
))}
</select>

<select
value={searchTrigger}
onChange={(e)=>{

const value = e.target.value;

setSearchTrigger(value);

loadNationCards(
  deckNation,
  searchCardType,
  searchGrade,
  searchRarity,
  searchParallel,
  cardSearch,
  includeNationless,
  value
);

}}
className="border p-2 w-[140px]"
>

<option value="">トリガー</option>

<option value="クリティカルトリガー＋10000">
クリティカル
</option>

<option value="ドロートリガー＋10000">
ドロー
</option>

<option value="フロントトリガー＋10000">
フロント
</option>

<option value="ヒールトリガー＋10000">
ヒール
</option>

<option value="オーバートリガー＋100000000">
オーバー
</option>

<option value="スタンドトリガー＋10000">
スタンド
</option>

</select>

<select value={searchParallel} onChange={(e)=>{const value=e.target.value;setSearchParallel(value);loadNationCards(deckNation,searchCardType,searchGrade,searchRarity,value);}} 
className="border p-2 w-[140px]">
<option value="">表示</option>
<option value="normal">通常</option>
<option value="parallel">パラレル</option>
</select>

<button
onClick={resetDeckFilters}
className="bg-gray-500 text-white px-4 rounded"
>
リセット
</button>

</div>

<div className="border-t mt-4 pt-4">

{/* デッキ作成検索表示 */}
<div
  id="search-result"
  className="font-bold text-xl mb-2"
>
  検索結果
</div>

</div>

  <div
className="
mt-4
flex
flex-wrap
items-start
content-start
justify-start
gap-2

h-[900px]
overflow-y-auto

md:h-[780px]
md:overflow-y-auto
"
>



{displayDeckSearchCards.map(
(card) => (

    <div
      key={card.id}
      className="w-[100px] cursor-pointer hover:opacity-80"
      onClick={() => {

        if (rideSelectMode === "g3") {
            setRideG3(card);
            setRideSelectMode(null);
         }

        if (rideSelectMode === "g2") {
           setRideG2(card);
           setRideSelectMode(null);
         }

        if (rideSelectMode === "g1") {
          setRideG1(card);
          setRideSelectMode(null);
         }  

        if (rideSelectMode === "g0") {
          setRideG0(card);
          setRideSelectMode(null);
         }

        if (rideSelectMode === "generator") {
          setRideGenerator(card);
          setRideSelectMode(null);
         }

       if (deckMode === "main") {
        addToMainDeck(card);
}

       if (deckMode === "gdeck") {
        addToGDeck(card);  
}

      if (deckMode === "finisher") {
        addToFinisherDeck(card);
}

      }}
    >



<div className="relative">

<button
onClick={(e)=>{
e.stopPropagation();
setZoomCard(card);
}}
className="
absolute
top-1
right-1
z-10
bg-black/70
text-white
w-6
h-6
rounded
text-xs
"
>
🔍
</button>

<img
  src={getCardImage(card)}
  alt={card.card_name}
  className="w-full h-[140px] object-contain border"
/>

<div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 bg-black/70 text-white font-bold">

<button
onClick={(e)=>{
e.stopPropagation();

if(deckMode==="main"){
removeFromMainDeck(card.card_no);
}

if(deckMode==="gdeck"){
removeFromGDeck(card.card_no);
}

if(deckMode==="finisher"){
removeFromFinisherDeck(card.card_no);
}
}}
>
-
</button>

<span>
{deckMode==="gdeck"
? getGDeckCount(card)
: deckMode==="finisher"
? getFinisherDeckCount(card)
: getDeckCount(card)
}
</span>

<button
onClick={(e)=>{
e.stopPropagation();

if(deckMode==="main"){
addToMainDeck(card);
}

if(deckMode==="gdeck"){
addToGDeck(card);
}

if(deckMode==="finisher"){
addToFinisherDeck(card);
}
}}
>
+
</button>

</div>

</div>

</div>

 ))}

</div>

</div>

</div>

<div ref={deckImageRef}className="hidden md:block border rounded p-4 bg-white w-[1050px]">


<div className="flex justify-between items-center mb-4">

<div className={`font-bold text-xl ${savingDeckImage ? "mb-2" : "mb-4"}`}>
  {savingDeckImage ? deckName : "デッキ内容"}
</div>

{!savingDeckImage && (
  <button
    onClick={saveDeckImage}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    デッキ画像保存
  </button>
)}
</div>

  <div className="font-bold mb-2">
    ライドデッキ
  </div>

  <div className={`flex gap-2 ${savingDeckImage ? "mb-2" : "mb-4"}`}>

    {rideG3 && (
      <img
        src={getCardImage(rideG3)}
        alt=""
        className="w-[120px] border rounded"
      />
    )}

    {rideG2 && (
      <img
        src={getCardImage(rideG2)}
        alt=""
        className="w-[120px] border rounded"
      />
    )}

    {rideG1 && (
      <img
        src={getCardImage(rideG1)}
        alt=""
        className="w-[120px] border rounded"
      />
    )}

    {rideG0 && (
      <img
        src={getCardImage(rideG0)}
        alt=""
        className="w-[120px] border rounded"
      />
    )}

    {rideGenerator && (
  <img
    src={getCardImage(rideGenerator)}
    alt=""
    className="h-[150px] w-auto border rounded object-contain"
  />
)}

  </div>

  <div
  className={`font-bold mb-2 ${
    savingDeckImage
      ? ""
      : mainDeck.length > 50
      ? "text-red-600"
      : mainDeck.length === 50
      ? "text-green-600"
      : ""
  }`}
>
  メインデッキ ({mainDeck.length}/50)
</div>

 <div className={`flex gap-2 flex-wrap ${savingDeckImage ? "mb-2" : "mb-4"}`}>

  {displayMainDeckGrouped.map((item:any)=>(

    <div
      key={item.card.id}
      className="w-[120px] relative"
    >
      
      <img
        src={getCardImage(item.card)}
        alt=""
        className="w-full border rounded"
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          bg-black/70
          text-white
          text-sm
          flex
          items-center
          justify-between
          px-1
        "
      >

      {!savingDeckImage && (
  <button
    className="px-1 font-bold"
    onClick={() =>
      removeFromMainDeck(
        item.card.card_no
      )
    }
  >
    −
  </button>
)}

{savingDeckImage ? (
  <span
    className="
      absolute
      bottom-1
      right-1
      bg-black/80
      text-white
      rounded
      px-2
      py-1
      text-lg
      font-bold
      leading-none
    "
  >
    {item.count}
  </span>
) : (
  <span>{item.count}</span>
)}
      {!savingDeckImage && (
  <button
    className="px-1 font-bold"
    onClick={() =>
      addToMainDeck(
        item.card
      )
    }
  >
    ＋
  </button>
)}
      </div>

    </div>

  ))}

</div>

 {(!savingDeckImage || gDeck.length > 0) && (
  <div
    className={`font-bold mb-2 ${
      savingDeckImage
        ? ""
        : gDeck.length > 16
        ? "text-red-600"
        : "text-green-600"
    }`}
  >
    Gデッキ ({gDeck.length}/16)
  </div>
)}

  <div className="flex gap-2 flex-wrap">

  {gDeckGrouped.map((item: any) => (

    <div
      key={item.card.id}
      className="w-[120px] relative"
    >

      <img
        src={getCardImage(item.card)}
        alt=""
        className="w-full border rounded"
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          bg-black/70
          text-white
          text-sm
          flex
          items-center
          justify-between
          px-1
        "
      >

       <button
  className="px-1 font-bold"
  onClick={() => {

    console.log(
"G MINUS",
item.card.card_no
);

    removeFromGDeck(
item.card.card_no
);

  }}
>
  −
</button>

 {savingDeckImage ? (
  <span
    className="
      absolute
      bottom-1
      right-1
      bg-black/80
      text-white
      rounded
      px-2
      py-1
      text-lg
      font-bold
      leading-none
      z-20
    "
  >
    ×{item.count}
  </span>
) : (
  <span>{item.count}</span>
)}

        <button
  className="px-1 font-bold"
  onClick={() => {

    console.log(
      "G PLUS",
      item.card.card_name
    );

    addToGDeck(
      item.card
    );

  }}
>
  ＋
</button>

</div>

</div>

 ))}

</div>

{(!savingDeckImage || finisherDeck.length > 0) && (
  <div
    className={`font-bold mb-2 ${
      savingDeckImage
        ? ""
        : finisherDeck.length > 16
        ? "text-red-600"
        : finisherDeck.length === 16
        ? "text-green-600"
        : ""
    }`}
  >
    必殺技デッキ ({finisherDeck.length}/16)
  </div>
)}

<div className="flex gap-2 flex-wrap">

  {finisherDeckGrouped.map((item:any)=>(

<div key={item.card.id} className="w-[120px] relative">
<img src={getCardImage(item.card)} alt="" className="w-full border rounded"/>
<div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm flex items-center justify-between px-1">
<button className="px-1 font-bold" onClick={() => removeFromFinisherDeck(item.card.card_no)}>−</button>
<span>{item.count}</span>
<button className="px-1 font-bold" onClick={() => addToFinisherDeck(item.card)}>＋</button>
</div>

<div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm flex items-center justify-between px-1">

<button
className="px-1 font-bold"
onClick={()=>removeFromFinisherDeck(item.card.card_no)}
>
−
</button>

{savingDeckImage ? (
  <span
    className="
      absolute
      bottom-1
      right-1
      bg-black/80
      text-white
      rounded
      px-2
      py-1
      text-lg
      font-bold
      leading-none
      z-20
    "
  >
    ×{item.count}
  </span>
) : (
  <span>{item.count}</span>
)}

<button
className="px-1 font-bold"
onClick={()=>addToFinisherDeck(item.card)}
>
＋
</button>

</div>

</div>

  ))}

</div>

</div>

</div>

{/* スマホ用デッキボタン */}
{showDeckButton && (

<button
  onClick={() => setShowDeckModal(true)}
  className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white border-2 border-black px-6 py-2 rounded font-bold md:hidden z-50"
>

  <div className="text-base text-center">
  デッキ
</div>

<div className="text-sm text-center">
  {mainDeck.length}/50 ・ {gDeck.length}/16
</div>

</button>

)}

{showDeckModal && (

<div className="fixed inset-0 bg-black/50 z-[60] md:hidden">

<div ref={deckImageRef} className="absolute inset-1 bg-white rounded p-2 overflow-y-auto">

<button
  onClick={() => setShowDeckModal(false)}
  className={`absolute top-2 right-3 text-3xl font-bold ${
    savingDeckImage ? "hidden" : ""
  }`}
>
      ×
    </button>

    <div
  className={`flex justify-center mb-4 mt-10 ${
    savingDeckImage ? "hidden" : ""
  }`}
>
  <button
    onClick={saveDeckImage}
    className="bg-green-600 text-white px-6 py-2 rounded font-bold"
  >
    デッキ画像保存
  </button>
</div>

<div className="text-2xl font-bold mb-4">

  {savingDeckImage ? deckName : "デッキ内容"}

</div>
    
<div className="font-bold mb-2">
  ライドデッキ
</div>

<div className="flex justify-between mb-4">

  {rideG3 && (
    <img
      src={getCardImage(rideG3)}
      alt=""
      className="w-[19%] border rounded"
    />
  )}

  {rideG2 && (
    <img
      src={getCardImage(rideG2)}
      alt=""
      className="w-[19%] border rounded"
    />
  )}

  {rideG1 && (
    <img
      src={getCardImage(rideG1)}
      alt=""
      className="w-[19%] border rounded"
    />
  )}

  {rideG0 && (
    <img
      src={getCardImage(rideG0)}
      alt=""
      className="w-[19%] border rounded"
    />
  )}

  {rideGenerator && (
    <img
      src={getCardImage(rideGenerator)}
      alt=""
      className="w-[19%] border rounded"
    />
  )}

</div>
<div
className={`font-bold mb-2 ${
mainDeck.length > 50
? "text-red-600"
: mainDeck.length === 50
? "text-green-600"
: ""
}`}
>
メインデッキ ({mainDeck.length}/50)
</div>

<div className="flex flex-wrap gap-1 mb-4">

{displayMainDeckGrouped.map((item:any)=>(

<div
key={item.card.id}
className="w-[19%] relative"
>

<img
  src={getCardImage(item.card)}
  alt=""
  className="w-full border rounded"
  loading="eager"
  decoding="sync"
/>

<div
  className={`absolute bottom-0 left-0 right-0 bg-black/70 text-white text-lg flex items-center justify-between px-1 ${
    savingDeckImage ? "hidden" : ""
  }`}
>

 <button className="text-2xl font-bold px-1 leading-none" onClick={() => removeFromMainDeck(item.card.card_no)}>
  −
</button>

  <span>
    {item.count}
  </span>

  <button className="text-2xl font-bold px-1 leading-none" onClick={() => addToMainDeck(item.card)}>
  ＋
</button>

</div>

{savingDeckImage && (
  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-lg font-bold rounded px-2 py-1">
    ×{item.count}
  </div>
)}

</div>

))}

</div>

<div
className={`font-bold mb-2 ${
gDeck.length > 16
? "text-red-600"
: "text-green-600"
}`}
>
Gデッキ ({gDeck.length}/16)
</div>

<div className="flex flex-wrap gap-1">

{gDeckGrouped.map((item:any) => (

<div
key={item.card.id}
className="w-[19%] relative"
>

<img
src={getCardImage(item.card)}
alt=""
className="w-full border rounded"
/>

<div
  className={`absolute bottom-0 left-0 right-0 bg-black/70 text-white text-lg flex items-center justify-between px-1 ${
    savingDeckImage ? "hidden" : ""
  }`}
>

<button className="text-2xl font-bold leading-none" onClick={() => removeFromGDeck(item.card.card_no)}>−</button>
<span>{item.count}</span>
<button className="text-2xl font-bold leading-none" onClick={() => addToGDeck(item.card)}>＋</button>
</div>
{savingDeckImage && (
  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-lg font-bold rounded px-2 py-1">
    ×{item.count}
  </div>
)}
</div>

))}

</div>

<div
className={`font-bold mb-2 ${
finisherDeck.length > 16
? "text-red-600"
: finisherDeck.length === 16
? "text-green-600"
: ""
}`}
>
必殺技デッキ ({finisherDeck.length}/16)
</div>

<div className="flex flex-wrap gap-1">

{finisherDeckGrouped.map((item:any)=>(

<div key={item.card.id} className="w-[19%] relative">
<img src={getCardImage(item.card)} alt="" className="w-full border rounded"/>

<div
  className={`
    absolute
    bottom-0
    left-0
    right-0
    bg-black/70
    text-white
    text-lg
    flex
    items-center
    justify-between
    px-1
    ${savingDeckImage ? "hidden" : ""}
  `}
>

<button
className="text-2xl font-bold leading-none"
onClick={()=>removeFromFinisherDeck(item.card.card_no)}
>
−
</button>

<span>{item.count}</span>

<button
className="text-2xl font-bold leading-none"
onClick={()=>addToFinisherDeck(item.card)}
>
＋
</button>

</div>

{savingDeckImage && (
  <div
    className="absolute bottom-1 right-1 bg-black/80 text-white text-lg font-bold rounded px-2 py-1"
  >
    ×{item.count}
  </div>
)}

</div>

))}

</div>

</div>


</div>

)}

 </>

 )}

</div>

)}

{user && activeTab === "home" && (

<>

{homeView === "products" && (
<>

<div className="w-full">

<div className="flex flex-col md:flex-row gap-2 mb-3">

  <input
    className="border p-3 w-full md:w-[500px]"
    placeholder="カード検索"
    value={cardSearch}
    onChange={(e) => setCardSearch(e.target.value)}
  />

<button
  className="border px-6 py-3 bg-blue-500 text-white w-full md:w-auto"
  onClick={() => {
    searchCards();
  }}
>
  検索
</button>

</div>

<div className="flex gap-4 mt-4 flex-wrap">


<select value={searchNation}onChange={(e)=>setSearchNation(e.target.value)}className="border p-2 w-[170px]">
<option value="">
国家
</option>

{nationList.map((nation)=>(

<option
key={nation}
value={nation}
>
{nation}
</option>

))}

</select>

<select value={homeCardType}onChange={(e)=>setHomeCardType(e.target.value)}className="border p-2 w-[165px]">  
<option value="">カードタイプ</option>
<option value="ノーマルユニット">ノーマルユニット</option>
<option value="トリガーユニット">トリガーユニット</option>
<option value="Gユニット">Gユニット</option>
<option value="ノーマルオーダー">ノーマルオーダー</option>
<option value="ブリッツオーダー">ブリッツオーダー</option>
<option value="セットオーダー">セットオーダー</option>
<option value="トリガーオーダー">トリガーオーダー</option>
<option value="ライドデッキクレスト">ライドデッキクレスト</option>
<option value="必殺技">必殺技</option>
<option value="その他">その他</option>
</select>

<select
value={homeGrade}
onChange={(e)=>setHomeGrade(e.target.value)}
className="border p-2 w-[120px]"
>
<option value="">グレード</option>
<option value="0">G0</option>
<option value="1">G1</option>
<option value="2">G2</option>
<option value="3">G3</option>
<option value="4">G4</option>
<option value="5">G5以上</option>
</select>

<select
value={homeRarity}
onChange={(e)=>setHomeRarity(e.target.value)}
className="border p-2 w-[140px]"
>
<option value="">レアリティ</option>

{rarityList.map((r)=>(
<option key={r} value={r}>
{r}
</option>
))}

</select>

<select
value={homeTrigger}
onChange={(e)=>setHomeTrigger(e.target.value)}
className="border p-2 w-[140px]"
>
<option value="">トリガー</option>

<option value="クリティカルトリガー＋10000">
クリティカル
</option>

<option value="ドロートリガー＋10000">
ドロー
</option>

<option value="フロントトリガー＋10000">
フロント
</option>

<option value="ヒールトリガー＋10000">
ヒール
</option>

<option value="オーバートリガー＋100000000">
オーバー
</option>

<option value="スタンドトリガー＋10000">
スタンド
</option>

</select>


<button
  className="bg-gray-500 text-white px-4 rounded"
  onClick={() => {
    setCardSearch("");
    setSearchNation("");
    setHomeCardType("");
    setHomeGrade("");
    setHomeRarity("");
    setHomeTrigger("");
  }}
>
  リセット
</button>

</div>

<div className="grid grid-cols-2 md:grid-cols-10 gap-4 mt-6">

  {products
.filter((product) => {

  const searchMatch =
    homeSearch === "" ||

    product.product_code
      ?.toLowerCase()
      .includes(
        homeSearch.toLowerCase()
      ) ||

    product.product_name
      ?.toLowerCase()
      .includes(
        homeSearch.toLowerCase()
      );

    return searchMatch;
})
.map((product) => (

<div
key={product.id}
className="border rounded p-3 bg-white cursor-pointer hover:bg-gray-100 w-full"
onClick={() => {
  window.history.pushState(
    { view: "cards" },
    "",
    "#cards"
  );

  window.scrollTo({
    top: 0,
    behavior: "auto",
  });

  setSelectedHomeProduct(product);
  setIsSearchResult(false);
  setRarityView("all");
  setHomeView("cards");
  loadCards(product.id);
}}
          >
            <div className="font-bold text-lg md:text-xl">
              {product.product_code}
            </div>

            <div className="mt-2">
              {product.product_name}
            </div>
          </div>

        ))}

    </div>


</div>
<div className="-mx-4 mt-10 border-t bg-gray-200 pt-6 px-4 pb-6 text-sm text-gray-800 leading-7">
  <p>
    当サイトに利用しているカード画像等は、
    カードファイト!! ヴァンガード公式ポータルサイト
    （https://cf-vanguard.com/）より、
    ガイドラインに従って転載しております。
  </p>

  <p className="mt-2">
    該当画像の再利用（転載・配布等）は禁止しております。
  </p>

  <p className="mt-2">
    ©bushiroad All Rights Reserved.
  </p>
</div>
</>

)}

</>

)}

{homeView === "cards" && (
<>
  <button
    onClick={() => {
     setRarityView("all");
     setHomeView("products");
     setSelectedHomeProduct(null);
}}
    className="hidden md:inline-block border px-4 py-2 mb-4"
  >
    戻る
  </button>

  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">

  <h2 className="text-xl md:text-3xl font-bold">
    {selectedHomeProduct?.product_code}
    {" "}
    {selectedHomeProduct?.product_name}
  </h2>

  <div className="flex flex-wrap gap-2">

    <button
      className="border px-4 py-2"
      onClick={() => setRarityView("all")}
    >
      全て
    </button>

    <button
      className="border px-4 py-2"
      onClick={() => setRarityView("normal")}
    >
      通常レアリティ
    </button>

    <button
      className="border px-4 py-2"
      onClick={() => setRarityView("parallel")}
    >
      パラレル
    </button>

  </div>

</div>
  <div className="grid grid-cols-2 md:grid-cols-10 gap-2">
  {cards
    .filter((card) => {


  if (rarityView === "all") {
    return true;
  }
      const normalList =
  card.products?.normal_rarity
    ?.split(",")
    .map((r: string) => r.trim()) || [];

const parallelList =
  card.products?.parallel_rarity
    ?.split(",")
    .map((r: string) => r.trim()) || [];

      if (rarityView === "normal") {
        return normalList.includes(card.rarity);
      }

      if (rarityView === "parallel") {
        return parallelList.includes(card.rarity);
      }

      return true;
    })
    .map((card) => (
    <div
      key={card.id}
      className="border rounded p-2 md:p-3 w-full bg-white cursor-pointer hover:bg-gray-100"
      onClick={() => {
      window.history.pushState(
       { view: "detail" },
       "",
       "#detail"
     );
       setPreviousTab("");
       setSelectedHomeCard(card);
       loadCollection(card.id);
       setHomeView("detail");
       window.scrollTo({
       top: 0,
       behavior: "instant"
});
}}
>
      {getCardImage(card) ? (
  <div className="aspect-[63/88] flex items-center justify-center mb-2">
  <img
    src={getCardImage(card)}
    alt={card.card_name}
    className="max-w-full max-h-full"
  />
</div>
) : (
  <div className="w-full h-[300px] border flex items-center justify-center">
    No Image
  </div>
)}

      <div className="font-bold text-xs md:text-base">
        {card.card_name}
      </div>

      <div className="text-xs md:text-sm">
       所持：
        {card.card_collection?.[0]?.owned_count || 0}

  {" / "}

       不足：
        {card.card_collection?.[0]?.shortage_count || 0}
      </div>
    </div>
  ))}
</div>

<FloatingBackButton
  onClick={() => {
    setRarityView("all");
if (isSearchResult) {
  setCards([]);
  setSelectedHomeProduct(null);
  setIsSearchResult(false);
  setHomeView("products");
   } else {
      setHomeView("products");
      setSelectedHomeProduct(null);
    }

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }}
/>

</>
)}

{homeView === "detail" && (
<>
  <button
    onClick={() => {
      setHomeView("cards");
      setSelectedHomeCard(null);
    }}
    className="hidden md:inline-block border px-4 py-2 mb-4"
  >
    戻る
  </button>

  <h1
  className="text-2xl md:text-4xl"
  onTouchStart={() => {
    const timer = setTimeout(() => {
      copyCardName();
    }, 1000);

    setPressTimer(timer);
  }}
  onTouchEnd={() => {
    if (pressTimer) {
      clearTimeout(pressTimer);
    }
  }}
>
  {selectedHomeCard?.card_name}
</h1>
{copied && (
  <div className="text-green-600 font-bold mb-4">
    コピーしました
  </div>
)}

  <div className="text-xl mb-2">
    カード番号：
    {selectedHomeCard?.card_no}
  </div>

  <div className="text-xl mb-6">
    レアリティ：
    【{selectedHomeCard?.rarity}】
  </div>

  <div className="flex flex-col md:flex-row gap-8 items-start mb-8">

  <div>

{selectedHomeCard?.image_url && (
  <img
  src={getCardImage(selectedHomeCard)}
  alt={selectedHomeCard.card_name}
  className="w-[220px] md:w-[280px] mb-2"
/>
)}
<div className="
mt-4
bg-white
rounded-xl
shadow
px-2
py-3
flex
items-center
justify-between
gap-2
">

<div className="flex gap-4 items-start">

<div className="flex flex-col items-center">

<h2 className="text-xs font-bold whitespace-nowrap mb-1">
所持枚数
</h2>

<div className="flex items-center gap-2">

      <button
  onClick={async () => {

    const newCount =
      Math.max(
        0,
        ownedCount - 1
      );

    setOwnedCount(newCount);

    await saveCollection(
      selectedHomeCard.id,
      {
        owned_count: newCount,
      }
    );

  }}
  className="w-8 h-8 border"
>
  -
</button>

<div className="font-bold w-5 text-center text-sm">
  {ownedCount}
</div>

      <button
  onClick={async () => {

    const newCount =
      ownedCount + 1;

    setOwnedCount(newCount);

    await saveCollection(
      selectedHomeCard.id,
      {
        owned_count: newCount,
      }
    );

  }}
  className="w-8 h-8 border"
>
  +
</button>
</div>
</div>

<div className="flex flex-col items-center">

<h2 className="text-xs font-bold whitespace-nowrap mb-1">
不足枚数
</h2>

<div className="flex items-center gap-2">

  <button
    onClick={async () => {

      const newCount =
        Math.max(
          0,
          shortageCount - 1
        );

      setShortageCount(newCount);

      await saveCollection(
        selectedHomeCard.id,
        {
          shortage_count: newCount,
        }
      );

    }}
    className="w-8 h-8 border"
  >
    -
  </button>

<div className="font-bold w-5 text-center text-sm">
  {shortageCount}
</div>

  <button
    onClick={async () => {

      const newCount =
        shortageCount + 1;

      setShortageCount(newCount);

      await saveCollection(
        selectedHomeCard.id,
        {
          shortage_count: newCount,
        }
      );

    }}
    className="w-8 h-8 border"
  >
    +
  </button>
</div>
</div>

</div>
  <div className="flex gap-3 items-center">

    <button
  onClick={async () => {
    const next = !favorite;

    setFavorite(next);

    await saveCollection(
      selectedHomeCard.id,
      { favorite: next }
    );
  }}
  className={`
w-12
h-12
rounded-full
border-2
border-black
flex
items-center
justify-center
text-2xl
transition
${
favorite
? "bg-yellow-300"
: "bg-white"
}
`}
>
{favorite ? "★" : "☆"}
</button>

    <button
  onClick={async () => {
    const next = !wanted;

    setWanted(next);

    await saveCollection(
      selectedHomeCard.id,
      { wanted: next }
    );
  }}
  className={`
w-12
h-12
rounded-full
border-2
flex
items-center
justify-center
text-2xl
transition
${
wanted
? "bg-blue-500 border-blue-600 text-white"
: "bg-white border-gray-400 text-black"
}
`}
>
📦
</button>

</div>

</div>

</div>

<div className="space-y-2 text-lg w-full md:w-[500px]">

    <div>
      カードタイプ：
      {selectedHomeCard?.card_type}
    </div>

    <div>
      国家：
      {selectedHomeCard?.nation}
    </div>

    <div>
      種族：
      {selectedHomeCard?.race}
    </div>

    <div>
      グレード：
      {selectedHomeCard?.grade}
    </div>

    <div>
      パワー：
      {selectedHomeCard?.power}
    </div>

    <div>
      クリティカル：
      {selectedHomeCard?.critical}
    </div>

    <div>
      シールド：
      {selectedHomeCard?.shield}
    </div>

    <div>
      アイコン：
      {selectedHomeCard?.skill_icon}
    </div>

    <div>
      トリガー：
      {selectedHomeCard?.trigger_type}
    </div>


<div className="mb-6">
  <h2 className="text-lg font-bold">
    能力テキスト
  </h2>

  <div
  className="border p-3 text-base min-h-[220px] w-full md:w-[500px]"
  dangerouslySetInnerHTML={{
    __html: selectedHomeCard?.card_text || "",
  }}
/>
</div>

<div className="mb-0">
  <h2 className="text-lg font-bold">
    フレーバーテキスト
  </h2>

  <div
  className="border p-3 text-base min-h-[70px] w-full md:w-[500px]"
  dangerouslySetInnerHTML={{
    __html: selectedHomeCard?.flavor_text || "",
  }}
/>
</div>

<h2 className="text-lg font-bold mt-6">
イラストレーター
</h2>

<div className="border p-3 text-base w-full md:w-[500px]">
  {selectedHomeCard?.illustrator}
</div>


</div>

</div>
  
<div className="mt-0">
  <h2 className="text-2xl font-bold mb-4">
    メモ
  </h2>

  <textarea
  className="border p-2 w-full md:max-w-[800px] h-[120px]"
  value={memo}
  onChange={async (e) => {

    const value = e.target.value;

    setMemo(value);

    await saveCollection(
      selectedHomeCard.id,
      {
        memo: value,
      }
    );

  }}
/>
</div>

<div className="mt-8">
  <h2 className="text-2xl font-bold mb-4">
    ショップリンク
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 w-full md:max-w-[800px]">

    <button
  onClick={() =>
    window.open(
      `https://dorasuta.jp/vanguard/product-list?kw=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  ドラスタ
</button>

    <button
  onClick={() =>
    window.open(
      `https://www.cardrush-vanguard.jp/phone/product-list?search_tmp=検索&keyword=${encodedCardName}&Submit=検索`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  カードラッシュ
</button>

    <button
  onClick={() =>
    window.open(
      `https://www.torecolo.jp/shop/goods/search.aspx?search=x&ct2=1050&keyword=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  トレコロ
</button>

    <button
  onClick={() =>
    window.open(
      `https://193tcg.com/products/list?category_id=2&name=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  193
</button>

    <button
  onClick={() =>
    window.open(
      `https://www.c-labo-online.jp/product-list?keyword=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  カードラボ
</button>

<button
  onClick={() =>
    window.open(
      `https://olta-tcg.com/VG/product/list?keyword=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  オルタ
</button>

<button
  onClick={() =>
    window.open(
      `https://www.bigweb.co.jp/ja/products/vg/list?name=${encodedCardName}&is_box=0&is_supply=0&is_purchase=0`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  BIGWEB
</button>

<button
  onClick={() =>
    window.open(
      `https://www.square-bushiroad.com/phone/product-list?keyword=${encodedCardName}&Submit=検索`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  マスターズスクウェア
</button>

<button
  onClick={() =>
    window.open(
      `https://www.hikahako.com/products/list?name=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  光のハコ舟
</button>

<button
  onClick={() =>
    window.open(
      `https://shopmanzokuya.com/products/list?name=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  まんぞく屋
</button>

<button
  onClick={() =>
    window.open(
      `https://www.advantagetcg.jp/phone/product-list?keyword=${encodedCardName}&Submit=検索`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  アドバンテージ
</button>

<button
  onClick={() =>
    window.open(
      `https://www.amenitydream.com/phone/product-list?keyword=${encodedCardName}&Submit=検索`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  アメニティドリーム
</button>

<button
  onClick={() =>
    window.open(
      `https://www.manasource.net/product-list?keyword=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  マナソース
</button>

<button
  onClick={() =>
    window.open(
      `https://www.ryuunoshippo4.com/product-list?search_tmp=検索&keyword=${encodedCardName}&Submit=検索`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  竜のしっぽ
</button>

<button
  onClick={() =>
    window.open(
      `https://pao-onlineshop.com/view/search?search_keyword=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  PAO
</button>

<button
  onClick={() =>
    window.open(
      `https://www.tcgshop-noah.net/product-list?search_tmp=検索&keyword=${encodedCardName}&Submit=検索`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  ノア
</button>

<button
  onClick={() =>
    window.open(
      `https://yuyu-tei.jp/sell/vg/s/search?search_word=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  遊々亭
</button>

<button
  onClick={() =>
    window.open(
      `https://www.van-happy.com/view/search?search_keyword=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  ヴァンハッピー
</button>

<button
  onClick={() =>
    window.open(
      `https://www.tcgmp.jp/s/product/?prc_id=5&prg_id=9&word=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  トレマ
</button>

<button
  onClick={() =>
    window.open(
      `https://fullahead-vg.com/shop/shopbrand.html?search=${encodedCardName}`,
      "_blank"
    )
  }
  className="bg-slate-900 text-white py-2 rounded text-sm"
>
  フルアヘッド
</button>

<button
  onClick={() =>
    window.open(
      `https://jp.mercari.com/search?keyword=${encodedCardName}`,
      "_blank"
    )
  }
 className="bg-slate-900 text-white py-2 rounded text-sm"
>
  メルカリ
</button>

  </div>
</div>

<FloatingBackButton
  onClick={() => {
    setHomeView("cards");
    setSelectedHomeCard(null);
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }}
/>

</>
)}

{user &&
role === "admin" &&
activeTab === "manage" && (

<>
  <h2 className="text-3xl font-bold mb-4">
    商品管理
  </h2>

<div className="flex flex-col md:flex-row gap-6">

<div className="order-2 md:order-1 w-full md:w-[850px]">
  <h2 className="text-2xl font-bold mb-4">
  登録済み商品
</h2>
<div className="mb-4 space-y-2">

<input
  className="border p-2 w-full"
  placeholder="商品コード検索"
  value={productCodeSearch}
  onChange={(e) => setProductCodeSearch(e.target.value)}
/>

<input
  className="border p-2 w-full"
  placeholder="商品名検索"
  value={productNameSearch}
  onChange={(e) => setProductNameSearch(e.target.value)}
/>

</div>

<div className="space-y-2 max-h-[650px] overflow-y-auto border p-2 w-full md:w-[850px]">

{products
.filter((product) => {
  const codeMatch =
    product.product_code
      ?.toLowerCase()
      .includes(productCodeSearch.toLowerCase());

  const nameMatch =
    product.product_name
      ?.toLowerCase()
      .includes(productNameSearch.toLowerCase());

  return codeMatch && nameMatch;
})
.map((product) => (
      <div
        key={product.id}
        className="border p-2 rounded"
      >
        <div>
          {product.product_code}
          {" | "}
          {product.product_name}
        </div>

        <div>
          通常：
          {product.normal_rarity}
        </div>

        <div>
          パラレル：
          {product.parallel_rarity}
        </div>
        <button
  
  onClick={() => moveProductUp(product)}
  className="border px-3 py-1 mt-2"
>
  ↑
</button>

<button
  onClick={() => moveProductDown(product)}
  className="border px-3 py-1 mt-2 ml-2"
>
  ↓
</button>

<button
  onClick={() => editProduct(product)}
  className="border px-3 py-1 mt-2 ml-2"
>
  編集
</button>

<button
  onClick={() =>
    autoImportCards(product)
  }
  className="border px-3 py-1 mt-2 ml-2"
>
  自動取得
</button>

<button
className="border px-3 py-1 mt-2 ml-2"
onClick={() => saveImagesToStorage(product)}
>
Storageへ保存
</button>

<button
  onClick={() => deleteStorageImages(product)}
  className="border px-3 py-1 mt-2 ml-2"
>
  画像(R2)削除
</button>

<button
  onClick={() =>
    setShowStorageStatus((prev) => ({
      ...prev,
      [product.id]: !prev[product.id],
    }))
  }
  className="ml-2 border px-3 py-1 rounded"
>
  {showStorageStatus[product.id] ? "▲" : "▼"}
</button>

<button
  onClick={() => deleteProduct(product.id)}
  className="border px-3 py-1 ml-2"
>
  削除
</button>

{showStorageStatus[product.id] && (
  <div className="mt-2 rounded border bg-gray-50 p-3 text-sm">

    <div className="font-bold mb-2">
      Storage画像
    </div>

    <div>
      保存済み：
      <span className="font-bold text-green-600">
        {storageResults[product.id].saved}
      </span>
      {" / "}
      {storageResults[product.id].total}
    </div>

    <div>
      スキップ：
      {storageResults[product.id].skip}
    </div>

    <div>
      失敗：
      {storageResults[product.id].failed}
    </div>

  </div>
)}

{importResults[product.id] && (
  <div className="mt-3 rounded border bg-green-50 p-3">

    <div className="font-bold text-lg mb-2">
      更新結果
    </div>

    <div>追加：{importResults[product.id].insert}件</div>

    <div>更新：{importResults[product.id].update}件</div>

    <div>スキップ：{importResults[product.id].skip}件</div>

  </div>
)}


      </div>
   ))}
</div>
</div>

<div className="order-1 md:order-2 w-full md:w-[500px]">

<h2 className="text-2xl font-bold mb-4">
  商品編集
</h2>
<input
          className="border p-2 w-full"
          placeholder="商品コード"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="商品名"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="通常レアリティ"
          value={normalRarity}
          onChange={(e) => setNormalRarity(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="パラレル"
          value={parallelRarity}
          onChange={(e) => setParallelRarity(e.target.value)}
        />

        <input
         className="border p-2 w-full"
         placeholder="公式URL"
         value={officialUrl}
         onChange={(e) => setOfficialUrl(e.target.value)}
        />

        <div className="flex gap-2 mt-2">

<button
  onClick={saveProduct}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  {editingProductId ? "商品更新" : "商品追加"}
</button>

<button
  onClick={resetProductForm}
  className="bg-gray-500 text-white px-4 py-2 rounded"
>
  リセット
</button>

</div>

{role === "admin" && (
  <div className="mt-4 border rounded-lg p-4 bg-gray-50">
    <div className="font-bold mb-2">
      画像表示方式
    </div>
    <div className="text-sm text-gray-600 mb-3">
  現在：{imageMode === "storage" ? "Storage画像" : "URL画像"}
</div>

    <div className="flex gap-2">
      <button
        onClick={() => setImageMode("storage")}
        className={`px-3 py-2 border rounded ${
          imageMode === "storage"
            ? "bg-blue-600 text-white"
            : "bg-white text-black"
        }`}
      >
        Storage画像
      </button>

      <button
        onClick={() => setImageMode("url")}
        className={`px-3 py-2 border rounded ${
          imageMode === "url"
            ? "bg-blue-600 text-white"
            : "bg-white text-black"
        }`}
      >
        URL画像
      </button>
    </div>
  </div>
)}

</div>

</div>

<div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">
    カード管理
  </h2>
  <select
  className="border p-2 w-full max-w-xl"
  value={selectedProductId}
  onChange={(e) => {
    const productId = e.target.value;

    setSelectedProductId(productId);

    loadCards(productId);

    const selectedProduct = products.find(
      (p) => String(p.id) === productId
    );

    if (selectedProduct) {
      const normal =
        selectedProduct.normal_rarity
          ?.split(",")
          .map((r: string) => r.trim())
          .filter(Boolean) || [];

      const parallel =
        selectedProduct.parallel_rarity
          ?.split(",")
          .map((r: string) => r.trim())
          .filter(Boolean) || [];

      setRarityList(
        [...new Set([...normal, ...parallel])]
      );
    } else {
      setRarityList([]);
    }
  }}
>
    <option value="">
  商品を選択してください
</option>

    {products.map((product) => (
      <option
        key={product.id}
        value={product.id}
      >
        {product.product_code}
        {" | "}
        {product.product_name}
      </option>
    ))}
  </select>
   <input
  className="border p-2 w-full max-w-xl mb-2"
  placeholder="カード番号検索"
  value={searchNo}
  onChange={(e) => setSearchNo(e.target.value)}
/>

<input
  className="border p-2 w-full max-w-xl mb-4"
  placeholder="カード名検索"
  value={searchName}
  onChange={(e) => setSearchName(e.target.value)}
/>
<select
  className="border p-2 w-full max-w-xl mb-4"
  value={searchRarity}
  onChange={(e) => setSearchRarity(e.target.value)}
>
  <option value="">
    全レアリティ
  </option>

  {rarityList.map((rarity) => (
    <option
      key={rarity}
      value={rarity}
    >
      {rarity}
    </option>
  ))}
</select>
 <div className="flex flex-col md:flex-row gap-4 mt-4">
  
  <div className="order-2 md:order-1 w-full md:w-[500px] h-[500px] overflow-y-scroll border">

{!selectedProductId && (
  <div className="p-4 text-center text-gray-500">
    商品を選択してください
  </div>
)}

{cards
  .filter((card) => {
    if (!selectedProductId) return false;
const noMatch =
  searchNo === "" ||
  card.card_no
    ?.toLowerCase()
    .includes(searchNo.toLowerCase());

const nameMatch =
  searchName === "" ||
  card.card_name
    ?.toLowerCase()
    .includes(searchName.toLowerCase());

const rarityMatch =
  searchRarity === "" ||
  card.rarity === searchRarity;

return noMatch && nameMatch && rarityMatch;
    })
    .map((card) => {

return (

<div
  key={card.id}
  className="border p-1 rounded cursor-pointer mb-1"
  onClick={() => {
    setEditingId(card.id);
    setCardNo(card.card_no || "");
    setCardName(card.card_name || "");
    setRarity(card.rarity || "");
    setImageUrl(card.image_url || "");
    setCardType(card.card_type || "");
    setNation(card.nation || "");
    setRace(card.race || "");
    setGrade(card.grade?.toString() || "");
    setPower(card.power?.toString() || "");
    setCritical(card.critical?.toString() || "");
    setShield(card.shield?.toString() || "");
    setSkillIcon(card.skill_icon || "");
    setCardText(card.card_text || "");
    setFlavorText(card.flavor_text || "");
    setTriggerType(card.trigger_type || "");
    setIllustrator(card.illustrator || "");
  }}
>

  <div className="flex items-start gap-2">
  {getCardImage(card) ? (
  <img
    src={getCardImage(card)}
    alt={card.card_name}
    className="w-14 h-20 object-cover border"
  />
) : (
  <div className="w-14 h-20 border flex items-center justify-center text-xs">
    No Image
  </div>
)}

  <div>
  <div className="flex items-center gap-4">
  <div className="font-bold">
    {card.card_no}
  </div>

  <div>
    {card.card_name}
  </div>
</div>

<div className="text-sm">
  レアリティ：{card.rarity}
</div>

<div className="flex gap-1 mt-1">

  <button
  onClick={async (e) => {
    e.stopPropagation();

    const currentIndex = cards.findIndex(
      (c) => c.id === card.id
    );

    if (currentIndex === 0) return;

    const targetCard =
      cards[currentIndex - 1];

    await moveCard(
      card.id,
      targetCard.id,
      card.sort_order,
      targetCard.sort_order
    );
  }}
  className="border px-2 py-0.5 text-sm"
>
  ↑
</button>

  <button
  onClick={async (e) => {
    e.stopPropagation();

    const currentIndex = cards.findIndex(
      (c) => c.id === card.id
    );

    if (
      currentIndex === cards.length - 1
    )
      return;

    const targetCard =
      cards[currentIndex + 1];

    await moveCard(
      card.id,
      targetCard.id,
      card.sort_order,
      targetCard.sort_order
    );
  }}
  className="border px-2 py-0.5 text-sm"
>
  ↓
</button>

  <button
  onClick={(e) => {
    e.stopPropagation();

    setEditingId(card.id);
    setCardNo(card.card_no || "");
    setCardName(card.card_name || "");
    setRarity(card.rarity || "");
    setImageUrl(card.image_url || "");
    setCardType(card.card_type || "");
    setNation(card.nation || "");
    setRace(card.race || "");
    setGrade(card.grade?.toString() || "");
    setPower(card.power?.toString() || "");
    setCritical(card.critical?.toString() || "");
    setShield(card.shield?.toString() || "");
    setSkillIcon(card.skill_icon || "");
    setCardText(card.card_text || "");
    setFlavorText(card.flavor_text || "");
    setTriggerType(card.trigger_type || "");
    setIllustrator(card.illustrator || "");

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }}
  className="border px-2 py-0.5 text-sm"
>
  編集
</button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      deleteCard(card.id);
    }}
    className="border px-2 py-0.5 text-sm"
  >
    削除
  </button>

</div>
</div>


  
 </div>
</div>

);
})}

</div>
  <div className="order-1 md:order-2 w-full max-w-4xl">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <select
  className="border p-2 w-full"
  value={selectedProductId}
  onChange={(e) =>
    setSelectedProductId(e.target.value)
  }
>
  <option value="">
    商品を選択してください
  </option>

  {products.map((product) => (
    <option
      key={product.id}
      value={product.id}
    >
      {product.product_code}
      {" | "}
      {product.product_name}
    </option>
  ))}
</select>
<input className="border p-2 w-full" placeholder="グレード" value={grade} onChange={(e) => setGrade(e.target.value)} />

<input className="border p-2 w-full" placeholder="カード番号" value={cardNo} onChange={(e) => setCardNo(e.target.value)} />

<input className="border p-2 w-full" placeholder="パワー" value={power} onChange={(e) => setPower(e.target.value)} />

<input className="border p-2 w-full" placeholder="カード名" value={cardName} onChange={(e) => setCardName(e.target.value)} />

<input className="border p-2 w-full" placeholder="クリティカル" value={critical} onChange={(e) => setCritical(e.target.value)} />

<input className="border p-2 w-full" placeholder="レアリティ" value={rarity} onChange={(e) => setRarity(e.target.value)} />

<input className="border p-2 w-full" placeholder="シールド" value={shield} onChange={(e) => setShield(e.target.value)} />

<input className="border p-2 w-full" placeholder="カードタイプ" value={cardType} onChange={(e) => setCardType(e.target.value)} />

<input className="border p-2 w-full" placeholder="その他アイコン" value={skillIcon} onChange={(e) => setSkillIcon(e.target.value)} />

<input className="border p-2 w-full" placeholder="国家" value={nation} onChange={(e) => setNation(e.target.value)} />

<input className="border p-2 w-full" placeholder="画像URL"value={imageUrl}onChange={(e) =>setImageUrl(e.target.value)}/>

<input className="border p-2 w-full" placeholder="種族" value={race} onChange={(e) => setRace(e.target.value)} />

<input type="file"accept="image/*"className="border p-2 w-full"onChange={(e) => {if (e.target.files?.[0]) {setImageFile(e.target.files[0]);}}}/>

<input className="border p-2 w-full"placeholder="トリガー種類"value={triggerType}onChange={(e) => setTriggerType(e.target.value)} />

<input className="border p-2 w-full"placeholder="イラストレーター"value={illustrator}onChange={(e) => setIllustrator(e.target.value)}/>

<div className="md:col-span-2">
  <textarea className="border p-2 w-full h-32" placeholder="能力テキスト" value={cardText} onChange={(e) => setCardText(e.target.value)} />
</div>

<div className="md:col-span-2">
  <textarea className="border p-2 w-full h-24" placeholder="フレーバーテキスト" value={flavorText} onChange={(e) => setFlavorText(e.target.value)} />
</div>

</div>

<div className="flex flex-col md:flex-row gap-2 mt-4">

<button
  onClick={saveCard}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  {editingId ? "カード更新" : "カード追加"}
</button>

<button
  onClick={() => {
    setEditingId(null);
    setCardNo("");
    setCardName("");
    setRarity("");
    setImageUrl("");
    setImageFile(null);
    setSearchNation("");
  }}
  className="bg-gray-500 text-white px-4 py-2 rounded h-12"
>
  リセット
</button>

</div>

</div>

</div>
</div>

</>
)}

{user &&
activeTab === "mypage" && (

<>

<h2 className="text-3xl font-bold mb-6">
マイページ
</h2>

<div className="max-w-3xl">

<div className="border rounded-lg bg-white shadow p-6">

<div className="flex items-center justify-between">

<div>

<div className="text-gray-500 text-sm">
ログイン中
</div>

<div className="text-xl font-bold break-all">
{user?.email}
</div>

</div>

<button
onClick={logout}
className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
>
ログアウト
</button>

</div>

</div>

{role === "admin" && (

<div className="border rounded-lg bg-white shadow p-6 mt-6">

<div className="text-2xl font-bold mb-4">
サイト設定
</div>

<div className="border rounded p-4">

<div className="flex gap-3">

<button
onClick={() => setRegistrationApproval(true)}
className={`px-6 py-2 rounded ${
registrationApproval
? "bg-green-500 text-white"
: "bg-gray-300"
}`}
>
ON
</button>

<button
onClick={() => setRegistrationApproval(false)}
className={`px-6 py-2 rounded ${
!registrationApproval
? "bg-red-500 text-white"
: "bg-gray-300"
}`}
>
OFF
</button>

<button
onClick={saveRegistrationSetting}
className="bg-blue-600 text-white px-6 py-2 rounded"
>
設定を保存
</button>

</div>

<div className="mt-8">

<div className="text-xl font-bold mb-4">
承認待ちユーザー
</div>

{pendingUsers.length === 0 ? (

<div className="text-gray-500">
承認待ちユーザーはいません
</div>

) : (

pendingUsers.map((pendingUser) => (

<div
key={pendingUser.id}
className="border rounded p-3 mb-3 flex justify-between items-center"
>

<div>
{pendingUser.email}
</div>

<button
onClick={() => approveUser(pendingUser.id)}
className="bg-green-600 text-white px-4 py-2 rounded"
>
承認
</button>

</div>

))

)}

</div>

<div className="text-sm text-gray-500 mt-3">
ON：管理者が承認するまでログインできません。<br />
OFF：新規登録後すぐに利用できます。
</div>

</div>

</div>

)}

</div>

</>

)}

</div>

{zoomCard && (

<div
className="
fixed
inset-0
bg-black/70
z-50
flex
items-center
justify-center
"
onClick={()=>
setZoomCard(null)
}
>

<div
className="bg-white p-4 rounded"
onClick={(e)=>
e.stopPropagation()
}
>

<img
src={getCardImage(zoomCard)}
alt={zoomCard.card_name}
className="max-h-[90vh] max-w-[90vw]"
/>

</div>

</div>

)}

{previewImage && (

<div
  className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
  onClick={() => setPreviewImage(null)}
>

  <img
    src={previewImage}
    alt=""
    className="max-w-full max-h-full bg-white rounded"
    onClick={(e) => e.stopPropagation()}
  />

  <button
    className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 text-2xl"
    onClick={() => setPreviewImage(null)}
  >
    ×
  </button>

</div>

)}

{showSaveImage && (

<div
  ref={saveImageRef}
  className="fixed inset-0 z-[9999] bg-white overflow-auto"
>

  <DeckImageForSave
    deckName={deckName}
    rideDeck={[
      rideG3,
      rideG2,
      rideG1,
      rideG0,
      rideGenerator,
    ].filter(Boolean)}
    mainDeck={displayMainDeckGrouped}
    gDeck={gDeckGrouped}
    finisherDeck={finisherDeckGrouped}
    getCardImage={getCardImage}
  />

</div>

)}
</div>

{previewImage && (
  <div
    className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[9999]"
    onClick={() => setPreviewImage(null)}
  >
    <img
      src={previewImage}
      alt="保存画像"
      className="max-w-full max-h-[90vh]"
    />

    <div className="mt-4 text-white text-center">
      長押しして画像を保存してください。<br />
      （タップすると閉じます）
    </div>
  </div>
)}

</main>

);
}