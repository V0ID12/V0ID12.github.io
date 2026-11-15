/*
 * Pixel-art characters, drawn as text. Every row must be the same length.
 * Each letter is one pixel, coloured by that sprite's `colors` table:
 *
 *   .  empty
 *   e  an eye   (blinks; `eyeBase` is the colour shown while it is shut)
 *   g  a light  (flashes)
 *
 * Any other letter is just a colour of your choosing. Edit the grids to redraw a character.
 */
const SPRITES = {
  // GitHub: a small robot that reads code.
  bot: {
    // k (outline) follows the theme's line colour so it shows on dark and light backgrounds.
    colors: { k: 'var(--line)', b: '#5b7fe0', e: '#f0ead8', g: 'var(--accent)', m: '#1a1c2c' },
    eyeBase: 'b',
    pixels: [
      '.....gg.....',
      '.....kk.....',
      '..kkkkkkkk..',
      '.kbbbbbbbbk.',
      '.kbeebbeebk.',
      '.kbeebbeebk.',
      '.kbbbbbbbbk.',
      '.kbbmmmmbbk.',
      '..kkkkkkkk..',
      '.kkbbbbbbkk.',
      '.k.bbggbb.k.',
      '...kk..kk...',
    ],
  },

  // LinkedIn: a ghost in a tie, dressed for networking.
  ghost: {
    colors: { k: 'var(--line)', w: '#fffaf0', e: '#1a1c2c', m: '#1a1c2c', t: '#d9475f' },
    eyeBase: 'w',
    pixels: [
      '....kkkk....',
      '..kkwwwwkk..',
      '.kwwwwwwwwk.',
      '.kwewwwwewk.',
      '.kwewwwwewk.',
      '.kwwwmmwwwk.',
      '.kwwwwwwwwk.',
      '.kwttwwttwk.',
      '.kwwttttwwk.',
      '.kwttwwttwk.',
      '.kwwkwwkwwk.',
      '..kk.kk.kk..',
    ],
  },
};
