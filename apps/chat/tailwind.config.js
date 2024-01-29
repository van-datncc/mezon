const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const Colors = require('../../libs/ui/src/lib/Variables/Colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    'node_modules/flowbite-react/lib/esm/**/*.js',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        px: '1px',
        0: '0',
        96: '96px',
        210: '210px',
      },
      width: {
        widthWithoutServerWidth: 'calc(100vw - 72px)',
      },
      height: {
        heightMessageViewChat: 'calc(100vh - 137px)',
        heightWithoutTopBar: 'calc(100vh - 72px)',
        heightTopBar: '72px',
      },

      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      screens: {
        'mobile-s': '320px',
        'mobile-l': '375px',
      },
      fontSize: {
        header: ['5rem', '5rem'],
        headerMobile: ['3.125rem', '3.75rem'],
        subHeaderMobile: '1.563rem',
        contentMobile: '1.25rem',
      },
      colors: Colors,
      transitionDuration: {
        3000: '3000ms',
      },
      keyframes: {
        rotation: {
          '0%': {
            transform: 'rotate3d(0, 1, 0, 0deg)',
          },
          '50%': {
            transform: 'rotate3d(0, 1, 0, 180deg)',
          },
          '100%': {
            transform: 'rotate3d(0, 1, 0, 360deg)',
          },
        },
      },
    },
    animation: {
      rotation: 'rotation 6s linear infinite',
    },
  },
  plugins: [require('flowbite/plugin')],
};
