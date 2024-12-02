/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: {
          400: '#F686A1',
        },
        lightGray: '#707070',
        costumGray: {
          400: '#3F3F3F',
        },
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
        oceanwide: ['Oceanwide', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        mervat: ['MervatVol2', 'sans-serif'],
      },
    },
  },
  variants: {},
  plugins: [],
}

