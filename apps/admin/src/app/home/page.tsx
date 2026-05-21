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
  IconButton,
  Divider,
  useTheme,
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
            icon: <MapIcon sx={{ fontSize: 40, color: '#38bdf8' }} />,
            title: 'تتبع حي للحافلة',
            desc: 'شاهد موقع الحافلة على الخريطة في الوقت الفعلي واعرف وقت وصولها الدقيق دون الحاجة للانتظار الطويل في الخارج.',
          },
          {
            icon: <PaymentsIcon sx={{ fontSize: 40, color: '#10b981' }} />,
            title: 'اشتراكات التراخيص الرقمية',
            desc: 'احجز مقعدك الشهري أو الأسبوعي بتفعيل أكواد التراخيص المدفوعة مسبقاً (8 رموز) لتجنب عناء الدفع النقدي اليومي.',
          },
          {
            icon: <NotificationsActiveIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
            title: 'تنبيهات فورية وذكية',
            desc: 'استقبل إشعارات لحظية على هاتفك فور انطلاق الرحلة، أو عند اقتراب السائق من موقع الانتظار الخاص بك.',
          },
          {
            icon: <SecurityIcon sx={{ fontSize: 40, color: '#ef4444' }} />,
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
            icon: <MapIcon sx={{ fontSize: 40, color: '#38bdf8' }} />,
            title: 'Real-Time Bus Tracking',
            desc: 'Monitor your bus exact location live on the map. Know the estimated arrival time and never miss a bus or wait in the heat.',
          },
          {
            icon: <PaymentsIcon sx={{ fontSize: 40, color: '#10b981' }} />,
            title: 'Prepaid Digital Licenses',
            desc: 'Secure your weekly or monthly seat subscription easily by activating official 8-digit license codes, without cash handling.',
          },
          {
            icon: <NotificationsActiveIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
            title: 'Smart Push Alerts',
            desc: 'Receive instant push notifications when your ride is scheduled, when the driver starts, or when the bus approaches your stop.',
          },
          {
            icon: <SecurityIcon sx={{ fontSize: 40, color: '#ef4444' }} />,
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
      sx={{
        minHeight: '100vh',
        bgcolor: '#070a13',
        color: '#f8fafc',
        fontFamily: 'var(--font-ibm-arabic), sans-serif',
        overflowX: 'hidden',
        position: 'relative',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      {/* Decorative ambient glowing background circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: isRtl ? 'auto' : '-10%',
          left: isRtl ? '-10%' : 'auto',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: isRtl ? '-15%' : 'auto',
          left: isRtl ? 'auto' : '-15%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Navigation Header */}
      <Box
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          bgcolor: 'rgba(7, 10, 19, 0.7)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
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
                  bgcolor: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)',
                }}
              >
                <DirectionsBusIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: 1, color: '#fff' }}>
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
                  color: '#38bdf8',
                  borderColor: 'rgba(56, 189, 248, 0.3)',
                  borderRadius: 2,
                  px: 2,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#38bdf8',
                    bgcolor: 'rgba(56, 189, 248, 0.05)',
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
                    '&:hover': { color: '#38bdf8', bgcolor: 'transparent' },
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
                    bgcolor: '#2563eb',
                    color: '#fff',
                    borderRadius: 2.5,
                    px: 3,
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                    '&:hover': {
                      bgcolor: '#1d4ed8',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
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
                    bgcolor: 'rgba(37, 99, 235, 0.1)',
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#60a5fa', fontWeight: 700 }}>
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
                    background: 'linear-gradient(to right, #38bdf8, #2563eb)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 8,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background:
                        'linear-gradient(to right, rgba(56,189,248,0.5), rgba(37,99,235,0.5))',
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
                    bgcolor: '#1e293b',
                    color: '#fff',
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: '#0f172a',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
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
                    bgcolor: '#1e293b',
                    color: '#fff',
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: '#0f172a',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
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

          {/* Graphical Mockup representation */}
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '380px',
                height: '420px',
                borderRadius: '24px',
                background:
                  'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(56, 189, 248, 0.1)',
                position: 'relative',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Glassmorphic inner card */}
              <Box
                sx={{
                  bgcolor: 'rgba(37, 99, 235, 0.05)',
                  border: '1px solid rgba(37, 99, 235, 0.15)',
                  borderRadius: '16px',
                  p: 2,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                    <Typography variant="caption" fontWeight={700} color="#10b981">
                      {lang === 'ar' ? 'رحلة نشطة حالياً' : 'Active Trip Now'}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="#94a3b8">
                    12:30 PM
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                  {lang === 'ar' ? 'خط جامعة بغداد - الجادرية' : 'Baghdad Uni Route - Jaderiyah'}
                </Typography>
                <Typography variant="caption" color="#94a3b8" sx={{ display: 'block', mb: 1 }}>
                  {lang === 'ar'
                    ? 'السائق: وسام سمير | حافلة رقم ٤٩٢ بابل'
                    : 'Driver: Wisam Samir | Bus 492 Babil'}
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: '80px',
                    borderRadius: '8px',
                    bgcolor: '#070a13',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Visual simulated map */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '2px',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '2px',
                      height: '100%',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '30%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: '#2563eb',
                      boxShadow: '0 0 10px #2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DirectionsBusIcon sx={{ color: '#fff', fontSize: 10 }} />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '70%',
                      top: '30%',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: '#ef4444',
                      boxShadow: '0 0 8px #ef4444',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 6,
                      fontSize: '0.65rem',
                      color: '#64748b',
                    }}
                  >
                    {lang === 'ar' ? 'تحديث تلقائي مفعّل 🟢' : 'Live Tracking Enabled 🟢'}
                  </Typography>
                </Box>
              </Box>

              {/* License Card Sim */}
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  p: 2,
                  mt: 2,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: 'rgba(56, 189, 248, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SecurityIcon sx={{ color: '#38bdf8', fontSize: 18 }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" color="#94a3b8" sx={{ display: 'block' }}>
                      {lang === 'ar' ? 'الاشتراك الرقمي النشط' : 'Active Digital License'}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      SR-9382-X9
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 1.5,
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <Typography variant="caption" fontWeight={700} color="#10b981">
                      {lang === 'ar' ? 'نشط' : 'Active'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          bgcolor: '#0b0f19',
          py: { xs: 8, md: 12 },
          borderTop: '1px solid rgba(255,255,255,0.03)',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}
            >
              {t.features.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#64748b', maxWidth: '600px' }}>
              {t.features.subtitle}
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {t.features.list.map((feat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    bgcolor: 'rgba(30, 41, 59, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: 'rgba(56, 189, 248, 0.2)',
                      bgcolor: 'rgba(30, 41, 59, 0.5)',
                      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                    },
                  }}
                >
                  <CardContent
                    sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}
                  >
                    <Box sx={{ mb: 2 }}>{feat.icon}</Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#fff' }}>
                      {feat.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                      {feat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Download Banner */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: 6,
            background:
              'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(56, 189, 248, 0.05) 100%)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, color: '#fff' }}
            >
              {t.cta.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#94a3b8', maxWidth: '600px' }}>
              {t.cta.subtitle}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#2563eb',
                  color: '#fff',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  '&:hover': {
                    bgcolor: '#1d4ed8',
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.5)',
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
      <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: '#05070d', py: 6 }}>
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
                      bgcolor: '#2563eb',
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
                        '&:hover': { color: '#38bdf8' },
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
                        '&:hover': { color: '#38bdf8' },
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
                        '&:hover': { color: '#38bdf8' },
                      }}
                    >
                      {t.footer.support}
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 3 }} />

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
