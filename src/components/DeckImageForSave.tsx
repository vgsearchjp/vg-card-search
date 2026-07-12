type DeckGroup = {
  card: any;
  count: number;
};

type DeckImageForSaveProps = {
  deckName: string;
  rideDeck: any[];
  mainDeck: any[];
  gDeck: any[];
  finisherDeck: any[];
  getCardImage: (card: any) => string;
};

export default function DeckImageForSave({
  deckName,
  rideDeck,
  mainDeck,
  gDeck,
  finisherDeck,
  getCardImage,
}: DeckImageForSaveProps) {

  return (

<div className="bg-white w-[1250px] p-3">

<div className="text-4xl font-bold mb-5">
{deckName}
</div>

<div className="text-3xl font-bold mb-2">
ライドデッキ
</div>

<div className="flex gap-2 mb-8">

{rideDeck.map((card:any, index:number)=>(

<img
  key={card.card_no}
  crossOrigin="anonymous"
  src={(() => {
    const url = getCardImage(card);
    console.log("RIDE:", url);
    return url;
  })()}
  alt=""
  className={
    index === 4
      ? "h-[120px] w-auto border rounded object-contain"
      : "w-[120px] border rounded"
  }
/>

))}

</div>

<div className="text-3xl font-bold mb-2">
  メインデッキ
</div>

<div className="flex flex-wrap gap-2 mb-8">

  {mainDeck.map((item: any) => (

    <div
      key={item.card.id}
      className="relative w-[120px]"
    >

<img
  crossOrigin="anonymous"
  src={(() => {
    const url = getCardImage(item.card);
    console.log("MAIN:", url);
    return url;
  })()}
  alt=""
        className="w-full border rounded"
      />

      <div
        className="
          absolute
          bottom-1
          right-1
          bg-black/80
          text-white
          rounded
          px-2
          py-1
          text-2xl
          font-bold
          leading-none
        "
      >
        ×{item.count}
      </div>

    </div>

  ))}

</div>

{gDeck.length > 0 && (

<>

<div className="text-3xl font-bold mb-2">
  Gデッキ
</div>

<div className="flex flex-wrap gap-2 mb-8">

  {gDeck.map((item:any)=>(

    <div
      key={item.card.id}
      className="relative w-[120px]"
    >

      <img
  crossOrigin="anonymous"
  src={getCardImage(item.card)}
  alt=""
  className="w-full border rounded"
/>

      <div
        className="
          absolute
          bottom-1
          right-1
          bg-black/80
          text-white
          rounded
          px-2
          py-1
          text-2xl
          font-bold
          leading-none
        "
      >
        ×{item.count}
      </div>

    </div>

  ))}

</div>

</>

)}

{finisherDeck.length > 0 && (

<>

<div className="text-3xl font-bold mb-2">
  必殺技デッキ
</div>

<div className="grid grid-cols-[repeat(8,130px)] gap-2">

  {finisherDeck.map((item:any)=>(

    <div
      key={item.card.id}
      className="relative w-[135px]"
    >

<img
  crossOrigin="anonymous"
  src={getCardImage(item.card)}
  alt=""
  className="w-full border rounded"
/>

      <div
        className="
          absolute
          bottom-1
          right-1
          bg-black/80
          text-white
          rounded
          px-2
          py-1
          text-2xl
          font-bold
          leading-none
        "
      >
        ×{item.count}
      </div>

    </div>

  ))}

</div>

</>

)}

</div>


);

}