import type { VercelRequest, VercelResponse } from "@vercel/node";

const ITEMS = [
  { name: "Tropic Tempest", brewery: "Lough Gill", price_eur: 5.15, quantity: 1, style: "IPA" },
  { name: "Year of Plenty", brewery: "O Brother", price_eur: 4.80, quantity: 1, style: "Saison" },
  { name: "Hoppy Shiny People", brewery: "Two Sides", price_eur: 4.65, quantity: 1, style: "IPA" },
  { name: "Pash 'N Fruit", brewery: "Rascals", price_eur: 3.80, quantity: 1, style: "Fruit IPA" },
  { name: "Devil's Glen", brewery: "Wicklow Wolf", price_eur: 4.40, quantity: 1, style: "Black IPA" },
  { name: "Sure Listen", brewery: "Whiplash", price_eur: 6.50, quantity: 1, style: "Double IPA" },
  { name: "Bone Machine", brewery: "Whiplash", price_eur: 5.40, quantity: 1, style: "IPA" },
  { name: "Alto", brewery: "Dot Brew", price_eur: 4.90, quantity: 1, style: "Double IPA" },
  { name: "Rolling Papers", brewery: "Bullhouse Brew Co", price_eur: 4.40, quantity: 1, style: "IPA" },
  { name: "Black Bucket", brewery: "Kinnegar", price_eur: 3.80, quantity: 1, style: "Black IPA" },
  { name: "Big Bunny", brewery: "Kinnegar", price_eur: 3.65, quantity: 2, style: "IPA" },
  { name: "Where The Hops Have No Name", brewery: "Brewski", price_eur: 4.00, quantity: 2, style: "IPA" },
  { name: "IPA IPA Reborn", brewery: "Dot Brew", price_eur: 3.65, quantity: 2, style: "IPA" }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  const q = (req.query.q as string || "").toLowerCase();
  const breweryQ = (req.query.brewery as string || "").toLowerCase();
  const styleQ = (req.query.style as string || "").toLowerCase();
  const sort = (req.query.sort as string || "name").toLowerCase();
  const order = (req.query.order as string || "asc").toLowerCase();

  let items = ITEMS.filter(x => {
    const textHit = !q || [x.name, x.brewery, x.style].join(" ").toLowerCase().includes(q);
    const breweryHit = !breweryQ || x.brewery.toLowerCase() === breweryQ;
    const styleHit = !styleQ || x.style.toLowerCase() === styleQ;
    return textHit && breweryHit && styleHit;
  });

  const dir = order === "desc" ? -1 : 1;
  items.sort((a, b) => {
    if (sort === "price" || sort === "price_eur") return (a.price_eur - b.price_eur) * dir;
    const av = (a as any)[sort]?.toString().toLowerCase() || "";
    const bv = (b as any)[sort]?.toString().toLowerCase() || "";
    return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
  });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).json({ items, count: items.length });
}
