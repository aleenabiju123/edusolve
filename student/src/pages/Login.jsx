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
  Paper,
  InputAdornment,
  IconButton,
  Link,
  Tooltip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';

export default function Login() {
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
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Admin ID or Email is required';
    } else if (formData.email.length < 3) {
      newErrors.email = 'Admin ID or Email must be at least 3 characters';
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
    // Clear error when user starts typing
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

    // Rate limiting simulation
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
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginAttempts(prev => prev + 1);
        setErrors({ general: data.message || 'Invalid credentials' });
        return;
      }

      // Check if user is admin
      if (data.user.userType !== 'Admin') {
        setErrors({ general: 'Access denied. Only admins can login here.' });
        return;
      }

      // Store authentication state
      const authData = {
        isAuthenticated: true,
        userType: 'Admin',
        adminId: data.user.studentId,
        name: data.user.name,
        email: data.user.email,
        department: data.user.department,
        adminDepartment: data.user.adminDepartment,
        phoneNumber: data.user.phoneNumber,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('adminAuthData', JSON.stringify(authData));

      // Reset login attempts on successful login
      setLoginAttempts(0);

      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Network error. Please check your connection.' });
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

      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: colors.cardBg,
              backdropFilter: 'blur(20px)',
              borderRadius: 6,
              border: `1px solid ${colors.border}`,
              boxShadow: isDark ? '0 40px 80px rgba(0,0,0,0.4)' : '0 40px 80px rgba(0,0,0,0.05)',
            }}
          >
            <Box sx={{
              width: 50, height: 50, borderRadius: 2,
              bgcolor: colors.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, color: 'white', fontSize: 24, mb: 2
            }}>E</Box>

            <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 900, color: colors.text, letterSpacing: '-0.5px' }}>
              Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
              Enter your credentials to access the console.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              {errors.general && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                  {errors.general}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Admin ID or Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
                inputProps={{ maxLength: 100 }}
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
                inputProps={{ maxLength: 100 }}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
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
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In to Console'}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link component={RouterLink} to="/forgot-password" sx={{
                  color: colors.accent, fontWeight: 700, textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}>
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}