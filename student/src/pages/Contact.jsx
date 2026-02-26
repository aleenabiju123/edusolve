import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    Card,
    CardContent,
    Stack,
    Alert,
    Snackbar,
    IconButton
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    Send as SendIcon,
    Chat as ChatIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';

export default function Contact() {
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
        border: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(197, 160, 89, 0.1)',
        inputBg: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF'
    };

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Feedback submitted:', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <Box sx={{ bgcolor: colors.bg, minHeight: '100vh', color: colors.text, transition: 'all 0.4s ease' }}>
            <Navbar isDark={isDark} onToggleTheme={toggleTheme} />

            <Container maxWidth="lg" sx={{ pt: 12, pb: 15 }}>
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 900, letterSpacing: 2 }}>
                        GET IN TOUCH
                    </Typography>
                    <Typography variant="h2" fontWeight="900" color={colors.text} sx={{ mt: 2, mb: 3, letterSpacing: '-2px' }}>
                        We're Here to <span style={{ color: colors.accent }}>Listen</span>
                    </Typography>
                    <Typography variant="h6" color={colors.textSecondary} sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
                        Have feedback or need assistance? Our support team sends replies to every genuine inquiry within 24 hours.
                    </Typography>
                </Box>

                <Grid container spacing={6}>
                    {/* Contact Info */}
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Stack spacing={4}>
                            <Card sx={{ bgcolor: isDark ? '#1E1E1E' : '#4A3E31', color: 'white', borderRadius: 6, p: 2, border: `1px solid ${colors.border}` }}>
                                <CardContent>
                                    <Typography variant="h5" fontWeight="900" sx={{ mb: 4, color: isDark ? colors.accent : 'white' }}>
                                        Contact Information
                                    </Typography>
                                    <Stack spacing={4}>
                                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 4 }}>
                                                <EmailIcon sx={{ color: colors.accent }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ opacity: 0.7 }}>Email Us</Typography>
                                                <Typography variant="h6" fontWeight="bold">support@edusolve.com</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 4 }}>
                                                <PhoneIcon sx={{ color: colors.accent }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ opacity: 0.7 }}>Call Us</Typography>
                                                <Typography variant="h6" fontWeight="bold">+1 (555) 123-4567</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 4 }}>
                                                <LocationOnIcon sx={{ color: colors.accent }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ opacity: 0.7 }}>Visit Us</Typography>
                                                <Typography variant="h6" fontWeight="bold">EduSolve Campus, Tech District</Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Box sx={{ p: 4, bgcolor: isDark ? 'rgba(197, 160, 89, 0.05)' : 'rgba(197, 160, 89, 0.1)', borderRadius: 6, border: `1px dashed ${colors.accent}` }}>
                                <Typography variant="h6" fontWeight="900" color={colors.text} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ChatIcon color="inherit" sx={{ color: colors.accent }} /> Support Policy
                                </Typography>
                                <Typography variant="body2" color={colors.textSecondary} sx={{ lineHeight: 1.6 }}>
                                    We value your feedback and send replies to all genuine inquiries. Your input helps us build a better campus for everyone.
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Feedback Form */}
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Box component="form" onSubmit={handleSubmit} sx={{
                            p: 6,
                            bgcolor: colors.cardBg,
                            borderRadius: 8,
                            boxShadow: isDark ? '0 40px 80px rgba(0,0,0,0.4)' : '0 40px 80px rgba(0,0,0,0.03)',
                            border: `1px solid ${colors.border}`
                        }}>
                            <Typography variant="h4" fontWeight="900" color={colors.text} sx={{ mb: 4, letterSpacing: '-1px' }}>
                                Send us a Feedback
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: 3, color: colors.text, '& fieldset': { borderColor: colors.border } },
                                            '& .MuiInputLabel-root': { color: colors.textSecondary }
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: 3, color: colors.text, '& fieldset': { borderColor: colors.border } },
                                            '& .MuiInputLabel-root': { color: colors.textSecondary }
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: 3, color: colors.text, '& fieldset': { borderColor: colors.border } },
                                            '& .MuiInputLabel-root': { color: colors.textSecondary }
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Your Feedback / Message"
                                        name="message"
                                        multiline
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: 3, color: colors.text, '& fieldset': { borderColor: colors.border } },
                                            '& .MuiInputLabel-root': { color: colors.textSecondary }
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        endIcon={<SendIcon />}
                                        sx={{
                                            py: 2,
                                            px: 6,
                                            borderRadius: 4,
                                            bgcolor: isDark ? colors.accent : '#4A3E31',
                                            color: isDark ? '#121212' : '#FFFDF5',
                                            fontWeight: 900,
                                            textTransform: 'none',
                                            boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(74, 62, 49, 0.2)',
                                            '&:hover': { bgcolor: isDark ? '#B48F48' : '#2D261E', transform: 'translateY(-2px)' }
                                        }}
                                    >
                                        Send Message
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={submitted}
                autoHideDuration={6000}
                onClose={() => setSubmitted(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSubmitted(false)} severity="success" sx={{ width: '100%', borderRadius: 3 }}>
                    Thank you for your feedback! We will get back to you soon.
                </Alert>
            </Snackbar>
        </Box>
    );
}
