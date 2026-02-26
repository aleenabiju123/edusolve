import React, { useMemo } from 'react';
import {
    Box, Grid, Paper, Typography, Grow, Fade
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    Assessment as AssessmentIcon,
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    Timeline as TimelineIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const CHART_COLORS = ['#C5A059', '#4A3E31', '#6B5E4F', '#81C784', '#FFD54F', '#E57373'];

export default function AdminAnalyticsSection({ complaints, isDark, c }) {
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
        return Object.entries(s).map(([name, value]) => ({
            name: name === 'Pending' ? 'In Progress' : name,
            value
        }));
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

    const chartPaperSx = {
        bgcolor: c.glassBg, backdropFilter: 'blur(20px)', border: `1px solid ${c.glassBorder}`,
        borderRadius: 4, p: 3, transition: 'all 0.3s', '&:hover': { borderColor: `${c.accent}40` }
    };

    const tooltipStyle = { backgroundColor: isDark ? '#1A1A2E' : '#FFF', border: `1px solid ${c.glassBorder}`, borderRadius: 12, color: c.textPrimary, fontSize: 12 };

    return (
        <Box>
            {/* Summary Stats */}
            <Grow in timeout={500}>
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {[
                        { icon: <AssignmentIcon />, label: 'Total Complaints', val: complaints.length, color: c.accent },
                        { icon: <CategoryIcon />, label: 'Categories', val: categoryData.length, color: c.cyan },
                        { icon: <PieChartIcon />, label: 'Resolved', val: complaints.filter(x => x.status === 'Resolved').length, color: c.emerald },
                        { icon: <BarChartIcon />, label: 'Months Tracked', val: monthlyData.length, color: c.amber },
                    ].map((s, i) => (
                        <Grid size={{ xs: 6, md: 3 }} key={i}>
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
                <Grid size={{ xs: 12, lg: 8 }}>
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

                <Grid size={{ xs: 12, lg: 4 }}>
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

                <Grid size={{ xs: 12, md: 6 }}>
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
                                            const colors = { Registered: c.amber, 'In Progress': c.cyan, Resolved: c.emerald };
                                            return <Cell key={i} fill={colors[entry.name] || c.accent} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Fade>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
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
    );
}
