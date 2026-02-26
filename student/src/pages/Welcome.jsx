import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
  Link,
  useTheme,
  IconButton
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';

export default function Welcome() {
  const theme = useTheme();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const colors = {
    bg: isDark ? '#121212' : '#FFFDF5',
    cardBg: isDark ? '#1E1E1E' : '#FFFDF5',
    text: isDark ? '#FFFDF5' : '#4A3E31',
    textSecondary: isDark ? 'rgba(255, 253, 245, 0.7)' : '#6B5E4F',
    accent: '#C5A059',
    white: isDark ? '#1E1E1E' : 'white',
    blob: isDark ? 'rgba(197, 160, 89, 0.05)' : 'rgba(197, 160, 89, 0.1)'
  };

  return (
    <Box sx={{
      flexGrow: 1,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: colors.bg,
      color: colors.text,
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Inter", "Roboto", sans-serif',
      transition: 'all 0.4s ease'
    }}>
      {/* Decorative Warm Blobs */}
      <Box sx={{
        position: 'absolute',
        top: -150,
        right: -150,
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.blob} 0%, rgba(197, 160, 89, 0) 70%)`,
        zIndex: 0,
        animation: 'pulse 12s infinite ease-in-out'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -200,
        left: -200,
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: isDark ? 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 70%)' : 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
        zIndex: 0,
      }} />

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0.3; }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Navbar */}
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />

      {/* Hero Section */}
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        pt: { xs: 8, md: 15 },
        pb: { xs: 10, md: 20 },
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }} sx={{ animation: 'fadeInUp 0.8s ease-out' }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2, mb: 1, display: 'block' }}>
                  THE FUTURE OF CAMPUS SUPPORT
                </Typography>
                <Typography
                  component="h1"
                  variant="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1,
                    color: colors.text,
                    letterSpacing: '-2px',
                    mb: 4
                  }}
                >
                  Your Voice <br />
                  <span style={{ color: colors.accent }}>Transformed</span> <br />
                  Into Resolution.
                </Typography>
                <Typography variant="h5" sx={{ color: colors.textSecondary, mb: 6, maxWidth: 520, lineHeight: 1.6, fontWeight: 400 }}>
                  A sophisticated platform for modern students to report issues, track progress, and experience genuine accountability.
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                >
                  <Button
                    component={RouterLink}
                    to="/student-signin"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      py: 2.5,
                      px: 6,
                      borderRadius: 4,
                      bgcolor: colors.text,
                      color: colors.bg,
                      fontSize: '1.2rem',
                      fontWeight: '900',
                      textTransform: 'none',
                      letterSpacing: -0.5,
                      boxShadow: isDark ? '0 25px 50px rgba(0, 0, 0, 0.4)' : '0 25px 50px rgba(74, 62, 49, 0.25)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        bgcolor: isDark ? '#333' : '#2D261E',
                        transform: 'scale(1.05) translateY(-5px)',
                        boxShadow: isDark ? '0 35px 70px rgba(0, 0, 0, 0.6)' : '0 35px 70px rgba(74, 62, 49, 0.35)',
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ position: 'relative' }}>
              <Box sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                animation: 'float 6s infinite ease-in-out',
                zIndex: 2,
                minHeight: { xs: 300, md: 450 }, // Reserves space
                bgcolor: isDark ? 'rgba(197, 160, 89, 0.05)' : 'rgba(197, 160, 89, 0.08)', // Tinted placeholder
                borderRadius: 8,
                overflow: 'hidden'
              }}>
                {/* Decorative Frame */}
                <Box sx={{
                  position: 'absolute',
                  inset: -15,
                  border: `1px solid ${isDark ? 'rgba(197, 160, 89, 0.1)' : 'rgba(197, 160, 89, 0.2)'}`,
                  borderRadius: 10,
                  zIndex: -1
                }} />

                <Box
                  component="img"
                  sx={{
                    width: '100%',
                    maxWidth: 600,
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 8,
                    boxShadow: '0 40px 80px rgba(0, 0, 0, 0.15)',
                    border: `12px solid ${colors.white}`,
                    bgcolor: colors.white
                  }}
                  alt="" // Empty alt to prevent "only text" look if failing
                  src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1200"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features - Minimalist Cards */}
      <Box sx={{ bgcolor: isDark ? '#1A1A1A' : 'white', py: 20 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Typography variant="h3" fontWeight="900" color={colors.text} sx={{ letterSpacing: '-1.5px', mb: 2 }}>
              Designed for Excellence
            </Typography>
            <Typography variant="h6" color={colors.textSecondary} sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
              The infrastructure for a better student experience starts here.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              { icon: <DescriptionIcon />, title: 'Elegant Submission', desc: 'Clear, concise forms designed for frustration-free reporting.' },
              { icon: <TimelineIcon />, title: 'Real-time Trace', desc: 'Maintain absolute visibility on every step of your resolution.' },
              { icon: <SecurityIcon />, title: 'Secure Vault', desc: 'Your private data is handled with enterprise-grade encryption.' },
              { icon: <SpeedIcon />, title: 'Priority Logic', desc: 'Accelerated routing for critical campus infrastructure issues.' },
            ].map((feature, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{
                  p: 4,
                  bgcolor: colors.cardBg,
                  borderRadius: 6,
                  height: '100%',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(197, 160, 89, 0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(197, 160, 89, 0.1)',
                    borderColor: colors.accent
                  }
                }}>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 3,
                    bgcolor: colors.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.accent,
                    mb: 3,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.03)'
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color={colors.text} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color={colors.textSecondary} sx={{ lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats - Elegant Layout */}
      <Box sx={{ py: 15, bgcolor: colors.bg }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {[
              { val: '2.4k', label: 'Active Students' },
              { val: '100%', label: 'Privacy Secured' },
              { val: '15m', label: 'Setup Time' },
            ].map((stat, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h2" fontWeight="900" color={colors.text} sx={{ letterSpacing: '-2px' }}>
                    {stat.val}
                  </Typography>
                  <Typography variant="h6" sx={{ color: colors.accent, fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: isDark ? '#1A1A1A' : 'white', p: 10, borderTop: isDark ? '1px solid #333' : '1px solid #f0f0f0' }} component="footer">
        <Stack alignItems="center" spacing={4}>
          <Typography variant="h5" fontWeight="900" color={colors.text}>
            EduSolve
          </Typography>
          <Stack direction="row" spacing={4}>
            <Link color="inherit" underline="hover" sx={{ cursor: 'pointer', color: colors.textSecondary }}>Terms</Link>
            <Link color="inherit" underline="hover" sx={{ cursor: 'pointer', color: colors.textSecondary }}>Privacy</Link>
            <Link color="inherit" underline="hover" sx={{ cursor: 'pointer', color: colors.textSecondary }}>Support</Link>
          </Stack>
          <Typography variant="body2" color={isDark ? 'rgba(255, 255, 255, 0.3)' : '#A89E94'}>
            © {new Date().getFullYear()} EduSolve Platform. Excellence in Education.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}



