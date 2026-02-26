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
    Link,
    Stepper,
    Step,
    StepLabel,
    InputAdornment,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    ArrowBack,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon
} from '@mui/icons-material';

export default function ForgotPassword() {
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

    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const steps = ['Identify Account', 'Verify OTP', 'Reset Password'];

    const validateEmail = () => {
        return email.trim().length > 0;
    };

    const validateOtp = () => {
        return otp.trim().length === 6;
    };

    const validatePassword = () => {
        if (password.length < 6) return false;
        if (password !== confirmPassword) return false;
        return true;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!validateEmail()) {
            setError('Please enter your Email or Admission Number');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:2000/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to generate OTP');
            }

            setSuccess(data.message);
            setActiveStep(1);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (!validateOtp()) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setSuccess('');
        setError('');
        setActiveStep(2);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validatePassword()) {
            if (password.length < 6) setError('Password must be at least 6 characters');
            else setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:2000/api/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    otp: otp.trim(),
                    newPassword: password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setSuccess(data.message);
            setTimeout(() => {
                navigate('/student-signin');
            }, 3000);

        } catch (err) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = (step) => {
        const fieldStyle = {
            '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                color: colors.text,
                '& fieldset': { borderColor: colors.border },
                '&:hover fieldset': { borderColor: colors.accent },
                '&.Mui-focused fieldset': { borderColor: colors.accent }
            },
            '& .MuiInputLabel-root': { color: colors.textSecondary },
            '& .MuiInputLabel-root.Mui-focused': { color: colors.text }
        };

        const btnStyle = {
            mt: 3, mb: 2, py: 1.5,
            bgcolor: colors.text,
            color: colors.bg,
            borderRadius: 3,
            fontWeight: 'bold',
            boxShadow: isDark ? '0 10px 20px rgba(0,0,0,0.4)' : '0 10px 20px rgba(74, 62, 49, 0.2)',
            transform: 'translateY(0)',
            transition: 'all 0.3s',
            '&:hover': {
                bgcolor: isDark ? '#FFF' : '#2D261E',
                color: isDark ? '#000' : '#FFF',
                transform: 'translateY(-2px)',
                boxShadow: isDark ? '0 15px 30px rgba(0,0,0,0.5)' : '0 15px 30px rgba(74, 62, 49, 0.3)'
            },
            '&.Mui-disabled': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(74, 62, 49, 0.3)' }
        };

        switch (step) {
            case 0:
                return (
                    <Box component="form" onSubmit={handleSendOtp} sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 2 }}>
                            Enter your registered Email or Admission Number to receive an OTP.
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email or Admission Number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            autoFocus
                            sx={fieldStyle}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={btnStyle}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                        </Button>
                        <Alert severity="info" sx={{ mt: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(2, 136, 209, 0.1)' : undefined }}>
                            Note: Since this is a demo, the OTP will be displayed in the server console/terminal.
                        </Alert>
                    </Box>
                );
            case 1:
                return (
                    <Box component="form" onSubmit={handleVerifyOtp} sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 2 }}>
                            Enter the 6-digit OTP sent to your email/console.
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={isLoading}
                            autoFocus
                            inputProps={{ maxLength: 6 }}
                            sx={fieldStyle}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={btnStyle}
                            disabled={isLoading}
                        >
                            Verify OTP
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => setActiveStep(0)}
                            disabled={isLoading}
                            sx={{ color: colors.accent, fontWeight: 700 }}
                        >
                            Back
                        </Button>
                    </Box>
                );
            case 2:
                return (
                    <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 2 }}>
                            Create a new password for your account.
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            sx={fieldStyle}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            error={password !== confirmPassword && confirmPassword.length > 0}
                            helperText={password !== confirmPassword && confirmPassword.length > 0 ? "Passwords do not match" : ""}
                            sx={fieldStyle}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={btnStyle}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
                        </Button>
                    </Box>
                );
            default:
                return null;
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

            <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
                            p: { xs: 3, sm: 4 },
                            width: '100%',
                            borderRadius: 6,
                            bgcolor: colors.cardBg,
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${colors.border}`,
                            boxShadow: isDark ? '0 40px 80px rgba(0,0,0,0.4)' : '0 40px 80px rgba(0,0,0,0.05)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <IconButton
                                component={RouterLink}
                                to="/student-signin"
                                sx={{
                                    mr: 2,
                                    color: colors.accent,
                                    bgcolor: isDark ? 'rgba(197, 160, 89, 0.1)' : 'rgba(197, 160, 89, 0.05)',
                                    '&:hover': { bgcolor: isDark ? 'rgba(197, 160, 89, 0.2)' : 'rgba(197, 160, 89, 0.1)' }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Box>
                                <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2, display: 'block', mb: -0.5 }}>
                                    SECURITY
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: colors.text, letterSpacing: '-0.5px' }}>
                                    Reset Password
                                </Typography>
                            </Box>
                        </Box>

                        <Stepper activeStep={activeStep} alternativeLabel sx={{
                            mb: 4,
                            '& .MuiStepLabel-label': { color: colors.textSecondary },
                            '& .MuiStepLabel-label.Mui-active': { color: colors.accent, fontWeight: 900 },
                            '& .MuiStepLabel-label.Mui-completed': { color: colors.text },
                            '& .MuiStepIcon-root': { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
                            '& .MuiStepIcon-root.Mui-active': { color: colors.accent },
                            '& .MuiStepIcon-root.Mui-completed': { color: colors.accent },
                            '& .MuiStepConnector-line': { borderColor: colors.border }
                        }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
                                {success}
                            </Alert>
                        )}

                        {renderStepContent(activeStep)}
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}
