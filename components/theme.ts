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
});

export default theme;
