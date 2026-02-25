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
    Paper,
    Link,
    Stepper,
    Step,
    StepLabel,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';

export default function ForgotPassword() {
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
        // In this simulation flow, we don't verify OTP separately with the backend yet (unless we added a dedicated verify-otp endpoint).
        // The reset-password endpoint handles verification. 
        // So for UI flow, we just check if it looks valid and move to next step.

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
            // Wait a moment then redirect to login
            setTimeout(() => {
                navigate('/student-signin');
            }, 3000);

        } catch (err) {
            setError(err.message || 'Failed to reset password');
            // If OTP invalid, maybe go back a step?
            if (err.message.includes('OTP')) {
                // stay here or go back? user might want to retry with same OTP or request new one
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box component="form" onSubmit={handleSendOtp} sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
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
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                        </Button>
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Note: Since this is a demo, the OTP will be displayed in the server console/terminal.
                        </Alert>
                    </Box>
                );
            case 1:
                return (
                    <Box component="form" onSubmit={handleVerifyOtp} sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
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
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            Verify OTP
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => setActiveStep(0)}
                            disabled={isLoading}
                        >
                            Back
                        </Button>
                    </Box>
                );
            case 2:
                return (
                    <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
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
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
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
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
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
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton component={RouterLink} to="/student-signin" sx={{ mr: 1 }}>
                            <ArrowBack />
                        </IconButton>
                        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
                            Reset Password
                        </Typography>
                    </Box>

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    {renderStepContent(activeStep)}

                </Paper>
            </Box>
        </Container>
    );
}
