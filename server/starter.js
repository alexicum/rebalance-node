// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({
  plugins: [
    // Support for the experimental syntax 'objectRestSpread' isn't currently enabled
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
  ],
  presets: [
    [
      'env',
      {
        targets: {
          node: true,
        },
      },
    ],
  ],
  sourceMaps: 'inline',
  retainLines: true,
});

// Import the rest of our application.
module.exports = require('./index.js');
