/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      ...colors,
      'ghost-white': '#F7F7FF',
      'licorice': '#1A0B1C',
      'dark-silver': '#6F6F73',
      'raisin-black': '#271A2A',
      'dark-purple': '#322136',
      'english-violet': '#543B59',
      'dark-red': '#D43752',
      'chinese-bronze': '#D48237',
      'chinese-black': '#150A17',
      'ufo-green': '#37D489'
    }
  }
  ,
  plugins: [],
}
