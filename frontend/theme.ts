import { extendTheme } from '@chakra-ui/react';

const colors = {
  atm: {
    purple: '#8E6DA8',
    cream: '#F6F4EA',
    signBlue: '#1E6BB3',
    screenBlue: '#7DB3D6',
    screenBorder: '#BFD6E2',
    sideBtn: '#CFCFD2',
    textWhite: '#F5F8FA',
    sideBtnTop: 'rgba(255,255,255,.6)',
    sideBtnBottom: '#9aa0a8',
    slat: '#9aa0a8',
    strip: '#e7e1e1ff',
  },
};

const fonts = {
  // Screen text uses VT323 everywhere by default
  heading:
    'var(--font-vt323), "VT323", ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
  body: 'var(--font-vt323), "VT323", ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
};

const styles = {
  global: {
    'html, body, #__next': { height: '100%' },
    body: { bg: 'atm.purple', color: 'atm.textWhite' },
    '*::selection': { background: 'atm.signBlue', color: 'white' },
  },
};

const textStyles = {
  atmScreenTitle: {
    fontFamily:
      'var(--font-vt323), "VT323", ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
    fontSize: ['26px', '28px'],
    lineHeight: '28px',
    letterSpacing: '0.5px',
    color: 'atm.textWhite',
    textAlign: 'center',
    fontWeight: 400,
    textTransform: 'none',
  },
  atmScreenLabel: {
    fontFamily:
      'var(--font-vt323), "VT323", ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
    fontSize: '14px',
    letterSpacing: '0.5px',
    color: 'atm.textWhite',
    fontWeight: 400,
    textTransform: 'none',
  },
  atmMenuItem: {
    fontFamily:
      'var(--font-vt323), "VT323", ui-monospace, SFMono-Regular, Menlo, Monaco, "Courier New", monospace',
    fontSize: ['16px', '18px'],
    letterSpacing: '0.5px',
    color: 'atm.textWhite',
    fontWeight: 400,
    textTransform: 'none',
  },
};

const theme = extendTheme({
  colors,
  fonts,
  styles,
  textStyles,
});

export default theme;
