import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, TextField, InputAdornment,
    Chip, Avatar, CircularProgress, Fade, Stack, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Login as LoginIcon,
    Person as PersonIcon,
    AdminPanelSettings as adminIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';

const AdminLoginHistorySection = ({ isDark, c }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const adminData = JSON.parse(localStorage.getItem('adminAuthData') || '{}');
    const adminId = adminData.adminId || adminData.userId || adminData.id || adminData.user?.id || 'ADM001';

    useEffect(() => {
        fetchHistory();
    }, [adminId]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:2000/api/users/login-history?adminId=${adminId}`);
            if (response.data.success) {
                setHistory(response.data.history);
            }
        } catch (error) {
            console.error('Error fetching login history:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.userName.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || item.userType === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const glassCard = {
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${c.glassBorder}`,
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(31,38,135,0.07)',
    };

    const selectSx = {
        borderRadius: 2.5, fontWeight: 700, fontSize: 13,
        color: c.textPrimary, bgcolor: c.inputBg,
        '& .MuiOutlinedInput-notchedOutline': { borderColor: c.glassBorder },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: c.accent },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: c.accent },
        '& .MuiSvgIcon-root': { color: c.textSecondary },
    };

    return (
        <Fade in={true} timeout={800}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: c.textPrimary, mb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LoginIcon sx={{ color: c.accent, fontSize: 28 }} /> Authentication Pulse
                </Typography>
                <Typography variant="body2" sx={{ color: c.textSecondary, mb: 4 }}>Monitor real-time access logs for students and administrative staff.</Typography>

                <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, ...glassCard, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                    <TextField
                        placeholder="Search by name or email..."
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            flex: 1, minWidth: 250,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                fontSize: 13, fontWeight: 600,
                                color: c.textPrimary,
                                '& fieldset': { borderColor: c.glassBorder },
                                '&:hover fieldset': { borderColor: c.accent },
                            }
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: c.textMuted, fontSize: 18 }} /></InputAdornment>,
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <Select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            displayEmpty
                            sx={selectSx}
                        >
                            <MenuItem value="all">All Access Types</MenuItem>
                            <MenuItem value="Student">Students Only</MenuItem>
                            <MenuItem value="Admin">Admins Only</MenuItem>
                        </Select>
                    </FormControl>
                </Paper>

                <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', ...glassCard }}>
                    <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {['User', 'Type', 'Access Point', 'Time Stamp'].map(h => (
                                        <TableCell key={h} sx={{
                                            bgcolor: isDark ? '#1a1a1a' : '#f8f9fa', color: c.textMuted,
                                            fontWeight: 800, textTransform: 'uppercase', fontSize: 10, letterSpacing: 1.5, py: 2,
                                            borderBottom: `1px solid ${c.glassBorder}`,
                                        }}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10, borderBottom: 'none' }}><CircularProgress size={32} sx={{ color: c.accent }} /></TableCell></TableRow>
                                ) : filteredHistory.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10, color: c.textMuted, borderBottom: 'none' }}>No login events found.</TableCell></TableRow>
                                ) : (
                                    filteredHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                                        <TableRow key={log._id} hover
                                            sx={{ '& td': { borderBottom: `1px solid ${c.glassBorder}` }, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' } }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{
                                                        width: 32, height: 32,
                                                        background: log.userType === 'Admin' ? `linear-gradient(135deg, ${c.rose}, ${c.amber})` : `linear-gradient(135deg, ${c.accent}, ${c.cyan})`,
                                                        fontSize: 12, fontWeight: 800
                                                    }}>{log.userName.charAt(0)}</Avatar>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: c.textPrimary, lineHeight: 1.2 }}>{log.userName}</Typography>
                                                        <Typography variant="caption" sx={{ color: c.textMuted }}>{log.email}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={log.userType}
                                                    size="small"
                                                    icon={log.userType === 'Admin' ? <adminIcon sx={{ fontSize: '12px !important' }} /> : <PersonIcon sx={{ fontSize: '12px !important' }} />}
                                                    sx={{
                                                        bgcolor: log.userType === 'Admin' ? `${c.rose}15` : `${c.accent}15`,
                                                        color: log.userType === 'Admin' ? c.rose : c.accentLight,
                                                        fontWeight: 800, fontSize: 10, height: 22,
                                                        '& .MuiChip-icon': { color: 'inherit' }
                                                    }}
                                                />
                                                {log.adminDepartment && (
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: c.textMuted, fontSize: 9, fontWeight: 700 }}>{log.adminDepartment} DEPT</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700 }}>IP: {log.ipAddress || 'Unknown'}</Typography>
                                                    <Typography variant="caption" sx={{ color: c.textMuted, fontSize: 10, maxWidth: 200, noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.userAgent}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <TimeIcon sx={{ fontSize: 14, color: c.textMuted }} />
                                                    <Box>
                                                        <Typography variant="caption" sx={{ color: c.textPrimary, fontWeight: 700, display: 'block' }}>{new Date(log.loginTime).toLocaleDateString()}</Typography>
                                                        <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: 10 }}>{new Date(log.loginTime).toLocaleTimeString()}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={filteredHistory.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ borderTop: `1px solid ${c.glassBorder}`, color: c.textSecondary }}
                    />
                </Paper>
            </Box>
        </Fade>
    );
};

export default AdminLoginHistorySection;
