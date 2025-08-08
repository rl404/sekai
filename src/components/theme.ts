'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  zIndex: {
    drawer: 1350,
  },
});

export default theme;
