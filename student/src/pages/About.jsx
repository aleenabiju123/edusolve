import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Avatar,
    Stack,
    useTheme
} from '@mui/material';
import {
    Lightbulb as LightbulbIcon,
    Groups as GroupsIcon,
    AutoGraph as AutoGraphIcon,
    VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';

export default function About() {
    const theme = useTheme();
    const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const colors = {
        bg: isDark ? '#121212' : '#FFFDF5',
        cardBg: isDark ? '#1E1E1E' : '#FFFFFF',
        text: isDark ? '#FFFDF5' : '#4A3E31',
        textSecondary: isDark ? 'rgba(255, 253, 245, 0.7)' : '#6B5E4F',
        accent: '#C5A059',
        border: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(197, 160, 89, 0.1)'
    };

    const values = [
        {
            icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
            title: 'Innovation',
            desc: 'We leverage modern technology to simplify campus grievance management and feedback loops.'
        },
        {
            icon: <GroupsIcon sx={{ fontSize: 40 }} />,
            title: 'Student-Centric',
            desc: 'Our platform is built with the student experience at its core, ensuring every voice is heard.'
        },
        {
            icon: <AutoGraphIcon sx={{ fontSize: 40 }} />,
            title: 'Accountability',
            desc: 'Transparent tracking allows students and administration to monitor progress in real-time.'
        },
        {
            icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
            title: 'Integrity',
            desc: 'We maintain the highest standards of data security and professional conduct in error resolution.'
        }
    ];

    return (
        <Box sx={{ bgcolor: colors.bg, minHeight: '100vh', color: colors.text, transition: 'all 0.4s ease' }}>
            <Navbar isDark={isDark} onToggleTheme={toggleTheme} />

            <Container maxWidth="lg" sx={{ pt: 12, pb: 15 }}>
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 15 }}>
                    <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2 }}>
                        OUR MISSION
                    </Typography>
                    <Typography variant="h2" fontWeight="900" color={colors.text} sx={{ mt: 2, mb: 4, letterSpacing: '-2px' }}>
                        Transforming Education <br />
                        Through <span style={{ color: colors.accent }}>Communication</span>
                    </Typography>
                    <Typography variant="h6" color={colors.textSecondary} sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400, lineHeight: 1.8 }}>
                        EduSolve was founded on the belief that a well-connected campus is a better learning environment.
                        We provide the infrastructure to bridge the gap between students and administration.
                    </Typography>
                </Box>

                {/* Content Section */}
                <Grid container spacing={8} alignItems="center" sx={{ mb: 15 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{
                            position: 'relative',
                            borderRadius: 8,
                            overflow: 'hidden',
                            boxShadow: isDark ? '0 40px 80px rgba(0,0,0,0.4)' : '0 40px 80px rgba(0,0,0,0.1)',
                            border: `1px solid ${colors.border}`
                        }}>
                            <Box
                                component="img"
                                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                sx={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h4" fontWeight="900" color={colors.text} gutterBottom sx={{ letterSpacing: '-1px' }}>
                            Why EduSolve?
                        </Typography>
                        <Typography variant="body1" color={colors.textSecondary} paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                            Academic success depends on more than just books and lectures. It requires a functioning,
                            responsive environment where students can focus on their studies without being weighed down by administrative hurdles.
                        </Typography>
                        <Typography variant="body1" color={colors.textSecondary} sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                            Our platform automates the routing of complaints, provides actionable analytics to department heads,
                            and keeps students informed every step of the way. We are not just a software; we are a partner in campus excellence.
                        </Typography>
                    </Grid>
                </Grid>

                {/* Values Grid */}
                <Box sx={{ mb: 12 }}>
                    <Typography variant="h4" fontWeight="900" color={colors.text} sx={{ textAlign: 'center', mb: 8, letterSpacing: '-1px' }}>
                        Our Core Values
                    </Typography>
                    <Grid container spacing={4}>
                        {values.map((v, i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card sx={{
                                    height: '100%',
                                    bgcolor: colors.cardBg,
                                    borderRadius: 6,
                                    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.02)',
                                    border: `1px solid ${colors.border}`,
                                    transition: '0.3s',
                                    '&:hover': { transform: 'translateY(-10px)', borderColor: colors.accent }
                                }}>
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Box sx={{ color: colors.accent, mb: 3 }}>{v.icon}</Box>
                                        <Typography variant="h6" fontWeight="bold" color={colors.text} gutterBottom>
                                            {v.title}
                                        </Typography>
                                        <Typography variant="body2" color={colors.textSecondary} sx={{ lineHeight: 1.6 }}>
                                            {v.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
