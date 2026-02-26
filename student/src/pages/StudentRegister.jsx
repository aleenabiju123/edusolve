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
  MenuItem,
  Checkbox,
  Grid,
  Link,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';

export default function StudentRegister() {
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
    role: 'student',
    admissionNumber: '',
    fullName: '',
    email: '',
    department: 'Computer Science',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Commerce',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
    'Biotechnology'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'Full name can only contain letters and spaces';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.admissionNumber.trim()) {
      newErrors.admissionNumber = 'Admission Number is required';
    } else if (!/^\d{8,12}$/.test(formData.admissionNumber.trim())) {
      newErrors.admissionNumber = 'Admission Number must be 8-12 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        role: 'student',
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim(),
        admissionNumber: formData.admissionNumber.trim(),
        department: formData.department
      };

      const response = await fetch('http://localhost:2000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Registration failed. Please try again.' });
        return;
      }

      alert(`Registration successful!\n\nYour Student ID: ${data.user.studentId}\nAdmission Number: ${data.user.admissionNumber}\n\nYou can now sign in.`);
      navigate('/student-signin');

    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Network error. Please try again later.' });
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
      py: { xs: 4, md: 6 },
      px: 2,
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
      {/* Decorative Warm Blobs */}
      <Box sx={{
        position: 'absolute',
        top: -150,
        left: -150,
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.1) 0%, rgba(197, 160, 89, 0) 70%)',
        zIndex: 0,
        animation: 'pulse 14s infinite ease-in-out'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -100,
        right: -100,
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74, 62, 49, 0.05) 0%, rgba(74, 62, 49, 0) 70%)',
        zIndex: 0,
        animation: 'pulse 10s infinite ease-in-out alternate'
      }} />

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0.3; }
          }
        `}
      </style>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            overflow: 'hidden',
            bgcolor: colors.cardBg,
            backdropFilter: 'blur(25px)',
            borderRadius: 10,
            border: `1px solid ${colors.border}`,
            boxShadow: isDark ? '0 40px 100px rgba(0, 0, 0, 0.4)' : '0 40px 100px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* LEFT: Community Hero Panel */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'flex-end',
            width: '42%',
            minHeight: 720,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundImage: 'url(https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: isDark
                ? 'linear-gradient(to top, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.6) 55%, rgba(18,18,18,0.2) 100%)'
                : 'linear-gradient(to top, rgba(74,62,49,0.95) 0%, rgba(74,62,49,0.4) 55%, rgba(74,62,49,0.1) 100%)',
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1, p: 5 }}>
              <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 3 }}>
                EDUSOLVE COMMUNITY
              </Typography>
              <Typography variant="h4" fontWeight="900" sx={{ color: 'white', mt: 1.5, lineHeight: 1.25, letterSpacing: '-0.5px' }}>
                Join thousands of students — solving campus problems, together.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2, lineHeight: 1.8 }}>
                Register your complaint, track its progress in real time, and connect with a community that cares about your campus experience.
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, mt: 4 }}>
                {[{ val: '2,000+', label: 'Students' }, { val: '98%', label: 'Resolved' }, { val: '24h', label: 'Response' }].map((s) => (
                  <Box key={s.label}>
                    <Typography variant="h6" fontWeight="900" sx={{ color: colors.accent }}>{s.val}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* RIGHT: Registration Form */}
          <Box sx={{ flex: 1, p: { xs: 4, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2 }}>
                START YOUR JOURNEY
              </Typography>
              <Typography variant="h4" fontWeight="900" sx={{ color: colors.text, letterSpacing: '-1px', mt: 0.5 }}>
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 1 }}>
                Fill in your details below to get started.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    id="fullName"
                    label="Full Name"
                    name="fullName"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    disabled={isLoading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        color: colors.text,
                        '& fieldset': { borderColor: colors.border },
                        '&:hover fieldset': { borderColor: colors.accent },
                        '&.Mui-focused fieldset': { borderColor: colors.accent }
                      },
                      '& .MuiInputLabel-root': { color: colors.textSecondary },
                      '& .MuiInputLabel-root.Mui-focused': { color: colors.text }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={isLoading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        color: colors.text,
                        '& fieldset': { borderColor: colors.border },
                        '&:hover fieldset': { borderColor: colors.accent },
                        '&.Mui-focused fieldset': { borderColor: colors.accent }
                      },
                      '& .MuiInputLabel-root': { color: colors.textSecondary },
                      '& .MuiInputLabel-root.Mui-focused': { color: colors.text }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    id="admissionNumber"
                    label="Admission Number"
                    name="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={handleInputChange}
                    error={!!errors.admissionNumber}
                    helperText={errors.admissionNumber}
                    disabled={isLoading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        color: colors.text,
                        '& fieldset': { borderColor: colors.border },
                        '&:hover fieldset': { borderColor: colors.accent },
                        '&.Mui-focused fieldset': { borderColor: colors.accent }
                      },
                      '& .MuiInputLabel-root': { color: colors.textSecondary },
                      '& .MuiInputLabel-root.Mui-focused': { color: colors.text }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    id="phoneNumber"
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    disabled={isLoading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        color: colors.text,
                        '& fieldset': { borderColor: colors.border },
                        '&:hover fieldset': { borderColor: colors.accent },
                        '&.Mui-focused fieldset': { borderColor: colors.accent }
                      },
                      '& .MuiInputLabel-root': { color: colors.textSecondary },
                      '& .MuiInputLabel-root.Mui-focused': { color: colors.text }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    select
                    required
                    fullWidth
                    id="department"
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        color: colors.text,
                        '& fieldset': { borderColor: colors.border },
                        '&:hover fieldset': { borderColor: colors.accent },
                        '&.Mui-focused fieldset': { borderColor: colors.accent }
                      },
                      '& .MuiInputLabel-root': { color: colors.textSecondary },
                      '& .MuiInputLabel-root.Mui-focused': { color: colors.text }
                    }}
                  >
                    {departments.map((option) => (
                      <MenuItem key={option} value={option} sx={{ color: colors.text }}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={isLoading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
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
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: colors.accent }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={isLoading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
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
                            aria-label="toggle confirm password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: colors.accent }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        sx={{ color: colors.accent, '&.Mui-checked': { color: colors.accent } }}
                        disabled={isLoading}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        I agree to the <Link href="#" sx={{ color: colors.accent, fontWeight: 600 }}>Terms and Conditions</Link> and <Link href="#" sx={{ color: colors.accent, fontWeight: 600 }}>Privacy Policy</Link>
                      </Typography>
                    }
                  />
                  {errors.agreeToTerms && (
                    <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                      {errors.agreeToTerms}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              {errors.general && (
                <Alert severity="error" sx={{ mt: 3, borderRadius: 3 }}>
                  {errors.general}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 6,
                  mb: 3,
                  py: 2,
                  bgcolor: colors.text,
                  color: colors.bg,
                  borderRadius: 5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(74, 62, 49, 0.2)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: isDark ? '#FFF' : '#2D261E',
                    color: isDark ? '#000' : '#FFF',
                    transform: 'translateY(-2px)',
                    boxShadow: isDark ? '0 25px 50px rgba(0,0,0,0.6)' : '0 25px 50px rgba(74, 62, 49, 0.3)',
                  },
                  '&.Mui-disabled': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(74, 62, 49, 0.3)' }
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/student-signin" sx={{
                    color: colors.accent,
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}>
                    Sign In Here
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
