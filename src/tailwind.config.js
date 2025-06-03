// // tailwind.config.js
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}", // Make sure your components are under /src
//   ],
//   theme: {
//     extend: {
//       colors: {
//         main: '#841A62',
//       },
//     },
//   },
//   plugins: [],
// };
// tailwind.config.js
export default {
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        main: {
          DEFAULT: '#841A62', // → Use as `bg-main` or `text-main`
          light: '#a54583',   // → Use as `bg-main-light`
          dark: '#5d1245',    // → Use as `bg-main-dark`
        },
      },
    },
  },
};