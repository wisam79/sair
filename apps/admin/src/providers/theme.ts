import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
      contrastText: '#fff',
    },
    error: {
      main: '#dc2626',
    },
    success: {
      main: '#16a34a',
    },
    warning: {
      main: '#d97706',
    },
    info: {
      main: '#0891b2',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: 'rgba(148,163,184,0.16)',
  },
  typography: {
    fontFamily: "'Cairo', 'Inter', system-ui, -apple-system, sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0 },
    overline: { fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.7rem' },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(15,23,42,0.06)',
    '0 2px 8px rgba(15,23,42,0.07)',
    '0 4px 16px rgba(15,23,42,0.08)',
    '0 6px 20px rgba(15,23,42,0.09)',
    '0 8px 24px rgba(15,23,42,0.10)',
    '0 10px 28px rgba(15,23,42,0.10)',
    '0 12px 32px rgba(15,23,42,0.11)',
    '0 14px 36px rgba(15,23,42,0.11)',
    '0 16px 40px rgba(15,23,42,0.12)',
    '0 18px 44px rgba(15,23,42,0.12)',
    '0 20px 48px rgba(15,23,42,0.13)',
    '0 22px 52px rgba(15,23,42,0.13)',
    '0 24px 56px rgba(15,23,42,0.14)',
    '0 26px 60px rgba(15,23,42,0.14)',
    '0 28px 64px rgba(15,23,42,0.15)',
    '0 30px 68px rgba(15,23,42,0.15)',
    '0 32px 72px rgba(15,23,42,0.16)',
    '0 34px 76px rgba(15,23,42,0.16)',
    '0 36px 80px rgba(15,23,42,0.17)',
    '0 38px 84px rgba(15,23,42,0.17)',
    '0 40px 88px rgba(15,23,42,0.18)',
    '0 42px 92px rgba(15,23,42,0.18)',
    '0 44px 96px rgba(15,23,42,0.19)',
    '0 46px 100px rgba(15,23,42,0.20)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "'Cairo', 'Inter', system-ui, -apple-system, sans-serif",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(15,23,42,0.07)',
          border: '1px solid rgba(148,163,184,0.12)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(15,23,42,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        contained: {
          boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
          '&:hover': { boxShadow: '0 6px 20px rgba(37,99,235,0.35)' },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '10px !important',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: 16,
          fontFamily: "'Cairo', 'Inter', system-ui, sans-serif",
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f1f5f9',
            borderRadius: '12px 12px 0 0',
            borderBottom: '1px solid rgba(148,163,184,0.2)',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#475569',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: 'rgba(37,99,235,0.04)',
            },
          },
          '& .MuiDataGrid-cell': {
            borderColor: 'rgba(148,163,184,0.1)',
            '&:focus': { outline: 'none' },
            '&:focus-within': { outline: 'none' },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(148,163,184,0.15)',
            backgroundColor: '#fafbfc',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: '#f1f5f9',
          color: '#475569',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
          fontWeight: 600,
        },
      },
    },
  },
});
