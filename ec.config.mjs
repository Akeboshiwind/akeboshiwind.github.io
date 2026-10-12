import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { defineEcConfig } from 'astro-expressive-code';

// Resolved through node_modules, not relative to this file: MDX <Code> loads this config from a bundled chunk in dist/.
const copySvg = readFileSync(createRequire(import.meta.url).resolve('pixelarticons/svg/copy.svg'), 'utf8');

export default defineEcConfig({
  themes: ['github-light', 'github-dark'],
  themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
  useDarkModeMediaQuery: false,
  emitExternalStylesheet: false,
  defaultProps: { frame: 'none' },
  styleOverrides: {
    borderRadius: '0',
    borderWidth: '0',
    codeBackground: 'transparent',
    codeFontFamily: 'var(--font-pixel)',
    uiFontFamily: 'var(--font-pixel)',
    codeFontSize: '13px',
    codePaddingInline: '0',
    codePaddingBlock: '1.25rem',
    frames: {
      frameBoxShadowCssValue: 'none',
      inlineButtonForeground: 'var(--text)',
      inlineButtonBackground: 'var(--accent)',
      inlineButtonBorder: 'var(--border)',
      inlineButtonBorderOpacity: '1',
      copyIcon: `url("data:image/svg+xml,${encodeURIComponent(copySvg)}")`,
    },
  },
});
