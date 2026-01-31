import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, ClipboardList, Upload, X, Image as ImageIcon } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [issues, setIssues] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Maintenance',
        priority: 'Medium',
        is_public: false
    });
    const [expandedIssue, setExpandedIssue] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchMyIssues = async () => {
        try {
            const res = await api.get('/issues/my');
            setIssues(res.data);
        } catch (err) {
            toast.error('Failed to load your issues');
        }
    };

    useEffect(() => {
        fetchMyIssues();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loading = toast.loading('Submitting issue...');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('priority', formData.priority);
        data.append('is_public', formData.is_public);
        if (image) {
            data.append('image', image);
        }

        try {
            await api.post('/issues', data);
            toast.success('Issue reported successfully!', { id: loading });
            setFormData({
                title: '',
                description: '',
                category: 'Maintenance',
                priority: 'Medium',
                is_public: false
            });
            setImage(null);
            setImagePreview(null);
            fetchMyIssues();
        } catch (err) {
            toast.error('Failed to submit issue', { id: loading });
        }
    };

    const stats = {
        total: issues.length,
        resolved: issues.filter(i => i.status?.toLowerCase() === 'resolved').length,
        pending: issues.filter(i => i.status?.toLowerCase() === 'reported').length,
        inProgress: issues.filter(i => i.status?.toLowerCase() === 'in_progress' || i.status?.toLowerCase() === 'open').length
    };

    return (
        <div className="animate-fade-in">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '32px' }}
            >
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
                    Welcome back, {user?.name || 'Student'}! 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Manage your hostel issues and track their progress
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                    icon={PlusCircle}
                    title="Pending"
                    value={stats.pending}
                    color="warning"
                />
                <StatCard
                    icon={ClipboardList}
                    title="In Progress"
                    value={stats.inProgress}
                    color="info"
                />
                <StatCard
                    icon={ClipboardList}
                    title="Resolved"
                    value={stats.resolved}
                    color="success"
                />
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px' }}>
                {/* Report Form */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 style={{
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '1.5rem'
                    }}>
                        <PlusCircle size={28} style={{ color: 'var(--accent-color)' }} />
                        Report New Issue
                    </h2>
                    <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                                marginBottom: '6px',
                                display: 'block'
                            }}>
                                Issue Title
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Leaking Pipe in Room 301"
                                className="input-field"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '6px',
                                    display: 'block'
                                }}>
                                    Category
                                </label>
                                <select
                                    className="input-field"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Security">Security</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={{
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '6px',
                                    display: 'block'
                                }}>
                                    Priority
                                </label>
                                <select
                                    className="input-field"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                                marginBottom: '6px',
                                display: 'block'
                            }}>
                                Description
                            </label>
                            <textarea
                                placeholder="Provide detailed information about the issue..."
                                className="input-field"
                                rows="4"
                                style={{ resize: 'vertical' }}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                Upload Image (Optional)
                            </label>
                            {imagePreview ? (
                                <div style={{ position: 'relative', marginTop: '8px' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: 'var(--radius-md)',
                                            border: '2px solid var(--card-border)'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: 'var(--error-500)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            boxShadow: 'var(--shadow-md)'
                                        }}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <label style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '30px',
                                    border: '2px dashed var(--card-border)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)',
                                    background: 'var(--card-highlight)'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
                                >
                                    <Upload size={32} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        Click to upload image
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={formData.is_public}
                                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                            />
                            <label htmlFor="isPublic" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                                Make this issue public (Visible on home page)
                            </label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '8px' }}
                        >
                            <PlusCircle size={20} />
                            Submit Report
                        </motion.button>
                    </form>
                </motion.div>

                {/* My Issues List */}
                <div>
                    <h2 style={{
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '1.5rem'
                    }}>
                        <ClipboardList size={28} style={{ color: 'var(--accent-color)' }} />
                        My Reported Issues
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <AnimatePresence>
                            {issues && issues.length > 0 ? (
                                issues.map((issue, idx) => (
                                    <motion.div
                                        key={issue.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: expandedIssue === issue.id ? '16px' : '0' }}>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
                                                    {issue.title}
                                                </h3>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        color: issue.priority === 'High' ? 'var(--error-600)' :
                                                            issue.priority === 'Medium' ? 'var(--warning-600)' :
                                                                'var(--text-tertiary)',
                                                        fontWeight: '600'
                                                    }}>
                                                        {issue.priority} Priority
                                                    </span>
                                                </div>
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
                                                                    alt="Issue proof"
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
                                                                Location
                                                            </strong>
                                                            {issue.hostel_name} ({issue.block_name}) - Room {issue.room_number}
                                                        </div>
                                                        <div>
                                                            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                Assigned To
                                                            </strong>
                                                            {issue.assigned_staff_name ?
                                                                `${issue.assigned_staff_name} ${issue.staff_specialty ? `(${issue.staff_specialty})` : ''}` :
                                                                'Not yet assigned'}
                                                        </div>
                                                        <div>
                                                            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                Reported On
                                                            </strong>
                                                            {new Date(issue.created_at).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                        <div>
                                                            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                                Time
                                                            </strong>
                                                            {new Date(issue.created_at).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>

                                                    {issue.admin_note && (
                                                        <div style={{
                                                            marginTop: '16px',
                                                            padding: '16px',
                                                            background: 'var(--accent-glow)',
                                                            borderRadius: 'var(--radius-md)',
                                                            borderLeft: '4px solid var(--accent-color)'
                                                        }}>
                                                            <strong style={{
                                                                color: 'var(--accent-color)',
                                                                fontSize: '0.75rem',
                                                                display: 'block',
                                                                marginBottom: '8px',
                                                                letterSpacing: '1px'
                                                            }}>
                                                                ADMIN RESPONSE
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
                                    title="No issues reported yet"
                                    message="Start by reporting your first issue using the form on the left."
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Responsive Styles */}
            <style jsx>{`
                @media (max-width: 1024px) {
                    div[style*="gridTemplateColumns: '1fr 1.2fr'"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default StudentDashboard;
