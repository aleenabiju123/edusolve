import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  InputAdornment
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
  CheckCircleOutline as SuccessIcon
} from '@mui/icons-material';

const drawerWidth = 240;

export default function StudentDashboard() {
  const navigate = useNavigate();
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(255, 253, 245, 0.9)' }}>
      <Toolbar>
        <Typography variant="h6" fontWeight="900" sx={{ color: '#4A3E31', letterSpacing: '-1px' }}>
          EduSolve
        </Typography>
      </Toolbar>
      <Divider sx={{ opacity: 0.1 }} />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Tooltip title="View Profile" placement="right">
          <Avatar
            onClick={handleProfileOpen}
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              bgcolor: 'white',
              border: '2px solid #C5A059',
              color: '#C5A059',
              boxShadow: '0 10px 20px rgba(197, 160, 89, 0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'scale(1.08)', boxShadow: '0 14px 28px rgba(197, 160, 89, 0.2)' }
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
        </Tooltip>
        <Typography variant="h6" fontWeight="bold" color="#4A3E31">{fullName || 'Student'}</Typography>
        <Typography variant="body2" color="#6B5E4F">{department}</Typography>
        <Chip
          label={`ID: ${studentId}`}
          size="small"
          sx={{ mt: 1.5, bgcolor: 'rgba(197, 160, 89, 0.1)', color: '#C5A059', fontWeight: 700 }}
        />
      </Box>
      <Divider sx={{ opacity: 0.1, mx: 2 }} />
      <List sx={{ px: 2, mt: 2 }}>
        <ListItem
          button
          onClick={() => { setSelectedComplaint(null); setMobileOpen(false); }}
          sx={{
            borderRadius: 3,
            mb: 1,
            bgcolor: !selectedComplaint ? 'rgba(74, 62, 49, 0.05)' : 'transparent',
            '&:hover': { bgcolor: 'rgba(74, 62, 49, 0.08)' }
          }}
        >
          <ListItemIcon><DashboardIcon sx={{ color: '#4A3E31' }} /></ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: !selectedComplaint ? 700 : 500, color: '#4A3E31' }} />
        </ListItem>
        <ListItem
          button
          onClick={() => { navigate('/complaint'); setMobileOpen(false); }}
          sx={{
            borderRadius: 3,
            mb: 1,
            bgcolor: '#4A3E31',
            color: 'white',
            '&:hover': { bgcolor: '#2D261E' },
            boxShadow: '0 4px 12px rgba(74, 62, 49, 0.2)'
          }}
        >
          <ListItemIcon><AddIcon sx={{ color: 'white' }} /></ListItemIcon>
          <ListItemText primary="New Complaint" primaryTypographyProps={{ fontWeight: 700 }} />
        </ListItem>
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            borderColor: 'rgba(74, 62, 49, 0.2)',
            color: '#4A3E31',
            '&:hover': { borderColor: '#4A3E31', bgcolor: 'rgba(74, 62, 49, 0.05)' }
          }}
        >
          Logout
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
      <Box sx={{ bgcolor: '#FFFDF5', p: 2.5 }}>
        {[
          { label: 'Student ID', value: studentId, icon: '🪪' },
          { label: 'Admission No.', value: admissionNumber, icon: '📋' },
          { label: 'Department', value: department, icon: '🏛️' },
          { label: 'Email', value: authData.email, icon: '✉️' },
          { label: 'Phone', value: authData.phoneNumber || 'Not provided', icon: '📱' },
        ].map((item) => (
          <Box key={item.label} sx={{
            display: 'flex', alignItems: 'flex-start', gap: 1.5,
            py: 1.2, borderBottom: '1px solid rgba(197,160,89,0.08)',
            '&:last-child': { borderBottom: 'none' }
          }}>
            <Typography sx={{ fontSize: 16, mt: 0.1 }}>{item.icon}</Typography>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: '#A89E94', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {item.label}
              </Typography>
              <Typography variant="body2" fontWeight="700" sx={{ color: '#4A3E31', wordBreak: 'break-all' }}>
                {item.value || '—'}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Change Password Section */}
      <Box sx={{ bgcolor: 'white', borderTop: '1px solid rgba(197,160,89,0.08)' }}>
        <Button
          fullWidth
          onClick={() => { setShowPwForm(v => !v); setPwError(''); setPwSuccess(false); }}
          startIcon={<LockResetIcon />}
          endIcon={<ExpandMoreIcon sx={{ transform: showPwForm ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />}
          sx={{
            justifyContent: 'flex-start',
            px: 2.5, py: 1.5,
            color: '#4A3E31',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'none',
            '&:hover': { bgcolor: 'rgba(197,160,89,0.06)' }
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
                        sx={{ color: '#C5A059' }}
                      >
                        {showPw[key] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '& fieldset': { borderColor: 'rgba(197,160,89,0.3)' },
                    '&:hover fieldset': { borderColor: '#C5A059' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4A3E31' }
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
                bgcolor: '#4A3E31',
                borderRadius: 3,
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: '0 6px 16px rgba(74,62,49,0.2)',
                '&:hover': { bgcolor: '#2D261E' }
              }}
            >
              {pwLoading ? <CircularProgress size={18} color="inherit" /> : 'Update Password'}
            </Button>
          </Box>
        </Collapse>
      </Box>

      {/* Footer action */}
      <Box sx={{ p: 2, bgcolor: '#FFFDF5', borderTop: '1px solid rgba(197,160,89,0.08)' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={() => { handleProfileClose(); handleLogout(); }}
          sx={{
            borderRadius: 3,
            borderColor: 'rgba(74,62,49,0.2)',
            color: '#4A3E31',
            fontWeight: 700,
            '&:hover': { borderColor: '#4A3E31', bgcolor: 'rgba(74,62,49,0.04)' }
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Popover>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#FFFDF5', minHeight: '100vh' }}>
      {profileCard}
      <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'rgba(255, 253, 245, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(197, 160, 89, 0.1)',
        color: '#4A3E31',
        boxShadow: 'none'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="bold" noWrap component="div">
              Welcome back, {fullName?.split(' ')[0] || 'Student'}
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body2" color="#6B5E4F" sx={{ opacity: 0.8 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(197, 160, 89, 0.1)' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />

        <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
          {/* Summary Stats */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[
              { label: 'Total Requests', val: complaints.length, icon: <ComplaintIcon sx={{ color: '#4A3E31' }} />, bg: 'rgba(74, 62, 49, 0.03)' },
              { label: 'Registered', val: complaints.filter(c => c.status === 'Registered').length, icon: <AssignmentIcon sx={{ color: '#C5A059' }} />, bg: 'rgba(197, 160, 89, 0.05)' },
              { label: 'Pending', val: complaints.filter(c => c.status === 'Pending').length, icon: <PendingIcon sx={{ color: '#4A3E31' }} />, bg: 'rgba(74, 62, 49, 0.03)' },
              { label: 'Resolved', val: complaints.filter(c => c.status === 'Resolved').length, icon: <CheckCircleIcon sx={{ color: '#2E7D32' }} />, bg: 'rgba(46, 125, 50, 0.05)' },
            ].map((stat, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{
                  borderRadius: 6,
                  bgcolor: stat.bg,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' },
                  border: '1px solid rgba(197, 160, 89, 0.1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 4, bgcolor: 'white', display: 'flex', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="#6B5E4F" fontWeight="500">{stat.label}</Typography>
                      <Typography variant="h4" fontWeight="900" color="#4A3E31">{stat.val}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4}>
            {/* Complaints List */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{
                borderRadius: 8,
                bgcolor: 'white',
                border: '1px solid rgba(197, 160, 89, 0.1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 300px)'
              }}>
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="#4A3E31">Activity History</Typography>
                  <IconButton size="small" onClick={fetchComplaints} sx={{ color: '#C5A059' }}>
                    <DateIcon fontSize="small" />
                  </IconButton>
                </Box>
                <List sx={{ overflowY: 'auto', p: 0 }}>
                  {loading ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={30} sx={{ color: '#C5A059' }} /></Box>
                  ) : complaints.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="body2" color="#6B5E4F">No history yet.</Typography>
                    </Box>
                  ) : (
                    complaints.map((complaint) => (
                      <ListItem
                        key={complaint._id}
                        disablePadding
                        divider
                        sx={{
                          borderBottom: '1px solid rgba(0,0,0,0.03)',
                          bgcolor: selectedComplaint?._id === complaint._id ? 'rgba(197, 160, 89, 0.05)' : 'transparent'
                        }}
                      >
                        <CardActionArea sx={{ p: 2.5 }} onClick={() => setSelectedComplaint(complaint)}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="700" color="#4A3E31">{complaint.category}</Typography>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(complaint.status), mt: 0.8 }} />
                          </Box>
                          <Typography variant="body2" color="#6B5E4F" noWrap sx={{ mb: 1, opacity: 0.8 }}>
                            {complaint.description}
                          </Typography>
                          <Typography variant="caption" color="#A89E94" fontWeight="500">
                            {new Date(complaint.registeredAt).toLocaleDateString()}
                          </Typography>
                        </CardActionArea>
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>
            </Grid>

            {/* Complaint Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              {selectedComplaint ? (
                <Paper elevation={0} sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 8,
                  bgcolor: 'white',
                  border: '1px solid rgba(197, 160, 89, 0.1)',
                  minHeight: 'calc(100vh - 300px)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.03)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                      <Typography variant="h5" fontWeight="900" color="#4A3E31">{selectedComplaint.category}</Typography>
                      <Typography variant="caption" color="#A89E94" letterSpacing={1}>ID: {selectedComplaint._id.toUpperCase()}</Typography>
                    </Box>
                    <Chip
                      label={selectedComplaint.status}
                      sx={{
                        bgcolor: getStatusColor(selectedComplaint.status) + '15',
                        color: getStatusColor(selectedComplaint.status),
                        fontWeight: 'bold',
                        px: 1,
                        borderRadius: 3
                      }}
                    />
                  </Box>

                  <Grid container spacing={4}>
                    <Grid size={12}>
                      <Typography variant="overline" color="#C5A059" fontWeight="900">Description</Typography>
                      <Typography variant="body1" sx={{ color: '#4A3E31', lineHeight: 1.8, mt: 1 }}>
                        {selectedComplaint.description}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ p: 2, borderRadius: 4, bgcolor: '#FFFDF5', border: '1px solid rgba(197, 160, 89, 0.05)' }}>
                        <Typography variant="caption" color="#6B5E4F" display="block">Registered Date</Typography>
                        <Typography variant="subtitle2" fontWeight="700" color="#4A3E31">{formatDate(selectedComplaint.registeredAt)}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ p: 2, borderRadius: 4, bgcolor: '#FFFDF5', border: '1px solid rgba(197, 160, 89, 0.05)' }}>
                        <Typography variant="caption" color="#6B5E4F" display="block">Priority Level</Typography>
                        <Typography variant="subtitle2" fontWeight="700" sx={{ color: getPriorityColor(selectedComplaint.priority) }}>
                          {selectedComplaint.priority}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ p: 2, borderRadius: 4, bgcolor: '#FFFDF5', border: '1px solid rgba(197, 160, 89, 0.05)' }}>
                        <Typography variant="caption" color="#6B5E4F" display="block">Department</Typography>
                        <Typography variant="subtitle2" fontWeight="700" color="#4A3E31">{selectedComplaint.department || 'General'}</Typography>
                      </Box>
                    </Grid>

                    {selectedComplaint.attachment && (
                      <Grid size={12}>
                        <Typography variant="overline" color="#C5A059" fontWeight="900">Submission Proof</Typography>
                        <Box sx={{ mt: 2, borderRadius: 6, overflow: 'hidden', border: '4px solid #FFFDF5', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                          <Box
                            component="img"
                            src={`http://localhost:2000/${selectedComplaint.attachment.replace(/\\/g, '/')}`}
                            alt="Attachment"
                            sx={{ width: '100%', maxHeight: 400, objectFit: 'contain', bgcolor: '#f9f9f9' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Attachment+Unavailable' }}
                          />
                        </Box>
                      </Grid>
                    )}

                    {selectedComplaint.subAdminNotes && (
                      <Grid size={12}>
                        <Box sx={{ p: 3, borderRadius: 6, bgcolor: 'rgba(197, 160, 89, 0.05)', border: '1px dashed #C5A059' }}>
                          <Typography variant="subtitle2" fontWeight="bold" color="#C5A059" sx={{ mb: 1 }}>Resolution Details</Typography>
                          <Typography variant="body2" color="#4A3E31" sx={{ lineHeight: 1.6 }}>{selectedComplaint.subAdminNotes}</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              ) : (
                <Paper elevation={0} sx={{
                  borderRadius: 8,
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px dashed rgba(197, 160, 89, 0.2)',
                  height: '100%',
                  minHeight: 'calc(100vh - 300px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 4,
                  textAlign: 'center'
                }}>
                  <Box sx={{ p: 3, borderRadius: '50%', bgcolor: 'white', mb: 3, boxShadow: '0 10px 40px rgba(197, 160, 89, 0.1)' }}>
                    <ComplaintIcon sx={{ fontSize: 60, color: 'rgba(197, 160, 89, 0.3)' }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="#4A3E31">Select a request</Typography>
                  <Typography variant="body2" color="#6B5E4F" sx={{ mb: 4, opacity: 0.7 }}>Choose an item from the sidebar history to view full status and details.</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/complaint')}
                    sx={{
                      borderRadius: 4,
                      bgcolor: '#4A3E31',
                      py: 1.5,
                      px: 4,
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: '#2D261E' }
                    }}
                  >
                    Register New Issue
                  </Button>
                </Paper>
              )}
            </Grid>
          </Grid>
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
