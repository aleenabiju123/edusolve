import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useTheme,
    useMediaQuery,
    Link,
    Tooltip
} from '@mui/material';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon
} from '@mui/icons-material';

export default function Navbar({ isDark, onToggleTheme }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    const colors = {
        bg: isDark ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 253, 245, 0.8)',
        drawerBg: isDark ? '#1E1E1E' : '#FFFDF5',
        text: isDark ? '#FFFDF5' : '#4A3E31',
        textSecondary: isDark ? 'rgba(255, 253, 245, 0.7)' : '#6B5E4F',
        accent: '#C5A059',
        border: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(197, 160, 89, 0.1)',
        iconBg: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0,0,0,0.02)'
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' }
    ];

    const drawer = (
        <Box sx={{ p: 3, bgcolor: colors.drawerBg, height: '100%', color: colors.text }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                    <IconButton onClick={onToggleTheme} sx={{ color: colors.accent, bgcolor: colors.iconBg }}>
                        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Tooltip>
                <IconButton onClick={handleDrawerToggle} sx={{ color: colors.text }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Typography variant="h5" fontWeight="900" color={colors.text} sx={{ mb: 4, textAlign: 'center' }}>
                EduSolve
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem
                        key={item.label}
                        component={RouterLink}
                        to={item.path}
                        onClick={handleDrawerToggle}
                        sx={{
                            textAlign: 'center',
                            color: location.pathname === item.path ? colors.accent : colors.textSecondary,
                            mb: 2,
                            borderRadius: 2,
                            '&.Mui-selected': { bgcolor: `${colors.accent}15` },
                            '&:hover': { bgcolor: `${colors.accent}08` }
                        }}
                    >
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ fontWeight: 800, fontSize: '1.2rem' }}
                        />
                    </ListItem>
                ))}
            </List>
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    component={RouterLink}
                    to="/student-signin"
                    variant="outlined"
                    fullWidth
                    sx={{
                        borderColor: colors.text,
                        color: colors.text,
                        borderRadius: 2,
                        fontWeight: 800,
                        textTransform: 'none',
                        '&:hover': { borderColor: colors.accent, color: colors.accent }
                    }}
                >
                    Sign In
                </Button>
                <Button
                    component={RouterLink}
                    to="/student-register"
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: colors.accent,
                        color: 'white',
                        borderRadius: 2,
                        fontWeight: 800,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#B48F48' }
                    }}
                >
                    Join EduSolve
                </Button>
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" color="transparent" elevation={0} sx={{
                zIndex: 10,
                backdropFilter: 'blur(20px)',
                bgcolor: colors.bg,
                borderBottom: `1px solid ${colors.border}`,
                transition: 'all 0.4s ease'
            }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
                            <Box sx={{ width: 14, height: 14, bgcolor: colors.accent, borderRadius: '50%' }} />
                            <Typography variant="h5" fontWeight="900" sx={{
                                color: colors.text,
                                letterSpacing: '-1px'
                            }}>
                                EduSolve
                            </Typography>
                        </Box>

                        {!isMobile && (
                            <Box sx={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        component={RouterLink}
                                        to={item.path}
                                        sx={{
                                            color: location.pathname === item.path ? colors.accent : colors.textSecondary,
                                            fontWeight: 800,
                                            textDecoration: 'none',
                                            position: 'relative',
                                            transition: '0.3s',
                                            fontSize: '0.95rem',
                                            '&:hover': { color: colors.text },
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: -4,
                                                left: 0,
                                                width: location.pathname === item.path ? '100%' : 0,
                                                height: 2,
                                                bgcolor: colors.accent,
                                                transition: '0.3s'
                                            },
                                            '&:hover::after': { width: '100%' }
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {!isMobile && (
                                <>
                                    <Tooltip title={isDark ? "Light Mode" : "Dark Mode"}>
                                        <IconButton
                                            onClick={onToggleTheme}
                                            sx={{
                                                color: colors.textSecondary,
                                                bgcolor: colors.iconBg,
                                                border: `1px solid ${colors.border}`,
                                                width: 38,
                                                height: 38,
                                                '&:hover': { color: colors.accent, borderColor: colors.accent }
                                            }}
                                        >
                                            {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
                                        </IconButton>
                                    </Tooltip>
                                    <Button
                                        component={RouterLink}
                                        to="/student-signin"
                                        sx={{
                                            color: colors.text,
                                            fontWeight: 800,
                                            px: 3,
                                            textTransform: 'none',
                                            '&:hover': { bgcolor: 'transparent', opacity: 0.7 }
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        component={RouterLink}
                                        to="/student-register"
                                        variant="contained"
                                        sx={{
                                            bgcolor: colors.text,
                                            color: isDark ? '#121212' : '#FFFDF5',
                                            borderRadius: 3,
                                            px: 4,
                                            py: 1,
                                            fontWeight: 900,
                                            textTransform: 'none',
                                            fontSize: '0.9rem',
                                            boxShadow: isDark ? '0 8px 25px rgba(0,0,0,0.4)' : '0 8px 25px rgba(74, 62, 49, 0.15)',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                bgcolor: isDark ? '#EEE' : '#2D261E',
                                                transform: 'translateY(-1px)',
                                                boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.6)' : '0 12px 30px rgba(74, 62, 49, 0.25)'
                                            }
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </>
                            )}
                            {isMobile && (
                                <IconButton onClick={handleDrawerToggle} sx={{ color: colors.text }}>
                                    <MenuIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    '& .MuiDrawer-paper': { width: '100%', maxWidth: 300, bgcolor: colors.drawerBg }
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
}
