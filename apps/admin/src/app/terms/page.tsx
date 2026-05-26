'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Button, Stack, Divider } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TranslateIcon from '@mui/icons-material/Translate';

export default function TermsOfService() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  const content = {
    ar: {
      title: 'شروط وأحكام الخدمة — سير',
      lastUpdated: 'آخر تحديث: 21 مايو 2026',
      intro:
        'يسرنا انضمامك إلى سير (Sair). يرجى قراءة هذه الشروط بعناية قبل استخدام التطبيق أو الخدمات المتاحة. يمثل استخدامك للمنصة موافقة كاملة على الالتزام بهذه الشروط.',
      sections: [
        {
          title: '1. شروط الأهلية والحساب',
          items: [
            'المنصة مخصصة لطلاب الجامعات العراقية المشتركين والموظفين والسائقين المعتمدين والمصرح لهم.',
            'أنت مسؤول بالكامل عن الحفاظ على سرية معلومات حسابك وكلمة المرور الخاصة بك، وعن جميع الأنشطة التي تحدث تحت حسابك.',
            'يجب أن تكون جميع البيانات الشخصية المدخلة صحيحة ومطابقة للواقع (خصوصاً الاسم ورقم الهاتف وتفاصيل الجامعة).',
          ],
        },
        {
          title: '2. نظام التراخيص والاشتراكات (License Codes)',
          items: [
            'لا تعتمد المنصة على الدفع الفردي المباشر لكل رحلة، بل يتم حجز المقاعد عن طريق شراء وتفعيل "أكواد التراخيص" (License Codes) التي توفر اشتراكاً دورياً.',
            'أكواد التراخيص المعتمدة تتكون من 8 رموز بالضبط ويتم إصدارها وتوزيعها حصرياً بواسطة إدارة سير.',
            'المقاعد والاشتراكات مرتبطة بالـ Subscription (الاشتراك) الخاص بالطالب وليست تابعة لرحلة معينة بشكل مستقل.',
          ],
        },
        {
          title: '3. قواعد السلوك والانتقالات (State Machine)',
          items: [
            'يلتزم الطلاب والسائقون بمسار حالة الرحلة المنظم عبر النظام (scheduled -> driver_waiting -> in_transit -> completed).',
            'يُسمح للسائق بإلغاء الرحلة في الحالات الطارئة حتى أثناء الانتقال (in_transit). بينما يعتبر الطالب المتغيب بعد انتظار السائق غائباً (absent) ولا يحق له المطالبة بالتعويض.',
            'يمنع منعاً باتاً أي سلوك غير لائق أو مضايقات داخل الحافلات، ويحق للإدارة حظر أي حساب يخالف شروط الآداب العامة فوراً.',
          ],
        },
        {
          title: '4. حدود المسؤولية',
          items: [
            'تعمل سير كمنصة ذكية لتسهيل النقل الطلابي وتوفير تتبع حي للمسار، ونسعى لأعلى مستويات الدقة والالتزام بالمواعيد.',
            'المنصة غير مسؤولة عن أي تأخير خارج عن الإرادة مثل الأزمات المرورية الخانقة أو القوة القاهرة أو الحوادث المفاجئة.',
            'نحتفظ بالحق في تعديل الأسعار أو مسارات الرحلات أو باقات الاشتراك بعد إشعار المستخدمين مسبقاً.',
          ],
        },
      ],
      footer:
        'لأي استفسارات حول شروط الخدمة، يرجى التواصل معنا عبر البريد الإلكتروني: wisamsamir78@gmail.com',
    },
    en: {
      title: 'Terms of Service — Sair',
      lastUpdated: 'Last Updated: May 21, 2026',
      intro:
        'Thank you for choosing Sair. Please read these terms carefully before using the app or any of the available services. Your use of the platform represents your full agreement to abide by these terms.',
      sections: [
        {
          title: '1. Eligibility & Account Terms',
          items: [
            'The platform is designated for registered university students, employees, and authorized drivers in Iraq.',
            'You are fully responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
            'All registered personal information must be accurate and authentic (especially name, phone number, and university details).',
          ],
        },
        {
          title: '2. Licenses & Subscriptions (M3)',
          items: [
            'Sair does not use direct single-trip bookings; seat reservations require purchasing and activating prepaid "License Codes".',
            'Authorized license codes are exactly 8 characters long and are issued and distributed exclusively by Sair administration.',
            "Seat allocations and rights are linked to the student's active Subscription, rather than individual trips.",
          ],
        },
        {
          title: '3. Conduct and State Machine Flow',
          items: [
            'Students and drivers must adhere to the system state transition flow (scheduled -> driver_waiting -> in_transit -> completed).',
            'Drivers are permitted to cancel a trip under emergency conditions even while in transit (in_transit). Students who fail to show up are marked as absent.',
            'Any form of harassment or inappropriate behavior inside buses is strictly prohibited, and admin reserves the right to ban violating accounts immediately.',
          ],
        },
        {
          title: '4. Limitation of Liability',
          items: [
            'Sair acts as a smart transit network facilitator providing real-time tracking, aiming for maximum punctuality and safety.',
            'The platform is not liable for force majeure events, sudden bus breakdowns, or unexpected heavy traffic delays.',
            'We reserve the right to modify pricing, active routes, or subscription plans after notifying active users in advance.',
          ],
        },
      ],
      footer:
        'For any inquiries regarding these Terms of Service, please contact us at: wisamsamir78@gmail.com',
    },
  };

  const t = content[lang];
  const isRtl = lang === 'ar';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#161616',
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
                bgcolor: '#16A34A',
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
              color: '#4ADE80',
              borderColor: 'rgba(74, 222, 128, 0.3)',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#4ADE80',
                bgcolor: 'rgba(74, 222, 128, 0.08)',
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
            bgcolor: '#242424',
            border: '1px solid #2D2D2D',
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
              borderBottom: '2px solid #16A34A',
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
                <Typography variant="h6" fontWeight={700} sx={{ color: '#4ADE80', mb: 2 }}>
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
                          bgcolor: '#16A34A',
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

          <Divider sx={{ my: 4, borderColor: '#2D2D2D' }} />

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
