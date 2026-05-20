'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
  TablePagination,
} from '@mui/material';
import { Search, Person, AdminPanelSettings, Settings, Delete, History } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { supabaseClient } from '../../providers/supabaseClient';

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  details?: Record<string, unknown> | string;
  created_at: string;
  ip_address?: string;
}

const ACTION_COLORS: Record<
  string,
  'default' | 'info' | 'warning' | 'error' | 'success' | 'primary'
> = {
  login: 'success',
  logout: 'default',
  create: 'info',
  update: 'warning',
  delete: 'error',
  role_change: 'info',
  trip_status_change: 'primary',
};

export default function ActivityLogPage() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const fetchLogs = async (
    currentPage: number,
    currentRowsPerPage: number,
    currentSearch: string,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const from = currentPage * currentRowsPerPage;
      const to = from + currentRowsPerPage - 1;

      let query = supabaseClient
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      const cleanSearch = currentSearch.trim();
      if (cleanSearch) {
        const searchPattern = `%${cleanSearch}%`;
        query = query.or(
          `user_id.ilike.${searchPattern},action.ilike.${searchPattern},resource.ilike.${searchPattern}`,
        );
      }

      const { data, count, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (err: unknown) {
      console.error('[ActivityLog] Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load activity logs');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0);
      void fetchLogs(0, rowsPerPage, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, rowsPerPage]);

  const handleRetry = () => {
    void fetchLogs(page, rowsPerPage, searchTerm);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {t('nav.activityLog', 'Activity Log')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t(
          'activityLog.description',
          'Track all admin actions and system events for auditing purposes.',
        )}
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              {t('common.retry', 'Retry')}
            </Button>
          }
        >
          {t('activityLog.loadError', 'Failed to load audit logs')}: {error}
        </Alert>
      )}

      <TextField
        placeholder={t(
          'activityLog.searchPlaceholder',
          'Search by action, resource, user, or details...',
        )}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 3, maxWidth: 500 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('activityLog.timestamp', 'Timestamp')}</TableCell>
                <TableCell>{t('activityLog.user', 'User')}</TableCell>
                <TableCell>{t('activityLog.action', 'Action')}</TableCell>
                <TableCell>{t('activityLog.resource', 'Resource')}</TableCell>
                <TableCell>{t('activityLog.details', 'Details')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      {t('common.noData', 'No data found')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(log.created_at).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {log.user_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action.replace('_', ' ')}
                        color={ACTION_COLORS[log.action] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{log.resource}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {typeof log.details === 'object'
                          ? JSON.stringify(log.details)
                          : log.details || '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => {
              setPage(newPage);
              void fetchLogs(newPage, rowsPerPage, searchTerm);
            }}
            onRowsPerPageChange={(event) => {
              const newRowsPerPage = parseInt(event.target.value, 10);
              setRowsPerPage(newRowsPerPage);
              setPage(0);
              void fetchLogs(0, newRowsPerPage, searchTerm);
            }}
          />
        </TableContainer>
      )}
    </Box>
  );
}
