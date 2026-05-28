'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TranslateIcon from '@mui/icons-material/Translate';
import SecurityIcon from '@mui/icons-material/Security';
import MapIcon from '@mui/icons-material/Map';
import PaymentsIcon from '@mui/icons-material/Payments';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AppleIcon from '@mui/icons-material/Apple';
import LoginIcon from '@mui/icons-material/Login';
import Link from 'next/link';

export default function LandingPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isRtl = lang === 'ar';

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const content = {
    ar: {
      nav: {
        login: 'لوحة التحكم',
        support: 'الدعم الفني',
      },
      hero: {
        badge: 'مستقبل النقل الجامعي في العراق ⚡',
        title: 'تنقل ذكي، آمن، ومريح مع منصة',
        titleAccent: 'سير',
        subtitle:
          'أول تطبيق متكامل لتنظيم رحلات النقل الجماعي للجامعات. تتبع مسار حافلتك بشكل حي، واحجز مقعدك بأكواد التراخيص الذكية بكل سهولة وأمان.',
        downloadApps: 'حمل التطبيق الآن',
        studentApp: 'تطبيق الطلاب',
        driverApp: 'تطبيق السائقين',
      },
      features: {
        title: 'لماذا يفضل الطلاب منصة سير؟',
        subtitle: 'صممنا المنصة لتلبية الاحتياجات اليومية للنقل الجامعي بأعلى كفاءة',
        list: [
          {
            icon: <MapIcon sx={{ fontSize: 40, color: '#8FA89B' }} />,
            title: 'تتبع حي للحافلة',
            desc: 'شاهد موقع الحافلة على الخريطة في الوقت الفعلي واعرف وقت وصولها الدقيق دون الحاجة للانتظار الطويل في الخارج.',
          },
          {
            icon: <PaymentsIcon sx={{ fontSize: 40, color: '#D49A3B' }} />,
            title: 'اشتراكات التراخيص الرقمية',
            desc: 'احجز مقعدك الشهري أو الأسبوعي بتفعيل أكواد التراخيص المدفوعة مسبقاً (8 رموز) لتجنب عناء الدفع النقدي اليومي.',
          },
          {
            icon: <NotificationsActiveIcon sx={{ fontSize: 40, color: '#D4845A' }} />,
            title: 'تنببهات فورية وذكية',
            desc: 'استقبل إشعارات لحظية على هاتفك فور انطلاق الرحلة، أو عند اقتراب السائق من موقع الانتظار الخاص بك.',
          },
          {
            icon: <SecurityIcon sx={{ fontSize: 40, color: '#C05C36' }} />,
            title: 'بيئة آمنة وموثقة',
            desc: 'جميع السائقين في شبكتنا موثقين ومعتمدين بعد مراجعة دقيقة لبياناتهم ومركباتهم لضمان رحلة دراسية آمنة تماماً.',
          },
        ],
      },
      cta: {
        title: 'جاهز لتبسيط رحلتك اليومية؟',
        subtitle: 'انضم لآلاف الطلاب والجامعيين الذين يستمتعون برحلة نقل خالية من التوتر كل يوم.',
        button: 'ابدأ الآن مجاناً',
      },
      footer: {
        desc: 'منصة سير للنقل الجامعي الذكي - الحل المتكامل لربط الطلاب بشبكة نقل مرخصة وموثوقة.',
        links: 'روابط هامة',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        support: 'الدعم وحذف الحساب',
        rights: 'جميع الحقوق محفوظة © ٢٠٢٦ منصة سير.',
      },
    },
    en: {
      nav: {
        login: 'Admin Panel',
        support: 'Support Hub',
      },
      hero: {
        badge: 'The Future of University Transit in Iraq ⚡',
        title: 'Smart, Secure, & Seamless Commutes with',
        titleAccent: 'Sair',
        subtitle:
          'The first unified university bus transit system. Track your bus live, secure your seat with smart prepaid license codes, and enjoy stress-free daily commutes.',
        downloadApps: 'Download App Now',
        studentApp: 'Student App',
        driverApp: 'Driver App',
      },
      features: {
        title: 'Why Students Love Sair',
        subtitle:
          'Designed to solve daily university transportation challenges with state-of-the-art tech.',
        list: [
          {
            icon: <MapIcon sx={{ fontSize: 40, color: '#8FA89B' }} />,
            title: 'Real-Time Bus Tracking',
            desc: 'Monitor your bus exact location live on the map. Know the estimated arrival time and never miss a bus or wait in the heat.',
          },
          {
            icon: <PaymentsIcon sx={{ fontSize: 40, color: '#D49A3B' }} />,
            title: 'Prepaid Digital Licenses',
            desc: 'Secure your weekly or monthly seat subscription easily by activating official 8-digit license codes, without cash handling.',
          },
          {
            icon: <NotificationsActiveIcon sx={{ fontSize: 40, color: '#D4845A' }} />,
            title: 'Smart Push Alerts',
            desc: 'Receive instant push notifications when your ride is scheduled, when the driver starts, or when the bus approaches your stop.',
          },
          {
            icon: <SecurityIcon sx={{ fontSize: 40, color: '#C05C36' }} />,
            title: 'Verified Fleet & Safe Rides',
            desc: 'All university drivers and buses are strictly verified for capacity, safety compliance, and official records to ensure complete safety.',
          },
        ],
      },
      cta: {
        title: 'Ready to Simplify Your Daily Commute?',
        subtitle:
          'Join thousands of university students and staff enjoying a modern, reliable, and premium transportation experience.',
        button: 'Get Started Today',
      },
      footer: {
        desc: 'Sair University Transit Platform - The complete solution to connect students with verified, reliable transport networks.',
        links: 'Useful Links',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        support: 'Support & Deletion',
        rights: 'All rights reserved © 2026 Sair Transit.',
      },
    },
  };

  const t = content[lang];

  return (
    <Box
      className="grid-pattern-dark"
      sx={{
        minHeight: '100vh',
        bgcolor: '#0B2418',
        color: '#f8fafc',
        fontFamily: 'var(--font-noto-arabic), sans-serif',
        overflowX: 'hidden',
        position: 'relative',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Decorative ambient glowing background circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-12%',
          right: isRtl ? 'auto' : '-8%',
          left: isRtl ? '-8%' : 'auto',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22,163,74,0.2) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(90px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          right: isRtl ? '-10%' : 'auto',
          left: isRtl ? 'auto' : '-10%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(110px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Navigation Header */}
      <Box
        sx={{
          borderBottom: '1px solid rgba(22, 163, 74, 0.12)',
          backdropFilter: 'blur(20px)',
          bgcolor: 'rgba(11, 36, 24, 0.85)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ height: '72px' }}
          >
            {/* Logo */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 24px rgba(22, 163, 74, 0.6)',
                }}
              >
                <DirectionsBusIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: 0.5, color: '#fff' }}>
                {lang === 'ar' ? 'سير' : 'Sair'}
              </Typography>
            </Stack>

            {/* Menu & Language Toggle */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="outlined"
                onClick={toggleLanguage}
                startIcon={<TranslateIcon sx={{ fontSize: 16 }} />}
                sx={{
                  color: '#4ADE80',
                  borderColor: 'rgba(74, 222, 128, 0.35)',
                  borderRadius: 2,
                  px: 2.2,
                  py: 0.8,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#4ADE80',
                    bgcolor: 'rgba(74, 222, 128, 0.08)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {lang === 'ar' ? 'English' : 'العربية'}
              </Button>

              <Link href="/support" passHref legacyBehavior>
                <Button
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    display: { xs: 'none', sm: 'inline-flex' },
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#4ADE80',
                      bgcolor: 'transparent',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {t.nav.support}
                </Button>
              </Link>

              <Link href="/login" passHref legacyBehavior>
                <Button
                  variant="contained"
                  startIcon={<LoginIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    bgcolor: '#16A34A',
                    color: '#fff',
                    borderRadius: 2.5,
                    px: 3,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 4px 16px rgba(22, 163, 74, 0.4)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: '#15803D',
                      boxShadow: '0 6px 22px rgba(22, 163, 74, 0.55)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {t.nav.login}
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 14 } }}
      >
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Stack spacing={4}>
              {/* Badge */}
              <Box sx={{ display: 'flex' }}>
                <Box
                  sx={{
                    px: 2,
                    py: 0.8,
                    borderRadius: 5,
                    bgcolor: 'rgba(22, 163, 74, 0.08)',
                    border: '1px solid rgba(22, 163, 74, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.05)',
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#4ADE80',
                      className: 'live-dot',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: '#4ADE80', fontWeight: 700, letterSpacing: 0.5 }}
                  >
                    {t.hero.badge}
                  </Typography>
                </Box>
              </Box>

              {/* Title */}
              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  lineHeight: 1.25,
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  letterSpacing: -0.5,
                }}
              >
                {t.hero.title}{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(to right, #4ADE80, #16A34A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                    position: 'relative',
                    textShadow: '0 0 40px rgba(22, 163, 74, 0.15)',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 8,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background:
                        'linear-gradient(to right, rgba(74,222,128,0.6), rgba(22, 163, 74, 0.6))',
                      borderRadius: 2,
                    },
                  }}
                >
                  {t.hero.titleAccent}
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h6"
                sx={{
                  color: '#94a3b8',
                  lineHeight: 1.7,
                  fontWeight: 400,
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  maxWidth: '600px',
                }}
              >
                {t.hero.subtitle}
              </Typography>

              {/* Buttons / Download Links */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AppleIcon />}
                  sx={{
                    bgcolor: '#2D2D2D',
                    color: '#fff',
                    borderRadius: 3,
                    px: 3.5,
                    py: 1.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    border: '1px solid rgba(22, 163, 74, 0.12)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: '#1E1E1E',
                      borderColor: 'rgba(22, 163, 74, 0.35)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Stack alignItems="flex-start" spacing={0} sx={{ textAlign: 'left' }}>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      Download on the
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {t.hero.studentApp}
                    </Typography>
                  </Stack>
                </Button>

                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    bgcolor: '#2D2D2D',
                    color: '#fff',
                    borderRadius: 3,
                    px: 3.5,
                    py: 1.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    border: '1px solid rgba(22, 163, 74, 0.12)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: '#1E1E1E',
                      borderColor: 'rgba(22, 163, 74, 0.35)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Stack alignItems="flex-start" spacing={0} sx={{ textAlign: 'left' }}>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      Get it on
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {t.hero.driverApp}
                    </Typography>
                  </Stack>
                </Button>
              </Stack>
            </Stack>
          </Grid>

          {/* Graphical Mockup representation (Interactive Smartphone Frame) */}
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '340px',
                height: '520px',
                borderRadius: '40px',
                background:
                  'linear-gradient(135deg, rgba(45, 43, 41, 0.85) 0%, rgba(26, 24, 23, 0.98) 100%)',
                border: '4px solid #333130',
                outline: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(22, 163, 74, 0.18)',
                position: 'relative',
                p: 3,
                pt: 7,
                pb: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
              }}
            >
              {/* iPhone Dynamic Island Style Notch */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 100,
                  height: 24,
                  borderRadius: '12px',
                  bgcolor: '#000000',
                  zIndex: 10,
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 1.5,
                }}
              >
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#0f172a' }} />
                <Box
                  sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }}
                />
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
              </Box>

              {/* Status Bar */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 24,
                  right: 24,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  zIndex: 9,
                  opacity: 0.85,
                  color: '#94a3b8',
                }}
              >
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 700 }}>12:30</Typography>
                <Stack direction="row" spacing={0.6} alignItems="center">
                  {/* Network Icon */}
                  <Box sx={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: 8 }}>
                    <Box sx={{ width: 2, height: 3, bgcolor: 'currentColor' }} />
                    <Box sx={{ width: 2, height: 5, bgcolor: 'currentColor' }} />
                    <Box sx={{ width: 2, height: 7, bgcolor: 'currentColor' }} />
                    <Box sx={{ width: 2, height: 8, bgcolor: 'currentColor' }} />
                  </Box>
                  {/* Battery */}
                  <Box
                    sx={{
                      width: 15,
                      height: 8,
                      borderRadius: '2px',
                      border: '1px solid currentColor',
                      position: 'relative',
                      p: '0.5px',
                      display: 'flex',
                    }}
                  >
                    <Box
                      sx={{
                        width: '80%',
                        height: '100%',
                        bgcolor: '#10b981',
                        borderRadius: '0.5px',
                      }}
                    />
                    <Box
                      sx={{
                        width: 1.5,
                        height: 3,
                        bgcolor: 'currentColor',
                        borderRadius: '0 0.5px 0.5px 0',
                        position: 'absolute',
                        right: -2.5,
                        top: 1.5,
                      }}
                    />
                  </Box>
                </Stack>
              </Box>

              {/* Glassmorphic live tracking card */}
              <Box
                sx={{
                  bgcolor: 'rgba(11, 36, 24, 0.75)',
                  border: '1px solid rgba(22, 163, 74, 0.22)',
                  borderRadius: '18px',
                  p: 2,
                  zIndex: 2,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: '#4ADE80',
                        className: 'live-dot',
                      }}
                    />
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="#4ADE80"
                      sx={{ letterSpacing: 0.5 }}
                    >
                      {lang === 'ar' ? 'تتبع حي نشط' : 'Active Tracking'}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="#94a3b8">
                    12:30 PM
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5, color: '#fff' }}>
                  {lang === 'ar' ? 'خط جامعة بغداد - الجادرية' : 'Baghdad Uni Route - Jaderiyah'}
                </Typography>
                <Typography variant="caption" color="#94a3b8" sx={{ display: 'block', mb: 1.5 }}>
                  {lang === 'ar'
                    ? 'السائق: وسام سمير | حافلة رقم ٤٩٢ بغداد'
                    : 'Driver: Wisam Samir | Bus 492 Baghdad'}
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: '100px',
                    borderRadius: '12px',
                    bgcolor: '#0B2418',
                    border: '1px solid rgba(22, 163, 74, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Dotted curve representing bus route */}
                  <svg
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                  >
                    <path
                      d="M 30,70 Q 120,20 160,50 T 260,35"
                      fill="none"
                      stroke="rgba(22, 163, 74, 0.2)"
                      strokeWidth="4"
                      strokeDasharray="6,6"
                    />
                    <path
                      d="M 30,70 Q 120,20 160,50"
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth="4"
                    />
                  </svg>

                  {/* Start Point */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 25,
                      top: 65,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#D49A3B',
                      boxShadow: '0 0 8px #D49A3B',
                    }}
                  />

                  {/* Active Bus Icon */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 154,
                      top: 44,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      bgcolor: '#16A34A',
                      boxShadow: '0 0 16px #16A34A, 0 0 0 4px rgba(22,163,74,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DirectionsBusIcon sx={{ color: '#fff', fontSize: 13 }} />
                  </Box>

                  {/* Destination Point */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 256,
                      top: 31,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#C05C36',
                      boxShadow: '0 0 8px #C05C36',
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 6,
                      right: 10,
                      fontSize: '0.62rem',
                      color: '#64748b',
                      fontWeight: 600,
                    }}
                  >
                    {lang === 'ar' ? 'تحديث حي 🟢' : 'Live updates 🟢'}
                  </Typography>
                </Box>
              </Box>

              {/* License Card Sim (Bronze/Amber theme) */}
              <Box
                sx={{
                  bgcolor: 'rgba(45, 43, 40, 0.85)',
                  border: '1px solid rgba(212, 154, 59, 0.25)',
                  borderRadius: '18px',
                  p: 2,
                  zIndex: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: 'rgba(74, 222, 128, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SecurityIcon sx={{ color: '#4ADE80', fontSize: 18 }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="caption"
                      color="#94a3b8"
                      sx={{ display: 'block', fontSize: '0.68rem' }}
                    >
                      {lang === 'ar' ? 'الاشتراك الرقمي النشط' : 'Active Digital License'}
                    </Typography>
                    <Typography variant="body2" fontWeight={800} color="#fff">
                      SR-2026-X8
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      bgcolor: 'rgba(212, 154, 59, 0.12)',
                      border: '1px solid rgba(212, 154, 59, 0.25)',
                    }}
                  >
                    <Typography variant="caption" fontWeight={700} color="#D49A3B">
                      {lang === 'ar' ? 'فعّال' : 'Active'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Home Indicator bar */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 120,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.25)',
                  zIndex: 10,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          bgcolor: '#0B2418',
          py: { xs: 8, md: 12 },
          borderTop: '1px solid rgba(22, 163, 74, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, color: '#fff' }}
            >
              {t.features.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#94a3b8', maxWidth: '600px' }}>
              {t.features.subtitle}
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {t.features.list.map((feat, idx) => {
              return (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Card
                    elevation={0}
                    className="card-shine"
                    sx={{
                      height: '100%',
                      bgcolor: 'rgba(11, 36, 24, 0.45)',
                      border: '1px solid rgba(22, 163, 74, 0.08)',
                      borderRadius: 5,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        borderColor: 'rgba(74, 222, 128, 0.3)',
                        bgcolor: 'rgba(45, 43, 41, 0.75)',
                        boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.7)',
                      },
                    }}
                  >
                    <CardContent
                      sx={{ p: 3.5, display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                      <Box sx={{ mb: 2.5 }}>{feat.icon}</Box>
                      <Typography variant="h6" fontWeight={750} gutterBottom sx={{ color: '#fff' }}>
                        {feat.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                        {feat.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* CTA Download Banner */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box
          className="grid-pattern"
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 6,
            background:
              'linear-gradient(135deg, rgba(22, 163, 74, 0.16) 0%, rgba(11, 36, 24, 0.95) 100%)',
            border: '1px solid rgba(22, 163, 74, 0.25)',
            boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.8)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle orb shine */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, rgba(0,0,0,0) 60%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          <Stack spacing={3.5} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, color: '#fff', letterSpacing: -0.5 }}
            >
              {t.cta.title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#94a3b8', maxWidth: '600px', lineHeight: 1.6 }}
            >
              {t.cta.subtitle}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#16A34A',
                  color: '#fff',
                  px: 4.5,
                  py: 1.6,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 18px rgba(22, 163, 74, 0.45)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#15803D',
                    boxShadow: '0 8px 24px rgba(22, 163, 74, 0.55)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {t.cta.button}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ borderTop: '1px solid rgba(22, 163, 74, 0.08)', bgcolor: '#0B2418', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      bgcolor: '#16A34A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DirectionsBusIcon sx={{ color: '#fff', fontSize: 16 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={800} color="#fff">
                    {lang === 'ar' ? 'سير' : 'Sair'}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ color: '#64748b', maxWidth: '400px', lineHeight: 1.6 }}
                >
                  {t.footer.desc}
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                <Typography variant="subtitle2" fontWeight={700} color="#fff">
                  {t.footer.links}
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1.5, sm: 3 }}
                  alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                >
                  <Link href="/privacy" passHref legacyBehavior>
                    <Button
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        p: 0,
                        minWidth: 0,
                        transition: 'color 0.2s ease',
                        '&:hover': { color: '#4ADE80' },
                      }}
                    >
                      {t.footer.privacy}
                    </Button>
                  </Link>
                  <Link href="/terms" passHref legacyBehavior>
                    <Button
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        p: 0,
                        minWidth: 0,
                        transition: 'color 0.2s ease',
                        '&:hover': { color: '#4ADE80' },
                      }}
                    >
                      {t.footer.terms}
                    </Button>
                  </Link>
                  <Link href="/support" passHref legacyBehavior>
                    <Button
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                        textTransform: 'none',
                        p: 0,
                        minWidth: 0,
                        transition: 'color 0.2s ease',
                        '&:hover': { color: '#4ADE80' },
                      }}
                    >
                      {t.footer.support}
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(22, 163, 74, 0.08)', mb: 3 }} />

          <Typography
            variant="caption"
            sx={{ color: '#475569', display: 'block', textAlign: 'center' }}
          >
            {t.footer.rights}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
