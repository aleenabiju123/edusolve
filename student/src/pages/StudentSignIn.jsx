import { useState } from 'react';
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
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function StudentSignIn() {
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
      bgcolor: '#FFFDF5',
      position: 'relative',
      overflow: 'hidden',
      p: 2
    }}>
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
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: 10,
            border: '1px solid rgba(197, 160, 89, 0.2)',
            boxShadow: '0 40px 80px rgba(0, 0, 0, 0.07)',
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
              background: 'linear-gradient(to top, rgba(74,62,49,0.97) 0%, rgba(74,62,49,0.5) 50%, rgba(74,62,49,0.15) 100%)',
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, p: { md: 5, lg: 6 } }}>
              {/* Brand name */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: 2,
                  bgcolor: '#C5A059',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, color: 'white', fontSize: 20
                }}>E</Box>
                <Typography variant="h5" fontWeight="900" sx={{ color: 'white', letterSpacing: '-0.5px' }}>
                  EduSolve
                </Typography>
              </Box>

              <Typography variant="overline" sx={{ color: '#C5A059', fontWeight: 900, letterSpacing: 3 }}>
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
                    bgcolor: 'rgba(197, 160, 89, 0.15)',
                    border: '1px solid rgba(197, 160, 89, 0.3)',
                    borderRadius: 10,
                  }}>
                    <Typography variant="caption" sx={{ color: '#C5A059', fontWeight: 700 }}>{f}</Typography>
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
                width: 36, height: 36, borderRadius: 2, bgcolor: '#C5A059',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, color: 'white', fontSize: 18
              }}>E</Box>
              <Typography variant="h6" fontWeight="900" sx={{ color: '#4A3E31' }}>EduSolve</Typography>
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography variant="overline" sx={{ color: '#C5A059', fontWeight: 900, letterSpacing: 2 }}>
                SIGN IN
              </Typography>
              <Typography variant="h4" fontWeight="900" sx={{ color: '#4A3E31', letterSpacing: '-1px', mt: 0.5 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B5E4F', mt: 1 }}>
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
                    '& fieldset': { borderColor: 'rgba(197, 160, 89, 0.3)' },
                    '&:hover fieldset': { borderColor: '#C5A059' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4A3E31' }
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
                    '& fieldset': { borderColor: 'rgba(197, 160, 89, 0.3)' },
                    '&:hover fieldset': { borderColor: '#C5A059' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4A3E31' }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: '#C5A059' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mt: 1, textAlign: 'right' }}>
                <Link component={RouterLink} to="/forgot-password" sx={{
                  color: '#C5A059', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem',
                  '&:hover': { color: '#4A3E31' }
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
                  bgcolor: '#4A3E31', borderRadius: 4,
                  fontSize: '1rem', fontWeight: 'bold',
                  boxShadow: '0 10px 20px rgba(74, 62, 49, 0.2)',
                  '&:hover': { bgcolor: '#2D261E', transform: 'translateY(-2px)', boxShadow: '0 15px 30px rgba(74, 62, 49, 0.3)' }
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to EduSolve'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#6B5E4F' }}>
                  New to EduSolve?{' '}
                  <Link component={RouterLink} to="/student-register" sx={{
                    color: '#C5A059', fontWeight: 700, textDecoration: 'none',
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
