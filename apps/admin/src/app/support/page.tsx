'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TranslateIcon from '@mui/icons-material/Translate';
import SendIcon from '@mui/icons-material/Send';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { supabaseClient } from '../../providers/supabaseClient';
import Link from 'next/link';

export default function SupportPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isRtl = lang === 'ar';

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState<'support' | 'account_deletion'>('support');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccess(false);

    if (!email || !message) {
      setErrorMsg(isRtl ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabaseClient.from('support_requests').insert([
        {
          email,
          phone: phone || null,
          request_type: requestType,
          message,
          status: 'pending',
        },
      ]);

      if (error) {
        console.error('Supabase error:', error);
        setErrorMsg(
          isRtl
            ? `فشل إرسال الطلب: ${error.message}`
            : `Failed to submit request: ${error.message}`,
        );
      } else {
        setSuccess(true);
        setEmail('');
        setPhone('');
        setMessage('');
      }
    } catch (err) {
      console.error('Submission catch error:', err);
      setErrorMsg(
        isRtl
          ? 'حدث خطأ غير متوقع أثناء الاتصال بالخادم.'
          : 'An unexpected error occurred while connecting to the server.',
      );
    } finally {
      setLoading(false);
    }
  };

  const content = {
    ar: {
      nav: {
        home: 'الرئيسية',
      },
      title: 'مركز الدعم الفني وحذف الحساب',
      subtitle: 'نحن هنا لمساعدتك. تواصل معنا للاستفسار أو تقديم طلب حذف الحساب والبيانات.',
      form: {
        emailLabel: 'البريد الإلكتروني *',
        phoneLabel: 'رقم الهاتف (اختياري)',
        typeLabel: 'نوع الطلب *',
        typeSupport: 'دعم فني واستفسارات عامة',
        typeDeletion: 'طلب حذف الحساب والبيانات الشخصية',
        messageLabel: 'تفاصيل رسالتك أو سبب الحذف *',
        submit: 'إرسال الطلب',
        sending: 'جاري الإرسال...',
        successTitle: 'تم إرسال طلبك بنجاح!',
        successDesc:
          'شكراً لتواصلك معنا. سنقوم بمراجعة طلبك والرد عليك في أقرب وقت ممكن عبر بريدك الإلكتروني.',
        errorTitle: 'حدث خطأ',
        requiredHint: 'الحقول المشار إليها بـ (*) مطلوبة.',
      },
      warning: {
        title: 'تنبيه هام بشأن حذف الحساب والبيانات:',
        desc: 'عند اختيار طلب حذف الحساب، سيتم إيقاف اشتراكاتك فوراً، وحذف جميع بياناتك الشخصية (الاسم، رقم الهاتف، سجل الرحلات، والاشتراكات الفعالة) من أنظمتنا بشكل نهائي خلال 14 يوماً. هذا الإجراء لا يمكن التراجع عنه.',
      },
      footer: {
        rights: 'جميع الحقوق محفوظة © ٢٠٢٦ منصة سير.',
      },
    },
    en: {
      nav: {
        home: 'Home',
      },
      title: 'Support & Account Deletion Hub',
      subtitle:
        'We are here to help. Reach out for general support or submit an account deletion request.',
      form: {
        emailLabel: 'Email Address *',
        phoneLabel: 'Phone Number (Optional)',
        typeLabel: 'Request Type *',
        typeSupport: 'General Support & Inquiries',
        typeDeletion: 'Request Account & Data Deletion',
        messageLabel: 'Message Details / Reason for Deletion *',
        submit: 'Submit Request',
        sending: 'Submitting...',
        successTitle: 'Request Submitted Successfully!',
        successDesc:
          'Thank you for reaching out. We will review your request and get back to you as soon as possible via email.',
        errorTitle: 'An error occurred',
        requiredHint: 'Fields marked with (*) are required.',
      },
      warning: {
        title: 'Important Account Deletion Warning:',
        desc: 'By requesting account deletion, all active subscriptions will be cancelled. Your personal information (name, phone, trip logs, and subscriptions) will be permanently purged from our database within 14 days. This action is irreversible.',
      },
      footer: {
        rights: 'All rights reserved © 2026 Sair Transit.',
      },
    },
  };

  const t = content[lang];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#161616',
        color: '#f8fafc',
        fontFamily: 'var(--font-noto-arabic), sans-serif',
        overflowX: 'hidden',
        position: 'relative',
        direction: isRtl ? 'rtl' : 'ltr',
        pb: 8,
      }}
    >
      {/* Decorative ambient glowing background circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: isRtl ? 'auto' : '-10%',
          left: isRtl ? '-10%' : 'auto',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22,163,74,0.1) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Navigation Header */}
      <Box
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          bgcolor: 'rgba(11, 36, 24, 0.7)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          mb: 6,
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
            <Link href="/home" passHref legacyBehavior>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ cursor: 'pointer' }}>
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
                  <DirectionsBusIcon sx={{ color: '#fff', fontSize: 18 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} color="#fff">
                  {lang === 'ar' ? 'سير' : 'Sair'}
                </Typography>
              </Stack>
            </Link>

            {/* Back & Lang switches */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Link href="/home" passHref legacyBehavior>
                <Button
                  startIcon={isRtl ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    '&:hover': { color: '#4ADE80', bgcolor: 'transparent' },
                  }}
                >
                  {t.nav.home}
                </Button>
              </Link>

              <Button
                variant="outlined"
                onClick={toggleLanguage}
                startIcon={<TranslateIcon sx={{ fontSize: 16 }} />}
                sx={{
                  color: '#4ADE80',
                  borderColor: 'rgba(74, 222, 128, 0.3)',
                  borderRadius: 2,
                  px: 2,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#4ADE80',
                    bgcolor: 'rgba(74, 222, 128, 0.05)',
                  },
                }}
              >
                {lang === 'ar' ? 'English' : 'العربية'}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4}>
          {/* Page Headers */}
          <Stack spacing={2} sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                lineHeight: 1.3,
                background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', mx: 'auto' }}
            >
              {t.subtitle}
            </Typography>
          </Stack>

          {/* Form Card */}
          <Card
            elevation={0}
            sx={{
              bgcolor: '#242424',
              border: '1px solid #2D2D2D',
              borderRadius: 5,
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              {success ? (
                /* Success Message */
                <Stack spacing={3} alignItems="center" sx={{ py: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      border: '2px solid #10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 44 }} />
                  </Box>
                  <Typography variant="h5" fontWeight={800} color="#fff">
                    {t.form.successTitle}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: '#94a3b8', maxWidth: '500px', lineHeight: 1.6 }}
                  >
                    {t.form.successDesc}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setSuccess(false)}
                    sx={{
                      mt: 2,
                      color: '#4ADE80',
                      borderColor: '#4ADE80',
                      borderRadius: 2,
                      px: 3,
                      '&:hover': {
                        borderColor: '#15803D',
                        bgcolor: 'rgba(74, 222, 128, 0.05)',
                      },
                    }}
                  >
                    {isRtl ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                  </Button>
                </Stack>
              ) : (
                /* Form fields */
                <form onSubmit={handleSubmit}>
                  <Stack spacing={3.5}>
                    {errorMsg && (
                      <Alert
                        severity="error"
                        sx={{
                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}
                      >
                        {errorMsg}
                      </Alert>
                    )}

                    {/* Email field */}
                    <TextField
                      label={t.form.emailLabel}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ style: { color: '#64748b' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          bgcolor: 'rgba(255,255,255,0.02)',
                          '& fieldset': { borderColor: '#3D3D3D' },
                          '&:hover fieldset': { borderColor: '#475569' },
                          '&.Mui-focused fieldset': { borderColor: '#16A34A' },
                        },
                      }}
                    />

                    {/* Phone field */}
                    <TextField
                      label={t.form.phoneLabel}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ style: { color: '#64748b' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          bgcolor: 'rgba(255,255,255,0.02)',
                          '& fieldset': { borderColor: '#3D3D3D' },
                          '&:hover fieldset': { borderColor: '#475569' },
                          '&.Mui-focused fieldset': { borderColor: '#16A34A' },
                        },
                      }}
                    />

                    {/* Request Type field */}
                    <TextField
                      select
                      label={t.form.typeLabel}
                      value={requestType}
                      onChange={(e) =>
                        setRequestType(e.target.value as 'support' | 'account_deletion')
                      }
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ style: { color: '#64748b' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          bgcolor: 'rgba(255,255,255,0.02)',
                          '& fieldset': { borderColor: '#3D3D3D' },
                          '&:hover fieldset': { borderColor: '#475569' },
                          '&.Mui-focused fieldset': { borderColor: '#16A34A' },
                        },
                      }}
                    >
                      <MenuItem
                        value="support"
                        sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}
                      >
                        {t.form.typeSupport}
                      </MenuItem>
                      <MenuItem
                        value="account_deletion"
                        sx={{ fontFamily: 'var(--font-noto-arabic), sans-serif' }}
                      >
                        {t.form.typeDeletion}
                      </MenuItem>
                    </TextField>

                    {/* Show Warning if account_deletion is selected */}
                    {requestType === 'account_deletion' && (
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: 'rgba(239, 68, 68, 0.05)',
                          border: '1px solid rgba(239, 68, 68, 0.15)',
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <WarningAmberIcon sx={{ color: '#f87171', mt: 0.3 }} />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={700}
                              color="#f87171"
                              gutterBottom
                            >
                              {t.warning.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                              {t.warning.desc}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    )}

                    {/* Message Details */}
                    <TextField
                      label={t.form.messageLabel}
                      multiline
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ style: { color: '#64748b' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          bgcolor: 'rgba(255,255,255,0.02)',
                          '& fieldset': { borderColor: '#3D3D3D' },
                          '&:hover fieldset': { borderColor: '#475569' },
                          '&.Mui-focused fieldset': { borderColor: '#16A34A' },
                        },
                      }}
                    />

                    <Typography variant="caption" sx={{ color: '#475569' }}>
                      {t.form.requiredHint}
                    </Typography>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      endIcon={!loading && <SendIcon />}
                      sx={{
                         bgcolor: requestType === 'account_deletion' ? '#dc2626' : '#16A34A',
                         color: '#fff',
                         borderRadius: 2.5,
                         py: 1.8,
                         fontWeight: 700,
                         fontSize: '1rem',
                         textTransform: 'none',
                         boxShadow: '0 4px 14px rgba(22, 163, 74, 0.2)',
                         '&:hover': {
                           bgcolor: requestType === 'account_deletion' ? '#b91c1c' : '#15803D',
                         },
                      }}
                    >
                      {loading ? (
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <CircularProgress size={20} color="inherit" />
                          <Typography>{t.form.sending}</Typography>
                        </Stack>
                      ) : (
                        t.form.submit
                      )}
                    </Button>
                  </Stack>
                </form>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          py: 3,
          textAlign: 'center',
          bgcolor: '#161616',
        }}
      >
        <Typography variant="caption" sx={{ color: '#475569' }}>
          {t.footer.rights}
        </Typography>
      </Box>
    </Box>
  );
}
