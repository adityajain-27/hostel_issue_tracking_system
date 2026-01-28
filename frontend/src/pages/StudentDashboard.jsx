import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, ClipboardList, Info } from 'lucide-react';

const StudentDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Maintenance',
        priority: 'Medium',
        is_public: false
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loading = toast.loading('Submitting issue...');
        try {
            await api.post('/issues', formData);
            toast.success('Issue reported successfully!', { id: loading });
            setFormData({
                title: '',
                description: '',
                category: 'Maintenance',
                priority: 'Medium',
                is_public: false
            });
            fetchMyIssues();
        } catch (err) {
            toast.error('Failed to submit issue', { id: loading });
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><PlusCircle color="var(--accent-color)" /> Report New Issue</h2>
                <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Issue Title (e.g., Leaking Fan)"
                        className="input-field"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>Category</label>
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
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>Priority</label>
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

                    <textarea
                        placeholder="Detailed description..."
                        className="input-field"
                        rows="5"
                        style={{ resize: 'none' }}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={formData.is_public}
                            onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                        />
                        <label htmlFor="isPublic">Make this issue public? (Visible on home page)</label>
                    </div>
                    <button type="submit" className="btn-primary">Submit Report</button>
                </form>
            </motion.div>

            <div>
                <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><ClipboardList color="var(--accent-color)" /> My Reported Issues</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <AnimatePresence>
                        {issues.length > 0 ? issues.map(issue => (
                            <motion.div
                                key={issue.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <h3 style={{ fontSize: '1.1rem' }}>{issue.title}</h3>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        background: issue.status === 'resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                        color: issue.status === 'resolved' ? 'var(--success)' : 'var(--warning)',
                                        border: `1px solid ${issue.status === 'resolved' ? 'var(--success)' : 'var(--warning)'}`
                                    }}>
                                        {issue.status.toUpperCase()}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px' }}>{issue.description}</p>
                            </motion.div>
                        )) : (
                            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
                                <Info size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                                <p>No issues reported yet.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
};

export default StudentDashboard;
