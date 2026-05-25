const ASSETS = {
  logo: "./assets/logo.avif",
  oneBite: "./assets/one-bite.webp",
  tezza: "./assets/tezza-8213.webp",
  nyStyle: "./assets/ny-style-tiktok.jpg",
  neapolitan: "./assets/neapolitan-margherita-pizza.webp"
};

const today = new Date().toISOString().slice(0, 10);
const currentUserId = "user-you";
const communityStorageVersion = "community-v2";

const state = {
  tab: "calculator",
  showFlow: false,
  toast: "",
  confetti: false,
  doughBounce: false,
  hydrationPop: false,
  highFive: false,
  cart: 0,
  shopSlide: 0,
  communityFilter: "Hot Bakes",
  following: loadFollowing(),
  communityPosts: [],
  calc: {
    size: 16,
    count: 6,
    thickness: "Regular",
    glutenFree: false,
    hydration: 65,
    ferment: "72 hours",
    oven: "Home Oven",
    surface: "Dough Guy Pizza Steel"
  },
  completedSteps: new Set(),
  journalOpen: false,
  journalPhoto: "",
  journalPhotos: {
    whole: "",
    slice: "",
    undercarriage: ""
  },
  activePhotoStep: 0,
  journalForm: {
    date: today,
    recipe: "48h cold ferment, 65% hydration classic",
    ovenTemp: 550,
    preheat: 60,
    pizzaStyle: "NY",
    hydration: 65,
    fermentationHours: 48,
    flourType: "High-gluten flour",
    ovenType: "Home Oven",
    bakeTime: 7,
    toppings: "San Marzano, fresh mozzarella, fresh basil, EVOO",
    score: 8.0,
    notes: "Slightly pale in center, add 15 minutes preheat next bake.",
    shareToCommunity: true,
    visibility: "public",
    communityCaption: "Respect the undercarriage. Good crisp, tiny tweak next round."
  },
  entries: loadEntries()
};

const steps = [
  ["Cool water", "Keep it under 60&deg;F. Cold water, calm dough.", "2m"],
  ["Mix water and yeast", "Let the yeast wake up before the flour party.", "5m"],
  ["Add flour and olive oil", "Mix until no dry pockets remain. Nice even distribush.", "2m"],
  ["Add sugar and salt", "For good measure. Browning and flavor, both invited.", ""],
  ["Knead or mix", "Go until elastic and smooth. Look at the integrity of that crust.", "8m"],
  ["Rest", "Cover and let the dough relax. No soupy mess today.", "20m"],
  ["Divide", "Weigh equal dough balls so every pie gets a fair shot.", ""],
  ["Ball", "Tuck the edges under and build surface tension.", ""],
  ["Oil container", "Lightly oil the tins or box so the dough releases clean.", ""],
  ["Cold ferment", "Chill for flavor. Tang, char, good crisp.", "48-72h"],
  ["Bring to room temp", "Pull dough before bake time so it stretches without tearing.", "2h"],
  ["Stretch, top, launch, bake", "Zoom in bro, dont be shy. Lets cut this guy up.", "6-8m"]
];

const photoSteps = [
  ["whole", "Whole Pizza", "Get the full pie. Char, shape, the whole situation."],
  ["slice", "Single Slice", "One clean slice. Show the cheese, the fold, the intent."],
  ["undercarriage", "Slice Undercarriage", "Flip that slice. Dough side gets the truth shot."]
];

const doughGuyPhotos = {
  whole: "https://doughguy.co/cdn/shop/files/IMG_7295.heic?v=1763934981&width=800",
  slice: "./assets/download.png",
  undercarriage: "https://doughguy.co/cdn/shop/files/IMG_0712.jpg?v=1745346126&width=800"
};

const pizzaImages = {
  bar: "https://platform.chicago.eater.com/wp-content/uploads/sites/17/chorus/uploads/chorus_asset/file/25835083/54156056883_14bcedb264_h.jpg?quality=90&strip=all&crop=16.65625%2C0%2C66.6875%2C100&w=2400",
  ny: ASSETS.nyStyle,
  fancy: ASSETS.neapolitan,
  newHaven: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Frank_pepe_clam_pie.jpg",
  detroit: "https://commons.wikimedia.org/wiki/Special:FilePath/Detroit-style_pizza_showing_typica_lacy_cheese_crust.jpg",
  chicago: "https://www.foodnetwork.com/content/dam/images/food/fullset/2019/2/19/0/KC2004_Deep-Dish-Pizza_s4x3.jpg",
  sicilian: "https://www.foodandwine.com/thmb/iL-0ND2EP8ZYhse-zzr8O1otCso=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Grandma-Pie-FT-RECIPE0520-2000-93e47e225db84699bb777e05eb75bdbc.jpg",
  tomato: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWiefU6R64sOMM88dAygcxII4UoTne1CvDpg&s",
  roman: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Neapolitan_pizza.jpg"
};

const styleCards = [
  ["The OG: New York Style", "Big slice, good fold, proper cheese pull. The baseline. The measuring stick.", "OG", pizzaImages.ny],
  ["Bar Pie", "Tavern table monster. Cracker crisp, square cut, zero patience for flop.", "Thin", pizzaImages.bar],
  ["Football Pizza", "Long oval situation. Tailgate geometry, cheese pull, one bite and keep it moving.", "Oval", pizzaImages.ny],
  ["New Haven Apizza", "Coal-kissed, weird shape, big tang. If the undercarriage talks, listen.", "Char", pizzaImages.newHaven],
  ["Fancy Pants Neapolitan", "Soft center, leopard spots, fast bake. Beautiful, but dont let it turn soupy.", "Airy", pizzaImages.fancy],
  ["Detroit Style", "Thick but light on its feet. Crispy cheese wall is the whole ballgame.", "Pan", pizzaImages.detroit],
  ["Chicago Deep Dish", "Knife-and-fork heavy hitter. Sauce on top, commitment underneath.", "Deep", pizzaImages.chicago],
  ["Grandma / Sicilian", "Square grandma energy. Fluffy middle, crisp bottom, feeds the whole table.", "Square", pizzaImages.sicilian],
  ["Tomato Pie", "Sauce-forward, cheese-light, tangy little operator. Respect the red.", "Tang", pizzaImages.tomato]
];

const users = {
  "user-you": {
    id: "user-you",
    displayName: "You",
    username: "homeovenhero",
    avatarUrl: ASSETS.logo,
    bio: "Chasing crisp bottoms in a normal kitchen.",
    followerCount: 18,
    followingCount: 7
  },
  "user-mia": {
    id: "user-mia",
    displayName: "ForReal Dough",
    username: "miamakespies",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    bio: "Detroit edges and hot honey experiments.",
    followerCount: 1240,
    followingCount: 188
  },
  "user-vin": {
    id: "user-vin",
    displayName: "Vinny Crisp",
    username: "vinnyslice",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    bio: "NY slices, fold tests, zero flop.",
    followerCount: 842,
    followingCount: 96
  },
  "user-zoe": {
    id: "user-zoe",
    displayName: "Zoe Char",
    username: "leopardspots",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    bio: "Neapolitan-ish, patio oven, big tang.",
    followerCount: 530,
    followingCount: 112
  }
};

const communityFilters = ["Hot Bakes", "New", "Following", "Top Rated", "My Posts"];
const pizzaStyleOptions = ["NY", "Neapolitan", "Detroit", "Sicilian", "Tavern", "Grandma", "New Haven", "Tomato Pie"];
state.communityPosts = loadCommunityPosts();

const products = [
  {
    name: "Dough Guy&trade; Pizza Steel",
    price: "$119.00",
    copy: "Restaurant quality pizza in your oven. The undercarriage machine.",
    image: ASSETS.tezza
  },
  {
    name: "Dough Guy Infrared Thermometer",
    price: "$29.99",
    copy: "Laser precision to check steel and stone surface temperatures.",
    image: "./assets/ChatGPT Image May 25, 2026, 09_55_30 AM.png"
  },
  {
    name: "Dough Guy Perforated Aluminum Peel",
    price: "$45.00",
    copy: "Lightweight, non-stick, effortlessly launches pizzas.",
    image: "./assets/ChatGPT Image May 25, 2026, 01_05_20 PM.png"
  },
  {
    name: "Dough Guy Wooden Peel",
    price: "$45.00",
    copy: "Lightweight launch control with classic shop-counter vibes.",
    image: "./assets/ChatGPT Image May 25, 2026, 01_07_11 PM.png"
  },
  {
    name: "Modular Dough Proofing Tins",
    price: "$24.99",
    copy: "Three stackable, airtight tins that fit standard refrigerators.",
    image: "./assets/ChatGPT Image May 25, 2026, 01_07_51 PM.png"
  },
  {
    name: "Modular Dough Proofing Boxes",
    price: "$24.99",
    copy: "Stackable, airtight, fridge-friendly proofing boxes.",
    image: "./assets/ChatGPT Image May 25, 2026, 01_10_31 PM.png"
  },
  {
    name: "Ergonomic Rocker Blade",
    price: "$19.99",
    copy: "Perfect, clean, single-motion slices across the whole pie.",
    image: "./assets/ChatGPT Image May 25, 2026, 09_56_55 AM.png"
  },
  {
    name: "Dough Guy Detroit Pan",
    price: "$34.99",
    copy: "Crispy cheese edges, square pie confidence, pan-pizza weekends.",
    image: "./assets/ChatGPT Image May 25, 2026, 01_13_30 PM.png"
  },
  {
    name: "Dough Guy Round Pizza Cutter",
    price: "$14.99",
    copy: "Classic wheel cutter for clean slices when the rocker is off duty.",
    image: "./assets/ChatGPT Image May 25, 2026, 10_07_43 AM.png"
  },
  {
    name: "Dough Guy Kitchen Scale",
    price: "$24.99",
    copy: "Because vibes are good, but grams make better dough.",
    image: "./assets/ChatGPT Image May 25, 2026, 01_14_31 PM.png"
  },
  {
    name: "Dough Guy Pizza Pin",
    price: "$17.99",
    copy: "A rolling pin built for bar pies, tavern pies, and thin-crust missions.",
    image: "./assets/ChatGPT Image May 25, 2026, 01_11_30 PM.png"
  },
  {
    name: "Dough Guy Essentials Pack",
    price: "$159.00",
    copy: "Steel, thermometer, and proofing tins. The home-oven starter kit.",
    shape: "combo"
  },
  {
    name: "Dough Guy Master Pack",
    price: "$229.00",
    copy: "Steel, peel, scale, cutter, proofing gear. Weekend warrior approved.",
    shape: "combo master"
  },
  {
    name: "Dough Guy Connoisseur Pack",
    price: "$299.00",
    copy: "The full no-flop arsenal for people who say undercarriage seriously.",
    shape: "combo connoisseur"
  }
];

function loadEntries() {
  const saved = localStorage.getItem("doughGuyEntries");
  if (saved) return JSON.parse(saved);

  return [
    {
      id: "sample-1",
      date: "2026-05-16",
      recipe: "72h cold ferment, 65% hydration",
      ovenTemp: 550,
      preheat: 60,
      toppings: "Pepperoni, mozz, basil",
      score: 8,
      notes: "Good crisp. Next time launch a little faster.",
      photo: ASSETS.oneBite
    },
    {
      id: "sample-2",
      date: "2026-05-02",
      recipe: "Same day, regular crust",
      ovenTemp: 525,
      preheat: 45,
      toppings: "Tomato, garlic, parm",
      score: 7,
      notes: "Great char, slight soupy mess in the middle.",
      photo: ""
    }
  ];
}

function persistEntries() {
  localStorage.setItem("doughGuyEntries", JSON.stringify(state.entries));
}

function loadFollowing() {
  if (localStorage.getItem("doughGuyCommunityVersion") !== communityStorageVersion) return ["user-mia"];
  const saved = localStorage.getItem("doughGuyFollowing");
  if (saved) return JSON.parse(saved);
  return ["user-mia"];
}

function persistFollowing() {
  localStorage.setItem("doughGuyCommunityVersion", communityStorageVersion);
  localStorage.setItem("doughGuyFollowing", JSON.stringify(state.following));
}

function loadCommunityPosts() {
  if (localStorage.getItem("doughGuyCommunityVersion") !== communityStorageVersion) return seedCommunityPosts();
  const saved = localStorage.getItem("doughGuyCommunityPosts");
  if (saved) return JSON.parse(saved);
  return seedCommunityPosts();
}

function seedCommunityPosts() {
  return [
    makeSeedPost({
      id: "post-ny-72",
      userId: "user-vin",
      title: "72-Hour NY Cheese Pie",
      pizzaStyle: "NY",
      photo: doughGuyPhotos.whole,
      photos: { whole: doughGuyPhotos.whole, slice: doughGuyPhotos.slice, undercarriage: doughGuyPhotos.undercarriage },
      caption: "Big slice, good fold, strong structural integrity. This may be my new Personal Best.",
      hydration: 65,
      fermentationHours: 72,
      flourType: "High-gluten flour",
      ovenType: "Home Oven",
      ovenTemp: 550,
      bakeTime: 7,
      ratings: { "user-mia": 8.8, "user-zoe": 8.6, "user-you": 8.7 },
      likes: ["user-mia", "user-zoe", "user-you"],
      createdAt: "2026-05-24T18:30:00.000Z"
    }),
    makeSeedPost({
      id: "post-detroit-first",
      userId: "user-mia",
      title: "First Detroit Attempt",
      pizzaStyle: "Detroit",
      photo: doughGuyPhotos.whole,
      photos: { whole: doughGuyPhotos.whole, slice: doughGuyPhotos.slice, undercarriage: doughGuyPhotos.undercarriage },
      caption: "Cheese edge trophy run. Thick but light on its feet. Crustworthy.",
      hydration: 70,
      fermentationHours: 48,
      flourType: "Bread flour",
      ovenType: "Home Oven",
      ovenTemp: 525,
      bakeTime: 14,
      ratings: { "user-vin": 7.8, "user-zoe": 8.1 },
      likes: ["user-vin", "user-you"],
      createdAt: "2026-05-25T11:05:00.000Z"
    }),
    makeSeedPost({
      id: "post-neo-patio",
      userId: "user-zoe",
      title: "Neapolitan-ish Patio Oven Bake",
      pizzaStyle: "Neapolitan",
      photo: doughGuyPhotos.whole,
      photos: { whole: doughGuyPhotos.whole, slice: doughGuyPhotos.slice, undercarriage: doughGuyPhotos.undercarriage },
      caption: "Nice leopard spots, soft center, not a soupy mess. 100 percent.",
      hydration: 68,
      fermentationHours: 24,
      flourType: "00 flour",
      ovenType: "Outdoor Pizza Oven",
      ovenTemp: 750,
      bakeTime: 2,
      ratings: { "user-mia": 9.3, "user-vin": 9.1 },
      likes: ["user-mia"],
      createdAt: "2026-05-23T20:15:00.000Z"
    }),
    makeSeedPost({
      id: "post-grandma-hot-honey",
      userId: "user-mia",
      title: "Grandma Pie with Hot Honey",
      pizzaStyle: "Grandma",
      photo: doughGuyPhotos.whole,
      photos: { whole: doughGuyPhotos.whole, slice: doughGuyPhotos.slice, undercarriage: doughGuyPhotos.undercarriage },
      caption: "Square grandma energy. Crisp bottom, sweet heat, feeds the whole table.",
      hydration: 66,
      fermentationHours: 48,
      flourType: "Bread flour",
      ovenType: "Home Oven",
      ovenTemp: 525,
      bakeTime: 18,
      ratings: { "user-vin": 9.1, "user-zoe": 9.3, "user-you": 9.2 },
      likes: ["user-vin", "user-zoe", "user-you"],
      createdAt: "2026-05-22T22:10:00.000Z"
    }),
    makeSeedPost({
      id: "post-sourdough-margherita",
      userId: "user-vin",
      title: "Sourdough Margherita",
      pizzaStyle: "Neapolitan",
      photo: doughGuyPhotos.whole,
      photos: { whole: doughGuyPhotos.whole, slice: doughGuyPhotos.slice, undercarriage: doughGuyPhotos.undercarriage },
      caption: "Tangy little operator. Good char. Undercarriage still needs 5 more minutes preheat.",
      hydration: 72,
      fermentationHours: 36,
      flourType: "Sourdough blend",
      ovenType: "Home Oven",
      ovenTemp: 550,
      bakeTime: 6,
      ratings: { "user-mia": 6.7, "user-zoe": 6.9 },
      likes: ["user-zoe"],
      createdAt: "2026-05-21T19:45:00.000Z"
    })
  ];
}

function makeSeedPost(post) {
  const ratings = post.ratings || {};
  const ratingValues = Object.values(ratings);
  return {
    journalEntryId: post.journalEntryId || null,
    visibility: "public",
    comments: seedComments(post.id),
    ...post,
    photos: post.photos || { whole: post.photo, slice: post.photo, undercarriage: post.photo },
    ratings,
    likes: post.likes || [],
    averageRating: ratingValues.length ? average(ratingValues) : 0,
    ratingCount: ratingValues.length,
    likeCount: (post.likes || []).length,
    commentCount: countComments(seedComments(post.id)),
    updatedAt: post.createdAt
  };
}

function seedComments(postId) {
  if (postId !== "post-ny-72") return [];
  return [
    {
      id: "comment-1",
      postId,
      userId: "user-mia",
      parentCommentId: null,
      body: "That fold is behaving. No flop jalops.",
      likeCount: 2,
      createdAt: "2026-05-24T19:02:00.000Z",
      updatedAt: "2026-05-24T19:02:00.000Z",
      deletedAt: null,
      replies: [
        {
          id: "comment-1-reply-1",
          postId,
          userId: "user-vin",
          parentCommentId: "comment-1",
          body: "Steel was ripping hot. It matters.",
          likeCount: 1,
          createdAt: "2026-05-24T19:05:00.000Z",
          updatedAt: "2026-05-24T19:05:00.000Z",
          deletedAt: null,
          replies: []
        }
      ]
    }
  ];
}

function persistCommunityPosts() {
  localStorage.setItem("doughGuyCommunityVersion", communityStorageVersion);
  localStorage.setItem("doughGuyCommunityPosts", JSON.stringify(state.communityPosts));
}

function average(values) {
  if (!values.length) return 0;
  return Math.round((values.reduce((sum, value) => sum + Number(value), 0) / values.length) * 10) / 10;
}

function countComments(comments = []) {
  return comments.reduce((count, comment) => count + (comment.deletedAt ? 0 : 1) + countComments(comment.replies || []), 0);
}

function calculateRecipe() {
  const { size, count, thickness, hydration, ferment, oven, surface, glutenFree } = state.calc;
  const thicknessFactor = { Thin: 1.06, Regular: 1.34, Thick: 1.68 }[thickness];
  const radius = size / 2;
  const doughBall = Math.round(Math.PI * radius * radius * thicknessFactor);
  const totalDough = doughBall * count;
  const hydrate = glutenFree ? hydration + 5 : hydration;
  const yeastPct = { "Same Day": 0.006, "24 hours": 0.0035, "48 hours": 0.0025, "72 hours": 0.0018 }[ferment];
  const saltPct = 0.028;
  const oilPct = surface === "Sheet Pan" ? 0.03 : 0.02;
  const sugarPct = oven === "Outdoor Pizza Oven" ? 0.008 : 0.015;
  const divisor = 1 + hydrate / 100 + yeastPct + saltPct + oilPct + sugarPct;
  const flour = Math.round(totalDough / divisor);
  const water = Math.round(flour * hydrate / 100);
  const salt = Math.round(flour * saltPct);
  const yeast = Math.max(0.2, flour * yeastPct);
  const oil = Math.round(flour * oilPct);
  const sugar = Math.round(flour * sugarPct);
  const steelSurface = surface === "Dough Guy Pizza Steel";
  const temp = oven === "Outdoor Pizza Oven" ? "700-800&deg;F" : steelSurface ? "550&deg;F" : "500-525&deg;F";
  const preheat = steelSurface ? "60 min" : surface === "Pizza Stone" ? "45-60 min" : "30 min";
  const roomRest = ferment === "Same Day" ? "1-3 hours" : "2 hours before launch";
  const coldRest = ferment === "Same Day" ? "Skip the fridge" : ferment;

  return {
    doughBall,
    totalDough,
    temp,
    preheat,
    roomRest,
    coldRest,
    flourName: glutenFree ? "Gluten-free flour blend" : "High-gluten flour",
    ingredients: [
      ["Flour", flour, "100%"],
      ["Water", water, `${hydrate}% hydration`],
      ["Fine sea salt", salt, "2.8%"],
      ["Instant dry yeast", formatGram(yeast), `${(yeastPct * 100).toFixed(2)}%`],
      ["Extra virgin olive oil", oil, `${Math.round(oilPct * 100)}%`],
      ["Sugar", sugar, `${(sugarPct * 100).toFixed(1)}%`]
    ],
    mission: `Your dough mission: ${count} ${thickness.toLowerCase()} ${size}-inch pies. Chill for ${coldRest.toLowerCase()}. Bring to room temp before launch. Get ready for crispy-bottom glory.`
  };
}

function formatGram(value) {
  return Number.isInteger(value) ? value : value.toFixed(1);
}

function setTab(tab) {
  state.tab = tab;
  state.showFlow = false;
  render();
}

function vibrate(ms = 18) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function toast(message) {
  state.toast = message;
  render();
  setTimeout(() => {
    state.toast = "";
    render();
  }, 1800);
}

function celebrate(message) {
  state.confetti = true;
  vibrate([18, 30, 18]);
  toast(message);
  render();
  setTimeout(() => {
    state.confetti = false;
    render();
  }, 1500);
}

function bounceDough() {
  state.doughBounce = true;
  vibrate(12);
  render();
  setTimeout(() => {
    state.doughBounce = false;
    render();
  }, 850);
}

function maybeHydrationPop(value) {
  if (value >= 60 && value <= 65) {
    state.hydrationPop = true;
    vibrate(14);
    setTimeout(() => {
      state.hydrationPop = false;
      render();
    }, 850);
  }
}

function render() {
  document.getElementById("app").innerHTML = `
    <div class="app-shell">
      ${renderHeader()}
      <main class="app-main">${renderScreen()}</main>
      ${renderNav()}
    </div>
    ${state.toast ? `<div class="toast show">${state.toast}</div>` : `<div class="toast"></div>`}
    ${state.confetti ? renderConfetti() : ""}
    ${state.doughBounce ? `<div class="delight-layer"><div class="bouncy-dough"></div></div>` : ""}
    ${state.hydrationPop ? `<div class="hydration-pop" aria-label="Perfect hydration sweet spot"></div>` : ""}
    ${state.highFive ? renderHighFive() : ""}
  `;
}

function renderHeader() {
  const count = state.entries.length;
  return `
    <header class="app-header">
      <div class="header-inner">
        <div class="brand-lockup">
          <img class="brand-logo" src="${ASSETS.logo}" alt="Dough Guy logo" />
          <div class="brand-copy">
            <strong>Dough Guy&trade;</strong>
            <span>Better Pizza Starts Here</span>
          </div>
        </div>
        <div class="status-pill">${count} pies logged</div>
      </div>
    </header>
  `;
}

function renderNav() {
  const items = [
    ["calculator", "Calculator", "recipe"],
    ["pies", "My Pies", "journal"],
    ["styles", "Doughjo Community", "pizza-full"],
    ["shop", "Shop", "cart"]
  ];

  return `
    <nav class="bottom-nav" aria-label="Primary">
      ${items.map(([id, label, icon]) => `
        <button class="nav-btn ${state.tab === id ? "active" : ""}" data-tab="${id}" type="button">
          <span class="mini-icon icon-${icon}"></span>
          <span>${label}</span>
        </button>
      `).join("")}
    </nav>
  `;
}

function renderScreen() {
  if (state.tab === "styles") return renderStyles();
  if (state.tab === "pies") return renderJournal();
  if (state.tab === "shop") return renderShop();
  return renderCalculator();
}

function renderCalculator() {
  const recipe = calculateRecipe();

  return `
    <section class="screen">
      <div class="hero-card">
        <img src="${ASSETS.oneBite}" alt="Dough Guy eating pizza" />
        <div class="hero-content">
          <span class="eyebrow">Restaurant quality pizza in your home oven</span>
          <h1>No More Flop Jalops</h1>
          <p>Your pocket pizza coach and community</p>
        </div>
      </div>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Dough Lab</h2>
            <p>Lock In!</p>
          </div>
        </div>
        ${rangeField("Number of pizzas", "count", state.calc.count, 1, 12, 1, state.calc.count)}
        ${rangeField("Pizza size", "size", state.calc.size, 8, 16, 1, `${state.calc.size}&quot;`)}
        ${segmented("Pizza thickness", "thickness", ["Thin", "Regular", "Thick"], state.calc.thickness)}
        <div class="field">
          <div class="field-label"><span>Gluten-free mode</span></div>
          <label class="toggle-row">
            <span>Boost hydration and switch flour blend.</span>
            <span class="switch">
              <input type="checkbox" data-calc="glutenFree" ${state.calc.glutenFree ? "checked" : ""} />
              <span></span>
            </span>
          </label>
        </div>
        ${hydrationField()}
        ${segmented("Fermentation time", "ferment", ["Same Day", "24 hours", "48 hours", "72 hours"], state.calc.ferment, 4)}
        ${selectField("Oven type", "oven", ["Home Oven", "Outdoor Pizza Oven", "Grill", "Other"], state.calc.oven)}
        ${selectField("Baking surface", "surface", ["Dough Guy Pizza Steel", "Pizza Stone", "Sheet Pan", "Other"], state.calc.surface)}
      </section>

      ${renderMission(recipe)}

      ${state.showFlow ? renderDoughFlow() : ""}
    </section>
  `;
}

function rangeField(label, key, value, min, max, step, display) {
  return `
    <div class="field">
      <div class="field-label">
        <span>${label}</span>
        <strong class="value-badge">${display}</strong>
      </div>
      <div class="range-wrap">
        <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-calc="${key}" />
      </div>
    </div>
  `;
}

function hydrationField() {
  return `
    <div class="field">
      <div class="field-label">
        <span>Hydration preference</span>
        <strong class="value-badge">${state.calc.hydration}%</strong>
      </div>
      <div class="range-wrap">
        <span class="perfect-zone"></span>
        <input type="range" min="55" max="75" step="1" value="${state.calc.hydration}" data-calc="hydration" />
      </div>
      <p>${state.calc.hydration >= 60 && state.calc.hydration <= 65 ? "Perfectly bouncy zone. Nice." : "Crispier lower, airier higher."}</p>
    </div>
  `;
}

function segmented(label, key, options, value, cols = 3) {
  return `
    <div class="field">
      <div class="field-label"><span>${label}</span></div>
      <div class="segmented" style="--cols:${cols}">
        ${options.map(option => `
          <button class="${value === option ? "active" : ""}" data-segment="${key}" data-value="${option}" type="button">${option}</button>
        `).join("")}
      </div>
    </div>
  `;
}

function selectField(label, key, options, value) {
  return `
    <div class="field">
      <label class="field-label" for="${key}">${label}</label>
      <select class="select" id="${key}" data-calc="${key}">
        ${options.map(option => `<option ${value === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </div>
  `;
}

function renderMission(recipe) {
  return `
    <section class="mission-card">
      <div class="mission-top">
        <div class="panel-header">
          <div>
            <h2>Dough Recipe</h2>
          </div>
        </div>
      </div>
      <div class="results-grid">
        <div class="result-tile"><span>Dough weight</span><strong>${recipe.totalDough}g</strong></div>
        <div class="result-tile"><span>Per ball</span><strong>${recipe.doughBall}g</strong></div>
        <div class="result-tile"><span>Room rest</span><strong>${recipe.roomRest}</strong></div>
        <div class="result-tile"><span>Steel preheat</span><strong>${recipe.preheat}</strong></div>
        <div class="result-tile"><span>Cold ferment</span><strong>${recipe.coldRest}</strong></div>
        <div class="result-tile"><span>Bake temp</span><strong>${recipe.temp}</strong></div>
      </div>
      <div class="ingredient-list">
        <div class="ingredient-row"><span>Ingredient</span><span>Weight</span></div>
        ${recipe.ingredients.map(([name, grams, pct]) => `
          <div class="ingredient-row">
            <span>${name === "Flour" ? recipe.flourName : name}<small>${pct}</small></span>
            <span>${grams}g</span>
          </div>
        `).join("")}
      </div>
      <div class="actions">
        <button class="btn btn-primary" data-action="start-flow" type="button">Start making your pies</button>
        <button class="btn" data-action="save-recipe" type="button">Save Recipe</button>
        <button class="btn btn-dark" data-action="shop-recipe" type="button">Shop Pizza Gear</button>
      </div>
    </section>
  `;
}

function renderDoughFlow() {
  const doneCount = state.completedSteps.size;
  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Make Dough With Me</h2>
          <p>${doneCount}/${steps.length} done. Earn the Crust High-Five.</p>
        </div>
        <div class="pizza-loader" aria-label="Pizza loading animation"></div>
      </div>
      <div class="step-list">
        ${steps.map(([title, copy, timer], index) => `
          <article class="step-card ${state.completedSteps.has(index) ? "done" : ""}">
            <button class="check" data-step="${index}" type="button" aria-label="Mark ${title} done"></button>
            <div class="step-copy">
              <strong>${index + 1}. ${title}</strong>
              <span>${copy}</span>
            </div>
            ${timer ? `<span class="tiny-timer">${timer}</span>` : `<span></span>`}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderStyles() {
  const posts = getCommunityFeed();
  return `
    <section class="screen">
      <section class="community-hero">
        <div class="panel-header">
          <div>
            <span class="eyebrow">Dough Nation</span>
            <h2>The Doughjo Community</h2>
            <p>Rate pies and connect with the pizza making community</p>
          </div>
          <span class="chip">${state.communityPosts.length} posts</span>
        </div>
        <div class="community-filters" role="tablist" aria-label="Community feed filters">
          ${communityFilters.map(filter => `
            <button class="${state.communityFilter === filter ? "active" : ""}" data-action="community-filter" data-filter="${filter}" type="button">${filter}</button>
          `).join("")}
        </div>
      </section>

      <div class="community-feed">
        ${posts.length ? posts.map(renderCommunityPostCard).join("") : renderCommunityEmpty()}
      </div>
    </section>
  `;
}

function getCommunityFeed() {
  const visiblePosts = state.communityPosts.filter(post => post.visibility === "public");
  const filtered = visiblePosts.filter(post => {
    if (state.communityFilter === "Following") return state.following.includes(post.userId);
    if (state.communityFilter === "My Posts") return post.userId === currentUserId;
    return true;
  });

  return filtered.sort((a, b) => {
    if (state.communityFilter === "Top Rated") return b.averageRating - a.averageRating || b.ratingCount - a.ratingCount;
    if (state.communityFilter === "New" || state.communityFilter === "My Posts" || state.communityFilter === "Following") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return (b.likeCount + b.commentCount + b.averageRating) - (a.likeCount + a.commentCount + a.averageRating);
  });
}

function renderCommunityPostCard(post) {
  const user = users[post.userId] || users[currentUserId];
  const isOwnPost = post.userId === currentUserId;
  const isFollowing = state.following.includes(post.userId);
  const liked = post.likes.includes(currentUserId);
  const myRating = post.ratings[currentUserId] || 8.0;
  const commentsOpen = post.commentsOpen;
  const photos = getPostPhotos(post);
  return `
    <article class="community-card">
      <div class="post-head">
        <img class="avatar" src="${user.avatarUrl}" alt="${escapeAttr(user.displayName)} avatar" />
        <div>
          <strong>${escapeHtml(user.displayName)}</strong>
          <span>@${escapeHtml(user.username)} · ${timeAgo(post.createdAt)}</span>
        </div>
        ${isOwnPost
          ? `<span class="owner-pill">Your bake</span>`
          : `<button class="follow-btn ${isFollowing ? "following" : ""}" data-action="toggle-follow" data-user-id="${post.userId}" type="button">${isFollowing ? "Following" : "Follow Baker"}</button>`}
      </div>

      <div class="community-photo-strip" aria-label="${escapeAttr(post.title)} photos">
        ${photos.map(({ label, src }) => `
          <figure>
            <img class="community-photo" src="${src}" alt="${escapeAttr(post.title)} ${label}" />
            <figcaption>${label}</figcaption>
          </figure>
        `).join("")}
      </div>

      <div class="post-body">
        <div class="post-title-row">
          <div>
            <span class="chip hot-chip">${post.pizzaStyle}</span>
            <h3>${escapeHtml(post.title)}</h3>
          </div>
          <div class="rating-summary">
            <strong>${Number(post.averageRating || 0).toFixed(1)}</strong>
            <span>${post.ratingCount || 0} ratings</span>
          </div>
        </div>
        <p>${escapeHtml(post.caption || post.notes || "Fresh out of the oven.")}</p>
        <div class="dough-specs">
          <span>${post.hydration}% hydration</span>
          <span>${post.fermentationHours}h ferment</span>
          <span>${escapeHtml(post.flourType)}</span>
          <span>${escapeHtml(post.ovenType)} · ${post.ovenTemp}&deg;F</span>
          <span>${post.bakeTime}m bake</span>
        </div>

        <div class="slice-score">
          <label for="rating-${post.id}">Slice Score</label>
          <input id="rating-${post.id}" type="range" min="1" max="10" step="0.1" value="${myRating}" data-action="rate-post" data-post-id="${post.id}" />
          <strong>${Number(myRating).toFixed(1)}</strong>
        </div>

        <div class="post-actions">
          <button class="social-btn ${liked ? "liked" : ""}" data-action="toggle-like" data-post-id="${post.id}" type="button">${liked ? "Liked" : "Like"} · ${post.likeCount}</button>
          <button class="social-btn" data-action="toggle-comments" data-post-id="${post.id}" type="button">Comment · ${post.commentCount}</button>
          ${isOwnPost ? `<button class="social-btn" data-action="unpublish-post" data-post-id="${post.id}" type="button">Unpublish</button>` : ""}
        </div>

        ${commentsOpen ? renderCommentThread(post) : ""}
      </div>
    </article>
  `;
}

function renderCommentThread(post) {
  return `
    <div class="comment-panel">
      ${post.comments.length ? post.comments.map(comment => renderComment(post, comment)).join("") : `<div class="empty-state small"><strong>No comments yet.</strong><p>Say something crustworthy.</p></div>`}
      <div class="comment-input-row">
        <input class="text-input" type="text" placeholder="Add a comment..." data-comment-input="${post.id}" />
        <button class="btn btn-primary mini-btn" data-action="add-comment" data-post-id="${post.id}" type="button">Post</button>
      </div>
    </div>
  `;
}

function getPostPhotos(post) {
  const photos = post.photos || {};
  const fallback = post.photo || ASSETS.oneBite;
  return [
    { label: "Pizza", src: photos.whole || fallback },
    { label: "Slice", src: photos.slice || photos.whole || fallback },
    { label: "Undercarriage", src: photos.undercarriage || photos.slice || fallback }
  ];
}

function renderComment(post, comment) {
  const user = users[comment.userId] || users[currentUserId];
  const isOwn = comment.userId === currentUserId;
  return `
    <div class="comment">
      <img class="avatar small-avatar" src="${user.avatarUrl}" alt="${escapeAttr(user.displayName)} avatar" />
      <div>
        <strong>${escapeHtml(user.displayName)} <span>${timeAgo(comment.createdAt)}</span></strong>
        <p>${comment.deletedAt ? "Comment deleted." : escapeHtml(comment.body)}</p>
        <div class="comment-actions">
          <button data-action="like-comment" data-post-id="${post.id}" data-comment-id="${comment.id}" type="button">Like ${comment.likeCount ? `· ${comment.likeCount}` : ""}</button>
          <button data-action="reply-comment" data-post-id="${post.id}" data-comment-id="${comment.id}" type="button">Reply</button>
          ${isOwn && !comment.deletedAt ? `<button data-action="edit-comment" data-post-id="${post.id}" data-comment-id="${comment.id}" type="button">Edit</button><button data-action="delete-comment" data-post-id="${post.id}" data-comment-id="${comment.id}" type="button">Delete</button>` : ""}
        </div>
        ${(comment.replies || []).length ? `<div class="replies">${comment.replies.map(reply => renderComment(post, reply)).join("")}</div>` : ""}
      </div>
    </div>
  `;
}

function renderCommunityEmpty() {
  const copy = state.communityFilter === "Following"
    ? ["Not following anyone yet.", "Follow a baker and their hot bakes will land here."]
    : state.communityFilter === "My Posts"
      ? ["No posts yet.", "Post a bake from My Pies and become the main character."]
      : ["No posts yet.", "Fresh dough, empty oven. Start the movement."];
  return `<section class="panel"><div class="empty-state"><strong>${copy[0]}</strong><p>${copy[1]}</p></div></section>`;
}

function renderJournal() {
  return `
    <section class="screen">
      <section class="panel panel-dark">
        <div class="panel-header">
          <div>
            <h2>My Pies</h2>
            <p>ABL - In pizza, youve got to Always Be Learnin'</p>
          </div>
          <span class="chip">${state.entries.length} bakes</span>
        </div>
        <button class="btn btn-primary" data-action="toggle-journal" type="button">${state.journalOpen ? "Close Bake Note" : "+ Record a New Bake"}</button>
      </section>

      ${state.journalOpen ? renderJournalForm() : ""}

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Bake Roll</h2>
            <p>Every entry gets a thumbnail, score, and next-time fix.</p>
          </div>
        </div>
        <div class="entries-list">
          ${state.entries.length ? state.entries.map(renderEntry).join("") : `<div class="empty-state"><strong>No pies yet.</strong><p>Record the first bake and start the glow-up.</p></div>`}
        </div>
      </section>
    </section>
  `;
}

function renderJournalForm() {
  const form = state.journalForm;
  const completedPhotos = photoSteps.filter(([key]) => state.journalPhotos[key]).length;
  const currentPhotoIndex = completedPhotos === photoSteps.length
    ? 0
    : Math.max(0, photoSteps.findIndex(([key]) => !state.journalPhotos[key]));
  const currentPhoto = photoSteps[currentPhotoIndex];
  return `
    <form class="journal-form" data-journal-form>
      <div class="field">
        <label class="field-label">Bake date</label>
        <input class="text-input" type="date" value="${form.date}" data-journal="date" />
      </div>
      <div class="field">
        <label class="field-label">Dough recipe details</label>
        <input class="text-input" type="text" value="${escapeAttr(form.recipe)}" placeholder="e.g. 48h cold ferment, 65% hydration classic" data-journal="recipe" />
      </div>
      <div class="grid-two">
        <div class="field">
          <label class="field-label">Pizza style</label>
          <select class="select" data-journal="pizzaStyle">
            ${pizzaStyleOptions.map(style => `<option ${form.pizzaStyle === style ? "selected" : ""}>${style}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label class="field-label">Hydration %</label>
          <input class="text-input" type="number" min="50" max="90" step="1" value="${form.hydration}" data-journal="hydration" />
        </div>
      </div>
      <div class="grid-two">
        <div class="field">
          <label class="field-label">Ferment hours</label>
          <input class="text-input" type="number" min="0" max="120" step="1" value="${form.fermentationHours}" data-journal="fermentationHours" />
        </div>
        <div class="field">
          <label class="field-label">Bake time (min)</label>
          <input class="text-input" type="number" min="1" max="30" step="1" value="${form.bakeTime}" data-journal="bakeTime" />
        </div>
      </div>
      <div class="field">
        <label class="field-label">Flour type</label>
        <input class="text-input" type="text" value="${escapeAttr(form.flourType)}" placeholder="e.g. High-gluten flour" data-journal="flourType" />
      </div>
      <div class="grid-two">
        <div class="field">
          <label class="field-label">Oven temp (&deg;F)</label>
          <input class="text-input" type="number" value="${form.ovenTemp}" data-journal="ovenTemp" />
        </div>
        <div class="field">
          <label class="field-label">Steel preheat (min)</label>
          <input class="text-input" type="number" value="${form.preheat}" data-journal="preheat" />
        </div>
      </div>
      <div class="field">
        <label class="field-label">Toppings used</label>
        <input class="text-input" type="text" value="${escapeAttr(form.toppings)}" placeholder="e.g. San Marzano, fresh mozzarella, basil" data-journal="toppings" />
      </div>
      <div class="field share-box">
        <div class="field-label"><span>Publish</span></div>
        <label class="toggle-row">
          <span>Post to Dough Nation after saving.</span>
          <span class="switch">
            <input type="checkbox" data-journal="shareToCommunity" ${form.shareToCommunity ? "checked" : ""} />
            <span></span>
          </span>
        </label>
        <div class="segmented" style="--cols:2">
          ${["public", "private"].map(option => `
            <button class="${form.visibility === option ? "active" : ""}" data-segment="visibility" data-value="${option}" type="button">${option === "public" ? "Public post" : "Private only"}</button>
          `).join("")}
        </div>
        <textarea class="textarea" placeholder="Optional caption for the feed..." data-journal="communityCaption">${escapeHtml(form.communityCaption)}</textarea>
      </div>
      <div class="field">
        <div class="field-label"><span>My Score</span></div>
        <div class="score-row">
          <input type="range" min="1" max="10" step="0.1" value="${form.score}" data-journal="score" />
          <span class="score-pill">${Number(form.score).toFixed(1)}/10</span>
        </div>
      </div>
      <div class="field photo-picker">
        <div class="field-label"><span>Pizza Photos</span><strong>${completedPhotos}/3</strong></div>
        <div class="photo-sequence">
          ${photoSteps.map(([key, label], index) => `
            <div class="photo-shot ${state.journalPhotos[key] ? "done" : ""} ${index === currentPhotoIndex ? "active" : ""}">
              <div class="photo-thumb">
                ${state.journalPhotos[key] ? `<img src="${state.journalPhotos[key]}" alt="${label} preview" />` : `<span>${index + 1}</span>`}
              </div>
              <span>${label}</span>
            </div>
          `).join("")}
        </div>
        <div class="photo-preview">
          <strong>Shot ${currentPhotoIndex + 1}: ${currentPhoto[1]}</strong>
          <span>${currentPhoto[2]}</span>
        </div>
        <label class="btn btn-primary">
          ${completedPhotos === 3 ? "Retake photos" : `Take photo ${currentPhotoIndex + 1} of 3`}
          <input hidden type="file" accept="image/*" capture="environment" data-action="capture-photo" data-photo-slot="${currentPhoto[0]}" />
        </label>
      </div>
      <div class="field">
        <label class="field-label">Next Time Fix</label>
        <textarea class="textarea" placeholder="Slightly pale in center, needs additional preheating next bake..." data-journal="notes">${escapeHtml(form.notes)}</textarea>
      </div>
      <div class="grid-two">
        <button class="btn btn-primary" data-action="save-bake" type="button">Save Bake Note</button>
        <button class="btn btn-ghost" data-action="discard-bake" type="button">Discard</button>
      </div>
    </form>
  `;
}

function renderEntry(entry) {
  const score = Number(entry.score).toFixed(1);
  return `
    <article class="entry-card">
      <div class="entry-thumb">${entry.photo ? `<img src="${entry.photo}" alt="${escapeAttr(entry.recipe)}" />` : ""}</div>
      <div>
        <h3>${escapeHtml(entry.recipe)}</h3>
        <div class="entry-meta">
          <span>${entry.date}</span>
          <span>${entry.ovenTemp}&deg;F</span>
          <span>${entry.preheat} min</span>
          <span>${score}/10</span>
        </div>
        <p>${escapeHtml(entry.notes || entry.toppings)}</p>
        <div class="entry-actions">
          ${entry.isPublishedToCommunity
            ? `<button class="btn btn-ghost mini-btn" data-action="unpublish-entry" data-entry-id="${entry.id}" type="button">Unpublish</button>`
            : `<button class="btn btn-primary mini-btn" data-action="publish-entry" data-entry-id="${entry.id}" type="button">Post to Dough Nation</button>`}
        </div>
      </div>
    </article>
  `;
}

function renderShop() {
  const feature = products[state.shopSlide % products.length];

  return `
    <section class="screen">
      <section class="shop-feature">
        <div class="shop-slider-media">
          ${renderProductVisual(feature)}
          <div class="shop-slider-controls">
            <button class="slider-btn" data-action="shop-prev" type="button" aria-label="Previous shop product">&larr;</button>
            <button class="slider-btn" data-action="shop-next" type="button" aria-label="Next shop product">&rarr;</button>
          </div>
        </div>
        <div class="shop-feature-content">
          <span class="eyebrow">Rotating Dough Guy gear</span>
          <h2>${feature.name}</h2>
          <p>${feature.copy}</p>
          <span class="price">${feature.price}</span>
          <div class="actions">
            <button class="btn btn-primary" data-action="add-cart" type="button">Add Featured Gear</button>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Tool Shop</h2>
            <p>Simple pizza gear. Highly practical. Zero preciousness.</p>
          </div>
          <span class="chip">${state.cart} in cart</span>
        </div>
        <div class="product-grid">
          ${products.map(renderProduct).join("")}
        </div>
      </section>
    </section>
  `;
}

function renderProduct(product) {
  return `
    <article class="product-card">
      <div class="product-art">
        ${renderProductVisual(product)}
      </div>
      <div class="product-info">
        <div class="product-row">
          <h3>${product.name}</h3>
          <span class="price">${product.price}</span>
        </div>
        <p>${product.copy}</p>
        <button class="btn btn-primary" data-action="add-cart" type="button">Add to Cart</button>
      </div>
    </article>
  `;
}

function renderProductVisual(product) {
  return product.image
    ? `<img src="${product.image}" alt="${product.name.replace(/&trade;/g, "trademark")}" />`
    : `<div class="tool-shape ${product.shape || ""}"></div>`;
}

function renderConfetti() {
  const pieces = Array.from({ length: 50 }, (_, index) => {
    const type = index % 3 === 0 ? "basil" : index % 3 === 1 ? "cheese" : "";
    const left = Math.round(Math.random() * 100);
    const delay = (Math.random() * 0.42).toFixed(2);
    const duration = (1.1 + Math.random() * 0.55).toFixed(2);
    return `<span class="confetti-piece ${type}" style="left:${left}%; animation-delay:${delay}s; animation-duration:${duration}s"></span>`;
  }).join("");

  return `<div class="confetti-layer">${pieces}</div>`;
}

function renderHighFive() {
  return `
    <div class="modal-layer">
      <div class="modal-card">
        <div class="high-five">
          <div class="dough-guy-face"></div>
          <div class="slice-friend"></div>
        </div>
        <h2>Crust High-Five</h2>
        <p>You finished the full dough flow. Beautiful undercarriage is no longer a dream.</p>
        <div class="actions">
          <button class="btn btn-primary" data-action="close-high-five" type="button">100 Percent</button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

document.addEventListener("input", event => {
  if (event.target.dataset.action === "rate-post") {
    ratePost(event.target.dataset.postId, Number.parseFloat(event.target.value));
    return;
  }

  const calcKey = event.target.dataset.calc;
  if (calcKey) {
    const isNumber = ["size", "count", "hydration"].includes(calcKey);
    const value = event.target.type === "checkbox" ? event.target.checked : isNumber ? Number(event.target.value) : event.target.value;
    state.calc[calcKey] = value;
    if (calcKey === "hydration") maybeHydrationPop(value);
    render();
    return;
  }

  const journalKey = event.target.dataset.journal;
  if (journalKey) {
    state.journalForm[journalKey] = event.target.type === "checkbox"
      ? event.target.checked
      : event.target.type === "number"
      ? Number(event.target.value)
      : event.target.type === "range"
        ? Number.parseFloat(event.target.value)
      : event.target.value;
    if (journalKey === "score") render();
  }
});

document.addEventListener("change", event => {
  if (event.target.dataset.action === "capture-photo" && event.target.files?.[0]) {
    const slot = event.target.dataset.photoSlot || "whole";
    const reader = new FileReader();
    reader.onload = () => {
      state.journalPhotos[slot] = reader.result;
      state.journalPhoto = state.journalPhotos.whole || state.journalPhotos.slice || state.journalPhotos.undercarriage;
      const nextMissing = photoSteps.findIndex(([key]) => !state.journalPhotos[key]);
      state.activePhotoStep = nextMissing === -1 ? 0 : nextMissing;
      render();
    };
    reader.readAsDataURL(event.target.files[0]);
  }
});

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-tab]");
  if (nav) {
    setTab(nav.dataset.tab);
    return;
  }

  const segment = event.target.closest("[data-segment]");
  if (segment) {
    const key = segment.dataset.segment;
    if (key in state.journalForm) state.journalForm[key] = segment.dataset.value;
    else state.calc[key] = segment.dataset.value;
    render();
    return;
  }

  const step = event.target.closest("[data-step]");
  if (step) {
    const index = Number(step.dataset.step);
    if (state.completedSteps.has(index)) state.completedSteps.delete(index);
    else {
      state.completedSteps.add(index);
      bounceDough();
    }

    if (state.completedSteps.size === steps.length) {
      state.highFive = true;
      celebrate("Dough flow complete. Lets cut this guy up.");
    } else {
      render();
    }
    return;
  }

  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  if (action === "capture-photo") return;

  if (action === "start-flow") {
    state.showFlow = true;
    toast("Pizza timer is spinning.");
  }
  if (action === "save-recipe") celebrate("Recipe locked. Crispy-bottom glory queued.");
  if (action === "shop-recipe") {
    state.tab = "shop";
    state.showFlow = false;
    toast("Steel, thermometer, and proofing boxes. Smart move.");
  }
  if (action === "toggle-journal") state.journalOpen = !state.journalOpen;
  if (action === "discard-bake") {
    state.journalOpen = false;
    state.journalPhoto = "";
    state.journalPhotos = { whole: "", slice: "", undercarriage: "" };
    state.activePhotoStep = 0;
    toast("Bake note discarded.");
  }
  if (action === "save-bake") saveBake();
  if (action === "publish-entry") publishEntry(actionEl.dataset.entryId, { forcePublic: true });
  if (action === "unpublish-entry") unpublishEntry(actionEl.dataset.entryId);
  if (action === "styles-prev" || action === "styles-next") {
    scrollStyles(action === "styles-next" ? 1 : -1);
    return;
  }
  if (action === "community-filter") state.communityFilter = actionEl.dataset.filter;
  if (action === "toggle-like") toggleLike(actionEl.dataset.postId);
  if (action === "toggle-comments") toggleComments(actionEl.dataset.postId);
  if (action === "add-comment") addComment(actionEl.dataset.postId);
  if (action === "reply-comment") replyComment(actionEl.dataset.postId, actionEl.dataset.commentId);
  if (action === "edit-comment") editComment(actionEl.dataset.postId, actionEl.dataset.commentId);
  if (action === "delete-comment") deleteComment(actionEl.dataset.postId, actionEl.dataset.commentId);
  if (action === "like-comment") likeComment(actionEl.dataset.postId, actionEl.dataset.commentId);
  if (action === "toggle-follow") toggleFollow(actionEl.dataset.userId);
  if (action === "unpublish-post") unpublishPost(actionEl.dataset.postId);
  if (action === "shop-prev") state.shopSlide = (state.shopSlide - 1 + products.length) % products.length;
  if (action === "shop-next") state.shopSlide = (state.shopSlide + 1) % products.length;
  if (action === "add-cart") {
    state.cart += 1;
    toast("Added to cart. Its only right.");
  }
  if (action === "close-high-five") state.highFive = false;

  render();
});

function saveBake() {
  const entry = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    ...state.journalForm,
    score: Number(state.journalForm.score).toFixed(1),
    photos: { ...state.journalPhotos },
    photo: state.journalPhotos.whole || state.journalPhotos.slice || state.journalPhotos.undercarriage || state.journalPhoto,
    isPublishedToCommunity: state.journalForm.shareToCommunity && state.journalForm.visibility === "public",
    communityPostId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (entry.isPublishedToCommunity) {
    const post = createCommunityPostFromEntry(entry, entry.communityCaption || entry.notes);
    entry.communityPostId = post.id;
    state.communityPosts = [post, ...state.communityPosts];
    persistCommunityPosts();
  }
  state.entries = [entry, ...state.entries];
  persistEntries();
  state.journalOpen = false;
  state.journalPhoto = "";
  state.journalPhotos = { whole: "", slice: "", undercarriage: "" };
  state.activePhotoStep = 0;
  celebrate("Bake logged. Improve every time.");
}

function publishEntry(entryId, options = {}) {
  const entry = state.entries.find(item => item.id === entryId);
  if (!entry) return;
  if (entry.communityPostId && state.communityPosts.some(post => post.id === entry.communityPostId)) {
    toast("Already posted. Fresh out of the oven.");
    return;
  }

  const post = createCommunityPostFromEntry(entry, entry.communityCaption || entry.notes, options.forcePublic ? "public" : entry.visibility);
  entry.isPublishedToCommunity = true;
  entry.communityPostId = post.id;
  entry.updatedAt = new Date().toISOString();
  state.communityPosts = [post, ...state.communityPosts];
  persistEntries();
  persistCommunityPosts();
  toast("Posted to Dough Nation. Crustworthy.");
  render();
}

function unpublishEntry(entryId) {
  const entry = state.entries.find(item => item.id === entryId);
  if (!entry?.communityPostId) return;
  state.communityPosts = state.communityPosts.filter(post => post.id !== entry.communityPostId || post.userId !== currentUserId);
  entry.isPublishedToCommunity = false;
  entry.communityPostId = null;
  entry.updatedAt = new Date().toISOString();
  persistEntries();
  persistCommunityPosts();
  toast("Unpublished. Private journal only.");
  render();
}

function unpublishPost(postId) {
  const post = state.communityPosts.find(item => item.id === postId);
  if (!post || post.userId !== currentUserId) {
    toast("Only the baker can unpublish this one.");
    return;
  }
  state.communityPosts = state.communityPosts.filter(item => item.id !== postId);
  const entry = state.entries.find(item => item.communityPostId === postId);
  if (entry) {
    entry.isPublishedToCommunity = false;
    entry.communityPostId = null;
  }
  persistEntries();
  persistCommunityPosts();
  toast("Unpublished. Back to private notes.");
}

function ratePost(postId, rating) {
  if (!isValidRating(rating)) {
    toast("Slice Score needs one decimal, 1.0 to 10.0.");
    return;
  }
  const post = state.communityPosts.find(item => item.id === postId);
  if (!post) return;
  post.ratings[currentUserId] = Number(rating.toFixed(1));
  const values = Object.values(post.ratings);
  post.averageRating = average(values);
  post.ratingCount = values.length;
  post.updatedAt = new Date().toISOString();
  persistCommunityPosts();
  render();
}

function isValidRating(value) {
  return Number.isFinite(value) && value >= 1 && value <= 10 && Number.isInteger(Math.round(value * 10));
}

function toggleLike(postId) {
  const post = state.communityPosts.find(item => item.id === postId);
  if (!post) return;
  if (post.likes.includes(currentUserId)) {
    post.likes = post.likes.filter(id => id !== currentUserId);
    toast("Like pulled back. No hard feelings.");
  } else {
    post.likes.push(currentUserId);
    toast("Strong structural integrity.");
  }
  post.likeCount = post.likes.length;
  post.updatedAt = new Date().toISOString();
  persistCommunityPosts();
}

function toggleComments(postId) {
  const post = state.communityPosts.find(item => item.id === postId);
  if (!post) return;
  post.commentsOpen = !post.commentsOpen;
}

function addComment(postId, parentCommentId = null, bodyOverride = "") {
  const post = state.communityPosts.find(item => item.id === postId);
  if (!post) return;
  const input = document.querySelector(`[data-comment-input="${postId}"]`);
  const body = (bodyOverride || input?.value || "").trim();
  if (!body) {
    toast("Give the bake a little love first.");
    return;
  }
  const comment = createComment(postId, body, parentCommentId);
  if (parentCommentId) {
    const parent = findComment(post.comments, parentCommentId);
    if (!parent) return;
    parent.replies = [...(parent.replies || []), comment];
  } else {
    post.comments = [...post.comments, comment];
  }
  post.commentCount = countComments(post.comments);
  post.commentsOpen = true;
  post.updatedAt = new Date().toISOString();
  persistCommunityPosts();
  toast(parentCommentId ? "Reply posted. Good crisp." : "Comment posted. Crustworthy.");
}

function createComment(postId, body, parentCommentId = null) {
  const now = new Date().toISOString();
  return {
    id: `comment-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    postId,
    userId: currentUserId,
    parentCommentId,
    body,
    likeCount: 0,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    replies: []
  };
}

function replyComment(postId, commentId) {
  const body = prompt("Reply to this crust conversation:");
  if (body) addComment(postId, commentId, body);
}

function editComment(postId, commentId) {
  const post = state.communityPosts.find(item => item.id === postId);
  const comment = post ? findComment(post.comments, commentId) : null;
  if (!comment || comment.userId !== currentUserId || comment.deletedAt) return;
  const next = prompt("Edit your comment:", comment.body);
  if (!next?.trim()) return;
  comment.body = next.trim();
  comment.updatedAt = new Date().toISOString();
  persistCommunityPosts();
  toast("Comment updated.");
}

function deleteComment(postId, commentId) {
  const post = state.communityPosts.find(item => item.id === postId);
  const comment = post ? findComment(post.comments, commentId) : null;
  if (!comment || comment.userId !== currentUserId) return;
  comment.deletedAt = new Date().toISOString();
  post.commentCount = countComments(post.comments);
  persistCommunityPosts();
  toast("Comment deleted.");
}

function likeComment(postId, commentId) {
  const post = state.communityPosts.find(item => item.id === postId);
  const comment = post ? findComment(post.comments, commentId) : null;
  if (!comment || comment.deletedAt) return;
  comment.likeCount += 1;
  persistCommunityPosts();
}

function findComment(comments = [], commentId) {
  for (const comment of comments) {
    if (comment.id === commentId) return comment;
    const reply = findComment(comment.replies || [], commentId);
    if (reply) return reply;
  }
  return null;
}

function toggleFollow(userId) {
  if (userId === currentUserId) {
    toast("You already follow your own pizza destiny.");
    return;
  }
  if (state.following.includes(userId)) {
    state.following = state.following.filter(id => id !== userId);
    toast("Unfollowed. Still respect the bake.");
  } else {
    state.following = [...state.following, userId];
    toast("Following baker. Hot bakes incoming.");
  }
  persistFollowing();
}

function createCommunityPostFromEntry(entry, caption, visibility = "public") {
  const title = entry.recipe || `${entry.pizzaStyle || "Pizza"} bake`;
  const ratings = { [currentUserId]: Number(entry.score || 8) };
  return {
    id: `post-${entry.id}`,
    journalEntryId: entry.id,
    userId: currentUserId,
    title,
    pizzaStyle: entry.pizzaStyle || "NY",
    photo: entry.photo || ASSETS.oneBite,
    photos: entry.photos || {},
    caption: caption || entry.notes || "Fresh out of the oven.",
    hydration: Number(entry.hydration || 65),
    fermentationHours: Number(entry.fermentationHours || 48),
    flourType: entry.flourType || "High-gluten flour",
    ovenType: entry.ovenType || "Home Oven",
    ovenTemp: Number(entry.ovenTemp || 550),
    bakeTime: Number(entry.bakeTime || 7),
    toppings: parseToppings(entry.toppings),
    notes: entry.notes || "",
    visibility,
    ratings,
    averageRating: average(Object.values(ratings)),
    ratingCount: 1,
    likes: [],
    likeCount: 0,
    comments: [],
    commentCount: 0,
    createdAt: entry.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function parseToppings(value = "") {
  return String(value).split(",").map(item => item.trim()).filter(Boolean);
}

function timeAgo(value) {
  const then = new Date(value).getTime();
  const diff = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function scrollStyles(direction) {
  const rail = document.querySelector("[data-styles-rail]");
  if (!rail) return;
  rail.scrollBy({ left: direction * 220, behavior: "smooth" });
}

setInterval(() => {
  if (state.tab !== "shop") return;
  state.shopSlide = (state.shopSlide + 1) % products.length;
  render();
}, 4200);

render();
