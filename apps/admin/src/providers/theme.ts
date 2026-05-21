import { createTheme } from '@mui/material/styles';
import { arSD } from '@mui/x-data-grid/locales';
import { arEG as coreArEG } from '@mui/material/locale';
import { enUS as gridEnUS } from '@mui/x-data-grid/locales';
import { enUS as coreEnUS } from '@mui/material/locale';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const getAdminTheme = (mode: 'light' | 'dark', lang: 'ar' | 'en') => {
  const isDark = mode === 'dark';
  const muiLocale = lang === 'ar' ? coreArEG : coreEnUS;
  const gridLocale = lang === 'ar' ? arSD : gridEnUS;

  return createTheme(
    {
      direction: lang === 'ar' ? 'rtl' : 'ltr',
      palette: {
        mode,
        primary: {
          main: isDark ? '#38bdf8' : '#2563eb', // Beautiful clean primary colors
          light: isDark ? '#7dd3fc' : '#3b82f6',
          dark: isDark ? '#0284c7' : '#1d4ed8',
          contrastText: '#ffffff',
        },
        secondary: {
          main: isDark ? '#94a3b8' : '#475569',
          light: isDark ? '#cbd5e1' : '#64748b',
          dark: isDark ? '#64748b' : '#334155',
          contrastText: isDark ? '#0f172a' : '#ffffff',
        },
        error: {
          main: isDark ? '#f87171' : '#ef4444',
        },
        success: {
          main: isDark ? '#4ade80' : '#22c55e',
        },
        warning: {
          main: isDark ? '#fbbf24' : '#f59e0b',
        },
        info: {
          main: isDark ? '#38bdf8' : '#0ea5e9',
        },
        background: {
          default: isDark ? '#0f172a' : '#f8fafc',
          paper: isDark ? '#1e293b' : '#ffffff',
        },
        text: {
          primary: isDark ? '#f8fafc' : '#0f172a',
          secondary: isDark ? '#94a3b8' : '#64748b',
        },
        divider: isDark ? '#334155' : '#e2e8f0',
      },
      typography: {
        fontFamily: "var(--font-ibm-arabic), 'Inter', system-ui, -apple-system, sans-serif",
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: { fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.02em' },
        h3: { fontWeight: 700, letterSpacing: '-0.01em' },
        h4: { fontWeight: 700, letterSpacing: '-0.01em' },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500 },
        subtitle2: { fontWeight: 500 },
        button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
        overline: { fontWeight: 600, letterSpacing: '0.08em', fontSize: '0.7rem' },
      },
      shape: {
        borderRadius: 8, // Standard clean border radius
      },
      shadows: isDark
        ? ([
            'none',
            '0 1px 2px rgba(0,0,0,0.3)',
            '0 2px 4px rgba(0,0,0,0.3)',
            '0 4px 8px rgba(0,0,0,0.3)',
            '0 8px 16px rgba(0,0,0,0.3)',
            ...Array(20).fill('none'),
          ] as any)
        : ([
            'none',
            '0 1px 2px rgba(15,23,42,0.05)',
            '0 2px 4px rgba(15,23,42,0.05)',
            '0 4px 8px rgba(15,23,42,0.05)',
            '0 8px 16px rgba(15,23,42,0.05)',
            ...Array(20).fill('none'),
          ] as any),
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              fontFamily: "var(--font-ibm-arabic), 'Inter', system-ui, -apple-system, sans-serif",
              backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#0f172a',
              transition: 'background-color 0.2s ease, color 0.2s ease',
              '::-webkit-scrollbar': {
                width: '6px',
                height: '6px',
              },
              '::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '::-webkit-scrollbar-thumb': {
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '999px',
              },
              '::-webkit-scrollbar-thumb:hover': {
                background: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              backgroundImage: 'none',
              boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(15,23,42,0.05)',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: isDark ? '#475569' : '#cbd5e1',
                boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(15,23,42,0.05)',
              },
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              padding: '6px 16px',
              fontWeight: 500,
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              '&:hover': { boxShadow: 'none', transform: 'none' },
              '&:active': { transform: 'none' },
            },
            contained: {
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
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
              borderRadius: '6px !important',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              transition: 'all 0.2s ease',
              '&.Mui-focused': {
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#475569' : '#cbd5e1',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#38bdf8' : '#2563eb',
                borderWidth: '1.5px',
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              fontWeight: 500,
              borderRadius: 6,
            },
          },
        },
        MuiDataGrid: {
          styleOverrides: {
            root: {
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              borderRadius: 8,
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              fontFamily: "var(--font-ibm-arabic), 'Inter', system-ui, sans-serif",
              color: isDark ? '#f8fafc' : '#0f172a',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                borderRadius: '8px 8px 0 0',
                borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
                fontSize: '0.75rem',
                color: isDark ? '#94a3b8' : '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              },
              '& .MuiDataGrid-row': {
                borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                transition: 'background-color 0.15s ease',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                },
              },
              '& .MuiDataGrid-cell': {
                borderColor: isDark ? '#334155' : '#e2e8f0',
                '&:focus': { outline: 'none' },
                '&:focus-within': { outline: 'none' },
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              fontWeight: 600,
              backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#94a3b8' : '#64748b',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              backgroundImage: 'none',
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                color: isDark ? '#ffffff' : '#0f172a',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                },
              },
            },
          },
        },
        MuiTooltip: {
          defaultProps: {
            arrow: true,
          },
          styleOverrides: {
            tooltip: {
              borderRadius: 6,
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: isDark ? '#0f172a' : '#0f172a',
              color: '#ffffff',
              border: `1px solid ${isDark ? '#334155' : '#334155'}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: '6px 12px',
            },
            arrow: {
              color: '#0f172a',
            },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              borderRadius: 99,
              height: 6,
              backgroundColor: isDark ? '#334155' : '#e2e8f0',
            },
            bar: {
              borderRadius: 99,
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              fontWeight: 500,
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 8,
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            },
          },
        },
      },
    },
    muiLocale,
    gridLocale,
  );
};

export const adminTheme = getAdminTheme('light', 'ar');
