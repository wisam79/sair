'use client';

import React from 'react';
import { useLogout, useGetIdentity } from '@refinedev/core';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  useTheme,
  Stack,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LayersIcon from '@mui/icons-material/Layers';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import FlagIcon from '@mui/icons-material/Flag';
import PaymentsIcon from '@mui/icons-material/Payments';
import StarIcon from '@mui/icons-material/Star';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArchiveIcon from '@mui/icons-material/Archive';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TranslateIcon from '@mui/icons-material/Translate';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '../providers/AppProvider';

const DRAWER_WIDTH = 272;
const DRAWER_COLLAPSED_WIDTH = 68;

interface NavItem {
  labelKey: string;
  defaultLabel: string;
  icon: React.ReactNode;
  path: string;
}

interface NavGroup {
  groupKey: string;
  defaultGroupLabel: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupKey: 'nav.group.operations',
    defaultGroupLabel: 'Operations',
    items: [
      { labelKey: 'nav.dashboard', defaultLabel: 'Dashboard', icon: <DashboardIcon />, path: '/' },
      {
        labelKey: 'nav.liveTrips',
        defaultLabel: 'Live Trips',
        icon: <DirectionsBusIcon />,
        path: '/trips',
      },
      {
        labelKey: 'nav.tripArchive',
        defaultLabel: 'Trip Archive',
        icon: <ArchiveIcon />,
        path: '/trip-archive',
      },
      {
        labelKey: 'nav.analytics',
        defaultLabel: 'Analytics',
        icon: <BarChartIcon />,
        path: '/analytics',
      },
    ],
  },
  {
    groupKey: 'nav.group.people',
    defaultGroupLabel: 'People',
    items: [
      { labelKey: 'nav.users', defaultLabel: 'Users', icon: <PeopleIcon />, path: '/profiles' },
      { labelKey: 'nav.drivers', defaultLabel: 'Drivers', icon: <PersonIcon />, path: '/drivers' },
      {
        labelKey: 'nav.institutions',
        defaultLabel: 'Institutions',
        icon: <SchoolIcon />,
        path: '/institutions',
      },
    ],
  },
  {
    groupKey: 'nav.group.network',
    defaultGroupLabel: 'Network',
    items: [
      { labelKey: 'nav.routes', defaultLabel: 'Routes', icon: <AltRouteIcon />, path: '/routes' },
      {
        labelKey: 'nav.subscriptions',
        defaultLabel: 'Subscriptions',
        icon: <CardMembershipIcon />,
        path: '/subscriptions',
      },
      {
        labelKey: 'nav.licenseBatches',
        defaultLabel: 'License Batches',
        icon: <LayersIcon />,
        path: '/license_batches',
      },
      {
        labelKey: 'nav.licenses',
        defaultLabel: 'Licenses',
        icon: <ConfirmationNumberIcon />,
        path: '/licenses',
      },
    ],
  },
  {
    groupKey: 'nav.group.finance',
    defaultGroupLabel: 'Finance',
    items: [
      {
        labelKey: 'nav.revenue',
        defaultLabel: 'Revenue',
        icon: <AttachMoneyIcon />,
        path: '/revenue',
      },
      {
        labelKey: 'nav.payouts',
        defaultLabel: 'Payouts',
        icon: <PaymentsIcon />,
        path: '/payouts',
      },
      { labelKey: 'nav.ratings', defaultLabel: 'Ratings', icon: <StarIcon />, path: '/ratings' },
    ],
  },
  {
    groupKey: 'nav.group.system',
    defaultGroupLabel: 'System',
    items: [
      {
        labelKey: 'nav.notifications',
        defaultLabel: 'Notifications',
        icon: <NotificationsIcon />,
        path: '/notifications',
      },
      {
        labelKey: 'nav.featureFlags',
        defaultLabel: 'Feature Flags',
        icon: <FlagIcon />,
        path: '/feature-flags',
      },
      {
        labelKey: 'nav.bulkImport',
        defaultLabel: 'Bulk Import',
        icon: <UploadFileIcon />,
        path: '/bulk-import',
      },
      {
        labelKey: 'nav.systemHealth',
        defaultLabel: 'System Health',
        icon: <HealthAndSafetyIcon />,
        path: '/system-health',
      },
      {
        labelKey: 'nav.activityLog',
        defaultLabel: 'Activity Log',
        icon: <HistoryIcon />,
        path: '/activity-log',
      },
      {
        labelKey: 'nav.settings',
        defaultLabel: 'Settings',
        icon: <SettingsIcon />,
        path: '/settings',
      },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity();
  const { t, i18n } = useTranslation();
  const isRTL = theme.direction === 'rtl';
  const activeItem = ALL_ITEMS.find((item) => item.path === pathname);
  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const toggleLanguage = () => {
    const nextLang = i18n.language?.startsWith('ar') ? 'en' : 'ar';
    void i18n.changeLanguage(nextLang);
    localStorage.setItem('admin-lang', nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  const isDark = mode === 'dark';
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: isDark ? '#0b0f19' : '#f8fafc',
          transition: 'background-color 0.2s ease',
        }}
      >
        {children}
      </Box>
    );
  }

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.path;
    return (
      <Tooltip
        title={collapsed ? t(item.labelKey, item.defaultLabel) : ''}
        placement={isRTL ? 'left' : 'right'}
        arrow
      >
        <ListItemButton
          selected={isActive}
          onClick={() => {
            router.push(item.path);
            setMobileOpen(false);
          }}
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 1.5,
            mb: 0.5,
            minHeight: 40,
            justifyContent: collapsed ? 'center' : 'flex-start',
            position: 'relative',
            color: isActive
              ? isDark
                ? '#38bdf8'
                : '#2563eb'
              : isDark
                ? 'rgba(255,255,255,0.65)'
                : 'rgba(15,23,42,0.7)',
            background: isActive
              ? isDark
                ? 'rgba(56,189,248,0.08)'
                : 'rgba(37,99,235,0.06)'
              : 'transparent',
            // Active line
            '&::before': isActive
              ? {
                  content: '""',
                  position: 'absolute',
                  [isRTL ? 'right' : 'left']: 0,
                  top: '20%',
                  bottom: '20%',
                  width: 3,
                  borderRadius: 99,
                  background: isDark ? '#38bdf8' : '#2563eb',
                }
              : {},
            '&:hover': {
              background: isActive
                ? isDark
                  ? 'rgba(56,189,248,0.12)'
                  : 'rgba(37,99,235,0.1)'
                : isDark
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(15,23,42,0.03)',
              color: isActive ? (isDark ? '#38bdf8' : '#2563eb') : isDark ? '#ffffff' : '#0f172a',
            },
            transition: 'all 0.15s ease',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              color: 'inherit',
              mr: collapsed ? 0 : 1.5,
              '& svg': { fontSize: 20 },
            }}
          >
            {item.icon}
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary={t(item.labelKey, item.defaultLabel)}
              primaryTypographyProps={{
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                lineHeight: 1.3,
                noWrap: true,
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    );
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
        borderRight: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
        overflowX: 'hidden',
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
      }}
    >
      {/* Brand Header */}
      <Box sx={{ p: collapsed ? 1.5 : 2, pt: 2, position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            p: collapsed ? 0.75 : 1.5,
            borderRadius: 2,
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 1.5,
            justifyContent: collapsed ? 'center' : 'flex-start',
            overflow: 'hidden',
            transition: 'all 0.2s ease',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              minWidth: 32,
              borderRadius: 1.5,
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <DirectionsBusIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          {!collapsed && (
            <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              >
                {t('nav.appTitle', 'UniRide Admin')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
                  whiteSpace: 'nowrap',
                  fontSize: '0.65rem',
                }}
              >
                {t('dashboard.title', 'Management Dashboard')}
              </Typography>
            </Box>
          )}
        </Box>

        {/* User chip */}
        {!collapsed && identity && (
          <Chip
            avatar={
              <Avatar sx={{ bgcolor: '#2563eb', color: '#fff', fontSize: 11 }}>
                {(identity as { name?: string })?.name?.[0]?.toUpperCase() || 'A'}
              </Avatar>
            }
            label={(identity as { name?: string })?.name || 'Admin'}
            sx={{
              mt: 1,
              width: '100%',
              justifyContent: 'flex-start',
              color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(15,23,42,0.85)',
              bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
              height: 30,
              '& .MuiChip-label': { fontWeight: 500, fontSize: 12 },
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' },
            }}
          />
        )}
      </Box>

      {/* Nav Groups */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: collapsed ? 0.5 : 1,
          pb: 1,
          position: 'relative',
          zIndex: 1,
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'transparent',
            borderRadius: '4px',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
          },
        }}
      >
        {NAV_GROUPS.map((group, gi) => (
          <React.Fragment key={group.groupKey}>
            {gi > 0 && <Divider sx={{ my: 1, borderColor: isDark ? '#1e293b' : '#e2e8f0' }} />}
            {!collapsed && (
              <Typography
                variant="overline"
                sx={{
                  color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)',
                  fontSize: '0.6rem',
                  px: 1.5,
                  py: 0.5,
                  display: 'block',
                  letterSpacing: '0.12em',
                  fontWeight: 600,
                }}
              >
                {t(group.groupKey, group.defaultGroupLabel)}
              </Typography>
            )}
            <List disablePadding>
              {group.items.map((item) => (
                <NavItemComponent key={item.path} item={item} />
              ))}
            </List>
          </React.Fragment>
        ))}
      </Box>

      {/* Bottom actions */}
      <Box sx={{ p: collapsed ? 0.5 : 1, position: 'relative', zIndex: 1 }}>
        <Divider sx={{ mb: 1, borderColor: isDark ? '#1e293b' : '#e2e8f0' }} />

        {/* Language toggle */}
        <Tooltip
          title={collapsed ? (isRTL ? 'English' : 'العربية') : ''}
          placement={isRTL ? 'left' : 'right'}
        >
          <ListItemButton
            onClick={toggleLanguage}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.7)',
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: 1.5,
              py: 0.8,
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
                color: isDark ? '#ffffff' : '#0f172a',
              },
              transition: 'all 0.15s ease',
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: 'inherit', mr: collapsed ? 0 : 1.5 }}>
              <TranslateIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={isRTL ? 'English' : 'العربية'}
                primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
              />
            )}
          </ListItemButton>
        </Tooltip>

        {/* Logout */}
        <Tooltip
          title={collapsed ? t('nav.logout', 'Logout') : ''}
          placement={isRTL ? 'left' : 'right'}
        >
          <ListItemButton
            onClick={() => logout()}
            sx={{
              borderRadius: 1.5,
              color: '#f87171',
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: 1.5,
              py: 0.8,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'rgba(239,68,68,0.08)',
                color: '#ef4444',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: 'inherit', mr: collapsed ? 0 : 1.5 }}>
              <LogoutIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={t('nav.logout', 'Logout')}
                primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
              />
            )}
          </ListItemButton>
        </Tooltip>

        {/* Collapse toggle (desktop only) */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', mt: 0.5 }}>
          <Tooltip
            title={
              collapsed ? t('nav.expand', 'Expand sidebar') : t('nav.collapse', 'Collapse sidebar')
            }
          >
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              size="small"
              sx={{
                color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
                '&:hover': {
                  color: isDark ? '#ffffff' : '#0f172a',
                  bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
                },
                transition: 'all 0.15s ease',
              }}
            >
              {isRTL ? (
                collapsed ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )
              ) : collapsed ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box dir={isRTL ? 'rtl' : 'ltr'} sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: isDark ? '#0f172a' : '#ffffff',
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          transition:
            'width 0.22s cubic-bezier(0.4,0,0.2,1), margin 0.22s cubic-bezier(0.4,0,0.2,1), background-color 0.2s ease',
        }}
      >
        <Toolbar sx={{ gap: 1, position: 'relative' }}>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ display: { sm: 'none' }, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                lineHeight: 1.2,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              {activeItem
                ? t(activeItem.labelKey, activeItem.defaultLabel)
                : t('nav.appTitle', 'UniRide')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
              {t('dashboard.subtitle', 'Monitor and manage platform operations')}
            </Typography>
          </Box>

          <Stack direction="row" gap="12px" alignItems="center">
            {/* Language toggle in AppBar */}
            <Tooltip title={isRTL ? 'Switch to English' : 'التحويل إلى العربية'}>
              <IconButton
                onClick={toggleLanguage}
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: 1.5,
                  px: 1.2,
                  py: 0.6,
                  gap: 0.5,
                  color: 'text.secondary',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isDark ? '#1e293b' : '#f1f5f9',
                    borderColor: isDark ? '#475569' : '#cbd5e1',
                  },
                }}
              >
                <TranslateIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.72rem' }}>
                  {isRTL ? 'EN' : 'عر'}
                </Typography>
              </IconButton>
            </Tooltip>

            {/* Dark Mode toggle in AppBar */}
            <Tooltip title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}>
              <IconButton
                onClick={toggleColorMode}
                size="small"
                sx={{
                  bgcolor: 'transparent',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: 1.5,
                  p: 0.6,
                  color: 'text.secondary',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isDark ? '#1e293b' : '#f1f5f9',
                    borderColor: isDark ? '#475569' : '#cbd5e1',
                  },
                }}
              >
                {isDark ? (
                  <LightModeIcon sx={{ fontSize: 18 }} />
                ) : (
                  <DarkModeIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Identity */}
            {identity && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.2,
                  py: 0.6,
                  borderRadius: 8,
                  bgcolor: isDark ? '#1e293b' : '#f1f5f9',
                  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isDark ? '#334155' : '#e2e8f0',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: '#2563eb',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {(identity as { name?: string })?.name?.[0]?.toUpperCase() || 'A'}
                </Avatar>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: 'text.primary', display: { xs: 'none', md: 'block' } }}
                >
                  {(identity as { name?: string })?.name || 'Admin'}
                </Typography>
              </Box>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar component */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: 0,
          transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          anchor="left"
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              border: 'none',
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          anchor="left"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              border: 'none',
              boxSizing: 'border-box',
              overflow: 'hidden',
              transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        className="page-enter"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: 8,
          minHeight: '100vh',
          bgcolor: isDark ? '#0b0f19' : '#f8fafc',
          transition: 'background-color 0.2s ease',
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
