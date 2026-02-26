import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Paper,
  Stack,
  CircularProgress,
  IconButton,
  Avatar,
  Popover,
  Tooltip,
  TextField,
  Alert,
  Collapse,
  InputAdornment,
  ListItemButton,
  Grow,
  Fade
} from '@mui/material';
import {
  ExitToApp as LogoutIcon,
  AddCircleOutline as AddIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  ReportProblem as ComplaintIcon,
  EventNote as DateIcon,
  PriorityHigh as PriorityIcon,
  Notes as NotesIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  LockReset as LockResetIcon,
  Visibility,
  VisibilityOff,
  ExpandMore as ExpandMoreIcon,
  CheckCircleOutline as SuccessIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';

const drawerWidth = 240;

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const c = {
    accent: '#C5A059',
    accentLight: '#D4B87E',
    bgPrimary: isDark ? '#121212' : '#FFFDF5',
    bgSecondary: isDark ? '#1E1E1E' : '#FFFFFF',
    textPrimary: isDark ? '#FFFDF5' : '#4A3E31',
    textSecondary: isDark ? 'rgba(255, 252, 245, 0.6)' : '#6B5E4F',
    textMuted: isDark ? 'rgba(255, 252, 245, 0.35)' : '#A89E94',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(197, 160, 89, 0.15)',
    glassBg: isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 253, 245, 0.8)',
    glassBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(197, 160, 89, 0.2)',
    sidebarBg: isDark ? ['#1E1E1E', '#121212'] : ['#FFFFFF', '#FFFDF5'],
    cardShadow: isDark ? '0 20px 50px rgba(0,0,0,0.5)' : '0 20px 50px rgba(197, 160, 89, 0.08)',

    // Status Gradients
    gradGold: 'linear-gradient(135deg, #C5A059 0%, #8E6E36 100%)',
    gradDark: 'linear-gradient(135deg, #4A3E31 0%, #2D261E 100%)',
    gradEmerald: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
    gradRose: 'linear-gradient(135deg, #FF5252 0%, #D32F2F 100%)',
  };

  const glassCardSx = {
    bgcolor: c.glassBg,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${c.glassBorder}`,
    borderRadius: 6,
    boxShadow: c.cardShadow,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const authData = JSON.parse(localStorage.getItem('studentAuthData') || '{}');
  const { studentId, admissionNumber, fullName, department } = authData;
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwData, setPwData] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleProfileOpen = (e) => setProfileAnchorEl(e.currentTarget);
  const handleProfileClose = () => {
    setProfileAnchorEl(null);
    setShowPwForm(false);
    setPwData({ current: '', newPw: '', confirm: '' });
    setPwError('');
    setPwSuccess(false);
  };
  const profileOpen = Boolean(profileAnchorEl);

  const handlePasswordChange = async () => {
    setPwError('');
    if (!pwData.current) return setPwError('Current password is required.');
    if (pwData.newPw.length < 6) return setPwError('New password must be at least 6 characters.');
    if (pwData.newPw !== pwData.confirm) return setPwError('Passwords do not match.');
    setPwLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:2000/api/users/change-password`,
        { email: authData.email, currentPassword: pwData.current, newPassword: pwData.newPw }
      );
      if (response.data.success) {
        setPwSuccess(true);
        setPwData({ current: '', newPw: '', confirm: '' });
        setTimeout(() => { setShowPwForm(false); setPwSuccess(false); }, 2500);
      } else {
        setPwError(response.data.message || 'Failed to update password.');
      }
    } catch (err) {
      setPwError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (studentId) {
      fetchComplaints();
    }
  }, [studentId]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:2000/api/complaints/student/${studentId}`
      );
      if (response.data.success) {
        setComplaints(response.data.complaints);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentAuthData');
    navigate('/');
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Registered': return '#C5A059'; // Bronze
      case 'Pending': return '#4A3E31'; // Dark Brown
      case 'Resolved': return '#2E7D32'; // Green
      default: return '#6B5E4F';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Registered': return <AssignmentIcon sx={{ color: '#C5A059' }} />;
      case 'Pending': return <PendingIcon sx={{ color: '#4A3E31' }} />;
      case 'Resolved': return <CheckCircleIcon sx={{ color: '#2E7D32' }} />;
      default: return <AssignmentIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#d32f2f';
      case 'Medium': return '#C5A059';
      case 'Low': return '#2E7D32';
      default: return '#6B5E4F';
    }
  };

  const drawerContent = (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: `linear-gradient(180deg, ${c.sidebarBg[0]} 0%, ${c.sidebarBg[1]} 100%)`,
      borderRight: `1px solid ${c.glassBorder}`
    }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 2.5,
          background: c.gradGold,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 15px ${c.accent}40`
        }}>
          <DashboardIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight="900" sx={{ color: c.textPrimary, letterSpacing: '-0.5px' }}>
          EduSolve
        </Typography>
      </Box>

      <Divider sx={{ opacity: 0.1, borderColor: c.glassBorder }} />

      <Box sx={{ p: 3.5, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Tooltip title="Student Profile" placement="right">
            <Avatar
              onClick={handleProfileOpen}
              sx={{
                width: 88, height: 88, mx: 'auto', mb: 2.5,
                p: 0.5,
                bgcolor: 'transparent',
                background: `linear-gradient(45deg, ${c.accent}, ${c.accentLight})`,
                boxShadow: `0 12px 30px ${c.accent}30`,
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': { transform: 'scale(1.05) rotate(5deg)', boxShadow: `0 15px 40px ${c.accent}50` }
              }}
            >
              <Avatar
                sx={{ width: '100%', height: '100%', bgcolor: c.bgSecondary, color: c.accent }}
              >
                <PersonIcon sx={{ fontSize: 44 }} />
              </Avatar>
            </Avatar>
          </Tooltip>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, lineHeight: 1.2 }}>{fullName || 'Student'}</Typography>
        <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mt: 0.5, display: 'block' }}>
          {department}
        </Typography>
      </Box>

      <List sx={{ px: 2, mt: 1 }}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
          { id: 'complaints', label: 'View Complaints', icon: <AssignmentIcon /> },
          { id: 'profile', label: 'My Profile', icon: <PersonIcon /> },
        ].map((item) => (
          <ListItem disablePadding key={item.id} sx={{ mb: 1.5 }}>
            <ListItemButton
              onClick={() => {
                setActiveTab(item.id);
                setSelectedComplaint(null);
                setMobileOpen(false);
                if (item.id === 'complaints') setStatusFilter('all');
              }}
              sx={{
                borderRadius: 3,
                py: 1.5,
                bgcolor: activeTab === item.id ? `${c.accent}12` : 'transparent',
                color: activeTab === item.id ? c.accent : c.textSecondary,
                transition: '0.3s',
                '&:hover': { bgcolor: `${c.accent}08`, color: c.accent },
                '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 40 }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: activeTab === item.id ? 800 : 500, fontSize: 14 }} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 1.5, opacity: 0.1, borderColor: c.glassBorder }} />

        <ListItem disablePadding sx={{ mb: 1.5 }}>
          <ListItemButton
            onClick={() => { navigate('/complaint'); setMobileOpen(false); }}
            sx={{
              borderRadius: 3,
              py: 1.5,
              background: c.gradGold,
              color: 'white',
              boxShadow: `0 8px 20px ${c.accent}30`,
              transition: 'all 0.3s',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 12px 25px ${c.accent}50` },
              '& .MuiListItemIcon-root': { color: 'white', minWidth: 40 }
            }}
          >
            <ListItemIcon><AddIcon /></ListItemIcon>
            <ListItemText primary="Report Issue" primaryTypographyProps={{ fontWeight: 800, fontSize: 14 }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ mt: 'auto', p: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            borderColor: c.glassBorder,
            color: c.textSecondary,
            textTransform: 'none',
            fontWeight: 700,
            py: 1.2,
            transition: 'all 0.2s',
            '&:hover': { borderColor: c.gradRose, color: '#D32F2F', bgcolor: 'rgba(211, 47, 47, 0.05)' }
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  const profileCard = (
    <Popover
      open={profileOpen}
      anchorEl={profileAnchorEl}
      onClose={handleProfileClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      PaperProps={{
        sx: {
          ml: 2,
          width: 320,
          borderRadius: 5,
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
          border: '1px solid rgba(197, 160, 89, 0.15)'
        }
      }}
    >
      {/* Header Banner */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4A3E31 0%, #2D261E 100%)',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        <Avatar sx={{
          width: 72, height: 72,
          bgcolor: 'rgba(197, 160, 89, 0.2)',
          border: '3px solid #C5A059',
          color: '#C5A059',
          mb: 1.5
        }}>
          <PersonIcon sx={{ fontSize: 36 }} />
        </Avatar>
        <Typography variant="h6" fontWeight="900" sx={{ color: 'white', letterSpacing: '-0.3px' }}>
          {fullName || 'Student'}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
          {authData.email || ''}
        </Typography>
        <Chip
          label="Active Student"
          size="small"
          sx={{ mt: 1.5, bgcolor: 'rgba(197, 160, 89, 0.2)', color: '#C5A059', fontWeight: 700, border: '1px solid rgba(197,160,89,0.3)' }}
        />
      </Box>

      {/* Details */}
      <Box sx={{ bgcolor: isDark ? c.bgSecondary : '#FFFDF5', p: 2.5 }}>
        {[
          { label: 'Student ID', value: studentId, icon: '🪪' },
          { label: 'Admission No.', value: admissionNumber, icon: '📋' },
          { label: 'Department', value: department, icon: '🏛️' },
          { label: 'Email', value: authData.email, icon: '✉️' },
          { label: 'Phone', value: authData.phoneNumber || 'Not provided', icon: '📱' },
        ].map((item) => (
          <Box key={item.label} sx={{
            display: 'flex', alignItems: 'flex-start', gap: 1.5,
            py: 1.2, borderBottom: `1px solid ${c.border}`,
            '&:last-child': { borderBottom: 'none' }
          }}>
            <Typography sx={{ fontSize: 16, mt: 0.1 }}>{item.icon}</Typography>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: '#A89E94', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {item.label}
              </Typography>
              <Typography variant="body2" fontWeight="700" sx={{ color: c.textPrimary, wordBreak: 'break-all' }}>
                {item.value || '—'}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Change Password Section */}
      <Box sx={{ bgcolor: c.bgSecondary, borderTop: `1px solid ${c.border}` }}>
        <Button
          fullWidth
          onClick={() => { setShowPwForm(v => !v); setPwError(''); setPwSuccess(false); }}
          startIcon={<LockResetIcon />}
          endIcon={<ExpandMoreIcon sx={{ transform: showPwForm ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />}
          sx={{
            justifyContent: 'flex-start',
            px: 2.5, py: 1.5,
            color: c.textPrimary,
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'none',
            '&:hover': { bgcolor: `${c.accent}08` }
          }}
        >
          Set New Password
        </Button>

        <Collapse in={showPwForm} timeout="auto">
          <Box sx={{ px: 2.5, pb: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {pwSuccess && (
              <Alert
                icon={<SuccessIcon fontSize="small" />}
                severity="success"
                sx={{ borderRadius: 3, fontSize: '0.8rem', py: 0.5 }}
              >
                Password updated successfully!
              </Alert>
            )}
            {pwError && (
              <Alert severity="error" sx={{ borderRadius: 3, fontSize: '0.8rem', py: 0.5 }}>
                {pwError}
              </Alert>
            )}
            {[
              { key: 'current', label: 'Current Password' },
              { key: 'newPw', label: 'New Password' },
              { key: 'confirm', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <TextField
                key={key}
                fullWidth
                size="small"
                label={label}
                type={showPw[key] ? 'text' : 'password'}
                value={pwData[key]}
                onChange={e => setPwData(prev => ({ ...prev, [key]: e.target.value }))}
                disabled={pwLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPw(prev => ({ ...prev, [key]: !prev[key] }))}
                        sx={{ color: c.accent }}
                      >
                        {showPw[key] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    color: c.textPrimary,
                    '& fieldset': { borderColor: c.border },
                    '&:hover fieldset': { borderColor: c.accent },
                  },
                  '& .MuiInputLabel-root': { color: c.textSecondary },
                  '& .MuiInputLabel-root.Mui-focused': { color: c.textPrimary }
                }}
              />
            ))}
            <Button
              fullWidth
              variant="contained"
              onClick={handlePasswordChange}
              disabled={pwLoading}
              sx={{
                mt: 0.5,
                py: 1.2,
                bgcolor: c.textPrimary,
                color: c.bgPrimary,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: `0 6px 16px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(74,62,49,0.2)'}`,
                '&:hover': { bgcolor: isDark ? '#FFF' : '#2D261E', color: isDark ? '#000' : '#FFF' }
              }}
            >
              {pwLoading ? <CircularProgress size={18} color="inherit" /> : 'Update Password'}
            </Button>
          </Box>
        </Collapse>
      </Box>

      {/* Footer action */}
      <Box sx={{ p: 2, bgcolor: isDark ? c.bgSecondary : '#FFFDF5', borderTop: `1px solid ${c.border}` }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={() => { handleProfileClose(); handleLogout(); }}
          sx={{
            borderRadius: 3,
            borderColor: c.border,
            color: c.textPrimary,
            fontWeight: 700,
            '&:hover': { borderColor: c.textPrimary, bgcolor: `${c.textPrimary}04` }
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Popover>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: c.bgPrimary, minHeight: '100vh', transition: 'all 0.4s ease' }}>
      {profileCard}
      <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: c.glassBg,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${c.glassBorder}`,
        color: c.textPrimary,
        boxShadow: 'none',
        transition: 'all 0.4s ease'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2.5, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.3px', fontSize: 18 }}>
                Command Center
              </Typography>
              <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: 11 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: c.textPrimary,
                  bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${c.glassBorder}`,
                  transition: 'all 0.3s ease',
                  '&:hover': { color: c.accent, borderColor: c.accent, bgcolor: `${c.accent}10` }
                }}
              >
                {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
              </IconButton>
            </Tooltip>

            <Tooltip title="View Profile">
              <IconButton onClick={handleProfileOpen} sx={{ p: 0.5, border: '2px solid transparent', transition: '0.3s', '&:hover': { borderColor: c.accentLight } }}>
                <Avatar sx={{
                  width: 34, height: 34,
                  background: c.gradGold,
                  fontSize: 14, fontWeight: 800
                }}>{fullName?.charAt(0)}</Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none', bgcolor: 'transparent' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 5 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />

        <Box sx={{ mt: 2 }}>
          {activeTab === 'dashboard' && (
            <Fade in timeout={600}>
              <Box>
                {/* Summary Stats */}
                <Grid container spacing={4} sx={{ mb: 6, mt: 2 }}>
                  {[
                    { id: 'all', label: 'Total Records', val: complaints.length, icon: <AssignmentIcon />, grad: c.gradDark, accent: c.textMuted },
                    { id: 'Registered', label: 'Recently Filed', val: complaints.filter(c => c.status === 'Registered').length, icon: <AddIcon />, grad: c.gradGold, accent: c.accent },
                    { id: 'Pending', label: 'In Progress', val: complaints.filter(c => c.status === 'Pending').length, icon: <PendingIcon />, grad: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)', accent: '#1E88E5' },
                    { id: 'Resolved', label: 'Resolved Success', val: complaints.filter(c => c.status === 'Resolved').length, icon: <CheckCircleIcon />, grad: c.gradEmerald, accent: '#43A047' },
                  ].map((stat, i) => (
                    <Grid key={i} size={{ xs: 6, sm: 6, md: 3 }}>
                      <Grow in timeout={500 + i * 200}>
                        <Card sx={{
                          ...glassCardSx,
                          p: 0, overflow: 'hidden',
                          position: 'relative',
                          cursor: 'pointer',
                          '&::after': {
                            content: '""', position: 'absolute', top: -20, right: -20, width: 80, height: 80,
                            borderRadius: '50%', background: `${stat.accent}15`, filter: 'blur(20px)'
                          }
                        }}>
                          <CardActionArea
                            onClick={() => {
                              setStatusFilter(stat.id);
                              setActiveTab('complaints');
                            }}
                            sx={{ p: 3 }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Box sx={{
                                p: 1.5, borderRadius: 2.5, background: stat.grad,
                                display: 'flex', boxShadow: `0 8px 20px ${stat.accent}30`
                              }}>
                                {React.cloneElement(stat.icon, { sx: { color: 'white', fontSize: 24 } })}
                              </Box>
                              <Typography variant="h4" sx={{ fontWeight: 900, color: c.textPrimary, letterSpacing: '-1px' }}>{stat.val}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: c.textSecondary, fontWeight: 700, textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5 }}>
                              {stat.label}
                            </Typography>
                          </CardActionArea>
                        </Card>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>

                <Fade in timeout={1200}>
                  <Paper elevation={0} sx={{ ...glassCardSx, p: 4, textAlign: 'center', bgcolor: `${c.accent}05` }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, mb: 1 }}>Welcome to your Command Center</Typography>
                    <Typography variant="body2" sx={{ color: c.textSecondary }}>Select a summary card above or use the navigation menu to manage your requests and profile details.</Typography>
                  </Paper>
                </Fade>
              </Box>
            </Fade>
          )}

          {activeTab === 'complaints' && (
            <Grid container spacing={4}>
              {/* Complaints List */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Fade in timeout={1000}>
                  <Paper elevation={0} sx={{
                    ...glassCardSx, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 340px)'
                  }}>
                    <Box sx={{ p: 3, borderBottom: `1px solid ${c.glassBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary }}>Timeline Updates</Typography>
                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700 }}>
                          {statusFilter === 'all' ? 'Showing all' : `Filtered: ${statusFilter === 'Pending' ? 'In Progress' : statusFilter}`}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => setStatusFilter('all')} sx={{ color: c.accent }}>
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <List sx={{ overflowY: 'auto', p: 0 }}>
                      {loading ? (
                        <Box sx={{ p: 6, textAlign: 'center' }}><CircularProgress size={28} sx={{ color: c.accent }} /></Box>
                      ) : complaints.filter(c => statusFilter === 'all' || c.status === statusFilter).length === 0 ? (
                        <Box sx={{ p: 6, textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: c.textSecondary, fontWeight: 600 }}>No entries found.</Typography>
                        </Box>
                      ) : (
                        complaints
                          .filter(c => statusFilter === 'all' || c.status === statusFilter)
                          .map((complaint) => (
                            <ListItem
                              key={complaint._id}
                              disablePadding
                              sx={{
                                borderBottom: `1px solid ${c.glassBorder}`,
                                bgcolor: selectedComplaint?._id === complaint._id ? `${c.accent}12` : 'transparent',
                                transition: '0.2s'
                              }}
                            >
                              <CardActionArea sx={{ p: 3 }} onClick={() => setSelectedComplaint(complaint)}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: c.textPrimary, lineHeight: 1.3 }}>{complaint.category}</Typography>
                                  <Box sx={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    bgcolor: getStatusColor(complaint.status),
                                    boxShadow: `0 0 10px ${getStatusColor(complaint.status)}`
                                  }} />
                                </Box>
                                <Typography variant="body2" sx={{ color: c.textSecondary, mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: 13 }}>
                                  {complaint.description}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Chip size="small" label={complaint.status === 'Pending' ? 'In Progress' : complaint.status}
                                    sx={{ height: 20, fontSize: 10, fontWeight: 800, bgcolor: `${getStatusColor(complaint.status)}15`, color: getStatusColor(complaint.status), border: `1px solid ${getStatusColor(complaint.status)}40` }} />
                                  <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700 }}>
                                    {new Date(complaint.registeredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </Typography>
                                </Box>
                              </CardActionArea>
                            </ListItem>
                          ))
                      )}
                    </List>
                  </Paper>
                </Fade>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                {selectedComplaint ? (
                  <Fade in key={selectedComplaint._id} timeout={600}>
                    <Paper elevation={0} sx={{
                      ...glassCardSx, p: { xs: 3, md: 5 }, minHeight: 'calc(100vh - 340px)'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
                        <Box>
                          <Typography variant="overline" sx={{ color: c.accent, fontWeight: 900, fontSize: 11, letterSpacing: 2 }}>
                            PROTOCOL CASE DETAILED
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: c.textPrimary, mt: 0.5, letterSpacing: '-1px' }}>
                            {selectedComplaint.category}
                          </Typography>
                          <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 700 }}>
                            ID REF: {selectedComplaint._id.toUpperCase()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                          <Chip
                            label={selectedComplaint.status === 'Pending' ? 'In Progress' : selectedComplaint.status}
                            sx={{
                              background: getStatusColor(selectedComplaint.status) + '15',
                              color: getStatusColor(selectedComplaint.status),
                              fontWeight: 900,
                              border: `1px solid ${getStatusColor(selectedComplaint.status)}40`,
                              borderRadius: 2
                            }}
                          />
                          <Chip
                            label={`${selectedComplaint.priority || 'Medium'} Priority`}
                            size="small"
                            sx={{ fontWeight: 800, fontSize: 10, bgcolor: `${getPriorityColor(selectedComplaint.priority)}15`, color: getPriorityColor(selectedComplaint.priority) }}
                          />
                        </Box>
                      </Box>

                      <Grid container spacing={4}>
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="subtitle2" sx={{ color: c.accent, fontWeight: 800, mb: 1, textTransform: 'uppercase', fontSize: 11 }}>Report Overview</Typography>
                          <Typography variant="body1" sx={{ color: c.textPrimary, lineHeight: 1.8, fontSize: 15, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', p: 3, borderRadius: 3 }}>
                            {selectedComplaint.description}
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                          <Box sx={{ p: 2, borderRadius: 3, border: `1px solid ${c.glassBorder}`, bgcolor: `${c.accent}05` }}>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, display: 'block', mb: 0.5 }}>Submission Date</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary }}>{formatDate(selectedComplaint.registeredAt)}</Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                          <Box sx={{ p: 2, borderRadius: 3, border: `1px solid ${c.glassBorder}`, bgcolor: `${c.accent}05` }}>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, display: 'block', mb: 0.5 }}>Assigned Department</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: c.textPrimary }}>{selectedComplaint.department || 'General'}</Typography>
                          </Box>
                        </Grid>

                        {selectedComplaint.attachment && (
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" sx={{ color: c.accent, fontWeight: 800, mb: 2, textTransform: 'uppercase', fontSize: 11 }}>Visual Evidence</Typography>
                            <Box sx={{ borderRadius: 6, overflow: 'hidden', border: `4px solid ${c.glassBorder}`, boxShadow: c.cardShadow }}>
                              <Box
                                component="img"
                                src={`http://localhost:2000/${selectedComplaint.attachment.replace(/\\/g, '/')}`}
                                alt="Attachment proof"
                                sx={{ width: '100%', maxHeight: 450, objectFit: 'contain', bgcolor: isDark ? '#000' : '#f9f9f9', display: 'block' }}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Attachment+Unavailable' }}
                              />
                            </Box>
                          </Grid>
                        )}

                        {selectedComplaint.subAdminNotes && (
                          <Grid size={{ xs: 12 }}>
                            <Box sx={{ p: 4, borderRadius: 5, background: c.gradEmerald, color: 'white', boxShadow: '0 15px 40px rgba(46, 125, 50, 0.3)' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                <CheckCircleIcon sx={{ fontSize: 22 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Resolution Updates</Typography>
                              </Box>
                              <Typography variant="body2" sx={{ lineHeight: 1.8, opacity: 0.95, fontWeight: 500 }}>
                                {selectedComplaint.subAdminNotes}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Fade>
                ) : (
                  <Fade in timeout={800}>
                    <Paper elevation={0} sx={{
                      ...glassCardSx, background: 'transparent', borderStyle: 'dashed',
                      height: '100%', minHeight: 'calc(100vh - 340px)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4
                    }}>
                      <Box sx={{
                        width: 80, height: 80, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(197, 160, 89, 0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3
                      }}>
                        <AssignmentIcon sx={{ fontSize: 32, color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(197, 160, 89, 0.3)' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, mb: 1 }}>Select a record</Typography>
                      <Typography variant="body2" sx={{ color: c.textSecondary, textAlign: 'center', maxWidth: 300 }}>
                        Click a complaint on the left to view its detailed status and history.
                      </Typography>
                    </Paper>
                  </Fade>
                )}
              </Grid>
            </Grid>
          )}

          {activeTab === 'profile' && (
            <Fade in timeout={800}>
              <Grid container spacing={4} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Paper elevation={0} sx={{ ...glassCardSx, p: 4, textAlign: 'center', background: `linear-gradient(135deg, ${c.accent}15, ${c.accentLight}05)` }}>
                    <Avatar sx={{
                      width: 100, height: 100, mx: 'auto', mb: 3,
                      p: 0.5, background: c.gradGold, boxShadow: `0 15px 40px ${c.accent}40`
                    }}>
                      <Avatar sx={{ width: '100%', height: '100%', bgcolor: c.bgSecondary, color: c.accent }}>
                        <PersonIcon sx={{ fontSize: 50 }} />
                      </Avatar>
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: c.textPrimary }}>{fullName}</Typography>
                    <Typography variant="body1" sx={{ color: c.textSecondary, fontWeight: 600, mt: 1 }}>{department}</Typography>
                    <Chip label="Verified Student" sx={{ mt: 2, bgcolor: `${c.accent}20`, color: c.accent, fontWeight: 800, border: `1px solid ${c.accent}40` }} />
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <Paper elevation={0} sx={{ ...glassCardSx, p: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ color: c.accent }} /> Personal Protocol Data
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        { label: 'Student ID', value: studentId },
                        { label: 'Admission Number', value: admissionNumber },
                        { label: 'Department', value: department },
                        { label: 'Official Email', value: authData.email },
                      ].map((field) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={field.label}>
                          <Box sx={{ p: 2, borderRadius: 3, border: `1px solid ${c.glassBorder}`, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 800, textTransform: 'uppercase', fontSize: 10 }}>{field.label}</Typography>
                            <Typography variant="body2" sx={{ color: c.textPrimary, fontWeight: 700, mt: 0.5 }}>{field.value || '—'}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    <Divider sx={{ my: 4, borderColor: c.glassBorder }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LockResetIcon sx={{ color: c.accent }} /> Security Settings
                    </Typography>
                    {pwSuccess && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>Password updated successfully!</Alert>}
                    {pwError && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{pwError}</Alert>}

                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12 }}>
                        <TextField fullWidth size="small" type={showPw.current ? 'text' : 'password'} label="Current Password"
                          value={pwData.current} onChange={e => setPwData(prev => ({ ...prev, current: e.target.value }))}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowPw(prev => ({ ...prev, current: !prev.current }))}><Visibility fontSize="small" /></IconButton>
                              </InputAdornment>
                            )
                          }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth size="small" type={showPw.newPw ? 'text' : 'password'} label="New Password"
                          value={pwData.newPw} onChange={e => setPwData(prev => ({ ...prev, newPw: e.target.value }))}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowPw(prev => ({ ...prev, newPw: !prev.newPw }))}><Visibility fontSize="small" /></IconButton>
                              </InputAdornment>
                            )
                          }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth size="small" type={showPw.confirm ? 'text' : 'password'} label="Confirm New Password"
                          value={pwData.confirm} onChange={e => setPwData(prev => ({ ...prev, confirm: e.target.value }))}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowPw(prev => ({ ...prev, confirm: !prev.confirm }))}><Visibility fontSize="small" /></IconButton>
                              </InputAdornment>
                            )
                          }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                      </Grid>
                    </Grid>
                    <Button fullWidth variant="contained" onClick={handlePasswordChange} disabled={pwLoading} sx={{
                      mt: 4, py: 1.5, borderRadius: 3, background: c.gradGold, color: 'white', fontWeight: 800, boxShadow: `0 8px 25px ${c.accent}40`,
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 12px 35px ${c.accent}60` }
                    }}>
                      {pwLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirm Security Update'}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </Fade>
          )}
        </Box>
      </Box>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}
