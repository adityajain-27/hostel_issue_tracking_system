import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, CheckCircle, Clock, AlertTriangle, Send, TrendingUp, Users } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [issues, setIssues] = useState([]);
    const [expandedIssue, setExpandedIssue] = useState(null);
    const [adminNotes, setAdminNotes] = useState({});
    const [staff, setStaff] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchIssues = async () => {
        try {
            const res = await api.get('/issues');
            setIssues(res.data);
        } catch (err) {
            toast.error('Failed to fetch issues');
        }
    };

    const fetchStaff = async () => {
        try {
            const res = await api.get('/issues/staff');
            setStaff(res.data);
        } catch (err) {
            console.error('Failed to fetch staff');
        }
    };

    useEffect(() => {
        fetchIssues();
        fetchStaff();
    }, []);

    const handleStatusUpdate = async (id, action) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            let data = {};
            if (action === 'resolve') {
                data = { admin_note: adminNotes[id] || 'Resolved by admin' };
            } else if (action === 'open') {
                if (!assignments[id]) {
                    toast.error('Please assign a staff member', { id: loadingToast });
                    return;
                }
                data = { assigned_user_id: assignments[id] };
            }

            await api.put(`/issues/${id}/${action}`, data);
            toast.success(`Issue ${action === 'open' ? 'assigned' : 'resolved'}`, { id: loadingToast });
            fetchIssues();
            setExpandedIssue(null);
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data?.error || 'Update failed', { id: loadingToast });
        }
    };

    const handleAnnouncement = async (e) => {
        e.preventDefault();
        const loading = toast.loading('Publishing announcement...');
        try {
            await api.post('/announcements', newAnnouncement);
            toast.success('Announcement published', { id: loading });
            setNewAnnouncement({ title: '', message: '' });
            window.location.reload();
        } catch (err) {
            toast.error('Failed to publish', { id: loading });
        }
    };

    const stats = {
        total: issues.length,
        pending: issues.filter(i => i.status?.toLowerCase() === 'reported').length,
        inProgress: issues.filter(i => i.status?.toLowerCase() === 'in_progress' || i.status?.toLowerCase() === 'open').length,
        resolved: issues.filter(i => i.status?.toLowerCase() === 'resolved').length
    };

    const filteredIssues = filterStatus === 'all' ? issues : issues.filter(i => {
        if (filterStatus === 'active') return i.status?.toLowerCase() !== 'resolved';
        return i.status?.toLowerCase() === filterStatus;
    });

    return (
        <div className="animate-fade-in">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '32px' }}
            >
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
                    Admin Dashboard 🛠️
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Manage all hostel issues and announcements
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                <StatCard
                    icon={ClipboardList}
                    title="Total Issues"
                    value={stats.total}
                    color="primary"
                />
                <StatCard
                    icon={AlertTriangle}
                    title="Pending"
                    value={stats.pending}
                    color="warning"
                />
                <StatCard
                    icon={Clock}
                    title="In Progress"
                    value={stats.inProgress}
                    color="info"
                />
                <StatCard
                    icon={CheckCircle}
                    title="Resolved"
                    value={stats.resolved}
                    color="success"
                />
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                {/* Issues List */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Recent Issues</h2>
                        <select
                            className="input-field"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ width: 'auto', minWidth: '150px' }}
                        >
                            <option value="all">All Issues</option>
                            <option value="active">Active Only</option>
                            <option value="reported">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <AnimatePresence>
                            {filteredIssues && filteredIssues.length > 0 ? (
                                filteredIssues.map((issue, idx) => (
                                    <motion.div
                                        key={issue.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        layout
                                        className="glass-card"
                                        style={{
                                            cursor: 'pointer',
                                            padding: '20px',
                                            border: expandedIssue === issue.id ? '2px solid var(--accent-color)' : '1px solid var(--card-border)',
                                            transition: 'all 0.3s ease',
                                            background: expandedIssue === issue.id ? 'var(--card-highlight)' : 'var(--card-bg)'
                                        }}
                                        onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '8px' }}>
                                                    {issue.title}
                                                </h3>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                                    <Badge
                                                        variant={
                                                            issue.status?.toLowerCase() === 'resolved' ? 'success' :
                                                                issue.status?.toLowerCase() === 'in_progress' ? 'info' :
                                                                    'warning'
                                                        }
                                                        size="small"
                                                    >
                                                        {issue.status?.toUpperCase() || 'REPORTED'}
                                                    </Badge>
                                                    <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                                                        {issue.category || 'Other'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                                                {(issue.status?.toLowerCase() === 'reported' || issue.status?.toLowerCase() === 'open') && (
                                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                        <select
                                                            className="input-field"
                                                            style={{ padding: '6px 10px', fontSize: '0.75rem', width: '140px' }}
                                                            value={assignments[issue.id] || ''}
                                                            onChange={(e) => setAssignments({ ...assignments, [issue.id]: e.target.value })}
                                                        >
                                                            <option value="">Assign To...</option>
                                                            {staff.map(s => (
                                                                <option key={s.id} value={s.id}>
                                                                    {s.name} {s.staff_specialty ? `(${s.staff_specialty})` : ''}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleStatusUpdate(issue.id, 'open')}
                                                            className="btn btn-primary btn-sm"
                                                            style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                                                        >
                                                            Start
                                                        </motion.button>
                                                    </div>
                                                )}
                                                {issue.status?.toLowerCase() === 'in_progress' && (
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                                                        ASSIGNED: {issue.assigned_staff_name?.toUpperCase() || 'STAFF'}
                                                    </span>
                                                )}
                                                {issue.status !== 'resolved' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleStatusUpdate(issue.id, 'resolve')}
                                                        className="btn btn-success btn-sm"
                                                        style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                                                    >
                                                        Resolve
                                                    </motion.button>
                                                )}
                                            </div>
                                        </div>


                                        <AnimatePresence>
                                            {expandedIssue === issue.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, translateY: -10 }}
                                                    animate={{ opacity: 1, translateY: 0 }}
                                                    exit={{ opacity: 0, translateY: -10 }}
                                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                                    style={{
                                                        marginTop: '16px',
                                                        paddingTop: '16px',
                                                        borderTop: '1px solid var(--card-border)'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div style={{ marginBottom: '16px' }}>
                                                        <strong style={{
                                                            fontSize: '0.75rem',
                                                            color: 'var(--text-secondary)',
                                                            display: 'block',
                                                            marginBottom: '6px',
                                                            letterSpacing: '1px'
                                                        }}>
                                                            DESCRIPTION
                                                        </strong>
                                                        <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                                            {issue.description}
                                                        </p>
                                                        {issue.image_url && (
                                                            <div style={{ marginTop: '12px' }}>
                                                                <img
                                                                    src={`http://localhost:5000/${issue.image_url}`}
                                                                    alt="Proof"
                                                                    style={{
                                                                        maxWidth: '100%',
                                                                        maxHeight: '250px',
                                                                        borderRadius: 'var(--radius-md)',
                                                                        border: '1px solid var(--card-border)',
                                                                        objectFit: 'cover'
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                                        gap: '12px',
                                                        fontSize: '0.85rem',
                                                        color: 'var(--text-secondary)',
                                                        background: 'var(--card-highlight)',
                                                        padding: '16px',
                                                        borderRadius: 'var(--radius-md)',
                                                        marginBottom: '16px'
                                                    }}>
                                                        <div>
                                                            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                Student
                                                            </strong>
                                                            {issue.student_name || 'Student'}
                                                        </div>
                                                        <div>
                                                            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                Location
                                                            </strong>
                                                            {issue.hostel_name} / {issue.block_name} / {issue.room_number}
                                                        </div>
                                                        <div>
                                                            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                Priority
                                                            </strong>
                                                            <span style={{
                                                                color: issue.priority === 'High' ? 'var(--error-600)' :
                                                                    issue.priority === 'Medium' ? 'var(--warning-600)' :
                                                                        'var(--success-600)',
                                                                fontWeight: '600'
                                                            }}>
                                                                {issue.priority || 'Medium'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                Date
                                                            </strong>
                                                            {new Date(issue.created_at).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>

                                                    {issue.status?.toLowerCase() !== 'resolved' && (
                                                        <div style={{ marginBottom: '16px' }}>
                                                            <label style={{
                                                                fontSize: '0.8rem',
                                                                fontWeight: '600',
                                                                color: 'var(--text-secondary)',
                                                                marginBottom: '6px',
                                                                display: 'block',
                                                                letterSpacing: '0.5px'
                                                            }}>
                                                                ADD RESOLUTION NOTE
                                                            </label>
                                                            <textarea
                                                                className="input-field"
                                                                placeholder="Type admin note here..."
                                                                rows="2"
                                                                value={adminNotes[issue.id] || ''}
                                                                onChange={(e) => setAdminNotes({ ...adminNotes, [issue.id]: e.target.value })}
                                                                style={{ fontSize: '0.9rem' }}
                                                            />
                                                        </div>
                                                    )}

                                                    {issue.admin_note && (
                                                        <div style={{
                                                            marginTop: '16px',
                                                            padding: '16px',
                                                            background: 'var(--accent-glow)',
                                                            borderRadius: 'var(--radius-md)',
                                                            borderLeft: '4px solid var(--accent-color)',
                                                            marginBottom: '16px'
                                                        }}>
                                                            <strong style={{
                                                                color: 'var(--accent-color)',
                                                                fontSize: '0.75rem',
                                                                display: 'block',
                                                                marginBottom: '8px',
                                                                letterSpacing: '1px'
                                                            }}>
                                                                ADMIN NOTE
                                                            </strong>
                                                            <p style={{
                                                                fontSize: '0.95rem',
                                                                color: 'var(--text-primary)',
                                                                fontStyle: 'italic',
                                                                lineHeight: '1.5'
                                                            }}>
                                                                "{issue.admin_note}"
                                                            </p>
                                                        </div>
                                                    )}

                                                    <CommentSection issueId={issue.id} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))
                            ) : (
                                <EmptyState
                                    icon={ClipboardList}
                                    title="No issues found"
                                    message={filterStatus !== 'all' ? 'Try changing the filter.' : 'No issues to review.'}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Announcements Section */}
                <div>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: '700' }}>
                        New Announcement
                    </h2>
                    <form onSubmit={handleAnnouncement} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                                marginBottom: '6px',
                                display: 'block'
                            }}>
                                Title
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Maintenance Schedule"
                                className="input-field"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                                marginBottom: '6px',
                                display: 'block'
                            }}>
                                Message
                            </label>
                            <textarea
                                placeholder="Type your announcement message..."
                                className="input-field"
                                rows="5"
                                value={newAnnouncement.message}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                                required
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            <Send size={18} />
                            Publish Announcement
                        </motion.button>
                    </form>
                </div>
            </div>

            {/* Responsive Styles */}
            <style jsx>{`
                @media (max-width: 1024px) {
                    div[style*="gridTemplateColumns: '1.5fr 1fr'"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
