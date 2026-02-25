import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText,
    ListItemIcon, Divider, Chip, Paper, IconButton, Avatar, Tooltip, Grid, Fade, Grow
} from '@mui/material';
import {
    ExitToApp as LogoutIcon, Dashboard as DashboardIcon, Assignment as AssignmentIcon,
    Assessment as AssessmentIcon, TrendingUp as TrendingUpIcon, Shield as ShieldIcon,
    Menu as MenuIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon,
    Notifications as NotifIcon, PieChart as PieChartIcon, BarChart as BarChartIcon,
    Timeline as TimelineIcon, Category as CategoryIcon
} from '@mui/icons-material';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const drawerWidth = 270;

const darkPalette = {
    bgPrimary: '#0F0F1A', bgSecondary: '#1A1A2E', bgTertiary: '#16213E',
    glassBg: 'rgba(255,255,255,0.05)', glassBorder: 'rgba(255,255,255,0.08)',
    sidebarBg: ['#1A1A2E', '#0F0F1A'], appBarBg: 'rgba(15,15,26,0.75)',
    inputBg: 'rgba(255,255,255,0.03)',
    accent: '#6C63FF', accentLight: '#8B83FF', cyan: '#00D9FF',
    emerald: '#00E676', amber: '#FFB300', rose: '#FF5252',
    textPrimary: '#EAEAFF', textSecondary: 'rgba(255,255,255,0.55)', textMuted: 'rgba(255,255,255,0.3)',
};

const lightPalette = {
    bgPrimary: '#F5F7FB', bgSecondary: '#FFFFFF', bgTertiary: '#EEF1F8',
    glassBg: 'rgba(255,255,255,0.85)', glassBorder: 'rgba(0,0,0,0.08)',
    sidebarBg: ['#FFFFFF', '#F8F9FD'], appBarBg: 'rgba(255,255,255,0.85)',
    inputBg: 'rgba(0,0,0,0.02)',
    accent: '#5B52E0', accentLight: '#7B73FF', cyan: '#0097B2',
    emerald: '#00A854', amber: '#E09800', rose: '#E53935',
    textPrimary: '#1A1A2E', textSecondary: 'rgba(0,0,0,0.55)', textMuted: 'rgba(0,0,0,0.35)',
};

const CHART_COLORS = ['#6C63FF', '#00D9FF', '#00E676', '#FFB300', '#FF5252', '#E040FB'];

export default function AdminAnalytics() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDark, setIsDark] = useState(true);
    const c = isDark ? darkPalette : lightPalette;
    const [complaints, setComplaints] = useState([]);
    const [mobileOpen, setMobileOpen] = useState(false);

    const authData = JSON.parse(localStorage.getItem('adminAuthData') || '{}');
    const username = authData.fullName || authData.name || 'Admin User';
    const adminEmail = authData.email || 'admin@edusolve.edu';
    const adminDepartment = authData.adminDepartment || 'General';

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const url = adminDepartment !== 'General'
                    ? `http://localhost:2000/api/complaints/department/${adminDepartment}`
                    : 'http://localhost:2000/api/complaints/all';
                const res = await axios.get(url);
                if (res.data.success) setComplaints(res.data.complaints);
            } catch (err) { console.error(err); }
        };
        fetchComplaints();
    }, []);

    const handleLogout = () => { localStorage.removeItem('adminAuthData'); navigate('/'); };

    // ─── Computed Chart Data ─────────────────────
    const monthlyData = useMemo(() => {
        const months = {};
        complaints.forEach(comp => {
            const d = new Date(comp.registeredAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (!months[key]) months[key] = { key, month: label, total: 0, resolved: 0 };
            months[key].total++;
            if (comp.status === 'Resolved') months[key].resolved++;
        });
        return Object.values(months).sort((a, b) => a.key.localeCompare(b.key));
    }, [complaints]);

    const categoryData = useMemo(() => {
        const cats = {};
        complaints.forEach(comp => {
            const cat = comp.category || 'Other';
            cats[cat] = (cats[cat] || 0) + 1;
        });
        return Object.entries(cats).map(([name, value]) => ({ name, value }));
    }, [complaints]);

    const statusData = useMemo(() => {
        const s = { Registered: 0, Pending: 0, Resolved: 0 };
        complaints.forEach(comp => { if (s[comp.status] !== undefined) s[comp.status]++; });
        return Object.entries(s).map(([name, value]) => ({ name, value }));
    }, [complaints]);

    const departmentData = useMemo(() => {
        const catMap = { 'Academic': 'Academic', 'Infrastructure': 'Infrastructure', 'Exam': 'Exam' };
        const deps = {};
        complaints.forEach(comp => {
            const dep = catMap[comp.category] || 'Other';
            if (!deps[dep]) deps[dep] = { name: dep, total: 0, resolved: 0 };
            deps[dep].total++;
            if (comp.status === 'Resolved') deps[dep].resolved++;
        });
        return Object.values(deps);
    }, [complaints]);

    // ─── Shared Sidebar ─────────────────────
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
                        <ListItem button key={item.text} selected={active}
                            onClick={() => navigate(item.path)}
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
                            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}>Analytics</Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: 11 }}>Complaint data insights & trends</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title={isDark ? 'Light Mode' : 'Dark Mode'}>
                            <IconButton onClick={() => setIsDark(p => !p)} sx={{ color: c.textSecondary, bgcolor: c.inputBg, border: `1px solid ${c.glassBorder}`, width: 38, height: 38, '&:hover': { color: c.amber, borderColor: c.amber } }}>
                                {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: 'none' } }}
                >{sidebarContent}</Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: 'none', bgcolor: 'transparent' } }} open>{sidebarContent}</Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3.5 }, pt: { xs: 10, md: 12 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>

                {/* Summary Stats */}
                <Grow in timeout={500}>
                    <Grid container spacing={2.5} sx={{ mb: 4 }}>
                        {[
                            { icon: <AssignmentIcon />, label: 'Total Complaints', val: complaints.length, color: c.accent },
                            { icon: <CategoryIcon />, label: 'Categories', val: categoryData.length, color: c.cyan },
                            { icon: <PieChartIcon />, label: 'Resolved', val: complaints.filter(x => x.status === 'Resolved').length, color: c.emerald },
                            { icon: <BarChartIcon />, label: 'Months Tracked', val: monthlyData.length, color: c.amber },
                        ].map((s, i) => (
                            <Grid item xs={6} md={3} key={i}>
                                <Paper elevation={0} sx={{
                                    p: 2.5, borderRadius: 4, bgcolor: `${s.color}15`, border: `1px solid ${c.glassBorder}`,
                                    transition: 'all 0.3s', '&:hover': { transform: 'translateY(-3px)', borderColor: `${s.color}40` },
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ width: 40, height: 40, borderRadius: 2.5, background: `linear-gradient(135deg, ${s.color}, ${s.color}CC)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 15px ${s.color}40` }}>
                                            {React.cloneElement(s.icon, { sx: { color: 'white', fontSize: 20 } })}
                                        </Box>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 900, color: c.textPrimary, lineHeight: 1 }}>{s.val}</Typography>
                                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700, fontSize: 10 }}>{s.label}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grow>

                <Grid container spacing={3}>
                    {/* ── Complaints Over Time ── */}
                    <Grid item xs={12} lg={8}>
                        <Fade in timeout={700}>
                            <Paper elevation={0} sx={chartPaperSx}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <TimelineIcon sx={{ color: c.accent, fontSize: 20 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary }}>Complaints Over Time</Typography>
                                </Box>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={monthlyData}>
                                        <defs>
                                            <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={c.accent} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={c.accent} stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={c.emerald} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={c.emerald} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={c.glassBorder} />
                                        <XAxis dataKey="month" tick={{ fill: c.textMuted, fontSize: 11 }} axisLine={{ stroke: c.glassBorder }} tickLine={false} />
                                        <YAxis tick={{ fill: c.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <RTooltip contentStyle={tooltipStyle} />
                                        <Area type="monotone" dataKey="total" stroke={c.accent} fill="url(#gradTotal)" strokeWidth={2.5} name="Total" />
                                        <Area type="monotone" dataKey="resolved" stroke={c.emerald} fill="url(#gradResolved)" strokeWidth={2.5} name="Resolved" />
                                        <Legend wrapperStyle={{ fontSize: 11, color: c.textSecondary }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Fade>
                    </Grid>

                    {/* ── Category Breakdown (Pie) ── */}
                    <Grid item xs={12} lg={4}>
                        <Fade in timeout={900}>
                            <Paper elevation={0} sx={chartPaperSx}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <PieChartIcon sx={{ color: c.cyan, fontSize: 20 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary }}>By Category</Typography>
                                </Box>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}
                                            style={{ fontSize: 11, fill: c.textPrimary }}
                                        >
                                            {categoryData.map((_, i) => (
                                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RTooltip contentStyle={tooltipStyle} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Fade>
                    </Grid>

                    {/* ── Status Distribution (Bar) ── */}
                    <Grid item xs={12} md={6}>
                        <Fade in timeout={1100}>
                            <Paper elevation={0} sx={chartPaperSx}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <BarChartIcon sx={{ color: c.amber, fontSize: 20 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary }}>Status Distribution</Typography>
                                </Box>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={statusData} barCategoryGap="30%">
                                        <CartesianGrid strokeDasharray="3 3" stroke={c.glassBorder} />
                                        <XAxis dataKey="name" tick={{ fill: c.textMuted, fontSize: 11 }} axisLine={{ stroke: c.glassBorder }} tickLine={false} />
                                        <YAxis tick={{ fill: c.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <RTooltip contentStyle={tooltipStyle} />
                                        <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
                                            {statusData.map((entry, i) => {
                                                const colors = { Registered: c.amber, Pending: c.cyan, Resolved: c.emerald };
                                                return <Cell key={i} fill={colors[entry.name] || c.accent} />;
                                            })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Fade>
                    </Grid>

                    {/* ── Department Performance ── */}
                    <Grid item xs={12} md={6}>
                        <Fade in timeout={1300}>
                            <Paper elevation={0} sx={chartPaperSx}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <AssessmentIcon sx={{ color: c.emerald, fontSize: 20 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary }}>Department Breakdown</Typography>
                                </Box>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={departmentData} layout="vertical" barCategoryGap="25%">
                                        <CartesianGrid strokeDasharray="3 3" stroke={c.glassBorder} />
                                        <XAxis type="number" tick={{ fill: c.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis dataKey="name" type="category" tick={{ fill: c.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                                        <RTooltip contentStyle={tooltipStyle} />
                                        <Bar dataKey="total" name="Total" fill={c.accent} radius={[0, 6, 6, 0]} barSize={14} />
                                        <Bar dataKey="resolved" name="Resolved" fill={c.emerald} radius={[0, 6, 6, 0]} barSize={14} />
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
