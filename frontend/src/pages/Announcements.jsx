import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, User } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get('/announcements');
                setAnnouncements(res.data);
            } catch (err) {
                toast.error('Failed to fetch announcements');
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <Megaphone size={32} style={{ color: 'var(--accent-color)' }} />
                    News & Announcements
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Stay updated with the latest hostel news and important announcements
                </p>
            </div>

            {/* Announcements List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </div>
                ) : announcements && announcements.length > 0 ? (
                    announcements.map((announcement, idx) => (
                        <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="glass-card"
                            style={{
                                padding: '28px',
                                borderLeft: '4px solid var(--accent-color)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Decorative gradient */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '150px',
                                height: '150px',
                                background: 'var(--gradient-blue)',
                                opacity: 0.05,
                                borderRadius: '50%',
                                transform: 'translate(50%, -50%)'
                            }}></div>

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                {/* Title */}
                                <h2 style={{
                                    fontSize: '1.4rem',
                                    fontWeight: '700',
                                    marginBottom: '12px',
                                    color: 'var(--text-primary)'
                                }}>
                                    {announcement.title}
                                </h2>

                                {/* Message */}
                                <p style={{
                                    fontSize: '1rem',
                                    lineHeight: '1.7',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '16px',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {announcement.message}
                                </p>

                                {/* Footer */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingTop: '16px',
                                    borderTop: '1px solid var(--card-border)',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-tertiary)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <User size={16} />
                                        <span>Posted by Admin</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar size={16} />
                                        <span>{formatDate(announcement.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <EmptyState
                        icon={Megaphone}
                        title="No announcements yet"
                        message="Check back later for important updates and news from the hostel administration."
                    />
                )}
            </div>
        </div>
    );
};

export default Announcements;
