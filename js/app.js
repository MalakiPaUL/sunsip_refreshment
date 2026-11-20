// Sunsip Refreshment — Menu Filter Controller
// Works with global PRODUCTS (from js/products.js) and global renderProductGrid (from js/menuRenderer.js)

let activeCategory = 'All';
let searchQuery = '';

function applyMenuFilters() {
  const filtered = PRODUCTS.filter((product) => {
    const matchesCategory =
      activeCategory === 'All' || product.category === activeCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.origin.toLowerCase().includes(q) ||
      product.tags.some((tag) => tag.includes(q));

    return matchesCategory && matchesSearch;
  });

  renderProductGrid(filtered);

  // Update active state on category pills
  document.querySelectorAll('[data-category-filter]').forEach((btn) => {
    const isSelected = btn.dataset.categoryFilter === activeCategory;
    btn.classList.toggle('bg-peelGreen', isSelected);
    btn.classList.toggle('text-suncream', isSelected);
  });
}

function initMenuFilters() {
  applyMenuFilters();

  const desktopSearch = document.getElementById('searchInputDesktop');
  const mobileSearch = document.getElementById('searchInputMobile');
  const clearBtn = document.getElementById('clearSearchDesktop');

  const handleSearchInput = (e) => {
    searchQuery = e.target.value;
    // Keep desktop & mobile search inputs synced
    if (desktopSearch && desktopSearch !== e.target) desktopSearch.value = searchQuery;
    if (mobileSearch && mobileSearch !== e.target) mobileSearch.value = searchQuery;
    clearBtn?.classList.toggle('hidden', searchQuery.length === 0);
    applyMenuFilters();
  };

  desktopSearch?.addEventListener('input', handleSearchInput);
  mobileSearch?.addEventListener('input', handleSearchInput);

  clearBtn?.addEventListener('click', () => {
    searchQuery = '';
    if (desktopSearch) desktopSearch.value = '';
    if (mobileSearch) mobileSearch.value = '';
    clearBtn.classList.add('hidden');
    applyMenuFilters();
  });

  // Category pill click handlers
  document.querySelectorAll('[data-category-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.categoryFilter;
      applyMenuFilters();
    });
  });
}

// Expose for inline onclick usage
window.applyMenuFilters = applyMenuFilters;
window.initMenuFilters = initMenuFilters;

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', initMenuFilters);
