import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ShieldCheck, MessageSquare } from 'lucide-react';

const Home = () => {
    const [publicIssues, setPublicIssues] = useState([]);
    const [expandedIssue, setExpandedIssue] = useState(null);

    useEffect(() => {
        const fetchPublicIssues = async () => {
            try {
                const res = await api.get('/issues/public');
                setPublicIssues(res.data);
            } catch (err) {
                console.error('Failed to fetch public issues');
            }
        };
        fetchPublicIssues();
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '60px 0' }}
            >
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '10px' }}>
                    Hostel<span style={{ color: 'var(--accent-color)' }}>Flow</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Transparent, fast, and efficient hostel issue management.
                </p>
            </motion.div>

            <div style={{ padding: '20px 0', textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem' }}>
                    <ShieldCheck color="var(--accent-color)" /> Community Issue Board
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {publicIssues && publicIssues.length > 0 ? (
                        Object.entries(publicIssues.reduce((acc, issue) => {
                            const cat = issue.category || 'Other';
                            acc[cat] = acc[cat] || [];
                            acc[cat].push(issue);
                            return acc;
                        }, {})).map(([category, catIssues]) => (
                            <div key={category}>
                                <h3 style={{ fontSize: '0.75rem', color: 'var(--accent-color)', letterSpacing: '2px', marginBottom: '15px', opacity: 0.8, borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                                    {category.toUpperCase()}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                                    {catIssues.map(issue => (
                                        <motion.div
                                            key={issue.id}
                                            layout
                                            className="glass-card"
                                            style={{ cursor: 'pointer', border: expandedIssue === issue.id ? '1px solid var(--accent-color)' : '1px solid var(--card-border)' }}
                                            onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: expandedIssue === issue.id ? '15px' : '0' }}>
                                                <MessageSquare size={16} color="var(--accent-color)" />
                                                <h3 style={{ fontSize: '0.95rem', fontWeight: '500' }}>{issue.title}</h3>
                                            </div>

                                            {expandedIssue === issue.id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px', lineHeight: '1.5' }}>
                                                        {issue.description}
                                                    </p>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '10px', fontSize: '0.75rem' }}>
                                                        <span style={{ opacity: 0.7 }}>By: {issue.student_name || 'Student'}</span>
                                                        <span style={{ color: issue.status?.toLowerCase() === 'resolved' ? 'var(--success)' : 'var(--warning)', fontWeight: 'bold' }}>
                                                            {issue.status?.toUpperCase() || 'REPORTED'}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <p>No public issues reported yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
