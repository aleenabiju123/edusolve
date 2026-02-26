import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Paper,
  CircularProgress,
  IconButton,
  Avatar,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Popover,
  Stack,
  Fade,
  Grow,
  Tooltip,
  LinearProgress,
  SwipeableDrawer,
  Badge,
  ListItemAvatar,
  ListItemButton
} from '@mui/material';
import {
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  Save as SaveIcon,
  Menu as MenuIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  AdminPanelSettings as AdminIcon,
  Speed as SpeedIcon,
  Notifications as NotifIcon,
  Shield as ShieldIcon,
  Close as CloseIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Person as PersonIcon,
  LockReset as LockResetIcon,
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
  ExpandMore as ExpandMoreIcon,
  CheckCircleOutline as SuccessIcon
} from '@mui/icons-material';
import AdminAnalyticsSection from './AdminAnalyticsSection';
import AdminPerformanceSection from './AdminPerformanceSection';
import AdminLoginHistorySection from './AdminLoginHistorySection';

const sideDrawerWidth = 270;
const actionDrawerWidth = 380;

// ─── Theme Palettes ─────────────────────────────
const darkPalette = {
  bgPrimary: '#121212',
  bgSecondary: '#1E1E1E',
  bgTertiary: '#181818',
  bgCard: 'rgba(255,255,255,0.03)',
  glassBg: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.08)',
  sidebarBg: ['#1E1E1E', '#121212'],
  appBarBg: 'rgba(18,18,18,0.75)',
  tableHeaderBg: 'rgba(18,18,18,0.95)',
  inputBg: 'rgba(255,255,255,0.03)',
  hoverBg: 'rgba(255,255,255,0.03)',
  selectedBg: 'rgba(197,160,89,0.08)',
  selectedHoverBg: 'rgba(197,160,89,0.12)',
  accent: '#C5A059',
  accentLight: '#D4B87E',
  cyan: '#D4B87E',
  emerald: '#81C784',
  amber: '#FFD54F',
  rose: '#E57373',
  textPrimary: '#FFFDF5',
  textSecondary: 'rgba(255,252,245,0.6)',
  textMuted: 'rgba(255,252,245,0.3)',
};

const lightPalette = {
  bgPrimary: '#FFFDF5',
  bgSecondary: '#FFFFFF',
  bgTertiary: '#FFFDF5',
  bgCard: 'rgba(0,0,0,0.02)',
  glassBg: 'rgba(255,253,245,0.85)',
  glassBorder: 'rgba(197,160,89,0.15)',
  sidebarBg: ['#FFFFFF', '#FFFDF5'],
  appBarBg: 'rgba(255,253,245,0.85)',
  tableHeaderBg: '#FFFDF5',
  inputBg: 'rgba(0,0,0,0.02)',
  hoverBg: 'rgba(197,160,89,0.05)',
  selectedBg: 'rgba(197,160,89,0.1)',
  selectedHoverBg: 'rgba(197,160,89,0.15)',
  accent: '#4A3E31',
  accentLight: '#6B5E4F',
  cyan: '#C5A059',
  emerald: '#2E7D32',
  amber: '#F57F17',
  rose: '#C62828',
  textPrimary: '#4A3E31',
  textSecondary: '#6B5E4F',
  textMuted: '#A89E94',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Theme state
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const c = isDark ? darkPalette : lightPalette;

  const glassCard = useMemo(() => ({
    bgcolor: c.glassBg,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${c.glassBorder}`,
    borderRadius: 4,
  }), [isDark]);

  // Auth data
  const authData = JSON.parse(localStorage.getItem('adminAuthData') || '{}');
  const adminId = authData.adminId || authData.userId || 'ADM001';
  const username = authData.fullName || authData.name || 'Admin User';
  const adminEmail = authData.email || 'admin@edusolve.edu';
  const adminDepartment = authData.adminDepartment || 'General';

  // UI State
  const [complaints, setComplaints] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [subAdminNotes, setSubAdminNotes] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('Pending');
  const [resolvedImage, setResolvedImage] = useState(null);
  const [priority, setPriority] = useState('Medium');
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwData, setPwData] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState(() => {
    return JSON.parse(localStorage.getItem(`readNotifs_${adminId}`) || '[]');
  });

  // Dynamic Notifications Logic
  const notifications = useMemo(() => {
    return complaints.filter(c => {
      if (adminDepartment === 'General') {
        // General Admin sees all Registered OR updates from Sub-Admins
        return c.status === 'Registered' || (c.subAdminNotes && (c.status === 'Pending' || c.status === 'Resolved'));
      } else {
        // Sub-Admins see only Registered in their department or category
        return c.status === 'Registered' && (c.department === adminDepartment || c.category === adminDepartment);
      }
    }).map(c => ({
      id: c._id,
      title: c.status === 'Registered' ? 'New Complaint Assigned' : 'Sub-Admin Update',
      message: `${c.studentName} - ${c.category}: ${c.description}`,
      time: new Date(c.registeredAt).toLocaleDateString(),
      unread: !readNotifIds.includes(c._id),
      type: c.status === 'Registered' ? 'complaint' : 'resolved',
      rawDate: c.registeredAt
    })).sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
  }, [complaints, adminDepartment, readNotifIds]);

  useEffect(() => {
    localStorage.setItem(`readNotifs_${adminId}`, JSON.stringify(readNotifIds));
  }, [readNotifIds, adminId]);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const url = adminDepartment !== 'General'
        ? `http://localhost:2000/api/complaints/department/${adminDepartment}`
        : filter === 'all'
          ? 'http://localhost:2000/api/complaints/all'
          : `http://localhost:2000/api/complaints/filter/status?status=${filter}`;
      const response = await axios.get(url);
      if (response.data.success) setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [filter]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileClick = (e) => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const handleNotifClick = (e) => setNotifAnchorEl(e.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);
  const handleMarkAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const newReadIds = Array.from(new Set([...readNotifIds, ...allIds]));
    setReadNotifIds(newReadIds);
    localStorage.setItem(`readNotifs_${adminId}`, JSON.stringify(newReadIds));
  };
  useEffect(() => {
    localStorage.setItem(`readNotifs_${adminId}`, JSON.stringify(readNotifIds));
  }, [readNotifIds, adminId]);
  const unreadCount = notifications.filter(n => n.unread).length;
  const open = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchorEl);

  const handleSelectComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    setAdminNotes(complaint.adminNotes || '');
    setSubAdminNotes(complaint.subAdminNotes || '');
    setVerificationStatus(complaint.verificationStatus || 'Pending');
    setPriority(complaint.priority || 'Medium');
    setResolvedImage(null);
  };

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('status', updateStatus);
      formData.append('adminNotes', adminNotes);
      formData.append('priority', priority);
      formData.append('verificationStatus', verificationStatus);
      formData.append('subAdminNotes', subAdminNotes);
      if (resolvedImage) formData.append('resolvedImage', resolvedImage);

      const response = await axios.put(
        `http://localhost:2000/api/complaints/update-status/${selectedComplaint._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        const updated = response.data.complaint;
        setSelectedComplaint(updated);
        setComplaints(prev => prev.map(x => x._id === updated._id ? updated : x));
        alert('Status updated successfully');
      }
    } catch (error) {
      alert('Update failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthData');
    navigate('/');
  };

  const handlePasswordChange = async () => {
    setPwError('');
    if (!pwData.current) return setPwError('Current password is required.');
    if (pwData.newPw.length < 6) return setPwError('New password must be at least 6 characters.');
    if (pwData.newPw !== pwData.confirm) return setPwError('Passwords do not match.');
    setPwLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:2000/api/users/change-password`,
        { email: adminEmail, currentPassword: pwData.current, newPassword: pwData.newPw }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Registered': return c.amber;
      case 'Pending': return c.cyan;
      case 'Resolved': return c.emerald;
      default: return c.textSecondary;
    }
  };

  const getStatusGlow = (status) => {
    const base = getStatusColor(status);
    return `0 0 10px ${base}50`;
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(+e.target.value); setPage(0); };

  const totalComplaints = complaints.length;
  const registeredCount = complaints.filter(x => x.status === 'Registered').length;
  const pendingCount = complaints.filter(x => x.status === 'Pending' || x.status === 'In Progress').length;
  const resolvedCount = complaints.filter(x => x.status === 'Resolved').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0;

  // ─── Input field styles (theme-aware) ──────────
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      color: c.textPrimary,
      bgcolor: c.inputBg,
      fontSize: 13,
      '& fieldset': { borderColor: c.glassBorder },
      '&:hover fieldset': { borderColor: c.accent },
      '&.Mui-focused fieldset': { borderColor: c.accent },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 700, color: c.textMuted, fontSize: 13,
      '&.Mui-focused': { color: c.accent },
    },
  };

  const selectSx = {
    borderRadius: 2.5, fontWeight: 700, fontSize: 13,
    color: c.textPrimary, bgcolor: c.inputBg,
    '& .MuiOutlinedInput-notchedOutline': { borderColor: c.glassBorder },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: c.accent },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: c.accent },
    '& .MuiSvgIcon-root': { color: c.textSecondary },
  };

  // ─── Sidebar Content ─────────────────────────────
  const sidebarContent = (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: `linear-gradient(180deg, ${c.sidebarBg[0]} 0%, ${c.sidebarBg[1]} 100%)`,
      borderRight: `1px solid ${c.glassBorder}`,
    }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 38, height: 38, borderRadius: 3,
          background: `linear-gradient(135deg, ${c.accent}, ${c.cyan})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 20px ${c.accent}60`,
        }}>
          <ShieldIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ color: c.textPrimary, fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.2 }}>EduSolve</Typography>
          <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: 10, letterSpacing: 1 }}>ADMIN PORTAL</Typography>
        </Box>
      </Box>

      {/* Admin Card */}
      <Box sx={{ px: 2.5, mb: 3 }}>
        <Box sx={{
          p: 2, borderRadius: 3,
          background: `linear-gradient(135deg, ${c.accent}18, ${c.cyan}0C)`,
          border: `1px solid ${c.accent}22`,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Avatar sx={{
              width: 36, height: 36,
              background: `linear-gradient(135deg, ${c.accent}, ${c.cyan})`,
              fontSize: 15, fontWeight: 800,
            }}>{username.charAt(0)}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ color: c.textPrimary, fontWeight: 800, lineHeight: 1.2 }} noWrap>{username}</Typography>
              <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: 10 }} noWrap>{adminEmail}</Typography>
            </Box>
          </Box>
          <Chip label={`${adminDepartment} Admin`} size="small" sx={{
            mt: 0.5, bgcolor: `${c.accent}22`, color: c.accentLight,
            fontWeight: 700, fontSize: 10, height: 22, border: `1px solid ${c.accent}30`,
          }} />
        </Box>
      </Box>

      {/* Nav */}
      <Typography variant="caption" sx={{ px: 3, mb: 1, color: c.textMuted, fontWeight: 800, letterSpacing: 1.5, fontSize: 9 }}>NAVIGATION</Typography>
      <List sx={{ px: 1.5 }}>
        {[
          { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
          { id: 'complaints', text: 'Complaints', icon: <AssignmentIcon /> },
          { id: 'analytics', text: 'Analytics', icon: <AssessmentIcon /> },
          { id: 'performance', text: 'Performance', icon: <TrendingUpIcon /> },
          ...(adminDepartment === 'General' ? [{ id: 'loginHistory', text: 'Login Pulse', icon: <LoginIcon /> }] : []),
          { id: 'profile', text: 'My Profile', icon: <PersonIcon /> },
        ].map((item) => {
          const active = activeTab === item.id;
          return (
            <ListItem button key={item.id} selected={active}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'complaints') setFilter('all');
                if (mobileOpen) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2.5, mb: 0.5, py: 1.2, px: 2, transition: 'all 0.2s',
                position: 'relative',
                '&.Mui-selected': {
                  bgcolor: `${c.accent}18`,
                  '&:hover': { bgcolor: `${c.accent}28` },
                  '&::before': {
                    content: '""', position: 'absolute', left: 0, top: '50%',
                    transform: 'translateY(-50%)', width: 3, height: '60%', borderRadius: 4,
                    background: `linear-gradient(180deg, ${c.accent}, ${c.cyan})`,
                  }
                },
                '& .MuiListItemIcon-root': { color: active ? c.accent : c.textMuted, minWidth: 38 },
                '& .MuiListItemText-primary': { fontWeight: active ? 700 : 500, color: active ? c.textPrimary : c.textSecondary, fontSize: 13.5 },
                '&:hover': { bgcolor: `${c.glassBorder}` },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 2.5 }}>
        <Divider sx={{ mb: 2, borderColor: c.glassBorder }} />
        <Button fullWidth variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}
          sx={{
            borderRadius: 2.5, borderColor: `${c.rose}40`, color: c.rose, fontWeight: 700,
            py: 1, fontSize: 13, textTransform: 'none',
            '&:hover': { borderColor: c.rose, bgcolor: `${c.rose}12` }
          }}
        >End Session</Button>
      </Box>
    </Box>
  );

  // ─── Action Drawer Content ─────────────────────────────
  const actionDrawerContent = selectedComplaint ? (
    <Box sx={{
      width: actionDrawerWidth, height: '100%', display: 'flex', flexDirection: 'column',
      background: isDark
        ? `linear-gradient(180deg, ${c.bgSecondary}, ${c.bgPrimary})`
        : `linear-gradient(180deg, #FFFFFF, ${c.bgTertiary})`,
      borderLeft: `1px solid ${c.glassBorder}`,
    }}>
      {/* Header */}
      <Box sx={{
        p: 3,
        background: `linear-gradient(135deg, ${c.accent}20, ${c.cyan}10)`,
        borderBottom: `1px solid ${c.glassBorder}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <Box>
          <Typography variant="caption" sx={{ color: c.cyan, fontWeight: 800, letterSpacing: 1.5, fontSize: 9 }}>
            RESOLUTION PROTOCOL
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, mt: 0.3, lineHeight: 1.2 }}>
            {selectedComplaint.category}
          </Typography>
          <Typography variant="caption" sx={{ color: c.textMuted, fontSize: 11 }}>
            {selectedComplaint.studentName} • {new Date(selectedComplaint.registeredAt).toLocaleDateString()}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setSelectedComplaint(null)} sx={{ color: c.textMuted }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Description */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${c.glassBorder}` }}>
        <Typography variant="body2" sx={{ color: c.textSecondary, lineHeight: 1.7, fontSize: 13 }}>
          {selectedComplaint.description}
        </Typography>
      </Box>

      {/* Status Badges */}
      <Box sx={{ px: 3, py: 2, display: 'flex', gap: 1, borderBottom: `1px solid ${c.glassBorder}` }}>
        <Chip size="small" label={selectedComplaint.status} sx={{
          bgcolor: `${getStatusColor(selectedComplaint.status)}18`,
          color: getStatusColor(selectedComplaint.status),
          fontWeight: 700, fontSize: 11, height: 24,
          border: `1px solid ${getStatusColor(selectedComplaint.status)}30`,
        }} />
        <Chip size="small" label={selectedComplaint.priority || 'Medium'} sx={{
          bgcolor: c.inputBg, color: c.textSecondary,
          fontWeight: 700, fontSize: 11, height: 24,
          border: `1px solid ${c.glassBorder}`,
        }} />
      </Box>

      {/* Form */}
      <Box sx={{ p: 3, flex: 1 }}>
        <Stack spacing={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontWeight: 700, color: c.textMuted, fontSize: 13, '&.Mui-focused': { color: c.accent } }}>Status</InputLabel>
            <Select
              value={adminDepartment === 'General' ? updateStatus : verificationStatus}
              label="Status"
              onChange={(e) => adminDepartment === 'General' ? setUpdateStatus(e.target.value) : setVerificationStatus(e.target.value)}
              sx={selectSx}
            >
              <MenuItem value="Registered">Registered</MenuItem>
              <MenuItem value="Pending">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth multiline rows={4}
            label="Admin Notes"
            value={adminDepartment === 'General' ? adminNotes : subAdminNotes}
            onChange={(e) => adminDepartment === 'General' ? setAdminNotes(e.target.value) : setSubAdminNotes(e.target.value)}
            variant="outlined" size="small" sx={inputSx}
          />

          <Button
            fullWidth variant="contained"
            startIcon={updating ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            onClick={handleUpdateStatus}
            disabled={updating}
            sx={{
              borderRadius: 2.5,
              background: `linear-gradient(135deg, ${c.accent}, ${c.cyan})`,
              py: 1.5, fontWeight: 800, fontSize: 13,
              textTransform: 'none',
              boxShadow: `0 8px 30px ${c.accent}40`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: `linear-gradient(135deg, ${c.accentLight}, ${c.cyan})`,
                transform: 'translateY(-2px)',
                boxShadow: `0 12px 40px ${c.accent}50`,
              },
              '&.Mui-disabled': { background: c.inputBg, color: c.textMuted }
            }}
          >
            {updating ? 'Updating...' : 'Commit Update'}
          </Button>
        </Stack>
      </Box>
    </Box>
  ) : null;

  // ─── RETURN ─────────────────────────────
  return (
    <Box sx={{
      display: 'flex', minHeight: '100vh',
      background: isDark
        ? `linear-gradient(135deg, ${c.bgPrimary} 0%, ${c.bgSecondary} 50%, ${c.bgTertiary} 100%)`
        : `linear-gradient(135deg, ${c.bgPrimary} 0%, ${c.bgTertiary} 50%, ${c.bgSecondary} 100%)`,
      transition: 'background 0.4s ease',
    }}>

      {/* ── AppBar ── */}
      <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: { sm: `calc(100% - ${sideDrawerWidth}px)` },
        ml: { sm: `${sideDrawerWidth}px` },
        bgcolor: c.appBarBg,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${c.glassBorder}`,
        color: c.textPrimary, boxShadow: 'none',
        transition: 'all 0.3s ease',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.3px', fontSize: 18, lineHeight: 1.2 }}>Command Center</Typography>
              <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, fontSize: 11 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* ── Theme Toggle ── */}
            <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton
                onClick={() => setIsDark(prev => !prev)}
                sx={{
                  color: c.textSecondary,
                  bgcolor: c.inputBg,
                  border: `1px solid ${c.glassBorder}`,
                  width: 38, height: 38,
                  transition: 'all 0.3s ease',
                  '&:hover': { color: c.amber, borderColor: c.amber, bgcolor: `${c.amber}12` },
                }}
              >
                {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleNotifClick}
                sx={{
                  color: c.textSecondary,
                  '&:hover': { color: c.cyan },
                  transition: '0.3s'
                }}
              >
                <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 900, fontSize: 10, bgcolor: c.rose } }}>
                  <NotifIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account">
              <IconButton onClick={handleProfileClick} sx={{
                p: 0.5, border: '2px solid',
                borderColor: open ? c.accent : 'transparent',
                transition: '0.3s', '&:hover': { borderColor: c.accentLight },
              }}>
                <Avatar sx={{
                  width: 34, height: 34, fontSize: 14, fontWeight: 800,
                  background: `linear-gradient(135deg, ${c.accent}, ${c.cyan})`,
                }}>{username.charAt(0)}</Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Notifications Popover ── */}
      <Popover
        open={notifOpen}
        anchorEl={notifAnchorEl}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 320,
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: isDark ? c.bgSecondary : '#FFFFFF',
            border: `1px solid ${c.glassBorder}`,
            boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.12)',
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${c.glassBorder}` }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: c.textPrimary }}>Notifications</Typography>
          <Button size="small" onClick={handleMarkAllRead} sx={{ fontSize: 11, fontWeight: 700, color: c.cyan, textTransform: 'none' }}>
            Mark all read
          </Button>
        </Box>
        <List sx={{ py: 0, maxHeight: 400, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center', opacity: 0.6 }}>
              <NotifIcon sx={{ fontSize: 40, mb: 1, color: c.textMuted }} />
              <Typography variant="body2" sx={{ color: c.textMuted, fontWeight: 600 }}>No new notifications</Typography>
            </Box>
          ) : notifications.map((n) => (
            <ListItemButton key={n.id} sx={{
              py: 1.5, px: 2,
              borderBottom: `1px solid ${c.glassBorder}`,
              bgcolor: n.unread ? (isDark ? 'rgba(197, 160, 89, 0.03)' : 'rgba(197, 160, 89, 0.05)') : 'transparent'
            }}>
              <ListItemAvatar sx={{ minWidth: 48 }}>
                <Avatar sx={{
                  width: 36, height: 36,
                  bgcolor: n.unread ? c.accent : c.inputBg,
                  color: n.unread ? 'white' : c.textMuted
                }}>
                  {n.type === 'complaint' && <AssignmentIcon sx={{ fontSize: 18 }} />}
                  {n.type === 'system' && <DashboardIcon sx={{ fontSize: 18 }} />}
                  {n.type === 'resolved' && <CheckCircleIcon sx={{ fontSize: 18 }} />}
                  {n.type === 'alert' && <SpeedIcon sx={{ fontSize: 18 }} />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: n.unread ? 800 : 600, color: c.textPrimary, fontSize: 13 }}>{n.title}</Typography>
                    <Typography variant="caption" sx={{ color: c.textMuted, fontSize: 10 }}>{n.time}</Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="caption" sx={{
                    color: c.textSecondary,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    lineHeight: 1.4, mt: 0.3
                  }}>
                    {n.message}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 1.5, textAlign: 'center', borderTop: `1px solid ${c.glassBorder}` }}>
          <Button fullWidth size="small" sx={{ color: c.textSecondary, fontSize: 11, fontWeight: 700, textTransform: 'none' }}>
            View Notification Center
          </Button>
        </Box>
      </Popover>

      {/* ── Profile Popover ── */}
      <Popover open={open} anchorEl={anchorEl} onClose={handleProfileClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5, width: 290, borderRadius: 4, overflow: 'hidden',
            bgcolor: isDark ? c.bgSecondary : '#FFFFFF',
            border: `1px solid ${c.glassBorder}`,
            boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.12)',
          }
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center', background: `linear-gradient(135deg, ${c.accent}20, ${c.cyan}10)` }}>
          <Avatar sx={{
            width: 56, height: 56, mx: 'auto', mb: 1.5,
            background: `linear-gradient(135deg, ${c.accent}, ${c.cyan})`,
            fontSize: 22, fontWeight: 900, boxShadow: `0 8px 30px ${c.accent}50`,
          }}>{username.charAt(0)}</Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary }}>{username}</Typography>
          <Typography variant="caption" sx={{ color: c.textSecondary }}>{adminEmail}</Typography>
          <Divider sx={{ my: 2, borderColor: c.glassBorder }} />
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: c.textMuted }}>ADMIN ID</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: c.textPrimary }}>{adminId}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: c.textMuted }}>ROLE</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: c.cyan }}>{adminDepartment} Lead</Typography>
            </Box>
          </Stack>
        </Box>
        <Box sx={{ p: 2, borderTop: `1px solid ${c.glassBorder}` }}>
          <Button fullWidth variant="contained" startIcon={<LogoutIcon />} onClick={handleLogout}
            sx={{ bgcolor: c.rose, borderRadius: 2.5, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#C62828' } }}
          >Sign Out</Button>
        </Box>
      </Popover>

      {/* ── Sidebar ── */}
      <Box component="nav" sx={{ width: { sm: sideDrawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sideDrawerWidth, borderRight: 'none' } }}
        >{sidebarContent}</Drawer>
        <Drawer variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sideDrawerWidth, borderRight: 'none', bgcolor: 'transparent' } }}
          open
        >{sidebarContent}</Drawer>
      </Box>

      {/* ── Action Slide-out Drawer (right side) ── */}
      <Drawer
        anchor="right"
        open={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            width: actionDrawerWidth,
            borderLeft: 'none',
            bgcolor: 'transparent',
            boxShadow: selectedComplaint ? (isDark ? '-8px 0 40px rgba(0,0,0,0.4)' : '-8px 0 40px rgba(0,0,0,0.08)') : 'none',
            top: 64,
            height: 'calc(100% - 64px)',
          },
          '& .MuiBackdrop-root': { display: 'none' },
        }}
      >
        {actionDrawerContent}
      </Drawer>

      {/* ── Main Content ── */}
      <Box component="main" sx={{
        flexGrow: 1,
        p: { xs: 2, md: 3.5 },
        pt: { xs: 10, md: 12 },
        width: { sm: `calc(100% - ${sideDrawerWidth}px)` },
        mr: selectedComplaint ? `${actionDrawerWidth}px` : 0,
        transition: 'margin-right 0.3s ease',
      }}>

        {(activeTab === 'dashboard' || activeTab === 'complaints') && (
          <Grow in={true} timeout={600}>
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              {[
                { id: 'all', label: 'Total Complaints', val: totalComplaints, gradient: `${c.accent}18`, iconBg: `linear-gradient(135deg, ${c.accent}, ${c.accentLight})`, icon: <AssignmentIcon sx={{ color: 'white', fontSize: 22 }} />, accent: c.accent, sub: 'All time records' },
                { id: 'Registered', label: 'Awaiting Action', val: registeredCount, gradient: `${c.amber}15`, iconBg: `linear-gradient(135deg, ${c.amber}, #FF8F00)`, icon: <SpeedIcon sx={{ color: 'white', fontSize: 22 }} />, accent: c.amber, sub: 'Needs attention' },
                { id: 'Pending', label: 'In Progress', val: pendingCount, gradient: `${c.cyan}15`, iconBg: `linear-gradient(135deg, ${c.cyan}, #0091EA)`, icon: <PendingIcon sx={{ color: 'white', fontSize: 22 }} />, accent: c.cyan, sub: 'Under review' },
                { id: 'Resolved', label: 'Resolved', val: resolvedCount, gradient: `${c.emerald}15`, iconBg: `linear-gradient(135deg, ${c.emerald}, #00C853)`, icon: <CheckCircleIcon sx={{ color: 'white', fontSize: 22 }} />, accent: c.emerald, sub: `${resolutionRate}% resolution rate` },
              ].map((stat, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    elevation={0}
                    onClick={() => {
                      setFilter(stat.id);
                      setActiveTab('complaints');
                    }}
                    sx={{
                      p: 2.5, borderRadius: 4,
                      bgcolor: stat.gradient,
                      border: `1px solid ${c.glassBorder}`,
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      cursor: 'pointer', position: 'relative', overflow: 'hidden',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 40px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`, borderColor: `${stat.accent}40` },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, letterSpacing: 0.5, fontSize: 11 }}>{stat.label}</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: c.textPrimary, mt: 0.5, lineHeight: 1, fontSize: 32 }}>{stat.val}</Typography>
                        <Typography variant="caption" sx={{ color: c.textMuted, fontWeight: 600, mt: 0.5, display: 'block', fontSize: 10 }}>{stat.sub}</Typography>
                      </Box>
                      <Box sx={{
                        width: 44, height: 44, borderRadius: 3, background: stat.iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 6px 20px ${stat.accent}40`,
                      }}>{stat.icon}</Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grow>
        )}

        {activeTab === 'dashboard' && (
          <Fade in={true} timeout={800}>
            <Box sx={{ mb: 4, p: 2.5, borderRadius: 3, ...glassCard, bgcolor: `${c.accent}10`, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: c.textPrimary, mb: 1 }}>Welcome to the Admin Command Center</Typography>
              <Typography variant="body2" sx={{ color: c.textSecondary }}>Select a summary card above or use the sidebar to manage complaints, view analytics, and track performance.</Typography>
            </Box>
          </Fade>
        )}

        {activeTab === 'dashboard' && (
          <Fade in={true} timeout={800}>
            <Box sx={{ mb: 4, p: 2, borderRadius: 3, ...glassCard, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 700, fontSize: 11 }}>Overall Resolution Rate</Typography>
                  <Typography variant="caption" sx={{ color: c.emerald, fontWeight: 800, fontSize: 11 }}>{resolutionRate}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={resolutionRate} sx={{
                  height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  '& .MuiLinearProgress-bar': { borderRadius: 3, background: `linear-gradient(90deg, ${c.accent}, ${c.cyan}, ${c.emerald})` }
                }} />
              </Box>
            </Box>
          </Fade>
        )}

        {activeTab === 'complaints' && (
          <Fade in={true} timeout={1000}>
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', ...glassCard }}>
              {/* Header */}
              <Box sx={{
                p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: `1px solid ${c.glassBorder}`,
              }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary, lineHeight: 1.2 }}>Complaint Stream</Typography>
                  <Typography variant="caption" sx={{ color: c.textMuted, fontSize: 11 }}>{complaints.length} total records</Typography>
                </Box>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select value={filter} onChange={(e) => setFilter(e.target.value)}
                    sx={{ ...selectSx, fontSize: 12 }}
                  >
                    <MenuItem value="all">All Complaints</MenuItem>
                    <MenuItem value="Registered">Registered</MenuItem>
                    <MenuItem value="Pending">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Table */}
              <TableContainer sx={{ maxHeight: 'calc(100vh - 420px)' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {['Student', 'Category', 'Date', 'Priority', 'Status'].map(h => (
                        <TableCell key={h} sx={{
                          bgcolor: c.tableHeaderBg, color: c.textMuted,
                          fontWeight: 800, textTransform: 'uppercase', fontSize: 10, letterSpacing: 1, py: 1.5,
                          borderBottom: `1px solid ${c.glassBorder}`,
                        }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10, borderBottom: 'none' }}><CircularProgress size={32} sx={{ color: c.accent }} /></TableCell></TableRow>
                    ) : complaints.length === 0 ? (
                      <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10, color: c.textMuted, borderBottom: 'none' }}>No complaints found</TableCell></TableRow>
                    ) : (
                      complaints.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((complaint) => (
                        <TableRow key={complaint._id} hover
                          onClick={() => handleSelectComplaint(complaint)}
                          selected={selectedComplaint?._id === complaint._id}
                          sx={{
                            cursor: 'pointer', transition: 'all 0.2s ease',
                            '& td': { borderBottom: `1px solid ${c.glassBorder}` },
                            '&.Mui-selected': { bgcolor: c.selectedBg, '&:hover': { bgcolor: c.selectedHoverBg } },
                            '&:hover': { bgcolor: c.hoverBg },
                          }}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.textPrimary, fontSize: 13 }}>{complaint.studentName}</Typography>
                            <Typography variant="caption" sx={{ color: c.textMuted, fontSize: 11 }}>{complaint.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={complaint.category} size="small" sx={{
                              borderRadius: 2, bgcolor: `${c.accent}15`, color: c.accentLight,
                              border: `1px solid ${c.accent}20`, fontWeight: 700, fontSize: 11, height: 24,
                            }} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontSize: 12 }}>
                              {new Date(complaint.registeredAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: c.textSecondary, fontWeight: 600, fontSize: 12 }}>
                              {complaint.priority || 'Medium'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: getStatusColor(complaint.status), boxShadow: getStatusGlow(complaint.status) }} />
                              <Typography variant="caption" sx={{ fontWeight: 700, color: getStatusColor(complaint.status), fontSize: 11 }}>
                                {complaint.status === 'Pending' ? 'In Progress' : complaint.status}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[10, 25]}
                component="div" count={complaints.length}
                rowsPerPage={rowsPerPage} page={page}
                onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: `1px solid ${c.glassBorder}`, color: c.textSecondary,
                  '& .MuiTablePagination-selectIcon': { color: c.textMuted },
                  '& .MuiIconButton-root': { color: c.textSecondary },
                }}
              />
            </Paper>
          </Fade>
        )}

        {activeTab === 'analytics' && (
          <Fade in timeout={800}>
            <Box>
              <AdminAnalyticsSection complaints={complaints} isDark={isDark} c={c} />
            </Box>
          </Fade>
        )}

        {activeTab === 'performance' && (
          <Fade in timeout={800}>
            <Box>
              <AdminPerformanceSection complaints={complaints} isDark={isDark} c={c} />
            </Box>
          </Fade>
        )}

        {activeTab === 'loginHistory' && adminDepartment === 'General' && (
          <Box>
            <AdminLoginHistorySection isDark={isDark} c={c} />
          </Box>
        )}

        {activeTab === 'profile' && (
          <Fade in timeout={800}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper elevation={0} sx={{ ...glassCard, p: 4, textAlign: 'center', background: `linear-gradient(135deg, ${c.accent}15, ${c.accentLight}05)` }}>
                  <Avatar sx={{
                    width: 100, height: 100, mx: 'auto', mb: 3,
                    background: `linear-gradient(135deg, ${c.accent}, ${c.cyan})`,
                    fontSize: 40, fontWeight: 900, boxShadow: `0 10px 30px ${c.accent}40`,
                    border: `4px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
                  }}>{username.charAt(0)}</Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: c.textPrimary, mb: 1 }}>{username}</Typography>
                  <Typography variant="body2" sx={{ color: c.textSecondary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: 11 }}>{adminDepartment} Administrator</Typography>

                  <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid ${c.glassBorder}` }}>
                    <Typography variant="caption" sx={{ color: c.textMuted, display: 'block', mb: 1, fontWeight: 800 }}>QUICK STATS</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="h6" sx={{ color: c.accent, fontWeight: 900 }}>{complaints.length}</Typography>
                        <Typography variant="caption" sx={{ color: c.textSecondary }}>Handled</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" sx={{ color: c.emerald, fontWeight: 900 }}>{resolutionRate}%</Typography>
                        <Typography variant="caption" sx={{ color: c.textSecondary }}>Efficiency</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Paper elevation={0} sx={{ ...glassCard, p: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: c.textPrimary, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShieldIcon sx={{ color: c.accent }} /> Admin Protocol Data
                  </Typography>
                  <Grid container spacing={3}>
                    {[
                      { label: 'Admin ID', value: adminId },
                      { label: 'Department Role', value: adminDepartment },
                      { label: 'Access Level', value: adminDepartment === 'General' ? 'Super Admin' : 'Departmental Admin' },
                      { label: 'Official Email', value: adminEmail },
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

                  {!showPwForm ? (
                    <Button variant="outlined" startIcon={<LockResetIcon />} onClick={() => setShowPwForm(true)}
                      sx={{ borderRadius: 2.5, borderColor: c.glassBorder, color: c.textPrimary, textTransform: 'none', fontWeight: 700, px: 3, py: 1.2, '&:hover': { borderColor: c.accent, bgcolor: `${c.accent}08` } }}
                    >Change Access Password</Button>
                  ) : (
                    <Box sx={{ maxWidth: 400 }}>
                      <Stack spacing={2.5}>
                        <TextField fullWidth size="small" type={showPw.current ? 'text' : 'password'} label="Current Password" value={pwData.current} onChange={(e) => setPwData({ ...pwData, current: e.target.value })} sx={inputSx}
                          InputProps={{ endAdornment: <IconButton size="small" onClick={() => setShowPw({ ...showPw, current: !showPw.current })}>{showPw.current ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}</IconButton> }}
                        />
                        <TextField fullWidth size="small" type={showPw.newPw ? 'text' : 'password'} label="New Password" value={pwData.newPw} onChange={(e) => setPwData({ ...pwData, newPw: e.target.value })} sx={inputSx}
                          InputProps={{ endAdornment: <IconButton size="small" onClick={() => setShowPw({ ...showPw, newPw: !showPw.newPw })}>{showPw.newPw ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}</IconButton> }}
                        />
                        <TextField fullWidth size="small" type={showPw.confirm ? 'text' : 'password'} label="Confirm New Password" value={pwData.confirm} onChange={(e) => setPwData({ ...pwData, confirm: e.target.value })} sx={inputSx}
                          InputProps={{ endAdornment: <IconButton size="small" onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}>{showPw.confirm ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}</IconButton> }}
                        />
                        {pwError && <Typography variant="caption" sx={{ color: c.rose, fontWeight: 700 }}>{pwError}</Typography>}
                        {pwSuccess && <Typography variant="caption" sx={{ color: c.emerald, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}><SuccessIcon sx={{ fontSize: 16 }} /> Password updated successfully!</Typography>}
                        <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                          <Button variant="contained" onClick={handlePasswordChange} disabled={pwLoading}
                            sx={{ flex: 1, borderRadius: 2.5, bgcolor: c.accent, color: 'white', fontWeight: 800, textTransform: 'none', py: 1, boxShadow: `0 8px 20px ${c.accent}40`, '&:hover': { bgcolor: c.accentLight } }}
                          >{pwLoading ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}</Button>
                          <Button variant="text" onClick={() => { setShowPwForm(false); setPwError(''); }}
                            sx={{ color: c.textMuted, fontWeight: 700, textTransform: 'none' }}
                          >Cancel</Button>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Fade>
        )}
      </Box>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}
