import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ShieldCheck, MessageSquare } from 'lucide-react';

const Home = () => {
    const [publicIssues, setPublicIssues] = useState([]);

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
                style={{ padding: '80px 0' }}
            >
                <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '10px' }}>
                    Hostel<span style={{ color: 'var(--accent-color)' }}>Flow</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Transparent, fast, and efficient hostel issue management. Report issues, track progress, and stay updated.
                </p>
            </motion.div>

            <div style={{ padding: '40px 0' }}>
                <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <ShieldCheck color="var(--accent-color)" /> Community Issue Board
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {publicIssues.map(issue => (
                        <motion.div
                            key={issue.id}
                            whileHover={{ y: -5 }}
                            className="glass-card"
                            style={{ textAlign: 'left' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <MessageSquare size={16} color="var(--accent-color)" />
                                <h3 style={{ fontSize: '1rem' }}>{issue.title}</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{issue.description}</p>
                            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Reported by: Student</span>
                                <span style={{ fontSize: '0.75rem', color: issue.status === 'resolved' ? 'var(--success)' : 'var(--warning)' }}>
                                    ● {issue.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
