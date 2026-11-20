/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './sections/*.html',
    './script.js',
  ],
  theme: {
    extend: {
      colors: {
        suncream: '#FFFDF7',
        citrusMist: '#F4F9F4',
        warmSand: '#FEF6E4',
        peelGreen: '#1B4332',
        peelGreenLight: '#2D6A4F',
        tangerine: '#F97316',
        tangerineDark: '#EA580C',
        tangerineAccessible: '#C2410C',
        sunnyLemon: '#FACC15',
        coralPop: '#FB7185',
        leafBorder: '#D8E6DC',
      },
      fontFamily: {
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        citrus: '0 12px 32px -6px rgba(27, 67, 50, 0.08)',
        'citrus-lg': '0 22px 48px -10px rgba(27, 67, 50, 0.16)',
      },
    },
  },
  plugins: [],
}
