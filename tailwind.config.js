/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        rubik: ["Rubik Scribble", 'system-ui'],
        'baloo-bhai': ["Baloo Bhai 2", 'sans-serif']
      }
    },
  },
  plugins: [],
}

