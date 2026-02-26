import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  Fade,
  Grow,
  Divider,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  DeleteOutline as DeleteIcon,
  ReportProblem as ComplaintIcon,
  EventNote as DateIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';

export default function ComplaintForm() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const colors = {
    bg: isDark ? '#121212' : '#FFFDF5',
    cardBg: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.6)',
    text: isDark ? '#FFFDF5' : '#4A3E31',
    textSecondary: isDark ? 'rgba(255, 252, 245, 0.6)' : '#6B5E4F',
    accent: '#C5A059',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(197, 160, 89, 0.15)',
    inputBg: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.4)',
    inputFocusBg: isDark ? 'rgba(255, 255, 255, 0.07)' : 'white'
  };

  const authData = JSON.parse(localStorage.getItem('studentAuthData') || '{}');
  const { studentId, fullName, email: authEmail } = authData;

  // Get email from authData or localStorage
  const email = authEmail || fullName?.toLowerCase().replace(/\s+/g, '.') + '@student.edu';

  const [formData, setFormData] = useState({
    studentName: fullName || 'Student',
    complaintDate: new Date().toISOString().split('T')[0],
    complaintTime: new Date().toLocaleTimeString('it-IT').slice(0, 5),
    description: '',
    category: 'Academic',
    feedback: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const removeAttachment = () => setAttachment(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId) {
      setMessageType('error');
      setMessage('Error: User ID not found. Please login again.');
      return;
    }

    if (!formData.description) {
      setMessageType('error');
      setMessage('Please describe your complaint');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('studentId', studentId);
      data.append('studentName', formData.studentName);
      data.append('email', email);
      data.append('complaintDate', formData.complaintDate);
      data.append('complaintTime', formData.complaintTime);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('feedback', formData.feedback);

      if (attachment) {
        data.append('attachment', attachment);
      }

      const response = await axios.post(
        'http://localhost:2000/api/complaints/register',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        setMessageType('success');
        setMessage('Your request has been filed securely. Redirecting...');
        setTimeout(() => navigate('/student'), 2000);
      }
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 4,
      backgroundColor: colors.inputBg,
      transition: 'all 0.3s',
      color: colors.text,
      "&:hover": { backgroundColor: colors.inputFocusBg },
      "&.Mui-focused": { backgroundColor: colors.inputFocusBg, boxShadow: isDark ? '0 8px 20px rgba(0,0,0,0.3)' : '0 8px 20px rgba(74, 62, 49, 0.08)' },
      "& fieldset": { borderColor: colors.border },
      "&:hover fieldset": { borderColor: colors.accent },
      "&.Mui-focused fieldset": { borderColor: colors.accent, borderWidth: '1px' },
    },
    "& .MuiInputLabel-root": { color: colors.textSecondary, fontWeight: 600 },
    "& .MuiInputLabel-root.Mui-focused": { color: colors.text }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: colors.bg,
      background: isDark ? 'none' : 'linear-gradient(135deg, #FFFDF5 0%, #F9F3EA 100%)',
      py: { xs: 4, md: 8 },
      px: 2,
      transition: 'all 0.4s ease'
    }}>
      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/student')}
                sx={{
                  color: colors.text,
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': { bgcolor: `${colors.text}08` }
                }}
              >
                Return to Dashboard
              </Button>

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

            <Paper elevation={0} sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 8,
              bgcolor: colors.cardBg,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              boxShadow: isDark ? '0 40px 100px rgba(0,0,0,0.3)' : '0 40px 100px rgba(0,0,0,0.04)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative Header */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: `linear-gradient(90deg, ${colors.text} 0%, ${colors.accent} 100%)`
              }} />

              <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Box sx={{
                  width: 60, height: 60,
                  bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFDF5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.3)' : '0 10px 25px rgba(197, 160, 89, 0.15)',
                  border: `1px solid ${colors.border}`
                }}>
                  <ComplaintIcon sx={{ color: colors.accent, fontSize: 32 }} />
                </Box>
                <Typography variant="h4" fontWeight="900" color={colors.text} gutterBottom sx={{ letterSpacing: -1 }}>
                  Submit Formal Request
                </Typography>
                <Typography variant="body1" color={colors.textSecondary} sx={{ opacity: 0.8 }}>
                  Provide the details below to initiate a resolution protocol.
                </Typography>
              </Box>

              {message && (
                <Grow in={true}>
                  <Alert
                    severity={messageType}
                    sx={{
                      mb: 4,
                      borderRadius: 4,
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: messageType === 'success' ? (isDark ? 'rgba(129, 199, 132, 0.2)' : '#2E7D3230') : (isDark ? 'rgba(229, 115, 115, 0.2)' : '#d32f2f30'),
                      bgcolor: messageType === 'success' ? (isDark ? 'rgba(129, 199, 132, 0.05)' : '#edf7ed') : (isDark ? 'rgba(229, 115, 115, 0.05)' : '#fdeded'),
                      color: messageType === 'success' ? (isDark ? '#81C784' : '#1e4620') : (isDark ? '#e57373' : '#5f2120')
                    }}
                  >
                    {message}
                  </Alert>
                </Grow>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Originator Name"
                      name="studentName"
                      value={formData.studentName}
                      disabled
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Event Date"
                      name="complaintDate"
                      value={formData.complaintDate}
                      onChange={handleInputChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <DateIcon sx={{ mr: 1, color: '#C5A059', fontSize: 20 }} /> }}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Event Time"
                      name="complaintTime"
                      value={formData.complaintTime}
                      onChange={handleInputChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ startAdornment: <TimeIcon sx={{ mr: 1, color: '#C5A059', fontSize: 20 }} /> }}
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth required sx={fieldStyle}>
                      <InputLabel>Request Category</InputLabel>
                      <Select
                        label="Request Category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        startAdornment={<CategoryIcon sx={{ mr: 1, color: '#C5A059', fontSize: 20, ml: 1 }} />}
                      >
                        <MenuItem value="Academic">Academic Affairs</MenuItem>
                        <MenuItem value="Infrastructure">Infrastructure & Facilities</MenuItem>
                        <MenuItem value="Exam">Examination & Grading</MenuItem>
                        <MenuItem value="Other">Miscellaneous Issues</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Detailed Description"
                      name="description"
                      placeholder="Describe the situation in detail..."
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      sx={fieldStyle}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box sx={{
                      p: 3,
                      borderRadius: 4,
                      border: `2px dashed ${colors.border}`,
                      bgcolor: colors.inputBg,
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      '&:hover': { borderColor: colors.accent, bgcolor: colors.inputFocusBg }
                    }}>
                      {!attachment ? (
                        <Box>
                          <Button
                            variant="text"
                            component="label"
                            startIcon={<AttachFileIcon />}
                            sx={{ color: colors.text, fontWeight: 700 }}
                          >
                            Attach Supporting Documentation
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </Button>
                          <Typography variant="caption" display="block" color="#A89E94">
                            Max size: 5MB (JPG, PNG)
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                          <Chip
                            label={attachment.name}
                            onDelete={removeAttachment}
                            deleteIcon={<DeleteIcon />}
                            sx={{
                              bgcolor: '#4A3E31',
                              color: 'white',
                              fontWeight: 600,
                              borderRadius: 2,
                              '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                      disabled={loading}
                      size="large"
                      sx={{
                        mt: 2,
                        py: 2,
                        bgcolor: colors.text,
                        color: colors.bg,
                        borderRadius: 4,
                        fontWeight: 900,
                        fontSize: '1rem',
                        textTransform: 'none',
                        letterSpacing: 0.5,
                        boxShadow: isDark ? '0 15px 35px rgba(0,0,0,0.4)' : '0 15px 35px rgba(74, 62, 49, 0.25)',
                        transition: 'all 0.3s',
                        '&:hover': { bgcolor: isDark ? '#FFF' : '#2D261E', transform: 'translateY(-3px)', boxShadow: isDark ? '0 20px 45px rgba(0,0,0,0.6)' : '0 20px 45px rgba(74, 62, 49, 0.3)' },
                        '&.Mui-disabled': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(74, 62, 49, 0.3)' }
                      }}
                    >
                      {loading ? 'Processing Submission...' : 'Finalise Submission'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}