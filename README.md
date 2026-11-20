# Sunsip Refreshment

Cold-pressed Philippine juices, sparkling coolers, and botanical iced teas delivered ice-chilled to Metro Manila & Davao.

🌐 **Live Demo:** https://malakipaul.github.io/sunsip_refreshment/

## Features

### E-Commerce & Shopping
- **Product Catalog** — 6 curated Philippine-inspired refreshments (calamansi honey fizz, mango sunset, pomelo mint splash, hibiscus berry cooler, pineapple ginger zest, barkada taster box)
- **Category Filters** — Cold-Pressed Juices, Sparkling Coolers, Botanical Iced Teas, Party Packs
- **Live Search** — Real-time filtering by name, flavor, ingredients, and category
- **Size Selector** — 330ml / 500ml / 6-Pack options with dynamic pricing
- **Cart Drawer** — Slide-over cart with quantity controls, remove items, subtotal, shipping, and free delivery progress bar toward ₱1,200
- **Persistent Cart** — Cart contents saved to `localStorage` across page reloads

### Authentication & Orders
- **Login / Signup** — Account creation with name and email persisted to `localStorage`
- **Auth Header** — Signed-in state swaps "Sign In/Sign Up" for user name + Order History + Sign Out
- **Order History** — Modal listing past orders with date, items, total, and status
- **Multi-Step Checkout** — Delivery city validation (Metro Manila / Davao) + payment methods (GCash, Maya, Card, Cash on Delivery)
- **Printable Receipt** — Downloadable/printable order summary receipt

### Interactive Quiz
- **Sip Quiz** — 2-step flavor matcher (mood + sweetness/fizz) with live product recommendation
- **Quiz → Menu** — One-click "Add Match to Cart" and "View Matching Drinks in Menu" filters the catalog to your matched category
- **Quiz Persistence** — Matched drink saved to `localStorage`

### Subscription Box
- **Build Your Chilled Box** — Select box size (6-Bottle / 12-Bottle), delivery frequency (Weekly / Bi-Weekly), and curated flavor mix
- **Subscriber Pricing** — 15% automatic savings display

## Accessibility (a11y)

- `aria-expanded` on mobile menu toggle, dynamically synced
- `aria-live="polite"` on cart badge and search result counter for screen reader announcements
- Decorative emojis wrapped in `aria-hidden="true"`
- `Escape` key closes all open overlays (cart, quiz, quick-view, checkout, order history, mobile menu)
- Focus trapping within modals; focus returns to trigger on close
- WCAG AA-compliant contrast (`#C2410C`) for small text on light backgrounds

## Tech Stack

- **HTML5** — Semantic markup
- **Tailwind CSS 3** — Utility-first styling with custom design tokens (Philippine-inspired color palette)
- **Vanilla JavaScript (ES Modules)** — Cart, quiz, auth, checkout, and order logic — no frameworks
- **localStorage** — Client-side persistence for cart, auth, quiz match, and order history

## Folder Structure

```
sunsip_refreshment/
├── index.html              # Main storefront (home page)
├── login.html              # Customer login page
├── signup.html             # Customer signup page
├── script.js               # Application logic (ES module)
├── styles.css              # Custom CSS utilities
├── tailwind.config.js      # Tailwind design tokens & config
├── src/
│   └── input.css           # Tailwind source CSS
├── dist/
│   └── output.css          # Compiled Tailwind CSS
├── assets/
│   └── images/
│       └── sunsip-logo.png # Brand logo (also used as favicon)
├── sections/               # HTML section partials (modular page sections)
│   ├── 01-announcement.html
│   ├── 02-navigation.html
│   ├── 03-hero.html
│   ├── 04-quiz.html
│   ├── 05-catalog.html
│   ├── 06-subscriptions.html
│   ├── 07-story.html
│   ├── 08-footer.html
│   ├── 09-modals.html
│   └── 10-toast.html
└── README.md
```

## Screenshots

### Sip Quiz in Action
The 2-step flavor matcher recommends a drink based on your mood and fizz preference, with one-click add-to-cart and menu filtering.

### Cart Drawer
Slide-over cart showing live free-shipping progress bar toward ₱1,200, quantity controls, and multi-step checkout.

## How to Run Locally

### Option 1: Open directly (simplest)
1. Clone or download this repository.
2. Open `index.html` in your browser.
   - No build step required — Tailwind CSS is pre-compiled in `dist/output.css`.

### Option 2: Serve with a local server
```bash
# Using Python
python -m http.server 8000

# Using PHP (XAMPP)
# Place folder in htdocs and visit http://localhost/sunsip_refreshment

# Using Node.js (if available)
npx serve .
```
Then visit `http://localhost:8000`.

### Rebuilding Tailwind CSS
If you modify `tailwind.config.js` or `src/input.css` and want to regenerate the compiled CSS:

```bash
npm install
npx tailwindcss -i ./src/input.css -o ./dist/output.css
```

## GitHub Pages Deployment

This site is configured for GitHub Pages. To enable:

1. Go to your repository **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Select **main** branch and **/(root)** folder
4. Click **Save**

Your site will be live at `https://malakipaul.github.io/sunsip_refreshment/`

## License

ISC

---
Built with ❤️ for Philippine-grown refreshments.