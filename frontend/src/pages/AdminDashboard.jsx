import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';

const AdminDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

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
            await api.put(`/issues/${id}/${action}`, {});
            toast.success(`Issue ${action === 'open' ? 'in progress' : 'resolved'}`, { id: loadingToast });
            fetchIssues();
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data?.error || 'Update failed', { id: loadingToast });
        }
    };

    const handleAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await api.post('/announcements', newAnnouncement);
            toast.success('Announcement published');
            setNewAnnouncement({ title: '', content: '' });
            window.location.reload(); // Refresh to update ticker
        } catch (err) {
            toast.error('Failed to publish');
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <div>
                <h2 style={{ marginBottom: '20px' }}>Recent Issues</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <AnimatePresence>
                        {issues.map(issue => (
                            <motion.div
                                key={issue.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="glass-card"
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <div>
                                    <h3 style={{ fontSize: '1.1rem' }}>{issue.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{issue.description}</p>
                                    <p style={{ marginTop: '5px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        Status: <span style={{ color: issue.status === 'resolved' ? 'var(--success)' : 'var(--warning)' }}>
                                            {issue.status.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                                {(issue.status?.toLowerCase() === 'reported' || issue.status?.toLowerCase() === 'open') && (
                                    <button
                                        onClick={() => handleStatusUpdate(issue.id, 'open')}
                                        className="btn-primary"
                                        style={{ padding: '8px 16px', background: 'var(--accent-color)', boxShadow: 'none' }}
                                    >
                                        Start Progress
                                    </button>
                                )}
                                {issue.status !== 'resolved' && (
                                    <button
                                        onClick={() => handleStatusUpdate(issue.id, 'resolve')}
                                        className="btn-primary"
                                        style={{ padding: '8px 16px', background: 'var(--success)', boxShadow: 'none' }}
                                    >
                                        Resolve
                                    </button>
                                )}
                            </motion.div>
                        ))}
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
                        style={{ resize: 'none' }}
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
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
