'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { CloudUpload, CheckCircle } from '@mui/icons-material';
import { supabaseClient } from '../../providers/supabaseClient';
import { useTranslation } from 'react-i18next';

export default function BulkImportPage() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [defaultRole, setDefaultRole] = useState('student');
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const STEPS = [
    t('bulkImport.stepUpload', 'Upload CSV'),
    t('bulkImport.stepPreview', 'Preview Data'),
    t('bulkImport.stepConfirm', 'Confirm Import'),
  ];

  const ROLE_OPTIONS = [
    { value: 'student', label: t('bulkImport.roleStudent', 'Student') },
    { value: 'driver', label: t('bulkImport.roleDriver', 'Driver') },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      parseCSV(selected);
    }
  };

  const parseCSV = (csvFile: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      const headers = lines[0].split(',').map((h) => h.trim());
      const rows = lines.slice(1, 6).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = values[i] || '';
        });
        return row;
      });
      setPreview(rows);
      setActiveStep(1);
    };
    reader.readAsText(csvFile);
  };

  const handleImport = async () => {
    setImporting(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      const headers = lines[0].split(',').map((h) => h.trim());

      const profilesToUpsert = [];
      let skippedCount = 0;

      for (const line of lines.slice(1)) {
        const values = line.split(',').map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = values[i] || '';
        });

        const id = row.id || row.user_id || '';
        const fullName = row.full_name || row.name || '';
        const phone = row.phone || '';
        const role = row.role || defaultRole;

        if (!id) {
          skippedCount++;
          continue;
        }

        profilesToUpsert.push({
          id,
          full_name: fullName,
          phone,
          role,
        });
      }

      if (profilesToUpsert.length === 0) {
        setError(
          t(
            'bulkImport.errorNoValidIds',
            'No valid rows containing an id (UUID) were found. Import cancelled.',
          ),
        );
        setImporting(false);
        return;
      }

      try {
        const { error: insertError } = await supabaseClient
          .from('profiles')
          .upsert(profilesToUpsert);

        if (insertError) {
          setError(insertError.message);
          setResult({ success: 0, failed: profilesToUpsert.length + skippedCount });
        } else {
          setResult({ success: profilesToUpsert.length, failed: skippedCount });
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Unknown error occurred');
        setResult({ success: 0, failed: profilesToUpsert.length + skippedCount });
      }

      setImporting(false);
      setActiveStep(2);
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t('bulkImport.title', 'Bulk User Import')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t(
          'bulkImport.description',
          'Import users from a CSV file. Expected columns: id (UUID), full_name, phone, role (optional).',
        )}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Card elevation={2} sx={{ maxWidth: 600 }}>
          <CardContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{ py: 3 }}
              >
                {t('bulkImport.uploadButton', 'Upload CSV File')}
                <input type="file" accept=".csv" hidden onChange={handleFileChange} />
              </Button>
              <Typography variant="caption" color="text.secondary">
                {t(
                  'bulkImport.csvFormatHint',
                  'CSV format: id, full_name, phone, role (role defaults to Student if not specified). Note: id must correspond to an existing authenticated user.',
                )}
              </Typography>
              <TextField
                select
                label={t('bulkImport.defaultRole', 'Default Role (if not in CSV)')}
                value={defaultRole}
                onChange={(e) => setDefaultRole(e.target.value)}
                fullWidth
              >
                {ROLE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </CardContent>
        </Card>
      )}

      {activeStep === 1 && (
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('bulkImport.previewTitle', 'Preview (first 5 rows)')}
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {Object.keys(preview[0] || {}).map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: 8,
                          borderBottom: '2px solid #eee',
                          textAlign: 'left',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((v, i) => (
                        <td key={i} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            <Box display="flex" gap={2} sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={() => setActiveStep(0)}>
                {t('bulkImport.back', 'Back')}
              </Button>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={importing}
                startIcon={importing ? <CircularProgress size={20} /> : undefined}
              >
                {importing
                  ? t('bulkImport.importing', 'Importing...')
                  : t('bulkImport.confirmImport', 'Confirm & Import')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {activeStep === 2 && result && (
        <Alert severity={result.failed === 0 ? 'success' : 'warning'} sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircle />
            <Typography>
              {t('bulkImport.importResult', 'Import complete')}: {result.success} succeeded,{' '}
              {result.failed} failed
            </Typography>
          </Box>
        </Alert>
      )}
    </Box>
  );
}
