'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Button, Stack, Divider } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TranslateIcon from '@mui/icons-material/Translate';

export default function PrivacyPolicy() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const content = {
    ar: {
      title: 'سياسة الخصوصية — سير',
      lastUpdated: 'آخر تحديث: 21 مايو 2026',
      intro:
        'تلتزم منصة سير (Sair) بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع بياناتك واستخدامها وحمايتها عند استخدام تطبيق الهاتف أو لوحة التحكم الخاصة بنا.',
      sections: [
        {
          title: '1. البيانات التي نجمعها',
          items: [
            'البيانات الشخصية: الاسم، رقم الهاتف، والبريد الإلكتروني.',
            'بيانات الموقع (GPS): نجمع إحداثيات موقعك الجغرافي لتحديد مسار الرحلات بدقة ومتابعة الرحلة أثناء سيرها لضمان الأمان.',
            'بيانات الترخيص والاشتراك: أكواد الترخيص المستخدمة لتفعيل الاشتراكات الشهرية أو الأسبوعية.',
            'بيانات الجهاز: معلومات حول جهازك المحمول، وإصدار نظام التشغيل، وسجلات الأداء.',
          ],
        },
        {
          title: '2. كيف نستخدم بياناتك',
          items: [
            'تسهيل مطابقة الرحلات بين الطلاب والسائقين وتحديد مسارات الانطلاق والوصول.',
            'تتبع موقع الحافلات بشكل حي (Realtime GPS Tracking) لتمكين الطلاب من معرفة وقت وصول الحافلة بدقة.',
            'إرسال إشعارات التنبيه المباشرة عند بدء الرحلة أو عند وصول السائق لموقع الانتظار.',
            'إدارة الاشتراكات والتحقق من صلاحية أكواد الترخيص المدفوعة لمنع الاحتيال.',
          ],
        },
        {
          title: '3. حماية البيانات ومشاركتها',
          items: [
            'يتم تخزين جميع البيانات بشكل آمن على خوادم مشفرة (Supabase) مع تطبيق سياسات حماية صارمة على مستوى قاعدة البيانات (Row Level Security).',
            'لا نقوم ببيع أو تأجير بياناتك الشخصية لأي طرف ثالث لأغراض تسويقية.',
            'تتم مشاركة موقعك الجغرافي بشكل مؤقت فقط مع السائق والطلاب المشتركين في نفس الرحلة لضمان جودة الخدمة والأمان.',
          ],
        },
        {
          title: '4. حقوقك والتحكم في البيانات',
          items: [
            'حق تعديل البيانات الشخصية مباشرة من شاشة حسابك الشخصي في التطبيق.',
            'حق إيقاف تشغيل مشاركة الموقع الجغرافي من إعدادات جهازك (قد يؤثر ذلك على عمل ميزات التطبيق الأساسية).',
            'طلب حذف الحساب وجميع البيانات المرتبطة به عبر مراسلتنا على البريد الإلكتروني المعتمد للمطورين.',
          ],
        },
      ],
      footer:
        'إذا كانت لديك أي استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني: wisamsamir78@gmail.com',
    },
    en: {
      title: 'Privacy Policy — Sair',
      lastUpdated: 'Last Updated: May 21, 2026',
      intro:
        'Sair platform is committed to protecting your privacy and personal data. This policy explains how your information is collected, used, and secured when you use our mobile app or administration dashboard.',
      sections: [
        {
          title: '1. Information We Collect',
          items: [
            'Personal Data: Name, phone number, and email address.',
            'Location Data (GPS): We collect your geographical location coordinates to determine trip routes accurately and track active trips for safety.',
            'License and Subscription Data: Payment license codes used to activate monthly or weekly subscriptions.',
            'Device Data: Mobile device information, operating system version, and system performance logs.',
          ],
        },
        {
          title: '2. How We Use Your Information',
          items: [
            'Facilitating ride matching between students and drivers and calculating optimal pick-up/drop-off routes.',
            'Real-time GPS tracking of buses to allow students to check estimated arrival times.',
            'Sending push notifications when a trip starts or when a driver arrives at the waiting point.',
            'Managing subscriptions and verifying active license codes to prevent fraud.',
          ],
        },
        {
          title: '3. Data Security & Sharing',
          items: [
            'All data is securely stored on encrypted servers (Supabase) using strict Row Level Security (RLS) policies.',
            'We do not sell, rent, or share your personal data with third parties for marketing purposes.',
            'Your geographical location is only shared temporarily with the driver and student passengers on the same trip for service quality and safety.',
          ],
        },
        {
          title: '4. Your Rights and Controls',
          items: [
            'The right to edit your personal profile information directly within the app settings.',
            'The right to disable location tracking from your device settings (note: this may affect core app features).',
            'Request deletion of your account and all associated personal data by contacting us at our developer email.',
          ],
        },
      ],
      footer:
        'If you have any questions regarding this Privacy Policy, please contact us at: wisamsamir78@gmail.com',
    },
  };

  const t = content[lang];
  const isRtl = lang === 'ar';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#1A1A1A',
        color: '#f8fafc',
        py: 6,
        px: 2,
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: '#C2703E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DirectionsBusIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
              Sair
            </Typography>
          </Stack>

          <Button
            variant="outlined"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            startIcon={<TranslateIcon />}
            sx={{
              color: '#D4845A',
              borderColor: '#D4845A',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#A85C2E',
                bgcolor: 'rgba(212, 132, 90, 0.08)',
              },
            }}
          >
            {lang === 'ar' ? 'English' : 'العربية'}
          </Button>
        </Stack>

        {/* Content Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: '#2D2D2D',
            border: '1px solid #3D3D3D',
            color: '#f1f5f9',
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
            sx={{
              color: '#ffffff',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              borderBottom: '2px solid #C2703E',
              pb: 1,
              display: 'inline-block',
            }}
          >
            {t.title}
          </Typography>

          <Typography variant="subtitle2" sx={{ color: '#64748b', mt: 1, mb: 3 }}>
            {t.lastUpdated}
          </Typography>

          <Typography
            variant="body1"
            sx={{ lineHeight: 1.8, mb: 4, fontSize: '1.05rem', color: '#cbd5e1' }}
          >
            {t.intro}
          </Typography>

          <Stack spacing={4}>
            {t.sections.map((section, idx) => (
              <Box key={idx}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#D4845A', mb: 2 }}>
                  {section.title}
                </Typography>
                <Stack spacing={1.5}>
                  {section.items.map((item, itemIdx) => (
                    <Stack
                      key={itemIdx}
                      direction="row"
                      spacing={isRtl ? 0 : 1.5}
                      sx={{ alignItems: 'flex-start' }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#C2703E',
                          mt: 1.2,
                          mr: isRtl ? 1.5 : 0,
                          ml: isRtl ? 0 : 1.5,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ lineHeight: 1.6, color: '#e2e8f0', fontSize: '0.95rem' }}
                      >
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 4, borderColor: '#3D3D3D' }} />

          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.6,
              color: '#64748b',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            {t.footer}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
