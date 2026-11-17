// Format numbers in Philippine Pesos (₱)
function formatPHP(amount) {
  return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 6 Curated Philippine-Inspired Refreshment Products
const products = [
  {
    id: 'calamansi-honey-fizz',
    name: 'Calamansi Honey Fizz',
    category: 'Sparkling Coolers',
    badge: 'Best Seller',
    flavorNotes: 'Batangas Calamansi • Wildflower Honey • Crisp Fizz',
    basePrice: 145.00,
    bottleColor: '#FACC15',
    accentColor: '#F97316',
    isPackOnly: false,
    ingredients: 'Cold-pressed Batangas calamansi juice (28%), Bukidnon raw wildflower honey, triple-filtered sparkling mountain water, calamansi peel oil.',
    nutrition: '68 kcal • 14g Natural Honey Sugars • 140% Daily Vitamin C • 0g Fat'
  },
  {
    id: 'davao-pomelo-mint',
    name: 'Davao Pomelo & Mint Splash',
    category: 'Cold-Pressed Juices',
    badge: 'Hydrating',
    flavorNotes: 'Pink Davao Pomelo • Garden Spearmint • Lime Zest',
    basePrice: 165.00,
    bottleColor: '#FB7185',
    accentColor: '#1B4332',
    isPackOnly: false,
    ingredients: '100% cold-pressed Davao ruby pomelo juice, crushed Tagaytay spearmint leaves, splash of dayap lime juice.',
    nutrition: '75 kcal • 16g Fruit Sugars • High Potassium & Electrolytes • 0g Added Sugar'
  },
  {
    id: 'guimaras-mango-sunset',
    name: 'Guimaras Mango Sunset',
    category: 'Cold-Pressed Juices',
    badge: 'Fan Favorite',
    flavorNotes: 'Sweet Guimaras Mango • Valencia Orange • Passionfruit',
    basePrice: 175.00,
    bottleColor: '#F97316',
    accentColor: '#FACC15',
    isPackOnly: false,
    ingredients: 'Cold-pressed Guimaras Carabao mango puree, fresh Valencia orange juice, wild Mindanao passionfruit pulp.',
    nutrition: '110 kcal • 22g Natural Fruit Sugars • Rich in Vitamin A & C • 0g Preservatives'
  },
  {
    id: 'hibiscus-berry-cooler',
    name: 'Hibiscus Berry Cooler',
    category: 'Botanical Iced Teas',
    badge: 'Caffeine-Free',
    flavorNotes: 'Organic Roselle Hibiscus • Benguet Strawberry • Lemon',
    basePrice: 150.00,
    bottleColor: '#E11D48',
    accentColor: '#FACC15',
    isPackOnly: false,
    ingredients: 'Slow-steeped Philippine roselle hibiscus petals, cold-pressed La Trinidad strawberries, lemon juice, organic coco nectar.',
    nutrition: '55 kcal • 11g Coco Nectar • Rich in Antioxidants & Anthocyanins • 0mg Caffeine'
  },
  {
    id: 'pineapple-ginger-zest',
    name: 'Pineapple Ginger Zest',
    category: 'Cold-Pressed Juices',
    badge: 'Immunity Boost',
    flavorNotes: 'Bukidnon Queen Pineapple • Native Ginger • Turmeric',
    basePrice: 160.00,
    bottleColor: '#EAB308',
    accentColor: '#2D6A4F',
    isPackOnly: false,
    ingredients: 'Cold-pressed Bukidnon sweet pineapple, raw native ginger root (8%), fresh yellow turmeric juice, pinch of black pepper.',
    nutrition: '85 kcal • 18g Natural Fruit Sugars • Anti-inflammatory Gingerol • 0g Added Sugar'
  },
  {
    id: 'barkada-taster-box',
    name: 'Sunsip Barkada 6-Bottle Taster Box',
    category: 'Party Packs',
    badge: 'Save ₱90',
    flavorNotes: 'All 5 Signature Flavors + Bonus Calamansi Ginger Shot',
    basePrice: 850.00,
    bottleColor: '#2D6A4F',
    accentColor: '#F97316',
    isPackOnly: true,
    ingredients: 'Includes 1× Calamansi Honey Fizz, 1× Davao Pomelo & Mint, 1× Guimaras Mango Sunset, 1× Hibiscus Berry Cooler, 1× Pineapple Ginger Zest, plus 1× Bonus 330ml Bottle.',
    nutrition: 'Assorted 330ml Glass Bottles • Delivered in an Insulated Sunsip Carrier Box'
  }
];

// Size Options & Multipliers
const sizeOptions = [
  { label: '330ml Bottle', multiplier: 1.0 },
  { label: '500ml Bottle', multiplier: 1.35 },
  { label: '6-Pack', multiplier: 5.4 }
];

// App State
let activeCategory = 'All';
let searchQuery = '';
let selectedSizes = {};
let cart = []; // { key, id, name, variant, price, qty }
let quizState = { mood: 'Zesty & Energizing', fizz: 'Sparkling & Bubbly' };
let subState = { size: '6-Bottle Box', price: 790, orig: 930, cadence: 'Weekly Delivery' };

products.forEach(p => {
  selectedSizes[p.id] = p.isPackOnly ? '6-Bottle Box (330ml)' : '330ml Bottle';
});

function getProductPrice(product) {
  if (product.isPackOnly) return product.basePrice;
  const chosen = selectedSizes[product.id];
  const opt = sizeOptions.find(s => s.label === chosen) || sizeOptions[0];
  return Math.round(product.basePrice * opt.multiplier);
}

// Custom Illustrated Chilled Bottle / Party Box SVG
function getDrinkSVG(product, sizeClass = 'w-40 h-48') {
  if (product.isPackOnly) {
    return `
      <svg viewBox="0 0 220 220" class="${sizeClass} mx-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="110" cy="204" rx="78" ry="9" fill="#1B4332" fill-opacity="0.14"/>
        <!-- 3 Bottles Peeking Out -->
        <rect x="52" y="34" width="28" height="75" rx="10" fill="#FACC15" stroke="#1B4332" stroke-width="2.5"/>
        <rect x="96" y="26" width="28" height="82" rx="10" fill="#F97316" stroke="#1B4332" stroke-width="2.5"/>
        <rect x="140" y="34" width="28" height="75" rx="10" fill="#FB7185" stroke="#1B4332" stroke-width="2.5"/>
        <!-- Carrier Box -->
        <rect x="34" y="88" width="152" height="108" rx="16" fill="#2D6A4F" stroke="#1B4332" stroke-width="3"/>
        <rect x="46" y="102" width="128" height="80" rx="10" fill="#FFFDF7" stroke="#1B4332" stroke-width="2"/>
        <circle cx="110" cy="126" r="14" fill="#FACC15" stroke="#1B4332" stroke-width="2"/>
        <text x="110" y="154" text-anchor="middle" fill="#1B4332" font-family="Outfit, sans-serif" font-weight="900" font-size="11">BARKADA BOX</text>
        <text x="110" y="168" text-anchor="middle" fill="#F97316" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="8">6 CHILLED BOTTLES</text>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 200 230" class="${sizeClass} mx-auto drop-shadow-md transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="216" rx="54" ry="8" fill="#1B4332" fill-opacity="0.14"/>
      <!-- Decorative Citrus Slice Behind Bottle -->
      <circle cx="142" cy="176" r="24" fill="${product.accentColor}" stroke="#1B4332" stroke-width="2.2"/>
      <circle cx="142" cy="176" r="18" fill="#FFFDF7" fill-opacity="0.9"/>
      <path d="M142 158V194M124 176H160" stroke="${product.accentColor}" stroke-width="2.2"/>
      <!-- Tropical Leaf -->
      <path d="M56 184C34 166 32 136 52 118C64 140 66 162 56 184Z" fill="#2D6A4F" stroke="#1B4332" stroke-width="2"/>
      <!-- Bottle Cap -->
      <rect x="85" y="14" width="30" height="13" rx="4" fill="#1B4332"/>
      <!-- Glass Bottle Body -->
      <path d="M88 27H112L119 62C128 71 132 82 132 96V194C132 205 123 214 112 214H88C77 214 68 205 68 194V96C68 82 72 71 81 62L88 27Z" fill="${product.bottleColor}" stroke="#1B4332" stroke-width="3"/>
      <!-- Glass Shine -->
      <path d="M77 92V188" stroke="#FFFDF7" stroke-width="3.2" stroke-linecap="round" stroke-opacity="0.6"/>
      <!-- Bottle Label -->
      <rect x="74" y="104" width="52" height="74" rx="9" fill="#FFFDF7" stroke="#1B4332" stroke-width="2"/>
      <circle cx="100" cy="124" r="10" fill="${product.accentColor}"/>
      <text x="100" y="146" text-anchor="middle" fill="#1B4332" font-family="Outfit, sans-serif" font-weight="900" font-size="9">SUNSIP</text>
      <text x="100" y="157" text-anchor="middle" fill="#2D6A4F" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="6.4">COLD-PRESSED</text>
      <text x="100" y="168" text-anchor="middle" fill="#F97316" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="6.2">100% PH FRUIT</text>
      <!-- Chilled Condensation Drops -->
      <ellipse cx="120" cy="84" rx="2.5" ry="4" fill="#FFFDF7"/>
      <circle cx="79" cy="76" r="2.2" fill="#FFFDF7"/>
      <circle cx="121" cy="188" r="2.5" fill="#FFFDF7"/>
    </svg>
  `;
}

// Render Product Grid
function renderProducts() {
  const grid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  const searchBanner = document.getElementById('searchStatusBanner');
  const searchQueryDisplay = document.getElementById('searchQueryDisplay');

  const filtered = products.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.flavorNotes.toLowerCase().includes(q) ||
      p.ingredients.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  if (searchQuery.trim() !== '') {
    searchBanner.classList.remove('hidden');
    searchQueryDisplay.textContent = searchQuery;
  } else {
    searchBanner.classList.add('hidden');
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  grid.innerHTML = filtered.map(product => {
    const currentPrice = getProductPrice(product);
    const currentSize = selectedSizes[product.id];

    return `
      <article class="group bg-white border-2 border-leafBorder rounded-3xl p-6 shadow-citrus hover:shadow-citrus-lg transition flex flex-col justify-between">
        <div>
          <!-- Category & Promo Badges -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-citrusMist text-peelGreen border border-leafBorder">
              ${product.category}
            </span>
            <span class="text-[11px] font-extrabold px-3 py-1 rounded-full bg-sunnyLemon/45 text-peelGreen">
              ${product.badge}
            </span>
          </div>

          <!-- Clickable Illustrated Bottle Showcase -->
          <div onclick="openQuickView('${product.id}')" class="cursor-pointer bg-gradient-to-b from-warmSand/75 to-citrusMist/80 hover:from-warmSand rounded-2xl py-5 px-4 mb-5 border border-leafBorder relative overflow-hidden transition">
            ${getDrinkSVG(product)}
            <span class="absolute bottom-2.5 right-2.5 bg-white/95 border border-leafBorder text-peelGreen text-[10px] font-extrabold px-2.5 py-1 rounded-full">
              Ingredients &amp; Info
            </span>
          </div>

          <!-- Title, Price & Flavor Notes -->
          <div class="flex items-start justify-between gap-2">
            <h3 onclick="openQuickView('${product.id}')" class="cursor-pointer font-display font-extrabold text-xl text-peelGreen hover:text-tangerine transition leading-snug">${product.name}</h3>
            <span class="font-display font-black text-xl text-peelGreen shrink-0">${formatPHP(currentPrice)}</span>
          </div>
          <p class="text-xs font-bold text-tangerine mt-1">${product.flavorNotes}</p>
        </div>

        <!-- Size Selector & Add to Cart -->
        <div class="mt-5 pt-4 border-t border-leafBorder space-y-3">
          <div>
            <label class="block text-[11px] font-extrabold uppercase tracking-wider text-peelGreenLight mb-1.5">Bottle Format</label>
            ${product.isPackOnly ? `
              <div class="text-xs font-extrabold py-2 px-3 rounded-xl bg-citrusMist border border-leafBorder text-peelGreen text-center">
                6-Bottle Taster Box (6 × 330ml)
              </div>
            ` : `
              <div class="grid grid-cols-3 gap-1.5">
                ${sizeOptions.map(opt => `
                  <button
                    type="button"
                    onclick="selectSize('${product.id}', '${opt.label}')"
                    class="text-[11px] font-extrabold py-1.5 px-1.5 rounded-xl border transition ${
                      currentSize === opt.label
                        ? 'bg-peelGreen text-suncream border-peelGreen'
                        : 'bg-suncream text-peelGreen border-leafBorder hover:border-peelGreen/40'
                    }">
                    ${opt.label}
                  </button>
                `).join('')}
              </div>
            `}
          </div>

          <button
            type="button"
            onclick="addToCart('${product.id}')"
            class="w-full bg-tangerine hover:bg-tangerineDark text-white font-extrabold text-sm py-3.5 px-5 rounded-full shadow-sm transition active:scale-95 flex items-center justify-center gap-2">
            <span>Add to Cart</span>
            <span>•</span>
            <span>${formatPHP(currentPrice)}</span>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function selectSize(productId, sizeLabel) {
  selectedSizes[productId] = sizeLabel;
  renderProducts();
}

// Category Filter Logic
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => filterByCategory(btn.dataset.filter));
});

function filterByCategory(category) {
  activeCategory = category;
  document.querySelectorAll('.filter-btn').forEach(b => {
    const isActive = b.dataset.filter === category;
    b.classList.toggle('active', isActive);
    b.classList.toggle('bg-peelGreen', isActive);
    b.classList.toggle('text-suncream', isActive);
    b.classList.toggle('bg-citrusMist', !isActive);
    b.classList.toggle('text-peelGreen', !isActive);
  });
  renderProducts();
}

// Real-time Search Logic
const searchDesktop = document.getElementById('searchInputDesktop');
const searchMobile = document.getElementById('searchInputMobile');
const clearSearchDesktop = document.getElementById('clearSearchDesktop');

function handleSearch(val) {
  searchQuery = val;
  if (searchDesktop.value !== val) searchDesktop.value = val;
  if (searchMobile.value !== val) searchMobile.value = val;
  clearSearchDesktop.classList.toggle('hidden', !val);
  renderProducts();
}

searchDesktop.addEventListener('input', e => handleSearch(e.target.value));
searchMobile.addEventListener('input', e => handleSearch(e.target.value));
clearSearchDesktop.addEventListener('click', () => handleSearch(''));

function resetFilters() {
  handleSearch('');
  filterByCategory('All');
}

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
function closeMobileMenu() { mobileMenu.classList.add('hidden'); }

// Quick-View Modal
function openQuickView(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const currentPrice = getProductPrice(product);
  const currentSize = selectedSizes[product.id];

  document.getElementById('quickViewContent').innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
      <div class="sm:col-span-5 bg-warmSand rounded-2xl p-5 border border-leafBorder">
        ${getDrinkSVG(product, 'w-36 h-44')}
      </div>
      <div class="sm:col-span-7 space-y-3">
        <div class="flex items-center gap-2">
          <span class="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-citrusMist border border-leafBorder text-peelGreen">${product.category}</span>
          <span class="text-[11px] font-extrabold px-3 py-1 rounded-full bg-sunnyLemon/50 text-peelGreen">${product.badge}</span>
        </div>
        <h3 class="font-display font-black text-2xl sm:text-3xl text-peelGreen">${product.name}</h3>
        <p class="font-display font-black text-2xl text-tangerine">${formatPHP(currentPrice)} <span class="text-xs font-sans font-bold text-peelGreenLight">(${currentSize})</span></p>
        <p class="text-xs font-extrabold text-peelGreen">${product.flavorNotes}</p>
        <div class="bg-citrusMist border border-leafBorder rounded-2xl p-3.5 text-xs space-y-2">
          <p><strong class="text-peelGreen">Cold-Pressed Ingredients:</strong> <span class="text-peelGreenLight">${product.ingredients}</span></p>
          <p><strong class="text-peelGreen">Nutrition Highlights:</strong> <span class="text-peelGreenLight">${product.nutrition}</span></p>
        </div>
        <button type="button" onclick="addToCart('${product.id}'); closeQuickView();" class="w-full bg-tangerine hover:bg-tangerineDark text-white font-extrabold text-sm py-3.5 rounded-full shadow-md transition">
          + Add Chilled Drink to Cart • ${formatPHP(currentPrice)}
        </button>
      </div>
    </div>
  `;

  const modal = document.getElementById('quickViewModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// 2-Step 'Find Your Sip' Mood Quiz Logic (Synced Inline + Modal)
function updateQuizMatch() {
  let match = products[0]; // Calamansi Honey Fizz
  let reason = 'Zesty Batangas calamansi lifted with crisp bubbles and a touch of raw honey for instant afternoon revival.';

  if (quizState.mood === 'Herbal & Calm') {
    match = products.find(p => p.id === 'hibiscus-berry-cooler');
    reason = 'Caffeine-free organic roselle hibiscus steeped with Benguet strawberries for a soothing botanical cool-down.';
  } else if (quizState.mood === 'Crisp & Hydrating') {
    match = products.find(p => p.id === 'davao-pomelo-mint');
    reason = 'Juicy pink Davao pomelo paired with cooling Tagaytay spearmint to replenish electrolytes fast.';
  } else if (quizState.mood === 'Fruity & Sweet') {
    match = products.find(p => p.id === 'guimaras-mango-sunset');
    reason = 'Lush, sun-ripened Guimaras Carabao mango blended with passionfruit for pure tropical sweetness.';
  } else if (quizState.fizz === 'Still & Pure Pressed') {
    match = products.find(p => p.id === 'pineapple-ginger-zest');
    reason = 'Cold-pressed Bukidnon pineapple with a bright native ginger & turmeric kick—zero bubbles, maximum zing.';
  } else {
    match = products.find(p => p.id === 'calamansi-honey-fizz');
    reason = 'Zesty Batangas calamansi lifted with crisp bubbles and a touch of raw honey for instant afternoon revival.';
  }

  // Sync Inline Quiz Card
  document.getElementById('inlineQuizMatchTitle').textContent = match.name;
  document.getElementById('inlineQuizMatchNotes').textContent = `${match.category} • ${match.flavorNotes}`;
  document.getElementById('inlineQuizMatchReason').textContent = reason;
  document.getElementById('inlineQuizMatchPrice').textContent = formatPHP(match.basePrice);

  // Sync Modal Quiz Card
  document.getElementById('modalQuizTitle').textContent = match.name;
  document.getElementById('modalQuizNotes').textContent = match.flavorNotes;
  document.getElementById('modalQuizPrice').textContent = formatPHP(match.basePrice);

  return match;
}

function setQuizMood(mood) {
  quizState.mood = mood;
  document.querySelectorAll('.inline-mood-btn, .modal-mood-btn').forEach(btn => {
    const text = btn.dataset.mood || btn.textContent;
    const active = text.includes(mood);
    btn.classList.toggle('bg-peelGreen', active);
    btn.classList.toggle('text-suncream', active);
    btn.classList.toggle('border-peelGreen', active);
    btn.classList.toggle('bg-white', !active);
    btn.classList.toggle('text-peelGreen', !active);
    btn.classList.toggle('border-leafBorder', !active);
  });
  updateQuizMatch();
}

function setQuizFizz(fizz) {
  quizState.fizz = fizz;
  document.querySelectorAll('.inline-fizz-btn, .modal-fizz-btn').forEach(btn => {
    const key = btn.dataset.fizz || btn.textContent.trim();
    const active = fizz.includes(key);
    btn.classList.toggle('bg-tangerine', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('border-tangerine', active);
    btn.classList.toggle('bg-white', !active);
    btn.classList.toggle('text-peelGreen', !active);
    btn.classList.toggle('border-leafBorder', !active);
  });
  updateQuizMatch();
}

document.querySelectorAll('.inline-mood-btn').forEach(btn => {
  btn.addEventListener('click', () => setQuizMood(btn.dataset.mood));
});

document.querySelectorAll('.inline-fizz-btn').forEach(btn => {
  btn.addEventListener('click', () => setQuizFizz(btn.dataset.fizz));
});

function addQuizMatchToCart() {
  const match = updateQuizMatch();
  addToCart(match.id, '330ml Bottle', match.basePrice, match.name);
}

function openQuizModal() {
  const modal = document.getElementById('quizModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeQuizModal() {
  const modal = document.getElementById('quizModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Subscription Box Configurator Logic
document.querySelectorAll('.sub-size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    subState.size = btn.dataset.size;
    subState.price = parseFloat(btn.dataset.price);
    subState.orig = parseFloat(btn.dataset.orig);

    document.querySelectorAll('.sub-size-btn').forEach(b => {
      const active = b.dataset.size === subState.size;
      b.classList.toggle('bg-peelGreen', active);
      b.classList.toggle('text-suncream', active);
      b.classList.toggle('border-peelGreen', active);
      b.classList.toggle('bg-citrusMist', !active);
      b.classList.toggle('text-peelGreen', !active);
    });

    document.getElementById('subDisplayPrice').textContent = formatPHP(subState.price);
    document.getElementById('subDisplayOrig').textContent = formatPHP(subState.orig);
  });
});

document.querySelectorAll('.sub-cadence-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    subState.cadence = btn.dataset.cadence;
    document.querySelectorAll('.sub-cadence-btn').forEach(b => {
      const active = b.dataset.cadence === subState.cadence;
      b.classList.toggle('bg-tangerine', active);
      b.classList.toggle('text-white', active);
      b.classList.toggle('border-tangerine', active);
      b.classList.toggle('bg-citrusMist', !active);
      b.classList.toggle('text-peelGreen', !active);
    });
  });
});

function addSubscriptionToCart() {
  const mix = document.getElementById('subMixSelect').value;
  const title = `Chilled Subscription (${subState.size} • ${subState.cadence})`;
  addToCart('chilled-sub', mix, subState.price, title);
  toggleCartDrawer(true);
}

// Cart Operations
function addToCart(productId, customVariant = null, customPrice = null, customName = null) {
  const product = products.find(p => p.id === productId);
  const variant = customVariant || (product ? selectedSizes[product.id] : '330ml Bottle');
  const price = customPrice !== null ? customPrice : getProductPrice(product);
  const name = customName || product.name;
  const key = `${productId}__${variant}__${name}`;

  const existing = cart.find(item => item.key === key);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ key, id: productId, name, variant, price, qty: 1 });
  }

  updateCartUI();
  showToast(`Chilled & added: ${name}`);
}

function updateItemQty(key, delta) {
  const idx = cart.findIndex(item => item.key === key);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartUI();
}

function removeCartItem(key) {
  cart = cart.filter(item => item.key !== key);
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const container = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShippingCost');
  const totalEl = document.getElementById('cartTotal');
  const progressText = document.getElementById('shippingProgressText');
  const progressBar = document.getElementById('shippingProgressBar');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const threshold = 1200;
  const shipping = subtotal === 0 ? 0 : (subtotal >= threshold ? 0 : 99);

  badge.textContent = totalQty;

  // Free Chilled Delivery Progress Bar toward ₱1,200
  const pct = Math.min(100, (subtotal / threshold) * 100);
  progressBar.style.width = `${pct}%`;

  if (subtotal >= threshold) {
    progressText.innerHTML = `🧊 You unlocked <span class="text-peelGreenLight font-extrabold">FREE Chilled Delivery!</span>`;
    shippingEl.textContent = 'FREE';
    shippingEl.classList.add('text-tangerine');
  } else {
    const remaining = threshold - subtotal;
    progressText.innerHTML = `Add <span class="text-tangerine font-extrabold">${formatPHP(remaining)}</span> more for <span class="underline">FREE Chilled Delivery</span>!`;
    shippingEl.textContent = subtotal === 0 ? '₱0.00' : formatPHP(shipping);
    shippingEl.classList.remove('text-tangerine');
  }

  subtotalEl.textContent = formatPHP(subtotal);
  totalEl.textContent = formatPHP(subtotal + shipping);
  checkoutBtn.disabled = cart.length === 0;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-14 space-y-3">
        <div class="w-16 h-16 rounded-full bg-warmSand border border-sunnyLemon flex items-center justify-center mx-auto text-2xl">🍹</div>
        <p class="font-display font-extrabold text-xl text-peelGreen">Your chilled cooler is empty</p>
        <p class="text-xs text-peelGreenLight max-w-xs mx-auto">Add ₱1,200 worth of cold-pressed juices and coolers for free chilled delivery in Metro Manila &amp; Davao.</p>
        <button type="button" onclick="toggleCartDrawer(false)" class="mt-2 inline-block bg-peelGreen text-suncream text-xs font-extrabold px-5 py-2.5 rounded-full">Explore Refreshments</button>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="bg-white border border-leafBorder rounded-2xl p-4 flex items-center justify-between gap-3">
      <div class="min-w-0">
        <h4 class="font-display font-extrabold text-base text-peelGreen truncate">${item.name}</h4>
        <p class="text-xs text-peelGreenLight truncate">Format: <span class="font-bold text-peelGreen">${item.variant}</span></p>
        <p class="text-sm font-extrabold text-tangerine mt-1">${formatPHP(item.price * item.qty)}</p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <div class="flex items-center bg-citrusMist border border-leafBorder rounded-full">
          <button type="button" onclick="updateItemQty('${item.key}', -1)" class="w-7 h-7 flex items-center justify-center font-extrabold text-peelGreen hover:text-tangerine">−</button>
          <span class="px-2 text-xs font-extrabold text-peelGreen">${item.qty}</span>
          <button type="button" onclick="updateItemQty('${item.key}', 1)" class="w-7 h-7 flex items-center justify-center font-extrabold text-peelGreen hover:text-tangerine">+</button>
        </div>
        <button type="button" onclick="removeCartItem('${item.key}')" class="text-xs text-peelGreenLight hover:text-red-600 p-1" aria-label="Remove item">✕</button>
      </div>
    </div>
  `).join('');
}

function toggleCartDrawer(open) {
  const overlay = document.getElementById('cartOverlay');
  overlay.classList.toggle('hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
}

// Simulated Checkout & Itemized Philippine Peso Receipt
function openCheckoutModal() {
  toggleCartDrawer(false);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal >= 1200 ? 0 : 99;
  const orderNum = 'SUN-' + Math.floor(100000 + Math.random() * 900000);

  document.getElementById('checkoutReceiptBox').innerHTML = `
    <div class="flex justify-between font-extrabold text-peelGreen pb-1.5 border-b border-leafBorder">
      <span>Order #${orderNum}</span>
      <span class="text-tangerine">Chilled Dispatch</span>
    </div>
    ${cart.map(i => `
      <div class="flex justify-between text-peelGreenLight">
        <span class="truncate pr-2">${i.qty}× ${i.name} (${i.variant})</span>
        <span class="shrink-0 font-bold text-peelGreen">${formatPHP(i.price * i.qty)}</span>
      </div>
    `).join('')}
    <div class="flex justify-between text-peelGreenLight pt-1 border-t border-leafBorder/60">
      <span>Chilled Delivery</span>
      <span>${shipping === 0 ? 'FREE' : formatPHP(shipping)}</span>
    </div>
    <div class="flex justify-between font-extrabold text-sm text-peelGreen pt-1.5 border-t border-leafBorder">
      <span>Total Paid (PHP)</span>
      <span class="font-display text-base text-tangerine">${formatPHP(subtotal + shipping)}</span>
    </div>
  `;

  const modal = document.getElementById('checkoutModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function completeDemoOrder() {
  cart = [];
  updateCartUI();
  closeCheckoutModal();
  showToast('Salamat! Your chilled Sunsip cooler is on the way.');
}

// Newsletter Form
document.getElementById('newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('newsletterEmail');
  if (!input.value.trim()) return;
  showToast('Welcome to Sunsip! Use code SUNSHINE10 for 10% off.');
  input.value = '';
});

// Toast Notification
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMessage').textContent = msg;
  toast.classList.remove('translate-y-24', 'opacity-0');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3200);
}

// Initialize Storefront
renderProducts();
updateCartUI();
updateQuizMatch();
