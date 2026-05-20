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
  Collapse,
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
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

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

// Flat list used for active item lookup
const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const activeItem = ALL_ITEMS.find((item) => item.path === pathname);
  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    void i18n.changeLanguage(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  };

  const NavItem = ({ item }: { item: NavItem }) => {
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
            px: collapsed ? 1.5 : 1.5,
            py: 1,
            borderRadius: 2.5,
            mb: 0.5,
            minHeight: 44,
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
            background: isActive
              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              : 'transparent',
            boxShadow: isActive ? '0 8px 20px rgba(37,99,235,0.3)' : 'none',
            '&:hover': {
              background: isActive
                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                : 'rgba(255,255,255,0.07)',
              color: '#fff',
            },
            transition: 'all 0.18s ease',
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
                fontWeight: isActive ? 700 : 500,
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
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 55%, #111827 100%)',
        color: '#fff',
        overflowX: 'hidden',
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Brand Header */}
      <Box sx={{ p: collapsed ? 1.5 : 2.5, pt: 2 }}>
        <Box
          sx={{
            p: collapsed ? 1 : 2,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 1.5,
            justifyContent: collapsed ? 'center' : 'flex-start',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              minWidth: 38,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(37,99,235,0.4)',
            }}
          >
            <DirectionsBusIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          {!collapsed && (
            <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="subtitle1"
                fontWeight={800}
                sx={{ lineHeight: 1.2, whiteSpace: 'nowrap' }}
              >
                {t('nav.appTitle', 'UniRide Admin')}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}
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
              <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', fontSize: 12 }}>
                {(identity as { name?: string })?.name?.[0]?.toUpperCase() || 'A'}
              </Avatar>
            }
            label={(identity as { name?: string })?.name || 'Admin'}
            sx={{
              mt: 1.5,
              width: '100%',
              justifyContent: 'flex-start',
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.08)',
              height: 34,
              '& .MuiChip-label': { fontWeight: 600, fontSize: 12.5 },
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
          px: collapsed ? 0.75 : 1.5,
          pb: 1,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.12) transparent',
        }}
      >
        {NAV_GROUPS.map((group, gi) => (
          <React.Fragment key={group.groupKey}>
            {gi > 0 && <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.07)' }} />}
            {!collapsed && (
              <Typography
                variant="overline"
                sx={{
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: '0.65rem',
                  px: 1.5,
                  py: 0.5,
                  display: 'block',
                  letterSpacing: '0.1em',
                }}
              >
                {t(group.groupKey, group.defaultGroupLabel)}
              </Typography>
            )}
            <List disablePadding>
              {group.items.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </List>
          </React.Fragment>
        ))}
      </Box>

      {/* Bottom actions */}
      <Box sx={{ p: collapsed ? 0.75 : 1.5 }}>
        <Divider sx={{ mb: 1.5, borderColor: 'rgba(255,255,255,0.07)' }} />

        {/* Language toggle */}
        <Tooltip
          title={collapsed ? (i18n.language === 'ar' ? 'English' : 'العربية') : ''}
          placement={isRTL ? 'left' : 'right'}
        >
          <ListItemButton
            onClick={toggleLanguage}
            sx={{
              borderRadius: 2.5,
              mb: 0.75,
              color: 'rgba(255,255,255,0.65)',
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1.5 : 1.5,
              py: 0.9,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', color: '#fff' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: 'inherit', mr: collapsed ? 0 : 1.5 }}>
              <TranslateIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={i18n.language === 'ar' ? 'English' : 'العربية'}
                primaryTypographyProps={{ fontSize: 13.5, fontWeight: 600 }}
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
              borderRadius: 2.5,
              bgcolor: 'rgba(239,68,68,0.1)',
              color: '#fca5a5',
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1.5 : 1.5,
              py: 0.9,
              '&:hover': { bgcolor: 'rgba(239,68,68,0.18)', color: '#fecaca' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: 'inherit', mr: collapsed ? 0 : 1.5 }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={t('nav.logout', 'Logout')}
                primaryTypographyProps={{ fontSize: 13.5, fontWeight: 600 }}
              />
            )}
          </ListItemButton>
        </Tooltip>

        {/* Collapse toggle (desktop only) */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', mt: 1 }}>
          <Tooltip
            title={
              collapsed ? t('nav.expand', 'Expand sidebar') : t('nav.collapse', 'Collapse sidebar')
            }
          >
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              size="small"
              sx={{
                color: 'rgba(255,255,255,0.4)',
                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
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
    <Box sx={{ display: 'flex', minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ...(isRTL ? { mr: { sm: `${drawerWidth}px` } } : { ml: { sm: `${drawerWidth}px` } }),
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(148,163,184,0.15)',
          boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
          transition:
            'width 0.22s cubic-bezier(0.4,0,0.2,1), margin 0.22s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
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
              sx={{ color: 'text.primary', fontWeight: 800, lineHeight: 1.2 }}
            >
              {activeItem
                ? t(activeItem.labelKey, activeItem.defaultLabel)
                : t('nav.appTitle', 'UniRide')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('dashboard.subtitle', 'Monitor and manage platform operations')}
            </Typography>
          </Box>

          {/* Language toggle in AppBar */}
          <Tooltip title={i18n.language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}>
            <IconButton
              onClick={toggleLanguage}
              size="small"
              sx={{
                bgcolor: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.12)',
                borderRadius: 2,
                px: 1.2,
                py: 0.6,
                gap: 0.5,
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(37,99,235,0.12)' },
              }}
            >
              <TranslateIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.72rem' }}>
                {i18n.language === 'ar' ? 'EN' : 'عر'}
              </Typography>
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
                borderRadius: 99,
                bgcolor: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.12)',
              }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: 'primary.main',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {(identity as { name?: string })?.name?.[0]?.toUpperCase() || 'A'}
              </Avatar>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: 'text.primary', display: { xs: 'none', md: 'block' } }}
              >
                {(identity as { name?: string })?.name || 'Admin'}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
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
          anchor={isRTL ? 'right' : 'left'}
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
          anchor={isRTL ? 'right' : 'left'}
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
          background: 'radial-gradient(ellipse at top left, rgba(59,130,246,0.07) 0%, #f8fafc 40%)',
          transition: 'margin 0.22s cubic-bezier(0.4,0,0.2,1)',
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
