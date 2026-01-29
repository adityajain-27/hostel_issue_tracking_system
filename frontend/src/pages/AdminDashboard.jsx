import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, CheckCircle, Clock, AlertTriangle, PlayCircle, AlertCircle, Send } from 'lucide-react';
import CommentSection from '../components/CommentSection';

const AdminDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [expandedIssue, setExpandedIssue] = useState(null);
    const [adminNotes, setAdminNotes] = useState({});
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });

    const fetchIssues = async () => {
        try {
            const res = await api.get('/issues');
            setIssues(res.data);
        } catch (err) {
            toast.error('Failed to fetch issues');
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const handleStatusUpdate = async (id, action) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            const data = action === 'resolve' ? { admin_note: adminNotes[id] || 'Resolved by admin' } : {};
            await api.put(`/issues/${id}/${action}`, data);
            toast.success(`Issue ${action === 'open' ? 'in progress' : 'resolved'}`, { id: loadingToast });
            fetchIssues();
            setExpandedIssue(null);
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data?.error || 'Update failed', { id: loadingToast });
        }
    };

    const handleAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await api.post('/announcements', newAnnouncement);
            toast.success('Announcement published');
            setNewAnnouncement({ title: '', message: '' });
            window.location.reload(); // Refresh to update ticker
        } catch (err) {
            toast.error('Failed to publish');
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <div>
                <h2 style={{ marginBottom: '20px' }}>Recent Issues</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <AnimatePresence>
                        {issues && issues.length > 0 ? (
                            Object.entries(issues.reduce((acc, issue) => {
                                const cat = issue.category || 'Other';
                                acc[cat] = acc[cat] || [];
                                acc[cat].push(issue);
                                return acc;
                            }, {})).map(([category, catIssues]) => (
                                <div key={category}>
                                    <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '2px', marginBottom: '12px', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px' }}>
                                        {category.toUpperCase()}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {catIssues.map(issue => (
                                            <motion.div
                                                key={issue.id}
                                                layout
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="glass-card"
                                                style={{ cursor: 'pointer', padding: '15px 20px', border: expandedIssue === issue.id ? '1px solid var(--accent-color)' : '1px solid var(--card-border)' }}
                                                onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <h3 style={{ fontSize: '1rem', fontWeight: '500' }}>{issue.title}</h3>
                                                        <span style={{ fontSize: '0.65rem', color: issue.status?.toLowerCase() === 'resolved' ? 'var(--success)' : 'var(--warning)', fontWeight: 'bold' }}>
                                                            {issue.status?.toUpperCase() || 'REPORTED'}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                                                        {(issue.status?.toLowerCase() === 'reported' || issue.status?.toLowerCase() === 'open') && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(issue.id, 'open')}
                                                                className="btn-primary"
                                                                style={{ padding: '6px 12px', fontSize: '0.7rem', background: 'var(--accent-color)', boxShadow: 'none' }}
                                                            >
                                                                Start
                                                            </button>
                                                        )}
                                                        {issue.status !== 'resolved' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(issue.id, 'resolve')}
                                                                className="btn-primary"
                                                                style={{ padding: '6px 12px', fontSize: '0.7rem', background: 'var(--success)', boxShadow: 'none' }}
                                                            >
                                                                Resolve
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {expandedIssue === issue.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--card-border)' }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div style={{ marginBottom: '15px' }}>
                                                            <strong style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>DESCRIPTION</strong>
                                                            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{issue.description}</p>
                                                            {issue.image_url && (
                                                                <div style={{ marginTop: '10px' }}>
                                                                    <img
                                                                        src={`http://localhost:5000/${issue.image_url}`}
                                                                        alt="Proof"
                                                                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid var(--card-border)' }}
                                                                    />
                                                                </div>
                                                            )}
                                                            <CommentSection issueId={issue.id} />
                                                        </div>

                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                                                            <div><strong>Student:</strong> {issue.student_name || 'Student'}</div>
                                                            <div><strong>Location:</strong> {issue.hostel_name} / {issue.block_name} / {issue.room_number}</div>
                                                            <div><strong>Priority:</strong> {issue.priority || 'Medium'}</div>
                                                            <div><strong>Date:</strong> {new Date(issue.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                            <div><strong>Time:</strong> {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        </div>

                                                        {issue.status?.toLowerCase() !== 'resolved' && (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                                                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>ADD RESOLUTION NOTE</label>
                                                                <textarea
                                                                    className="input-field"
                                                                    placeholder="Type admin note here..."
                                                                    rows="2"
                                                                    value={adminNotes[issue.id] || ''}
                                                                    onChange={(e) => setAdminNotes({ ...adminNotes, [issue.id]: e.target.value })}
                                                                    style={{ fontSize: '0.85rem' }}
                                                                />
                                                            </div>
                                                        )}

                                                        {issue.admin_note && (
                                                            <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '10px', borderLeft: '4px solid var(--accent-color)' }}>
                                                                <strong style={{ color: 'var(--accent-color)', fontSize: '0.7rem', display: 'block', marginBottom: '5px' }}>ADMIN NOTE</strong>
                                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>"{issue.admin_note}"</p>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
                                <AlertCircle size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                <p>No issues to review.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div>
                <h2 style={{ marginBottom: '20px' }}>New Announcement</h2>
                <form onSubmit={handleAnnouncement} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Announcement Title"
                        className="input-field"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Content..."
                        className="input-field"
                        rows="4"
                        value={newAnnouncement.message}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                        required
                    />
                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Send size={18} /> Publish
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
