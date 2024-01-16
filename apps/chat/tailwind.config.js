const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      spacing: {
        px: '1px',
        0: '0',
        96:"96px",
        210:"210px"
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
    },
    plugins: [],
  },
};


