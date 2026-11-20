// Format numbers in Philippine Pesos (₱)
 function formatPHP(amount) {
  return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 6 Curated Philippine-Inspired Refreshment Products (loaded from js/products.js)
let products = [];

if (typeof PRODUCTS !== 'undefined') {
  const categoryColors = {
    'Cold-Pressed Juices': { bottle: '#FACC15', accent: '#1B4332' },
    'Botanical Coolers': { bottle: '#FB7185', accent: '#2D6A4F' },
    'Sparkling Refreshers': { bottle: '#FACC15', accent: '#F97316' },
    'Party Packs': { bottle: '#2D6A4F', accent: '#F97316' },
  };

  products = PRODUCTS.map(p => {
    const colors = categoryColors[p.category] || { bottle: '#FACC15', accent: '#1B4332' };
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      badge: p.badge,
      flavorNotes: p.tags.join(' • '),
      basePrice: p.price,
      bottleColor: colors.bottle,
      accentColor: colors.accent,
      isPackOnly: p.isBundle || false,
      ingredients: p.description,
      nutrition: p.calories,
    };
  });
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

// --- localStorage persistence ---
const STORAGE_KEYS = {
  CART: 'sunsip_cart',
  USER: 'sunsip_user',
  QUIZ_MATCH: 'sunsip_quiz_match',
  ORDERS: 'sunsip_orders',
};

let currentUser = null;
let quizMatchId = null;

 function loadState() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (savedCart) cart = JSON.parse(savedCart);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    }
    const savedQuizMatch = localStorage.getItem(STORAGE_KEYS.QUIZ_MATCH);
    if (savedQuizMatch) quizMatchId = savedQuizMatch;
  } catch (e) {
    console.warn('Failed to load state from localStorage', e);
  }
  renderAuthHeader();
}

 function saveCart() {
  try { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); } catch (e) {}
}

 function saveUser(user) {
  currentUser = user;
  try { localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)); } catch (e) {}
  renderAuthHeader();
}

 function logout() {
  currentUser = null;
  try { localStorage.removeItem(STORAGE_KEYS.USER); } catch (e) {}
  renderAuthHeader();
  showToast('Signed out');
}

 function saveQuizMatchId(productId) {
  quizMatchId = productId;
  try { localStorage.setItem(STORAGE_KEYS.QUIZ_MATCH, productId); } catch (e) {}
}

 function getCurrentUser() {
  return currentUser;
}

 function isLoggedIn() {
  return !!currentUser;
}

 function renderAuthHeader() {
  const authHeader = document.getElementById('authHeader');
  const userName = document.getElementById('userName');
  const orderHistoryBtn = document.getElementById('orderHistoryBtn');
  const signupLink = document.getElementById('signupLink');
  const signinLink = document.getElementById('signinLink');
  const signoutBtn = document.querySelector('[data-action="signout"]');

  if (currentUser) {
    if (authHeader) authHeader.classList.remove('hidden');
    if (userName) userName.textContent = currentUser.name;
    if (orderHistoryBtn) orderHistoryBtn.classList.remove('hidden');
    if (signoutBtn) signoutBtn.classList.remove('hidden');
    if (signupLink) signupLink.classList.add('hidden');
    if (signinLink) signinLink.classList.add('hidden');
  } else {
    if (authHeader) authHeader.classList.add('hidden');
    if (userName) userName.textContent = '';
    if (orderHistoryBtn) orderHistoryBtn.classList.add('hidden');
    if (signoutBtn) signoutBtn.classList.add('hidden');
    if (signupLink) signupLink.classList.remove('hidden');
    if (signinLink) signinLink.classList.remove('hidden');
  }
}

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
  let match = products[0]; // Mindoro Calamansi & Wildflower Honey
  let reason = 'Zesty native calamansi balanced with raw highland wildflower honey and cold mountain spring water for instant afternoon revival.';

  if (quizState.mood === 'Herbal & Calm') {
    match = products.find(p => p.id === 'ref-davao-mangosteen-hibiscus');
    reason = 'Deep ruby mangosteen cold-pressed with steeped gumamela (hibiscus) petals for a floral, antioxidant-rich sip.';
  } else if (quizState.mood === 'Crisp & Hydrating') {
    match = products.find(p => p.id === 'ref-davao-pomelo-mint');
    reason = 'Juicy pink Davao suha (pomelo) segments muddled with crushed spearmint leaves and a splash of green lime.';
  } else if (quizState.mood === 'Fruity & Sweet') {
    match = products.find(p => p.id === 'ref-guimaras-mango-passion');
    reason = 'Sweet export-grade Guimaras Carabao mangoes cold-pressed with tangy purple passionfruit seeds.';
  } else if (quizState.fizz === 'Still & Pure Pressed') {
    match = products.find(p => p.id === 'ref-bukidnon-pineapple-ginger');
    reason = 'Sun-ripened Bukidnon MD2 pineapple pressed with fresh turmeric (luyang dilaw), ginger root, and sparkling fizz.';
  } else {
    match = products.find(p => p.id === 'ref-calamansi-honey-zest');
    reason = 'Hand-squeezed native calamansi balanced with raw highland wildflower honey and cold mountain spring water.';
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

  saveQuizMatchId(match.id);

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

 function filterByQuizMatch() {
  if (!quizMatchId) return;
  const product = products.find(p => p.id === quizMatchId);
  if (!product) return;

  // Save match id for persistence
  saveQuizMatchId(quizMatchId);

  // Filter by matched category
  filterByCategory(product.category);

  // Highlight the matched product by scrolling to menu and setting a temporary search
  const el = document.getElementById('drink-menu');
  if (el) el.scrollIntoView({ behavior: 'smooth' });

  showToast(`Showing ${product.category} drinks matching your sip quiz`);
}

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
  saveCart();
  showToast(`Chilled & added: ${name}`);
}

 function updateItemQty(key, delta) {
  const idx = cart.findIndex(item => item.key === key);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartUI();
  saveCart();
}

function removeCartItem(key) {
  cart = cart.filter(item => item.key !== key);
  updateCartUI();
  saveCart();
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

// Simulated Checkout & Itemized Philippine Peso Receipt (Multi-Step)
let checkoutState = {
  step: 1,
  payment: null,
  delivery: { name: '', city: '', phone: '', address: '' },
};

 function openCheckoutModal() {
  toggleCartDrawer(false);
  checkoutState.step = 1;
  checkoutState.payment = null;
  checkoutState.delivery = { name: '', city: '', phone: '', address: '' };

  document.querySelectorAll('.checkout-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.checkout-step').forEach((s, i) => {
    s.className = i === 0 ? 'checkout-step w-5 h-5 rounded-full bg-tangerine flex items-center justify-center text-white font-bold text-[10px] shadow-sm' : 'checkout-step w-5 h-5 rounded-full bg-leafBorder text-peelGreen flex items-center justify-center text-[10px]';
  });
  document.getElementById('checkoutStep1Panel').classList.remove('hidden');
  document.getElementById('checkoutStep1').className = 'checkout-step w-5 h-5 rounded-full bg-tangerine flex items-center justify-center text-white font-bold text-[10px] shadow-sm';

  document.getElementById('checkoutDeliveryForm').reset();
  document.getElementById('checkoutPaymentDetails').classList.add('hidden');
  document.querySelectorAll('.payment-option').forEach(b => {
    b.className = 'payment-option w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 border-leafBorder bg-white text-peelGreen font-extrabold transition hover:border-tangerine/50';
  });
  document.getElementById('checkoutBtnStep2').classList.add('opacity-50', 'pointer-events-none');
  document.getElementById('checkoutBtnStep2').disabled = true;

  renderCheckoutStep3();

  const modal = document.getElementById('checkoutModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

 function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

 function checkoutNextStep(fromStep) {
  if (fromStep === 1) {
    const form = document.getElementById('checkoutDeliveryForm');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    checkoutState.delivery.name = document.getElementById('checkoutName').value;
    checkoutState.delivery.city = document.getElementById('checkoutCity').value;
    checkoutState.delivery.phone = document.getElementById('checkoutPhone').value;
    checkoutState.delivery.address = document.getElementById('checkoutAddress').value;

    const cityNote = document.getElementById('checkoutCityNote');
    if (checkoutState.delivery.city) {
      cityNote.classList.remove('hidden');
    }
  } else if (fromStep === 2) {
    if (!checkoutState.payment) {
      showToast('Please select a payment method.');
      return;
    }
  }

  checkoutState.step = fromStep + 1;
  document.querySelectorAll('.checkout-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(`checkoutStep${checkoutState.step}Panel`).classList.remove('hidden');

  document.querySelectorAll('.checkout-step').forEach((s, i) => {
    const active = i < checkoutState.step;
    s.className = active ? 'checkout-step w-5 h-5 rounded-full bg-tangerine flex items-center justify-center text-white font-bold text-[10px] shadow-sm' : 'checkout-step w-5 h-5 rounded-full bg-leafBorder text-peelGreen flex items-center justify-center text-[10px]';
  });

  if (checkoutState.step === 3) {
    renderCheckoutStep3();
  }
}

 function checkoutPrevStep() {
  if (checkoutState.step <= 1) return;
  checkoutState.step -= 1;
  document.querySelectorAll('.checkout-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(`checkoutStep${checkoutState.step}Panel`).classList.remove('hidden');

  document.querySelectorAll('.checkout-step').forEach((s, i) => {
    const active = i < checkoutState.step;
    s.className = active ? 'checkout-step w-5 h-5 rounded-full bg-tangerine flex items-center justify-center text-white font-bold text-[10px] shadow-sm' : 'checkout-step w-5 h-5 rounded-full bg-leafBorder text-peelGreen flex items-center justify-center text-[10px]';
  });
}

 function selectPayment(method) {
  checkoutState.payment = method;
  document.querySelectorAll('.payment-option').forEach(b => {
    const isSelected = b.id === `payment-${method}`;
    if (isSelected) {
      b.className = 'payment-option w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 border-tangerine bg-tangerine/10 text-peelGreen font-extrabold transition shadow-sm';
    } else {
      b.className = 'payment-option w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 border-leafBorder bg-white text-peelGreen font-extrabold transition hover:border-tangerine/50';
    }
  });

  document.getElementById('checkoutPaymentDetails').classList.remove('hidden');
  document.querySelectorAll('.payment-detail').forEach(d => d.classList.add('hidden'));
  const detail = document.getElementById(`checkout${method.charAt(0).toUpperCase() + method.slice(1)}Info`);
  if (detail) detail.classList.remove('hidden');

  const ref = 'SUN-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('checkoutGcashRef').textContent = ref;
  document.getElementById('checkoutMayaRef').textContent = ref;

  document.getElementById('checkoutBtnStep2').classList.remove('opacity-50', 'pointer-events-none');
  document.getElementById('checkoutBtnStep2').disabled = false;
}

function renderCheckoutStep3() {
  const container = document.getElementById('checkoutOrderItems');
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal >= 1200 ? 0 : 99;

  container.innerHTML = cart.map(i => `
    <div class="flex justify-between items-center text-sm text-peelGreenLight">
      <span class="truncate pr-2">${i.qty}× ${i.name}</span>
      <span class="shrink-0 font-bold text-peelGreen">${formatPHP(i.price * i.qty)}</span>
    </div>
  `).join('');

  document.getElementById('checkoutSubtotal').textContent = formatPHP(subtotal);
  document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : formatPHP(shipping);
  document.getElementById('checkoutTotal').textContent = formatPHP(subtotal + shipping);

  const meta = document.getElementById('checkoutOrderMeta');
  meta.innerHTML = `
    <div class="flex justify-between"><span>Delivery City</span><span class="font-bold text-peelGreen">${checkoutState.delivery.city}</span></div>
    <div class="flex justify-between"><span>Payment Method</span><span class="font-bold text-peelGreen">${checkoutState.payment.charAt(0).toUpperCase() + checkoutState.payment.slice(1)}</span></div>
    <div class="flex justify-between"><span>Order Total</span><span class="font-bold text-tangerine">${formatPHP(subtotal + shipping)}</span></div>
  `;
}

 function placeOrder() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal >= 1200 ? 0 : 99;
  const total = subtotal + shipping;
  const orderNum = 'SUN-' + Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date().toISOString();

  const order = {
    id: orderNum,
    date: orderDate,
    city: checkoutState.delivery.city,
    payment: checkoutState.payment,
    items: [...cart],
    subtotal,
    shipping,
    total,
    status: 'Chilled & Dispatched',
  };

  // Save to order history
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]'); } catch (e) {}
  orders.push(order);
  try { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); } catch (e) {}

  // Attach to user if logged in
  if (currentUser) {
    if (!currentUser.orders) currentUser.orders = [];
    currentUser.orders.push(order);
    saveUser(currentUser);
  }

  // Clear cart
  cart = [];
  updateCartUI();
  saveCart();

  // Show receipt in modal step 3 (reuse as receipt view)
  closeCheckoutModal();
  showOrderReceipt(order);
}

 function showOrderReceipt(order) {
  const modal = document.getElementById('checkoutModal');

  const dateStr = new Date(order.date).toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
  const paymentLabel = order.payment.charAt(0).toUpperCase() + order.payment.slice(1);

  const itemsHtml = order.items.map(i => `
    <div class="flex justify-between text-peelGreenLight text-xs mb-1">
      <span class="truncate pr-2">${i.qty}× ${i.name}</span>
      <span class="shrink-0 font-bold text-peelGreen">${formatPHP(i.price * i.qty)}</span>
    </div>
  `).join('');

  const receiptHtml = `
    <div class="flex justify-between font-extrabold text-peelGreen pb-1.5 border-b border-leafBorder">
      <span>Order #${order.id}</span>
      <span class="text-tangerine">${order.status}</span>
    </div>
    <div class="flex justify-between text-peelGreenLight text-xs mb-2">
      <span>Date</span><span>${dateStr}</span>
    </div>
    <div class="flex justify-between text-peelGreenLight text-xs mb-2">
      <span>City</span><span>${order.city}</span>
    </div>
    <div class="flex justify-between text-peelGreenLight text-xs mb-3">
      <span>Payment</span><span>${paymentLabel}</span>
    </div>
    ${itemsHtml}
    <div class="flex justify-between text-peelGreenLight text-xs pt-2 border-t border-leafBorder/60 mb-3">
      <span>Total Paid (PHP)</span>
      <span class="font-bold text-tangerine">${formatPHP(order.total)}</span>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  // Replace panel content with receipt
  document.querySelectorAll('.checkout-panel').forEach(p => p.classList.add('hidden'));
  const step3 = document.getElementById('checkoutStep3Panel');
  step3.classList.remove('hidden');
  step3.innerHTML = `
    <div class="text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-sunnyLemon/50 text-peelGreen flex items-center justify-center mx-auto text-2xl font-black mb-2">☀️</div>
      <h3 class="font-display font-black text-xl text-peelGreen">Order Confirmed!</h3>
      <p class="text-peelGreenLight text-sm">Your chilled cooler is being packed for dispatch.</p>
      <div id="checkoutReceiptBox" class="mt-4 bg-citrusMist border border-leafBorder rounded-2xl p-4 text-left text-xs space-y-1.5">
        ${receiptHtml}
      </div>
    </div>
    <div class="pt-6 flex justify-center gap-3">
      <button type="button" onclick="printReceipt('${order.id}')" class="bg-peelGreen hover:bg-tangerine text-suncream font-extrabold text-sm px-6 py-3 rounded-full shadow-citrus transition active:scale-95">Print Receipt</button>
      <button type="button" onclick="closeCheckoutModal()" class="bg-leafBorder hover:bg-leafBorder/50 text-peelGreen font-extrabold text-sm px-6 py-3 rounded-full transition active:scale-95">Continue Shopping</button>
    </div>
  `;

  showToast(`Order ${order.id} placed!`);
}

 function printReceipt(orderId) {
  const printContents = document.getElementById('checkoutReceiptBox').innerHTML;
  const popup = window.open('', '_blank', 'width=600,height=800');
  popup.document.write(`
    <html><head><title>Sunsip Receipt #${orderId}</title>
    <style>
      body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #1B4332; padding: 20px; }
      .header { text-align: center; border-bottom: 2px solid #1B4332; padding-bottom: 10px; margin-bottom: 20px; }
      .logo { font-weight: 900; font-size: 24px; letter-spacing: -0.5px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      td { padding: 6px 0; border-bottom: 1px solid #D8E6DC; }
      .total { font-weight: 900; font-size: 18px; color: #F97316; border-top: 2px solid #1B4332; padding-top: 10px; }
      .footer { font-size: 11px; color: #2D6A4F; text-align: center; margin-top: 30px; }
      @media print { body { padding: 0; } }
    </style>
    </head><body onload="window.print(); window.close();">
    <div class="header">
      <div class="logo">Sunsip Refreshment</div>
      <div style="font-size:11px;color:#2D6A4F">Order Receipt #${orderId} • Cold-Pressed Philippine Juices</div>
    </div>
    ${printContents}
    <div class="footer">Thank you for choosing Sunsip Refreshment! Delivered ice-chilled to Metro Manila &amp; Davao.</div>
    </body></html>
  `);
  popup.document.close();
}

// Order History
 function openOrderHistoryModal() {
  const list = document.getElementById('orderHistoryList');
  const empty = document.getElementById('orderHistoryEmpty');

  let orders = [];
  try { orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]'); } catch (e) {}

  if (currentUser && currentUser.orders) {
    orders = [...orders, ...currentUser.orders];
  }

  if (orders.length === 0) {
    empty.classList.remove('hidden');
    list.innerHTML = '';
  } else {
    empty.classList.add('hidden');
    const sorted = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    list.innerHTML = sorted.map(order => {
      const dateStr = new Date(order.date).toLocaleString('en-PH', { timeZone: 'Asia/Manila', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const itemsText = order.items.map(i => `${i.qty}× ${i.name}`).join(', ');
      return `
        <div class="bg-white border border-leafBorder rounded-xl p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <span class="font-display font-extrabold text-sm text-peelGreen">#${order.id}</span>
              <span class="ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded bg-leafBorder text-peelGreen">${order.status}</span>
            </div>
            <span class="text-xs text-peelGreenLight">${dateStr}</span>
          </div>
          <div class="text-xs text-peelGreenLight mb-2">${itemsText}</div>
          <div class="flex justify-between text-sm">
            <span class="text-peelGreenLight">Total</span>
            <span class="font-bold text-tangerine">${formatPHP(order.total)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  const modal = document.getElementById('orderHistoryModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

 function closeOrderHistoryModal() {
  const modal = document.getElementById('orderHistoryModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function completeDemoOrder() {
  cart = [];
  updateCartUI();
  saveCart();
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

// Event Listeners
document.querySelectorAll('button[aria-label="Open Cart"]').forEach(btn => {
  btn.addEventListener('click', () => toggleCartDrawer(true));
});

document.querySelectorAll('button[aria-label="Close Cart"]').forEach(btn => {
  btn.addEventListener('click', () => toggleCartDrawer(false));
});

document.querySelectorAll('button[aria-label="Close quiz"]').forEach(btn => {
  btn.addEventListener('click', closeQuizModal);
});

document.querySelectorAll('button[aria-label="Close modal"]').forEach(btn => {
  btn.addEventListener('click', closeQuickView);
});

document.querySelectorAll('button[aria-label="Open Menu"]').forEach(btn => {
  btn.addEventListener('click', toggleMobileMenu);
});

document.querySelectorAll('button.modal-mood-btn, button.modal-fizz-btn').forEach(btn => {
  if (btn.dataset.mood) {
    btn.addEventListener('click', () => setQuizMood(btn.dataset.mood));
  } else if (btn.dataset.fizz) {
    btn.addEventListener('click', () => setQuizFizz(btn.dataset.fizz));
  }
});

// Inline quiz mood/fizz buttons (section 4)
document.querySelectorAll('button.inline-mood-btn').forEach(btn => {
  btn.addEventListener('click', () => setQuizMood(btn.dataset.mood));
});
document.querySelectorAll('button.inline-fizz-btn').forEach(btn => {
  btn.addEventListener('click', () => setQuizFizz(btn.dataset.fizz));
});

// Header Sip Quiz button
document.querySelectorAll('button.js-open-quiz-modal').forEach(btn => {
  btn.addEventListener('click', openQuizModal);
});

document.querySelectorAll('button.js-add-quiz-cart').forEach(btn => {
  btn.addEventListener('click', addQuizMatchToCart);
});

document.querySelectorAll('button.js-close-quick-view').forEach(btn => {
  btn.addEventListener('click', closeQuickView);
});

document.querySelectorAll('button.js-explore-refreshments').forEach(btn => {
  btn.addEventListener('click', () => toggleCartDrawer(false));
});

// Initialize persisted state
loadState();

// Auth header event delegation
document.body.addEventListener('click', e => {
  if (e.target.id === 'orderHistoryBtn') {
    e.preventDefault();
    openOrderHistoryModal();
  }
  if (e.target.closest('#signInBtn, [data-action="signin"]')) {
    e.preventDefault();
    window.location.href = 'login.html';
  }
  if (e.target.closest('#signOutBtn, [data-action="signout"]')) {
    e.preventDefault();
    logout();
  }
});

// --- Accessibility: Focus Management & Keyboard Navigation ---
let lastFocusedElement = null;
const FOCUSABLE_SELECTORS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS)).filter(el => !el.disabled && el.offsetParent !== null);
}

function trapFocus(modal) {
  const focusables = getFocusableElements(modal);
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  modal.addEventListener('keydown', function handleFocusTrap(e) {
    if (!modal.classList.contains('flex') || modal.classList.contains('hidden')) {
      modal.removeEventListener('keydown', handleFocusTrap);
      return;
    }
    if (e.key !== 'Tab') return;
    e.preventDefault();
    if (e.shiftKey) {
      if (document.activeElement === first || document.activeElement === modal) last.focus();
      else first.focus();
    } else {
      if (document.activeElement === last) first.focus();
      else last.focus();
    }
  });
}

function saveFocus() {
  lastFocusedElement = document.activeElement || document.body;
}

function restoreFocus() {
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function closeAllOverlays() {
  toggleCartDrawer(false);
  closeMobileMenu();
  closeQuizModal();
  closeQuickView();
  closeCheckoutModal();
  closeOrderHistoryModal();
}

// Global Escape key listener
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const cartOverlay = document.getElementById('cartOverlay');
    const quizModal = document.getElementById('quizModal');
    const quickViewModal = document.getElementById('quickViewModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const orderHistoryModal = document.getElementById('orderHistoryModal');
    const mobileMenu = document.getElementById('mobileMenu');

    const isOpen = el => el && !el.classList.contains('hidden');
    if (isOpen(cartOverlay) || isOpen(quizModal) || isOpen(quickViewModal) || isOpen(checkoutModal) || isOpen(orderHistoryModal) || isOpen(mobileMenu)) {
      e.preventDefault();
      closeAllOverlays();
      restoreFocus();
    }
  }
});

// --- Mobile Menu ARIA state ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMobileMenu() {
  const isOpen = !mobileMenu.classList.contains('hidden');
  if (isOpen) {
    closeMobileMenu();
  } else {
    mobileMenu.classList.remove('hidden');
    saveFocus();
  }
  mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
}

 function closeMobileMenu() {
  mobileMenu.classList.add('hidden');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  restoreFocus();
}

// --- Cart Drawer focus management ---
const _toggleCartDrawer = toggleCartDrawer;
function toggleCartDrawer(open) {
  const overlay = document.getElementById('cartOverlay');
  if (open) {
    saveFocus();
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    trapFocus(overlay);
    const closeBtn = overlay.querySelector('[aria-label="Close Cart"]');
    if (closeBtn) closeBtn.focus();
  } else {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    restoreFocus();
  }
}

// --- Quick View Modal focus management ---
const _openQuickView = openQuickView;
openQuickView = function(productId) {
  saveFocus();
  _openQuickView.call(this, productId);
  const modal = document.getElementById('quickViewModal');
  trapFocus(modal);
  const closeBtn = modal.querySelector('[aria-label="Close modal"]');
  if (closeBtn) closeBtn.focus();
};

const _closeQuickView = closeQuickView;
closeQuickView = function() {
  _closeQuickView.call(this);
  restoreFocus();
};

// --- Quiz Modal focus management ---
const _openQuizModal = openQuizModal;
openQuizModal = function() {
  saveFocus();
  _openQuizModal.call(this);
  const modal = document.getElementById('quizModal');
  trapFocus(modal);
  const closeBtn = modal.querySelector('[aria-label="Close quiz"]');
  if (closeBtn) closeBtn.focus();
};

const _closeQuizModal = closeQuizModal;
closeQuizModal = function() {
  _closeQuizModal.call(this);
  restoreFocus();
};

// --- Checkout Modal focus management ---
const _openCheckoutModal = openCheckoutModal;
openCheckoutModal = function() {
  saveFocus();
  _openCheckoutModal.call(this);
  const modal = document.getElementById('checkoutModal');
  trapFocus(modal);
};

const _closeCheckoutModal = closeCheckoutModal;
closeCheckoutModal = function() {
  _closeCheckoutModal.call(this);
  restoreFocus();
};

// --- Order History Modal focus management ---
const _openOrderHistoryModal = openOrderHistoryModal;
openOrderHistoryModal = function() {
  saveFocus();
  _openOrderHistoryModal.call(this);
  const modal = document.getElementById('orderHistoryModal');
  trapFocus(modal);
  const closeBtn = modal.querySelector('[aria-label="Close Order History"]');
  if (closeBtn) closeBtn.focus();
};

const _closeOrderHistoryModal = closeOrderHistoryModal;
closeOrderHistoryModal = function() {
  _closeOrderHistoryModal.call(this);
  restoreFocus();
};

