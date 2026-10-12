import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['github-light', 'github-dark'],
  themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
  useDarkModeMediaQuery: false,
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
    },
  },
});
