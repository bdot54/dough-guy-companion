const ASSETS = {
  logo: "./assets/logo.avif",
  oneBite: "./assets/one-bite.webp",
  tezza: "./assets/tezza-8213.webp",
  nyStyle: "./assets/ny-style-tiktok.jpg",
  neapolitan: "./assets/neapolitan-margherita-pizza.webp"
};

const today = new Date().toISOString().slice(0, 10);

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
  journalForm: {
    date: today,
    recipe: "48h cold ferment, 65% hydration classic",
    ovenTemp: 550,
    preheat: 60,
    toppings: "San Marzano, fresh mozzarella, fresh basil, EVOO",
    score: 8,
    notes: "Slightly pale in center, add 15 minutes preheat next bake."
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
    shape: "round"
  },
  {
    name: "Dough Guy Perforated Aluminum Peel",
    price: "$45.00",
    copy: "Lightweight, non-stick, effortlessly launches pizzas.",
    shape: "peel"
  },
  {
    name: "Dough Guy Wooden Peel",
    price: "$45.00",
    copy: "Lightweight launch control with classic shop-counter vibes.",
    shape: "peel wood"
  },
  {
    name: "Modular Dough Proofing Tins",
    price: "$24.99",
    copy: "Three stackable, airtight tins that fit standard refrigerators.",
    shape: "tins"
  },
  {
    name: "Modular Dough Proofing Boxes",
    price: "$24.99",
    copy: "Stackable, airtight, fridge-friendly proofing boxes.",
    shape: "tins"
  },
  {
    name: "Ergonomic Rocker Blade",
    price: "$19.99",
    copy: "Perfect, clean, single-motion slices across the whole pie.",
    shape: "steel"
  },
  {
    name: "Dough Guy Detroit / Grandma Pan",
    price: "$34.99",
    copy: "Crispy cheese edges, square pie confidence, pan-pizza weekends.",
    shape: "pan"
  },
  {
    name: "Dough Guy Round Pizza Cutter",
    price: "$14.99",
    copy: "Classic wheel cutter for clean slices when the rocker is off duty.",
    shape: "cutter"
  },
  {
    name: "Dough Guy Kitchen Scale",
    price: "$24.99",
    copy: "Because vibes are good, but grams make better dough.",
    shape: "scale"
  },
  {
    name: "Dough Guy Pizza Screens",
    price: "$18.99",
    copy: "Extra crisp insurance for reheats, thin pies, and no-flop experiments.",
    shape: "screen"
  },
  {
    name: "Dough Guy Pizza Pin",
    price: "$17.99",
    copy: "A rolling pin built for bar pies, tavern pies, and thin-crust missions.",
    shape: "pin"
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
    ["styles", "Pizza Styles", "pizza-full"],
    ["pies", "My Pies", "journal"],
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
          <span class="eyebrow">Restaurant quality pizza in your oven</span>
          <h1>No flop jalops.</h1>
          <p>Your pizza wingman.</p>
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
        <div class="mission-copy">${recipe.mission}</div>
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
        <button class="btn btn-primary" data-action="start-flow" type="button">Start Dough Timer</button>
        <button class="btn" data-action="save-recipe" type="button">Save Recipe</button>
        <button class="btn btn-dark" data-action="shop-recipe" type="button">Shop tools for this recipe</button>
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
  return `
    <section class="screen">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Pizza Styles</h2>
            <p>Pick a pie personality and get weird this weekend.</p>
          </div>
          <div class="slider-controls">
            <button class="slider-btn" data-action="styles-prev" type="button" aria-label="Previous pizza style">&larr;</button>
            <button class="slider-btn" data-action="styles-next" type="button" aria-label="Next pizza style">&rarr;</button>
          </div>
        </div>
        <div class="styles-wrap">
          <div class="styles-rail" data-styles-rail>
            ${styleCards.map(([name, copy, tag, image]) => `
              <article class="style-card">
              <img class="pizza-photo" src="${image}" alt="${name} pizza" />
              <span class="chip">${tag}</span>
              <h3>${name}</h3>
              <p>${copy}</p>
            </article>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Weekend Trifecta</h2>
            <p>Friday NY style, then Detroit and bar pie. Strong weekend.</p>
          </div>
        </div>
        <div class="step-list">
          <article class="trifecta-card"><img src="${pizzaImages.ny}" alt="NY style pizza" /><div class="step-copy"><strong>Friday: NY Style</strong><span>Big slice, good fold, beautiful undercarriage.</span></div><span class="tiny-timer">550&deg;F</span></article>
          <article class="trifecta-card"><img src="${pizzaImages.detroit}" alt="Detroit style pizza" /><div class="step-copy"><strong>Saturday: Detroit Style</strong><span>Cheese edge trophy run. Thick but light on its feet.</span></div><span class="tiny-timer">Pan</span></article>
          <article class="trifecta-card"><img src="${pizzaImages.bar}" alt="Bar pie pizza" /><div class="step-copy"><strong>Sunday: Bar Pie</strong><span>Thin, crisp, no flop. Its only right.</span></div><span class="tiny-timer">Fast</span></article>
        </div>
      </section>
    </section>
  `;
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
      <div class="field">
        <div class="field-label"><span>Undercarriage and bake score</span></div>
        <div class="score-row">
          <input type="range" min="1" max="10" value="${form.score}" data-journal="score" />
          <span class="score-pill">${form.score}/10</span>
        </div>
      </div>
      <div class="field photo-picker">
        <div class="field-label"><span>Pizza photo</span></div>
        <div class="photo-preview">${state.journalPhoto ? `<img src="${state.journalPhoto}" alt="Pizza preview" />` : `<span>Camera ready. Zoom in bro, dont be shy.</span>`}</div>
        <label class="btn btn-primary">
          Open Camera
          <input hidden type="file" accept="image/*" capture="environment" data-action="capture-photo" />
        </label>
      </div>
      <div class="field">
        <label class="field-label">Next Time Fix...</label>
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
  return `
    <article class="entry-card">
      <div class="entry-thumb">${entry.photo ? `<img src="${entry.photo}" alt="${escapeAttr(entry.recipe)}" />` : ""}</div>
      <div>
        <h3>${escapeHtml(entry.recipe)}</h3>
        <div class="entry-meta">
          <span>${entry.date}</span>
          <span>${entry.ovenTemp}&deg;F</span>
          <span>${entry.preheat} min</span>
          <span>${entry.score}/10</span>
        </div>
        <p>${escapeHtml(entry.notes || entry.toppings)}</p>
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
    state.journalForm[journalKey] = event.target.type === "number" || event.target.type === "range"
      ? Number(event.target.value)
      : event.target.value;
    if (journalKey === "score") render();
  }
});

document.addEventListener("change", event => {
  if (event.target.dataset.action === "capture-photo" && event.target.files?.[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      state.journalPhoto = reader.result;
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
    state.calc[segment.dataset.segment] = segment.dataset.value;
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
    toast("Bake note discarded.");
  }
  if (action === "save-bake") saveBake();
  if (action === "styles-prev" || action === "styles-next") {
    scrollStyles(action === "styles-next" ? 1 : -1);
    return;
  }
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
    photo: state.journalPhoto
  };
  state.entries = [entry, ...state.entries];
  persistEntries();
  state.journalOpen = false;
  state.journalPhoto = "";
  celebrate("Bake logged. Improve every time.");
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
