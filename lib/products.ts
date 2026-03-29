export type ProductCategory =
  | "cellsentials"
  | "optimizers"
  | "nutrimeal"
  | "celavive"
  | "active";

export type ProductBadge = "award" | "best" | "new" | "sale" | "";

export type Product = {
  id: number;
  category: ProductCategory;
  name: string;
  desc: string;
  price: number;
  pcPrice: number;
  badge: ProductBadge;
  award: string | null;
  color: string;
  accent: string;
};

export const products: Product[] = [
  { id: 1,  category: "cellsentials", name: "USANA CellSentials®",       desc: "Vita-Antioxidant + Core Minerals with InCelligence™",             price: 74.95,  pcPrice: 67.95,  badge: "award", award: "NutriSearch 5-Star",   color: "#001a4d", accent: "#007dc3" },
  { id: 2,  category: "cellsentials", name: "USANA HealthPak™",           desc: "CellSentials + MagneCal D + Booster in AM/PM packets",            price: 153.95, pcPrice: 139.95, badge: "best",  award: "Most Comprehensive",  color: "#002060", accent: "#00529b" },
  { id: 3,  category: "cellsentials", name: "Prenatal CellSentials™",     desc: "Advanced prenatal nutrition for mother and baby",                 price: 62.95,  pcPrice: 56.95,  badge: "new",   award: null,                  color: "#001e4a", accent: "#79bde9" },
  { id: 4,  category: "optimizers",   name: "BiOmega™",                   desc: "Ultra-pure omega-3 fish oil — EPA & DHA",                        price: 40.95,  pcPrice: 36.95,  badge: "",      award: null,                  color: "#002244", accent: "#007dc3" },
  { id: 5,  category: "optimizers",   name: "Proflavanol® C100",          desc: "Grape-seed extract + Vitamin C antioxidant protection",          price: 51.95,  pcPrice: 46.95,  badge: "best",  award: null,                  color: "#1a1050", accent: "#5b70c8" },
  { id: 6,  category: "optimizers",   name: "MagneCal D™",                desc: "Magnesium, calcium & vitamin D for strong bones",                price: 31.95,  pcPrice: 28.95,  badge: "",      award: null,                  color: "#0a1e40", accent: "#6aa8d8" },
  { id: 7,  category: "optimizers",   name: "CoQuinone® 30",              desc: "CoQ10 + alpha-lipoic acid for cellular energy",                  price: 60.95,  pcPrice: 54.95,  badge: "",      award: null,                  color: "#1a0a30", accent: "#8878c8" },
  { id: 8,  category: "optimizers",   name: "Hepasil DTX™",               desc: "Silymarin + antioxidants for liver detox support",               price: 45.95,  pcPrice: 41.25,  badge: "",      award: null,                  color: "#0a2010", accent: "#4a9860" },
  { id: 9,  category: "optimizers",   name: "CopaPrime+™",                desc: "Bacopa & coffee cherry for brain performance",                   price: 51.95,  pcPrice: 46.95,  badge: "new",   award: null,                  color: "#15102a", accent: "#7058b8" },
  { id: 10, category: "optimizers",   name: "Procosa®",                   desc: "Glucosamine + InCelligence Complex for joints",                  price: 44.95,  pcPrice: 40.65,  badge: "",      award: null,                  color: "#0a1830", accent: "#5890c0" },
  { id: 11, category: "optimizers",   name: "Pure Rest™",                 desc: "Melatonin for a restful, natural sleep cycle",                   price: 24.95,  pcPrice: 22.50,  badge: "",      award: null,                  color: "#08102a", accent: "#4878c8" },
  { id: 12, category: "optimizers",   name: "Proglucamune®",              desc: "Beta-glucans + zinc for immune system support",                  price: 44.95,  pcPrice: 40.95,  badge: "",      award: null,                  color: "#0e1a30", accent: "#5898c8" },
  { id: 13, category: "nutrimeal",    name: "Nutrimeal™ French Vanilla",  desc: "Low-glycemic NON-GMO protein shake — 9 servings",                price: 43.95,  pcPrice: 38.95,  badge: "best",  award: null,                  color: "#201808", accent: "#c8a040" },
  { id: 14, category: "nutrimeal",    name: "Nutrimeal™ Dutch Chocolate", desc: "Low-glycemic NON-GMO protein shake — 9 servings",                price: 43.95,  pcPrice: 38.95,  badge: "",      award: null,                  color: "#200808", accent: "#c85820" },
  { id: 15, category: "nutrimeal",    name: "Nutrimeal™ Wild Strawberry", desc: "Low-glycemic NON-GMO protein shake — 9 servings",                price: 43.95,  pcPrice: 38.95,  badge: "",      award: null,                  color: "#200a10", accent: "#c84060" },
  { id: 16, category: "celavive",     name: "Celavive® Hydrating Toner",  desc: "Refreshing toner to hydrate and prep skin",                      price: 46.95,  pcPrice: 41.95,  badge: "new",   award: null,                  color: "#10182a", accent: "#79bde9" },
  { id: 17, category: "celavive",     name: "Celavive® Perfecting Serum", desc: "Lightweight serum for radiant, younger-looking skin",            price: 94.95,  pcPrice: 84.95,  badge: "",      award: null,                  color: "#141025", accent: "#9070c8" },
  { id: 18, category: "celavive",     name: "Celavive® Day Cream SPF 30", desc: "Broad-spectrum SPF 30 with Olivol® olive-fruit extract",         price: 69.95,  pcPrice: 62.95,  badge: "best",  award: null,                  color: "#0e1820", accent: "#78b8d8" },
  { id: 19, category: "active",       name: "Rev3 Energy® Surge Sticks",  desc: "Clean energy — green tea, B vitamins, no artificial dyes",       price: 39.95,  pcPrice: 35.95,  badge: "new",   award: null,                  color: "#0a1a10", accent: "#2aa848" },
  { id: 20, category: "active",       name: "USANA MySmart® Bars",        desc: "High-protein, low-glycemic snack bars — 19g protein",            price: 34.95,  pcPrice: 31.95,  badge: "",      award: null,                  color: "#1a1008", accent: "#b87830" },
];

export const categoryLabels: Record<ProductCategory, string> = {
  cellsentials: "CellSentials",
  optimizers:   "Optimizers",
  nutrimeal:    "Nutrimeal",
  celavive:     "Celavive",
  active:       "Active Nutrition",
};

export const productShapeIcons: Record<ProductCategory, string> = {
  cellsentials: `<svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="1.8"><circle cx="32" cy="32" r="18"/><circle cx="32" cy="32" r="9"/><circle cx="32" cy="32" r="3" fill="white" stroke="none"/><line x1="32" y1="4" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="60"/><line x1="4" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="60" y2="32"/></svg>`,
  optimizers:   `<svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="1.8"><rect x="14" y="22" width="10" height="22" rx="5"/><rect x="27" y="14" width="10" height="30" rx="5"/><rect x="40" y="18" width="10" height="26" rx="5"/><line x1="8" y1="52" x2="56" y2="52"/></svg>`,
  nutrimeal:    `<svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="1.8"><path d="M20 12 Q20 8 32 8 Q44 8 44 12 L48 44 Q48 56 32 56 Q16 56 16 44 Z"/><line x1="24" y1="8" x2="22" y2="20"/><line x1="32" y1="8" x2="32" y2="20"/><line x1="40" y1="8" x2="42" y2="20"/></svg>`,
  celavive:     `<svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="1.8"><circle cx="32" cy="28" r="16"/><path d="M32 12C22 16 18 26 24 34C28 40 36 40 40 34C46 26 42 16 32 12Z"/><circle cx="32" cy="28" r="5"/><path d="M28 50Q32 56 36 50"/></svg>`,
  active:       `<svg viewBox="0 0 64 64" fill="none" stroke="white" strokeWidth="1.8"><circle cx="32" cy="14" r="6"/><line x1="32" y1="20" x2="32" y2="40"/><path d="M18 28L32 36L46 28"/><line x1="24" y1="40" x2="18" y2="56"/><line x1="40" y1="40" x2="46" y2="56"/></svg>`,
};
