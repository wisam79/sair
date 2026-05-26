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
          main: isDark ? '#4ADE80' : '#16A34A', // Sair Premium Green
          light: isDark ? '#F0FDF4' : '#4ADE80',
          dark: isDark ? '#16A34A' : '#15803D',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#2D2D2D', // Sair Charcoal
          light: '#3D3D3D',
          dark: '#1A1A1A',
          contrastText: '#ffffff',
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
          main: isDark ? '#4ADE80' : '#16A34A',
        },
        background: {
          default: isDark ? '#161616' : '#F7F5F2', // Sair Warm Off-white / Charcoal
          paper: isDark ? '#242424' : '#ffffff', // Sair Surface / Paper
        },
        text: {
          primary: isDark ? '#ffffff' : '#1A1A1A',
          secondary: isDark ? '#A8A8A8' : '#555555',
        },
        divider: isDark ? '#2D2D2D' : '#E8E5E0', // Sair Warm Border
      },
      typography: {
        fontFamily: "var(--font-noto-arabic), 'Inter', system-ui, -apple-system, sans-serif",
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
        borderRadius: 8,
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
              fontFamily: "var(--font-noto-arabic), 'Inter', system-ui, -apple-system, sans-serif",
              backgroundColor: isDark ? '#161616' : '#F7F5F2',
              color: isDark ? '#ffffff' : '#1A1A1A',
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
              backgroundColor: isDark ? '#242424' : '#ffffff',
              backgroundImage: 'none',
              boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(15,23,42,0.03)',
              border: `1px solid ${isDark ? '#2D2D2D' : '#E8E5E0'}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: isDark ? '#2D2D2D' : '#E8E5E0',
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
              backgroundColor: isDark ? '#1A1A1A' : '#ffffff',
              transition: 'all 0.2s ease',
              '&.Mui-focused': {
                backgroundColor: isDark ? '#1A1A1A' : '#ffffff',
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#2D2D2D' : '#E8E5E0',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#4ADE80' : '#16A34A',
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
              border: `1px solid ${isDark ? '#2D2D2D' : '#E8E5E0'}`,
              borderRadius: 8,
              backgroundColor: isDark ? '#242424' : '#ffffff',
              fontFamily: "var(--font-noto-arabic), 'Inter', system-ui, sans-serif",
              color: isDark ? '#ffffff' : '#1A1A1A',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: isDark ? '#161616' : '#F7F5F2',
                borderRadius: '8px 8px 0 0',
                borderBottom: `1px solid ${isDark ? '#2D2D2D' : '#E8E5E0'}`,
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
                fontSize: '0.75rem',
                color: isDark ? '#A8A8A8' : '#555555',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              },
              '& .MuiDataGrid-row': {
                borderBottom: `2px solid ${isDark ? '#2D2D2D' : '#E5E1D8'}`,
                transition: 'all 0.15s ease',
                '&:nth-of-type(odd)': {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(15,23,42,0.015)',
                },
                '&:nth-of-type(even)': {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.003)' : 'rgba(15,23,42,0.002)',
                },
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(74,222,128,0.06) !important' : 'rgba(22,163,74,0.04) !important',
                  transform: 'translateY(-1px)',
                  boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(15, 23, 42, 0.02)',
                },
              },
              '& .MuiDataGrid-cell': {
                borderColor: isDark ? '#2D2D2D' : '#E8E5E0',
                '&:focus': { outline: 'none' },
                '&:focus-within': { outline: 'none' },
              },
              '& .MuiDataGrid-toolbarContainer': {
                padding: '10px 16px',
                gap: '12px',
                borderBottom: `1px solid ${isDark ? '#2D2D2D' : '#E8E5E0'}`,
                backgroundColor: isDark ? '#1d1d1d' : '#fafafa',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                '& .MuiButton-root': {
                  color: isDark ? '#4ADE80' : '#16A34A',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  fontFamily: "var(--font-noto-arabic), 'Inter', sans-serif",
                  borderRadius: 1.5,
                  padding: '4px 10px',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(74,222,128,0.08)' : 'rgba(22,163,74,0.06)',
                  },
                  '& svg': {
                    width: 16,
                    height: 16,
                  },
                },
                '& .MuiTextField-root': {
                  marginLeft: 'auto',
                  minWidth: 200,
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                    fontSize: '0.8rem',
                    backgroundColor: isDark ? '#161616' : '#ffffff',
                    border: `1px solid ${isDark ? '#2D2D2D' : '#E8E5E0'}`,
                    '&.Mui-focused': {
                      borderColor: isDark ? '#4ADE80' : '#16A34A',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  },
                },
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${isDark ? '#2D2D2D' : '#E8E5E0'}`,
                backgroundColor: isDark ? '#161616' : '#F7F5F2',
              },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              fontWeight: 600,
              backgroundColor: isDark ? '#161616' : '#F7F5F2',
              color: isDark ? '#A8A8A8' : '#555555',
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
              backgroundColor: isDark ? '#242424' : '#ffffff',
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
                color: isDark ? '#ffffff' : '#1A1A1A',
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
              backgroundColor: '#2D2D2D',
              color: '#ffffff',
              border: '1px solid #3D3D3D',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: '6px 12px',
            },
            arrow: {
              color: '#2D2D2D',
            },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              borderRadius: 99,
              height: 6,
              backgroundColor: isDark ? '#3D3D3D' : '#E0DDD8',
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
              border: `1px solid ${isDark ? '#2D2D2D' : '#E8E5E0'}`,
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
