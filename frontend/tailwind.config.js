// const withMT = require("@material-tailwind/react/utils/withMT");



/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Include all JS/TS/HTML files in the `src` folder
    "./public/index.html", // Include the `index.html` file if you're using React
    // "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    // "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
  	extend: {
  		colors: {
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  plugins: [],
}
