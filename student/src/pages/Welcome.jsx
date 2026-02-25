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
  useTheme
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

export default function Welcome() {
  const theme = useTheme();

  return (
    <Box sx={{
      flexGrow: 1,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#FFFDF5', // Warm Cream Background
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Inter", "Roboto", sans-serif'
    }}>
      {/* Decorative Warm Blobs */}
      <Box sx={{
        position: 'absolute',
        top: -150,
        right: -150,
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.1) 0%, rgba(197, 160, 89, 0) 70%)',
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
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
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
      <AppBar position="sticky" color="transparent" elevation={0} sx={{
        zIndex: 10,
        backdropFilter: 'blur(15px)',
        bgcolor: 'rgba(255, 253, 245, 0.7)',
        borderBottom: '1px solid rgba(197, 160, 89, 0.1)'
      }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
            <Typography variant="h5" fontWeight="900" sx={{
              color: '#4A3E31',
              letterSpacing: '-1px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mr: { md: 6 }
            }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#C5A059', borderRadius: '50%' }} />
              EduSolve
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 5, flexGrow: 1 }}>
              {['Solutions', 'Impact', 'Infrastructure', 'Resources'].map((link) => (
                <Link
                  key={link}
                  component="button"
                  variant="body2"
                  sx={{
                    color: '#6B5E4F',
                    fontWeight: 800,
                    textDecoration: 'none',
                    position: 'relative',
                    transition: '0.3s',
                    '&:hover': { color: '#4A3E31' },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: 0,
                      height: 2,
                      bgcolor: '#C5A059',
                      transition: '0.3s'
                    },
                    '&:hover::after': { width: '100%' }
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                component={RouterLink}
                to="/student-signin"
                sx={{
                  color: '#4A3E31',
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
                  bgcolor: '#4A3E31',
                  color: '#FFFDF5',
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  fontWeight: 900,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  boxShadow: '0 8px 25px rgba(74, 62, 49, 0.15)',
                  '&:hover': { bgcolor: '#2D261E', transform: 'translateY(-1px)', boxShadow: '0 12px 30px rgba(74, 62, 49, 0.25)' }
                }}
              >
                Join EduSolve
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

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
                <Typography variant="overline" sx={{ color: '#C5A059', fontWeight: 900, letterSpacing: 2, mb: 1, display: 'block' }}>
                  THE FUTURE OF CAMPUS SUPPORT
                </Typography>
                <Typography
                  component="h1"
                  variant="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1,
                    color: '#4A3E31',
                    letterSpacing: '-2px',
                    mb: 4
                  }}
                >
                  Your Voice <br />
                  <span style={{ color: '#C5A059' }}>Transformed</span> <br />
                  Into Resolution.
                </Typography>
                <Typography variant="h5" sx={{ color: '#6B5E4F', mb: 6, maxWidth: 520, lineHeight: 1.6, fontWeight: 400 }}>
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
                      bgcolor: '#4A3E31',
                      color: '#FFFDF5',
                      fontSize: '1.2rem',
                      fontWeight: '900',
                      textTransform: 'none',
                      letterSpacing: -0.5,
                      boxShadow: '0 25px 50px rgba(74, 62, 49, 0.25)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        bgcolor: '#2D261E',
                        transform: 'scale(1.05) translateY(-5px)',
                        boxShadow: '0 35px 70px rgba(74, 62, 49, 0.35)',
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
                bgcolor: 'rgba(197, 160, 89, 0.08)', // Tinted placeholder
                borderRadius: 8,
                overflow: 'hidden'
              }}>
                {/* Decorative Frame */}
                <Box sx={{
                  position: 'absolute',
                  inset: -15,
                  border: '1px solid rgba(197, 160, 89, 0.2)',
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
                    border: '12px solid white',
                    bgcolor: 'white'
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
      <Box sx={{ bgcolor: 'white', py: 20 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 12 }}>
            <Typography variant="h3" fontWeight="900" color="#4A3E31" sx={{ letterSpacing: '-1.5px', mb: 2 }}>
              Designed for Excellence
            </Typography>
            <Typography variant="h6" color="#6B5E4F" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
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
                  bgcolor: '#FFFDF5',
                  borderRadius: 6,
                  height: '100%',
                  border: '1px solid rgba(197, 160, 89, 0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(197, 160, 89, 0.1)',
                    borderColor: '#C5A059'
                  }
                }}>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 3,
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C5A059',
                    mb: 3,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.03)'
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="#4A3E31" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="#6B5E4F" sx={{ lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats - Elegant Layout */}
      <Box sx={{ py: 15, bgcolor: '#FFFDF5' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {[
              { val: '2.4k', label: 'Active Students' },
              { val: '100%', label: 'Privacy Secured' },
              { val: '15m', label: 'Setup Time' },
            ].map((stat, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h2" fontWeight="900" color="#4A3E31" sx={{ letterSpacing: '-2px' }}>
                    {stat.val}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#C5A059', fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'white', p: 10, borderTop: '1px solid #f0f0f0' }} component="footer">
        <Stack alignItems="center" spacing={4}>
          <Typography variant="h5" fontWeight="900" color="#4A3E31">
            EduSolve
          </Typography>
          <Stack direction="row" spacing={4}>
            <Link color="inherit" underline="hover" sx={{ cursor: 'pointer', color: '#6B5E4F' }}>Terms</Link>
            <Link color="inherit" underline="hover" sx={{ cursor: 'pointer', color: '#6B5E4F' }}>Privacy</Link>
            <Link color="inherit" underline="hover" sx={{ cursor: 'pointer', color: '#6B5E4F' }}>Support</Link>
          </Stack>
          <Typography variant="body2" color="#A89E94">
            © {new Date().getFullYear()} EduSolve Platform. Excellence in Education.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}



