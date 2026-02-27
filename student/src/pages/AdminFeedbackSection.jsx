import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    Grid,
    LinearProgress,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Info as InfoIcon,
    Reply as ReplyIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';

const statusColors = {
    'New': { bg: '#FFD54F', text: '#000' },
    'Read': { bg: '#81C784', text: '#fff' },
    'In Progress': { bg: '#64B5F6', text: '#fff' },
    'Resolved': { bg: '#4CAF50', text: '#fff' }
};

const priorityColors = {
    'Low': { bg: '#81C784', text: '#fff' },
    'Medium': { bg: '#FFB74D', text: '#fff' },
    'High': { bg: '#E57373', text: '#fff' }
};

const typeColors = {
    'Feedback': '#64B5F6',
    'Grievance': '#E57373',
    'Suggestion': '#81C784',
    'Complaint': '#FFB74D',
    'Other': '#9C27B0'
};

export default function AdminFeedbackSection({ isDark, colors }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [openReplyDialog, setOpenReplyDialog] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [stats, setStats] = useState({ total: 0, new: 0, resolved: 0, pending: 0 });

    useEffect(() => {
        fetchFeedbacks();
        fetchStats();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:2000/api/feedback/all');
            setFeedbacks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('http://localhost:2000/api/feedback/stats/overview');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleViewDetails = (feedback) => {
        setSelectedFeedback(feedback);
        setOpenDetailDialog(true);
    };

    const handleOpenReply = () => {
        setOpenDetailDialog(false);
        setOpenReplyDialog(true);
    };

    const handleSubmitReply = async () => {
        try {
            await axios.put(`http://localhost:2000/api/feedback/${selectedFeedback._id}`, {
                adminReply: replyText,
                repliedBy: 'Admin',
                status: 'Resolved'
            });
            setReplyText('');
            setOpenReplyDialog(false);
            setOpenDetailDialog(false);
            fetchFeedbacks();
            fetchStats();
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    const handleDeleteFeedback = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await axios.delete(`http://localhost:2000/api/feedback/${id}`);
                fetchFeedbacks();
                fetchStats();
            } catch (error) {
                console.error('Error deleting feedback:', error);
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:2000/api/feedback/${id}`, { status: newStatus });
            fetchFeedbacks();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <Box sx={{ mt: 4 }}>
            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: colors.cardBg, borderRadius: 3, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="body2" color={colors.textSecondary}> Total Feedbacks</Typography>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: colors.accent }}>
                                    {stats.total}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: colors.cardBg, borderRadius: 3, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="body2" color={colors.textSecondary}>New Feedbacks</Typography>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFD54F' }}>
                                    {stats.new}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: colors.cardBg, borderRadius: 3, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="body2" color={colors.textSecondary}>Pending</Typography>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: '#64B5F6' }}>
                                    {stats.pending}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: colors.cardBg, borderRadius: 3, p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="body2" color={colors.textSecondary}>Resolved</Typography>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                                    {stats.resolved}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Feedbacks Table */}
            <Card sx={{ bgcolor: colors.cardBg, borderRadius: 3, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                                <TableRow>
                                    <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Email</TableCell>
                                    <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Type</TableCell>
                                    <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Priority</TableCell>
                                    <TableCell sx={{ color: colors.text, fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ color: colors.text, fontWeight: 'bold' }} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {feedbacks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: colors.textSecondary }}>
                                            No feedbacks yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    feedbacks.map((feedback) => (
                                        <TableRow key={feedback._id} sx={{ '&:hover': { bgcolor: colors.hoverBg } }}>
                                            <TableCell sx={{ color: colors.text }}>{feedback.name}</TableCell>
                                            <TableCell sx={{ color: colors.text }}>{feedback.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={feedback.feedbackType}
                                                    size="small"
                                                    sx={{ bgcolor: typeColors[feedback.feedbackType], color: '#fff' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={feedback.priority}
                                                    size="small"
                                                    sx={{ bgcolor: priorityColors[feedback.priority].bg, color: priorityColors[feedback.priority].text }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={feedback.status}
                                                    onChange={(e) => handleStatusChange(feedback._id, e.target.value)}
                                                    size="small"
                                                    sx={{ color: colors.text }}
                                                >
                                                    <MenuItem value="New">New</MenuItem>
                                                    <MenuItem value="Read">Read</MenuItem>
                                                    <MenuItem value="In Progress">In Progress</MenuItem>
                                                    <MenuItem value="Resolved">Resolved</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleViewDetails(feedback)}
                                                        sx={{ color: colors.accent }}
                                                    >
                                                        <InfoIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteFeedback(feedback._id)}
                                                        sx={{ color: '#E57373' }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog
                open={openDetailDialog}
                onClose={() => setOpenDetailDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { bgcolor: colors.cardBg, color: colors.text } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                        Feedback Details
                    </Typography>
                    <IconButton onClick={() => setOpenDetailDialog(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedFeedback && (
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body2" color={colors.textSecondary}>Name</Typography>
                                <Typography variant="body1">{selectedFeedback.name}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color={colors.textSecondary}>Email</Typography>
                                <Typography variant="body1">{selectedFeedback.email}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color={colors.textSecondary}>Subject</Typography>
                                <Typography variant="body1">{selectedFeedback.subject}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color={colors.textSecondary}>Type</Typography>
                                <Chip
                                    label={selectedFeedback.feedbackType}
                                    size="small"
                                    sx={{ bgcolor: typeColors[selectedFeedback.feedbackType], color: '#fff', mt: 0.5 }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="body2" color={colors.textSecondary}>Message</Typography>
                                <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
                                    {selectedFeedback.message}
                                </Typography>
                            </Box>
                            {selectedFeedback.adminReply && (
                                <Box sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: '1px solid #4CAF50' }}>
                                    <Stack spacing={1}>
                                        <Typography variant="body2" fontWeight="bold" color="#4CAF50">Admin Reply</Typography>
                                        <Typography variant="body2">{selectedFeedback.adminReply}</Typography>
                                        <Typography variant="caption" color={colors.textSecondary}>
                                            Replied by: {selectedFeedback.repliedBy} on {new Date(selectedFeedback.repliedAt).toLocaleDateString()}
                                        </Typography>
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    {selectedFeedback?.status !== 'Resolved' && (
                        <Button onClick={handleOpenReply} variant="contained" sx={{ bgcolor: colors.accent, color: '#000' }}>
                            <ReplyIcon sx={{ mr: 1 }} /> Reply
                        </Button>
                    )}
                    <Button onClick={() => setOpenDetailDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Reply Dialog */}
            <Dialog
                open={openReplyDialog}
                onClose={() => setOpenReplyDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { bgcolor: colors.cardBg, color: colors.text } }}
            >
                <DialogTitle>Send Reply</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Typography variant="body2" color={colors.textSecondary}>
                            Replying to: <strong>{selectedFeedback?.name}</strong>
                        </Typography>
                        <TextField
                            fullWidth
                            label="Your Reply"
                            multiline
                            rows={6}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your response here..."
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': { color: colors.text, borderColor: colors.border },
                                '& .MuiInputLabel-root': { color: colors.textSecondary }
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReplyDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmitReply}
                        variant="contained"
                        disabled={!replyText.trim()}
                        sx={{ bgcolor: colors.accent, color: '#000' }}
                    >
                        <CheckCircleIcon sx={{ mr: 1 }} /> Send Reply
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
