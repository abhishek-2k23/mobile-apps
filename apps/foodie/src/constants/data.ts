// ─── Foodie App Data ──────────────────────────────────────────

export const HERO_BANNER = {
  image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=90",
  tag:   "Hot Today",
  title: "Artisan Burgers",
  sub:   "Handcrafted · locally sourced · 20 min",
};

export const CATEGORIES = [
  { label: "Bakery",  image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&q=80" },
  { label: "Bowls",   image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
  { label: "Tandoor", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" },
  { label: "Seafood", image: "https://images.unsplash.com/photo-1559409569-c5af4a1e52cc?w=400&q=80" },
  { label: "Dessert", image: "https://images.unsplash.com/photo-1557979619-445218b2a71a?w=400&q=80" },
  { label: "Coffee",  image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80" },
];

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  price: number;
  rating: string;
  time: string;
  offer: string;
  distance: string;
  type: "veg" | "nonveg";
  category: string;
  image: string;
  featured?: boolean;
};

export const RESTAURANTS: Restaurant[] = [
  { id: "1",  name: "The Bakehouse",      cuisine: "Sourdough, brunch, pastry",  price: 219, rating: "4.7", time: "18 min", offer: "Morning set",   distance: "1.0 km", type: "veg",    category: "Bakery",  image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80", featured: true },
  { id: "2",  name: "Copper Bowl Co.",    cuisine: "Grain bowls, greens, feta",  price: 279, rating: "4.6", time: "24 min", offer: "Protein boost", distance: "2.4 km", type: "veg",    category: "Bowls",   image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80", featured: true },
  { id: "3",  name: "Charcoal Tandoor",   cuisine: "Kebab, tikka, naan",         price: 329, rating: "4.8", time: "26 min", offer: "Chef pick",     distance: "1.7 km", type: "nonveg", category: "Tandoor", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80", featured: true },
  { id: "4",  name: "Bay Leaf Catch",     cuisine: "Prawn curry, grills, rice",  price: 399, rating: "4.5", time: "32 min", offer: "Seafood night", distance: "3.1 km", type: "nonveg", category: "Seafood", image: "https://images.unsplash.com/photo-1559409569-c5af4a1e52cc?w=600&q=80" },
  { id: "5",  name: "Bloom Dessert Bar",  cuisine: "Tarts, gelato, jars",        price: 169, rating: "4.7", time: "14 min", offer: "Sweet hour",    distance: "1.3 km", type: "veg",    category: "Dessert", image: "https://images.unsplash.com/photo-1557979619-445218b2a71a?w=600&q=80", featured: true },
  { id: "6",  name: "Drift Coffee",       cuisine: "Pour-over, cold brew",       price: 149, rating: "4.6", time: "12 min", offer: "Flat white",    distance: "900 m",  type: "veg",    category: "Coffee",  image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80" },
  { id: "7",  name: "Stone & Steam",      cuisine: "Grilled plates, herb rice",  price: 319, rating: "4.8", time: "28 min", offer: "Signature",     distance: "2.2 km", type: "nonveg", category: "Tandoor", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" },
  { id: "8",  name: "Harbor Bowl",        cuisine: "Citrus salmon, soba",        price: 429, rating: "4.7", time: "30 min", offer: "Fresh catch",   distance: "3.6 km", type: "nonveg", category: "Seafood", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80" },
  { id: "9",  name: "Basil & Grain",      cuisine: "Millet bowls, hummus",       price: 259, rating: "4.5", time: "16 min", offer: "Green bowl",    distance: "1.4 km", type: "veg",    category: "Bowls",   image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" },
  { id: "10", name: "Pecan Yard",         cuisine: "Banana bread, croissant",    price: 189, rating: "4.6", time: "15 min", offer: "Bakery box",    distance: "1.8 km", type: "veg",    category: "Bakery",  image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80" },
  { id: "11", name: "Salted Caramel Lab", cuisine: "Cheesecake, cold desserts",  price: 199, rating: "4.8", time: "13 min", offer: "New jar",       distance: "1.1 km", type: "veg",    category: "Dessert", image: "https://images.unsplash.com/photo-1557979619-445218b2a71a?w=600&q=80" },
  { id: "12", name: "Hearth & Spice",     cuisine: "Roast chicken, brown rice",  price: 349, rating: "4.7", time: "29 min", offer: "Dinner set",    distance: "2.9 km", type: "nonveg", category: "Tandoor", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80" },
];

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
};

export const MENU_ITEMS: MenuItem[] = [
  { id: "1",  name: "Citrus Herb Chicken",  desc: "Lemon zest, grilled chicken, herb rice",  price: 289, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80" },
  { id: "2",  name: "Charred Veg Tandoor",  desc: "Seasonal vegetables, smoky yogurt",       price: 249, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80" },
  { id: "3",  name: "Sesame Citrus Bowl",   desc: "Greens, grains, citrus dressing",          price: 229, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80" },
  { id: "4",  name: "Spice Butter Prawns",  desc: "Garlic butter, chilli oil, basmati",       price: 349, image: "https://images.unsplash.com/photo-1559409569-c5af4a1e52cc?w=300&q=80" },
  { id: "5",  name: "Sourdough Melt",       desc: "Toasted loaf, tomato jam, cheese",         price: 179, image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&q=80" },
  { id: "6",  name: "Green Tahini Salad",   desc: "Cucumber, herbs, lemon tahini",            price: 199, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&q=80" },
  { id: "7",  name: "Smoky Pepper Paneer",  desc: "Paneer, roasted peppers, onion",           price: 239, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80" },
  { id: "8",  name: "Roast Chicken Plate",  desc: "Gravy, herbed potatoes",                   price: 319, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80" },
  { id: "9",  name: "Cold Brew Tonic",      desc: "Citrus tonic, coffee over ice",            price: 139, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80" },
  { id: "10", name: "Rose Milk Pudding",    desc: "Creamy milk pudding, pistachio",           price: 159, image: "https://images.unsplash.com/photo-1557979619-445218b2a71a?w=300&q=80" },
  { id: "11", name: "Chilli Garlic Rice",   desc: "Wok tossed rice, scallions",               price: 189, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&q=80" },
  { id: "12", name: "Basil Pesto Pasta",    desc: "Pesto cream, toasted nuts",                price: 269, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80" },
  { id: "13", name: "Warm Olive Focaccia",  desc: "Olive oil, sea salt, herbs",              price: 149, image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&q=80" },
  { id: "14", name: "Miso Veg Skewer",      desc: "Charred veg, miso glaze",                  price: 219, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80" },
  { id: "15", name: "Lime Mint Cooler",     desc: "Crushed ice, citrus fizz",                 price: 109, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80" },
  { id: "16", name: "Dark Cocoa Tart",      desc: "Bittersweet tart, cream",                  price: 189, image: "https://images.unsplash.com/photo-1557979619-445218b2a71a?w=300&q=80" },
];
