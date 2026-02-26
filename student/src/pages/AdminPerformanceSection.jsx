import React, { useMemo } from 'react';
import {
    Box, Grid, Paper, Typography, Grow, Fade, LinearProgress, CircularProgress
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    Speed as SpeedIcon,
    Timer as TimerIcon,
    TrendingDown as TrendingDownIcon,
    EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    ResponsiveContainer, BarChart, Bar, Legend, Cell
} from 'recharts';

export default function AdminPerformanceSection({ complaints, isDark, c }) {
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
        <Box>
            {/* KPI Cards */}
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
    );
}
