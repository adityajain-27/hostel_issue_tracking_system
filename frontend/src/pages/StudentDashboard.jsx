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
    const [expandedIssue, setExpandedIssue] = useState(null);

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

    const [image, setImage] = useState(null);

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
            await api.post('/issues', data); // Let browser set Content-Type with boundary
            toast.success('Issue reported successfully!', { id: loading });
            setFormData({
                title: '',
                description: '',
                category: 'Maintenance',
                priority: 'Medium',
                is_public: false
            });
            setImage(null);
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

                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>Upload Image Proof (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="input-field"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>

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
                                    <h3 style={{ fontSize: '0.75rem', color: 'var(--accent-color)', opacity: 0.8, letterSpacing: '2px', marginBottom: '12px', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px' }}>
                                        {category.toUpperCase()}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {catIssues.map(issue => (
                                            <motion.div
                                                key={issue.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="glass-card"
                                                style={{ cursor: 'pointer', padding: '15px 20px', border: expandedIssue === issue.id ? '1px solid var(--accent-color)' : '1px solid var(--card-border)' }}
                                                onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: '500' }}>{issue.title}</h3>
                                                    <span style={{
                                                        padding: '2px 10px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.65rem',
                                                        fontWeight: 'bold',
                                                        background: issue.status?.toLowerCase() === 'resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                                        color: issue.status?.toLowerCase() === 'resolved' ? 'var(--success)' : 'var(--warning)',
                                                        border: `1px solid ${issue.status?.toLowerCase() === 'resolved' ? 'var(--success)' : 'var(--warning)'}`
                                                    }}>
                                                        {issue.status?.toUpperCase() || 'REPORTED'}
                                                    </span>
                                                </div>

                                                {expandedIssue === issue.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--card-border)' }}
                                                    >
                                                        <div style={{ marginBottom: '12px' }}>
                                                            <strong style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>DESCRIPTION</strong>
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
                                                        </div>

                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                                                            <div><strong>Reported by:</strong> {issue.student_name || 'Student'}</div>
                                                            <div><strong>Priority:</strong> {issue.priority || 'Medium'}</div>
                                                            <div><strong>Date:</strong> {new Date(issue.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                            <div><strong>Time:</strong> {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                        </div>

                                                        {issue.admin_note && (
                                                            <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', borderLeft: '4px solid var(--accent-color)' }}>
                                                                <strong style={{ color: 'var(--accent-color)', fontSize: '0.75rem', display: 'block', marginBottom: '5px' }}>ADMIN RESPONSE</strong>
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
