/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightColor: "#E0EAF9", 
        darkColor: "#001945",
      },
    },
  },
 plugins: [require('tailwind-scrollbar')],
  
};
