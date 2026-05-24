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
import {
  LayoutDashboard,
  Users,
  Route,
  Bus,
  CreditCard,
  LogOut,
  Menu,
  User,
  Ticket,
  Layers,
  GraduationCap,
  BarChart3,
  Flag,
  Wallet,
  Star,
  Bell,
  Archive,
  DollarSign,
  ShieldAlert,
  Upload,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
  Languages,
  Moon,
  Sun,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
      {
        labelKey: 'nav.dashboard',
        defaultLabel: 'Dashboard',
        icon: <LayoutDashboard size={20} />,
        path: '/',
      },
      {
        labelKey: 'nav.liveTrips',
        defaultLabel: 'Live Trips',
        icon: <Bus size={20} />,
        path: '/trips',
      },
      {
        labelKey: 'nav.tripArchive',
        defaultLabel: 'Trip Archive',
        icon: <Archive size={20} />,
        path: '/trip-archive',
      },
      {
        labelKey: 'nav.analytics',
        defaultLabel: 'Analytics',
        icon: <BarChart3 size={20} />,
        path: '/analytics',
      },
    ],
  },
  {
    groupKey: 'nav.group.people',
    defaultGroupLabel: 'People',
    items: [
      {
        labelKey: 'nav.users',
        defaultLabel: 'Users',
        icon: <Users size={20} />,
        path: '/profiles',
      },
      {
        labelKey: 'nav.drivers',
        defaultLabel: 'Drivers',
        icon: <User size={20} />,
        path: '/drivers',
      },
      {
        labelKey: 'nav.institutions',
        defaultLabel: 'Institutions',
        icon: <GraduationCap size={20} />,
        path: '/institutions',
      },
    ],
  },
  {
    groupKey: 'nav.group.network',
    defaultGroupLabel: 'Network',
    items: [
      {
        labelKey: 'nav.routes',
        defaultLabel: 'Routes',
        icon: <Route size={20} />,
        path: '/routes',
      },
      {
        labelKey: 'nav.subscriptions',
        defaultLabel: 'Subscriptions',
        icon: <CreditCard size={20} />,
        path: '/subscriptions',
      },
      {
        labelKey: 'nav.licenseBatches',
        defaultLabel: 'License Batches',
        icon: <Layers size={20} />,
        path: '/license_batches',
      },
      {
        labelKey: 'nav.licenses',
        defaultLabel: 'Licenses',
        icon: <Ticket size={20} />,
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
        icon: <DollarSign size={20} />,
        path: '/revenue',
      },
      {
        labelKey: 'nav.payouts',
        defaultLabel: 'Payouts',
        icon: <Wallet size={20} />,
        path: '/payouts',
      },
      {
        labelKey: 'nav.ratings',
        defaultLabel: 'Ratings',
        icon: <Star size={20} />,
        path: '/ratings',
      },
    ],
  },
  {
    groupKey: 'nav.group.system',
    defaultGroupLabel: 'System',
    items: [
      {
        labelKey: 'nav.notifications',
        defaultLabel: 'Notifications',
        icon: <Bell size={20} />,
        path: '/notifications',
      },
      {
        labelKey: 'nav.featureFlags',
        defaultLabel: 'Feature Flags',
        icon: <Flag size={20} />,
        path: '/feature-flags',
      },
      {
        labelKey: 'nav.bulkImport',
        defaultLabel: 'Bulk Import',
        icon: <Upload size={20} />,
        path: '/bulk-import',
      },
      {
        labelKey: 'nav.systemHealth',
        defaultLabel: 'System Health',
        icon: <ShieldAlert size={20} />,
        path: '/system-health',
      },
      {
        labelKey: 'nav.activityLog',
        defaultLabel: 'Activity Log',
        icon: <History size={20} />,
        path: '/activity-log',
      },
      {
        labelKey: 'nav.settings',
        defaultLabel: 'Settings',
        icon: <Settings size={20} />,
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
  const isPublicPage = ['/login', '/privacy', '/terms', '/home', '/support'].includes(
    pathname || '',
  );

  if (isPublicPage) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: isDark ? '#1A1A1A' : '#F5F2EF',
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
          component={Link}
          href={item.path}
          selected={isActive}
          onClick={() => setMobileOpen(false)}
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
                ? '#D4845A'
                : '#C2703E'
              : isDark
                ? 'rgba(255,255,255,0.65)'
                : 'rgba(15,23,42,0.7)',
            background: isActive
              ? isDark
                ? 'rgba(212,132,90,0.08)'
                : 'rgba(194,112,62,0.06)'
              : 'transparent',
            // Active line
            '&::before': isActive
              ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '20%',
                  bottom: '20%',
                  width: 3,
                  borderRadius: 99,
                  background: isDark ? '#D4845A' : '#C2703E',
                }
              : {},
            '&:hover': {
              background: isActive
                ? isDark
                  ? 'rgba(212,132,90,0.12)'
                  : 'rgba(194,112,62,0.1)'
                : isDark
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(15,23,42,0.03)',
              color: isActive ? (isDark ? '#D4845A' : '#C2703E') : isDark ? '#ffffff' : '#0f172a',
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
        background: isDark ? '#2D2D2D' : '#ffffff',
        color: isDark ? '#ffffff' : '#1A1A1A',
        borderRight: `1px solid ${isDark ? '#3D3D3D' : '#E0DDD8'}`,
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
            border: `1px solid ${isDark ? '#3D3D3D' : '#E0DDD8'}`,
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
              background: '#C2703E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Bus size={18} color="#fff" />
          </Box>
          {!collapsed && (
            <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  color: isDark ? '#ffffff' : '#1A1A1A',
                }}
              >
                {t('nav.appTitle', 'Sair Admin')}
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
        {!collapsed && !!identity && (
          <Chip
            avatar={
              <Avatar sx={{ bgcolor: '#C2703E', color: '#fff', fontSize: 11 }}>
                {(identity as { name?: string })?.name?.[0]?.toUpperCase() || 'A'}
              </Avatar>
            }
            label={(identity as { name?: string })?.name || 'Admin'}
            sx={{
              mt: 1,
              width: '100%',
              justifyContent: 'flex-start',
              color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(26,26,26,0.85)',
              bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isDark ? '#3D3D3D' : '#E0DDD8'}`,
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
            {gi > 0 && <Divider sx={{ my: 1, borderColor: isDark ? '#3D3D3D' : '#E0DDD8' }} />}
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
        <Divider sx={{ mb: 1, borderColor: isDark ? '#3D3D3D' : '#E0DDD8' }} />

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
              <Languages size={18} />
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
              <LogOut size={18} />
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
                  <ChevronLeft />
                ) : (
                  <ChevronRight />
                )
              ) : collapsed ? (
                <ChevronRight />
              ) : (
                <ChevronLeft />
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
          top: { xs: '12px', sm: '16px' },
          left: { xs: '12px', sm: `calc(${drawerWidth}px + 24px)` },
          right: { xs: '12px', sm: '24px' },
          width: 'auto',
          bgcolor: isDark ? 'rgba(45, 45, 45, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)'}`,
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.37)'
            : '0 8px 32px rgba(15, 23, 42, 0.05)',
          transition:
            'left 0.22s cubic-bezier(0.4,0,0.2,1), right 0.22s cubic-bezier(0.4,0,0.2,1), background-color 0.2s ease',
        }}
      >
        <Toolbar sx={{ gap: 1, position: 'relative' }}>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ display: { sm: 'none' }, color: 'text.secondary' }}
          >
            <Menu />
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
                : t('nav.appTitle', 'Sair')}
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
                  border: `1px solid ${isDark ? '#3D3D3D' : '#E0DDD8'}`,
                  borderRadius: 1.5,
                  px: 1.2,
                  py: 0.6,
                  gap: 0.5,
                  color: 'text.secondary',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isDark ? '#3D3D3D' : '#F5F2EF',
                    borderColor: isDark ? '#3D3D3D' : '#E0DDD8',
                  },
                }}
              >
                <Languages size={16} />
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
                  border: `1px solid ${isDark ? '#3D3D3D' : '#E0DDD8'}`,
                  borderRadius: 1.5,
                  p: 0.6,
                  color: 'text.secondary',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isDark ? '#3D3D3D' : '#F5F2EF',
                    borderColor: isDark ? '#3D3D3D' : '#E0DDD8',
                  },
                }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </IconButton>
            </Tooltip>

            {/* Identity */}
            {!!identity && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.2,
                  py: 0.6,
                  borderRadius: 8,
                  bgcolor: isDark ? '#2D2D2D' : '#ffffff',
                  border: `1px solid ${isDark ? '#3D3D3D' : '#E0DDD8'}`,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: isDark ? '#3D3D3D' : '#F5F2EF',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: '#C2703E',
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
          mt: { xs: 11, sm: 13 },
          minHeight: '100vh',
          bgcolor: isDark ? '#1A1A1A' : '#F5F2EF',
          transition: 'background-color 0.2s ease',
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
