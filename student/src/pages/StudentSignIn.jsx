import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';

export default function StudentSignIn() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const colors = {
    bg: isDark ? '#121212' : '#FFFDF5',
    cardBg: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    text: isDark ? '#FFFDF5' : '#4A3E31',
    textSecondary: isDark ? 'rgba(255, 252, 245, 0.6)' : '#6B5E4F',
    accent: '#C5A059',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(197, 160, 89, 0.2)'
  };

  const [formData, setFormData] = useState({
    loginId: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.loginId.trim()) {
      newErrors.loginId = 'ID or Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (loginAttempts >= 5) {
      setErrors({ general: 'Too many login attempts. Please try again later.' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:2000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.loginId.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginAttempts(prev => prev + 1);
        setErrors({ general: data.message || 'Invalid credentials' });
        return;
      }

      const userType = data.user.userType;
      const authData = {
        isAuthenticated: true,
        userType: userType,
        userId: data.user.studentId || data.user.adminId || data.user._id,
        studentId: data.user.studentId,
        adminId: data.user.adminId,
        admissionNumber: data.user.admissionNumber,
        fullName: data.user.name,
        email: data.user.email,
        department: data.user.department,
        adminDepartment: data.user.adminDepartment,
        phoneNumber: data.user.phoneNumber,
        loginTime: new Date().toISOString()
      };

      // Store in the correct key based on user type
      const storageKey = userType === 'Admin' ? 'adminAuthData' : 'studentAuthData';
      localStorage.setItem(storageKey, JSON.stringify(authData));

      setLoginAttempts(0);

      if (userType === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }

    } catch (error) {
      console.error('Login error:', error);
      setLoginAttempts(prev => prev + 1);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: colors.bg,
      position: 'relative',
      overflow: 'hidden',
      p: 2,
      transition: 'all 0.4s ease'
    }}>
      {/* Theme Toggle */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: colors.text,
              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${colors.border}`,
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)' }
            }}
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      {/* Decorative Blobs */}
      <Box sx={{
        position: 'absolute', top: -100, right: -100, width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.1) 0%, rgba(197, 160, 89, 0) 70%)',
        animation: 'pulse 10s infinite ease-in-out'
      }} />
      <Box sx={{
        position: 'absolute', bottom: -150, left: -150, width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74, 62, 49, 0.05) 0%, rgba(74, 62, 49, 0) 70%)',
        animation: 'pulse 15s infinite ease-in-out alternate'
      }} />

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0.3; }
        }
      `}</style>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            overflow: 'hidden',
            bgcolor: colors.cardBg,
            backdropFilter: 'blur(20px)',
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            boxShadow: isDark ? '0 40px 80px rgba(0, 0, 0, 0.4)' : '0 40px 80px rgba(0, 0, 0, 0.07)',
            minHeight: { md: 600 }
          }}
        >
          {/* LEFT: Welcome Hero Panel */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'flex-end',
            width: '48%',
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: 'url(https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=900)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: isDark
                ? 'linear-gradient(to top, rgba(18,18,18,0.97) 0%, rgba(18,18,18,0.7) 50%, rgba(18,18,18,0.2) 100%)'
                : 'linear-gradient(to top, rgba(74,62,49,0.97) 0%, rgba(74,62,49,0.5) 50%, rgba(74,62,49,0.15) 100%)',
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, p: { md: 5, lg: 6 } }}>
              {/* Brand name */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: 2,
                  bgcolor: colors.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, color: 'white', fontSize: 20
                }}>E</Box>
                <Typography variant="h5" fontWeight="900" sx={{ color: 'white', letterSpacing: '-0.5px' }}>
                  EduSolve
                </Typography>
              </Box>

              <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 3 }}>
                WELCOME BACK
              </Typography>
              <Typography variant="h3" fontWeight="900" sx={{ color: 'white', mt: 1.5, lineHeight: 1.2, letterSpacing: '-1px' }}>
                Your voice matters here.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2.5, lineHeight: 1.8, maxWidth: 360 }}>
                Sign in to track your complaints, get real-time updates, and stay connected with EduSolve — your campus problem-solving platform.
              </Typography>

              {/* Feature pills */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 4 }}>
                {['Real-time tracking', 'Campus community', 'Fast resolution'].map((f) => (
                  <Box key={f} sx={{
                    px: 2, py: 0.8,
                    bgcolor: `${colors.accent}25`,
                    border: `1px solid ${colors.accent}40`,
                    borderRadius: 10,
                  }}>
                    <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 700 }}>{f}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* RIGHT: Sign-In Form */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 4, sm: 6, md: 6 }
          }}>
            {/* Mobile brand */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: 2, bgcolor: colors.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, color: 'white', fontSize: 18
              }}>E</Box>
              <Typography variant="h6" fontWeight="900" sx={{ color: colors.text }}>EduSolve</Typography>
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2 }}>
                SIGN IN
              </Typography>
              <Typography variant="h4" fontWeight="900" sx={{ color: colors.text, letterSpacing: '-1px', mt: 0.5 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 1 }}>
                Continue your journey with EduSolve.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {errors.general && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{errors.general}</Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="loginId"
                label="Student ID / Admission Number / Email"
                name="loginId"
                autoComplete="username"
                autoFocus
                value={formData.loginId}
                onChange={handleInputChange}
                error={!!errors.loginId}
                helperText={errors.loginId}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    color: colors.text,
                    '& fieldset': { borderColor: colors.border },
                    '&:hover fieldset': { borderColor: colors.accent },
                    '&.Mui-focused fieldset': { borderColor: colors.accent }
                  },
                  '& .MuiInputLabel-root': { color: colors.textSecondary },
                  '& .MuiInputLabel-root.Mui-focused': { color: colors.text }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    color: colors.text,
                    '& fieldset': { borderColor: colors.border },
                    '&:hover fieldset': { borderColor: colors.accent },
                    '&.Mui-focused fieldset': { borderColor: colors.accent }
                  },
                  '& .MuiInputLabel-root': { color: colors.textSecondary },
                  '& .MuiInputLabel-root.Mui-focused': { color: colors.text }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: colors.accent }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mt: 1, textAlign: 'right' }}>
                <Link component={RouterLink} to="/forgot-password" sx={{
                  color: colors.accent, fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem',
                  '&:hover': { color: colors.text }
                }}>
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 4, mb: 3, py: 1.8,
                  bgcolor: colors.text,
                  color: colors.bg,
                  borderRadius: 4,
                  fontSize: '1rem', fontWeight: 'bold',
                  boxShadow: isDark ? '0 10px 20px rgba(0,0,0,0.4)' : '0 10px 20px rgba(74, 62, 49, 0.2)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: isDark ? '#FFF' : '#2D261E',
                    color: isDark ? '#000' : '#FFF',
                    transform: 'translateY(-2px)',
                    boxShadow: isDark ? '0 15px 30px rgba(0,0,0,0.5)' : '0 15px 30px rgba(74, 62, 49, 0.3)'
                  },
                  '&.Mui-disabled': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(74, 62, 49, 0.3)' }
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to EduSolve'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                  New to EduSolve?{' '}
                  <Link component={RouterLink} to="/student-register" sx={{
                    color: colors.accent, fontWeight: 700, textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}>
                    Create Account
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
