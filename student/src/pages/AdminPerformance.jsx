import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText,
    ListItemIcon, Divider, Chip, Paper, IconButton, Avatar, Tooltip, Grid, Fade, Grow,
    LinearProgress, CircularProgress
} from '@mui/material';
import {
    ExitToApp as LogoutIcon, Dashboard as DashboardIcon, Assignment as AssignmentIcon,
    Assessment as AssessmentIcon, TrendingUp as TrendingUpIcon, Shield as ShieldIcon,
    Menu as MenuIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon,
    Speed as SpeedIcon, CheckCircle as CheckIcon, Timer as TimerIcon,
    TrendingDown as TrendingDownIcon, EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    ResponsiveContainer, BarChart, Bar, Legend, Cell
} from 'recharts';

const drawerWidth = 270;

const darkPalette = {
    bgPrimary: '#121212', bgSecondary: '#1E1E1E', bgTertiary: '#181818',
    glassBg: 'rgba(255,255,255,0.05)', glassBorder: 'rgba(255,255,255,0.08)',
    sidebarBg: ['#1E1E1E', '#121212'], appBarBg: 'rgba(18,18,18,0.75)',
    inputBg: 'rgba(255,255,255,0.03)',
    accent: '#C5A059', accentLight: '#D4B87E', cyan: '#D4B87E',
    emerald: '#81C784', amber: '#FFD54F', rose: '#E57373',
    textPrimary: '#FFFDF5', textSecondary: 'rgba(255,252,245,0.6)', textMuted: 'rgba(255,252,245,0.3)',
};

const lightPalette = {
    bgPrimary: '#FFFDF5', bgSecondary: '#FFFFFF', bgTertiary: '#FFFDF5',
    glassBg: 'rgba(255,253,245,0.85)', glassBorder: 'rgba(197, 160, 89, 0.15)',
    sidebarBg: ['#FFFFFF', '#FFFDF5'], appBarBg: 'rgba(255,253,245,0.85)',
    inputBg: 'rgba(0,0,0,0.02)',
    accent: '#4A3E31', accentLight: '#6B5E4F', cyan: '#C5A059',
    emerald: '#2E7D32', amber: '#F57F17', rose: '#C62828',
    textPrimary: '#4A3E31', textSecondary: '#6B5E4F', textMuted: '#A89E94',
};

export default function AdminPerformance() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const c = isDark ? darkPalette : lightPalette;
    const [complaints, setComplaints] = useState([]);
    const [mobileOpen, setMobileOpen] = useState(false);

    const authData = JSON.parse(localStorage.getItem('adminAuthData') || '{}');
    const username = authData.fullName || authData.name || 'Admin User';
    const adminEmail = authData.email || 'admin@edusolve.edu';
    const adminDepartment = authData.adminDepartment || 'General';

    useEffect(() => {
        const fetch = async () => {
            try {
                const url = adminDepartment !== 'General'
                    ? `http://localhost:2000/api/complaints/department/${adminDepartment}`
                    : 'http://localhost:2000/api/complaints/all';
                const res = await axios.get(url);
                if (res.data.success) setComplaints(res.data.complaints);
            } catch (err) { console.error(err); }
        };
        fetch();
    }, []);

    const handleLogout = () => { localStorage.removeItem('adminAuthData'); navigate('/'); };

    // ─── KPI Calculations ─────────────────────
    const totalComplaints = complaints.length;
    const resolvedCount = complaints.filter(x => x.status === 'Resolved').length;
    const pendingCount = complaints.filter(x => x.status === 'Pending' || x.status === 'In Progress').length;
    const registeredCount = complaints.filter(x => x.status === 'Registered').length;
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0;

    const avgResolutionDays = useMemo(() => {
        const resolved = complaints.filter(x => x.status === 'Resolved' && x.resolvedAt);
        if (resolved.length === 0) return 0;
        const total = resolved.reduce((sum, x) => {
            const diff = new Date(x.resolvedAt) - new Date(x.registeredAt);
            return sum + diff / (1000 * 60 * 60 * 24);
        }, 0);
        return Math.round(total / resolved.length * 10) / 10;
    }, [complaints]);

    const monthlyTrend = useMemo(() => {
        const months = {};
        complaints.forEach(comp => {
            const d = new Date(comp.registeredAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (!months[key]) months[key] = { key, month: label, complaints: 0, resolved: 0 };
            months[key].complaints++;
            if (comp.status === 'Resolved') months[key].resolved++;
        });
        return Object.values(months).sort((a, b) => a.key.localeCompare(b.key));
    }, [complaints]);

    const priorityByMonth = useMemo(() => {
        const months = {};
        complaints.forEach(comp => {
            const d = new Date(comp.registeredAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (!months[key]) months[key] = { key, month: label, High: 0, Medium: 0, Low: 0 };
            const p = comp.priority || 'Medium';
            if (months[key][p] !== undefined) months[key][p]++;
        });
        return Object.values(months).sort((a, b) => a.key.localeCompare(b.key));
    }, [complaints]);

    // ─── Sidebar ─────────────────────
    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Complaints', icon: <AssignmentIcon />, path: '/admin' },
        { text: 'Analytics', icon: <AssessmentIcon />, path: '/admin/analytics' },
        { text: 'Performance', icon: <TrendingUpIcon />, path: '/admin/performance' },
    ];

    const sidebarContent = (
        <Box sx={{
            height: '100%', display: 'flex', flexDirection: 'column',
            background: `linear-gradient(180deg, ${c.sidebarBg[0]}, ${c.sidebarBg[1]})`,
            borderRight: `1px solid ${c.glassBorder}`,
        }}>
            <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 38, height: 38, borderRadius: 3,
                    background: `linear-gradient(135deg, ${c.accent}, ${c.cyan})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 20px ${c.accent}60`,
                }}><ShieldIcon sx={{ color: 'white', fontSize: 20 }} /></Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ color: c.textPrimary, fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.2 }}>EduSolve</Typography>
                    <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: 10, letterSpacing: 1 }}>ADMIN PORTAL</Typography>
                </Box>
            </Box>

            <Box sx={{ px: 2.5, mb: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, background: `linear-gradient(135deg, ${c.accent}18, ${c.cyan}0C)`, border: `1px solid ${c.accent}22` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${c.accent}, ${c.cyan})`, fontSize: 15, fontWeight: 800 }}>{username.charAt(0)}</Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ color: c.textPrimary, fontWeight: 800, lineHeight: 1.2 }} noWrap>{username}</Typography>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: 10 }} noWrap>{adminEmail}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Typography variant="caption" sx={{ px: 3, mb: 1, color: c.textMuted, fontWeight: 800, letterSpacing: 1.5, fontSize: 9 }}>NAVIGATION</Typography>
            <List sx={{ px: 1.5 }}>
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <ListItem button key={item.text} selected={active} onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 2.5, mb: 0.5, py: 1.2, px: 2, transition: 'all 0.2s', position: 'relative', cursor: 'pointer',
                                '&.Mui-selected': {
                                    bgcolor: `${c.accent}18`, '&:hover': { bgcolor: `${c.accent}28` },
                                    '&::before': { content: '""', position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: '60%', borderRadius: 4, background: `linear-gradient(180deg, ${c.accent}, ${c.cyan})` }
                                },
                                '& .MuiListItemIcon-root': { color: active ? c.accent : c.textMuted, minWidth: 38 },
                                '& .MuiListItemText-primary': { fontWeight: active ? 700 : 500, color: active ? c.textPrimary : c.textSecondary, fontSize: 13.5 },
                                '&:hover': { bgcolor: c.glassBorder },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ mt: 'auto', p: 2.5 }}>
                <Divider sx={{ mb: 2, borderColor: c.glassBorder }} />
                <Button fullWidth variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}
                    sx={{ borderRadius: 2.5, borderColor: `${c.rose}40`, color: c.rose, fontWeight: 700, py: 1, fontSize: 13, textTransform: 'none', '&:hover': { borderColor: c.rose, bgcolor: `${c.rose}12` } }}
                >End Session</Button>
            </Box>
        </Box>
    );

    const chartPaperSx = {
        bgcolor: c.glassBg, backdropFilter: 'blur(20px)', border: `1px solid ${c.glassBorder}`,
        borderRadius: 4, p: 3, transition: 'all 0.3s', '&:hover': { borderColor: `${c.accent}40` }
    };
    const tooltipStyle = { backgroundColor: isDark ? '#1A1A2E' : '#FFF', border: `1px solid ${c.glassBorder}`, borderRadius: 12, color: c.textPrimary, fontSize: 12 };

    // ─── Circular Progress Ring Component ─────────────────────
    const ProgressRing = ({ value, size = 120, thickness = 8, color }) => (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={100}
                size={size} thickness={thickness}
                sx={{ color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', position: 'absolute' }}
            />
            <CircularProgress variant="determinate" value={value}
                size={size} thickness={thickness}
                sx={{ color, '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }}
            />
            <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: c.textPrimary }}>{value}%</Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{
            display: 'flex', minHeight: '100vh',
            background: isDark ? `linear-gradient(135deg, ${c.bgPrimary}, ${c.bgSecondary}, ${c.bgTertiary})` : `linear-gradient(135deg, ${c.bgPrimary}, ${c.bgTertiary}, ${c.bgSecondary})`,
            transition: 'background 0.4s',
        }}>
            <AppBar position="fixed" sx={{
                zIndex: (t) => t.zIndex.drawer + 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` },
                bgcolor: c.appBarBg, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${c.glassBorder}`, color: c.textPrimary, boxShadow: 'none',
            }}>
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}><MenuIcon /></IconButton>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}>Performance</Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: 11 }}>KPIs, metrics & efficiency tracking</Typography>
                        </Box>
                    </Box>
                    <Tooltip title={isDark ? 'Light Mode' : 'Dark Mode'}>
                        <IconButton onClick={() => setIsDark(p => !p)} sx={{ color: c.textSecondary, bgcolor: c.inputBg, border: `1px solid ${c.glassBorder}`, width: 38, height: 38, '&:hover': { color: c.amber, borderColor: c.amber } }}>
                            {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: 'none' } }}
                >{sidebarContent}</Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: 'none', bgcolor: 'transparent' } }} open>{sidebarContent}</Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3.5 }, pt: { xs: 10, md: 12 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>

                {/* ── KPI Cards ── */}
                <Grow in timeout={500}>
                    <Grid container spacing={2.5} sx={{ mb: 4 }}>
                        {[
                            { icon: <TrophyIcon />, label: 'Resolution Rate', val: `${resolutionRate}%`, color: c.emerald, sub: `${resolvedCount} of ${totalComplaints} resolved` },
                            { icon: <TimerIcon />, label: 'Avg. Resolution', val: `${avgResolutionDays}d`, color: c.cyan, sub: 'Average days to resolve' },
                            { icon: <SpeedIcon />, label: 'Awaiting Action', val: registeredCount, color: c.amber, sub: 'New complaints' },
                            { icon: <TrendingDownIcon />, label: 'Backlog', val: pendingCount, color: c.rose, sub: 'In-progress items' },
                        ].map((s, i) => (
                            <Grid size={{ xs: 6, md: 3 }} key={i}>
                                <Paper elevation={0} sx={{
                                    p: 2.5, borderRadius: 4, bgcolor: `${s.color}15`, border: `1px solid ${c.glassBorder}`,
                                    transition: 'all 0.3s', '&:hover': { transform: 'translateY(-3px)', borderColor: `${s.color}40` },
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: 11 }}>{s.label}</Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 900, color: c.textPrimary, mt: 0.5, lineHeight: 1, fontSize: 28 }}>{s.val}</Typography>
                                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: 10, mt: 0.5, display: 'block' }}>{s.sub}</Typography>
                                        </Box>
                                        <Box sx={{
                                            width: 44, height: 44, borderRadius: 3, background: `linear-gradient(135deg, ${s.color}, ${s.color}BB)`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 20px ${s.color}40`,
                                        }}>{React.cloneElement(s.icon, { sx: { color: 'white', fontSize: 22 } })}</Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grow>

                <Grid container spacing={3}>
                    {/* ── Resolution Rate Ring + Progress Bars ── */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Fade in timeout={700}>
                            <Paper elevation={0} sx={{ ...chartPaperSx, textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary, mb: 3 }}>Resolution Overview</Typography>
                                <ProgressRing value={resolutionRate} size={140} thickness={10} color={c.emerald} />
                                <Typography variant="body2" sx={{ color: c.textSecondary, mt: 2, fontWeight: 600 }}>Resolution Rate</Typography>

                                <Box sx={{ mt: 4, textAlign: 'left' }}>
                                    {[
                                        { label: 'Registered', count: registeredCount, color: c.amber },
                                        { label: 'In Progress', count: pendingCount, color: c.cyan },
                                        { label: 'Resolved', count: resolvedCount, color: c.emerald },
                                    ].map((item) => (
                                        <Box key={item.label} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: 11 }}>{item.label}</Typography>
                                                <Typography variant="caption" sx={{ color: item.color, fontWeight: 800, fontSize: 11 }}>{item.count}</Typography>
                                            </Box>
                                            <LinearProgress variant="determinate" value={totalComplaints ? (item.count / totalComplaints) * 100 : 0}
                                                sx={{
                                                    height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                                                    '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: item.color },
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </Fade>
                    </Grid>

                    {/* ── Monthly Trend Line Chart ── */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Fade in timeout={900}>
                            <Paper elevation={0} sx={chartPaperSx}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <TrendingUpIcon sx={{ color: c.accent, fontSize: 20 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary }}>Monthly Volume Trend</Typography>
                                </Box>
                                <ResponsiveContainer width="100%" height={340}>
                                    <LineChart data={monthlyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={c.glassBorder} />
                                        <XAxis dataKey="month" tick={{ fill: c.textMuted, fontSize: 11 }} axisLine={{ stroke: c.glassBorder }} tickLine={false} />
                                        <YAxis tick={{ fill: c.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <RTooltip contentStyle={tooltipStyle} />
                                        <Line type="monotone" dataKey="complaints" stroke={c.accent} strokeWidth={3} dot={{ r: 5, fill: c.accent, strokeWidth: 2, stroke: isDark ? c.bgPrimary : '#FFF' }} name="Total" activeDot={{ r: 7 }} />
                                        <Line type="monotone" dataKey="resolved" stroke={c.emerald} strokeWidth={3} dot={{ r: 5, fill: c.emerald, strokeWidth: 2, stroke: isDark ? c.bgPrimary : '#FFF' }} name="Resolved" activeDot={{ r: 7 }} />
                                        <Legend wrapperStyle={{ fontSize: 11, color: c.textSecondary }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Fade>
                    </Grid>

                    {/* ── Priority Distribution (Stacked Bar) ── */}
                    <Grid size={{ xs: 12 }}>
                        <Fade in timeout={1100}>
                            <Paper elevation={0} sx={chartPaperSx}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <SpeedIcon sx={{ color: c.amber, fontSize: 20 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary }}>Priority Breakdown by Month</Typography>
                                </Box>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={priorityByMonth} barCategoryGap="20%">
                                        <CartesianGrid strokeDasharray="3 3" stroke={c.glassBorder} />
                                        <XAxis dataKey="month" tick={{ fill: c.textMuted, fontSize: 11 }} axisLine={{ stroke: c.glassBorder }} tickLine={false} />
                                        <YAxis tick={{ fill: c.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <RTooltip contentStyle={tooltipStyle} />
                                        <Bar dataKey="High" stackId="a" fill={c.rose} radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="Medium" stackId="a" fill={c.amber} radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="Low" stackId="a" fill={c.emerald} radius={[4, 4, 0, 0]} />
                                        <Legend wrapperStyle={{ fontSize: 11, color: c.textSecondary }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Fade>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
