// Sunsip Refreshment — Menu Renderer
// Renders the filtered product grid into #productGrid
// Depends on global PRODUCTS (from js/products.js) and global addToCart (from script.js)

function renderProductGrid(products) {
  const container = document.getElementById('productGrid');
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 space-y-3">
        <div class="w-16 h-16 rounded-full bg-warmSand border border-sunnyLemon flex items-center justify-center mx-auto text-2xl">🍹</div>
        <p class="font-display font-extrabold text-xl text-peelGreen">No drinks matched that craving</p>
        <p class="text-peelGreenLight text-sm mt-2 max-w-xl mx-auto">Try searching for "Calamansi", "Mango", "Pomelo", "Hibiscus", or reset your filters.</p>
        <button type="button" onclick="resetFilters()" class="mt-5 bg-peelGreen text-suncream px-6 py-2.5 rounded-full text-sm font-extrabold hover:bg-tangerine transition">View All Drinks</button>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => {
    const sizes = product.isPackOnly
      ? [{ label: '6-Bottle Box (330ml)', multiplier: 1 }]
      : [
          { label: '330ml Bottle', multiplier: 1 },
          { label: '500ml Bottle', multiplier: 1.5 },
          { label: '1-Liter Bottle', multiplier: 3 },
        ];

    return `
      <article class="bg-white border border-leafBorder rounded-3xl p-5 hover:shadow-citrus-lg transition shadow-sm">
        <div class="relative mb-4">
          <svg width="120" height="120" viewBox="0 0 284 284" class="block mx-auto">
            <defs>
              <linearGradient id="grad-${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${product.bottleColor}" />
                <stop offset="100%" stop-color="${product.accentColor}" />
              </linearGradient>
            </defs>
            <rect x="60" y="40" width="164" height="210" rx="20" fill="url(#grad-${product.id})" stroke="#1B4332" stroke-width="2"/>
            <circle cx="142" cy="176" r="24" fill="${product.accentColor}" stroke="#1B4332" stroke-width="2.2"/>
            <path d="M142 158V194M124 176H160" stroke="${product.accentColor}" stroke-width="2.2"/>
            <path d="M88 27H112L119 62C128 71 132 82 132 96V194C132 205 123 214 112 214H88C77 214 68 205 68 194V96C68 82 72 71 81 62L88 27Z" fill="${product.bottleColor}" stroke="#1B4332" stroke-width="3"/>
            <circle cx="100" cy="124" r="10" fill="${product.accentColor}"/>
            <text x="142" y="62" font-family="Outfit" font-size="16" font-weight="900" fill="#1B4332" text-anchor="middle">${product.badge}</text>
          </svg>
          <span class="absolute -top-2 -right-2 bg-sunnyLemon text-peelGreen text-[10px] font-extrabold px-2 py-0.5 rounded-full">${product.badge}</span>
        </div>

        <h3 class="font-display font-extrabold text-base text-peelGreen truncate mb-1">${product.name}</h3>
        <p class="text-xs font-bold text-tangerine mt-1">${product.flavorNotes}</p>
        <p class="text-[10px] text-peelGreenLight mb-3 line-clamp-2">${product.ingredients}</p>

        <div class="mt-3">
          <label class="block text-[10px] font-extrabold uppercase tracking-wider text-peelGreenLight mb-1.5">Bottle Format</label>
          <div class="grid grid-cols-3 gap-1">
            ${sizes.map(opt => {
              const currentPrice = Math.round(product.basePrice * opt.multiplier);
              return `
                <button
                  type="button"
                  onclick="addToCart('${product.id}', '${opt.label}', ${currentPrice}, '${product.name}')"
                  class="text-[10px] font-extrabold py-1.5 px-1.5 rounded-xl border transition bg-citrusMist text-peelGreen border-leafBorder hover:border-peelGreen/40">
                  ${opt.label}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </article>
    `;
  }).join('');
}
