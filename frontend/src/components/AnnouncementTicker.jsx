import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Megaphone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementTicker = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get('/announcements');
                setAnnouncements(res.data);
            } catch (err) {
                console.error('Failed to fetch announcements', err);
            }
        };
        fetchAnnouncements();
    }, []);

    if (!isVisible || announcements.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ticker-container"
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px'
                }}
            >
                <Megaphone
                    size={20}
                    style={{
                        color: 'var(--accent-color)',
                        flexShrink: 0,
                        animation: 'pulse 2s ease-in-out infinite'
                    }}
                />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div className="ticker-text">
                        {announcements.map((a, idx) => (
                            <span key={a.id} style={{ marginRight: '40px' }}>
                                <strong>{a.title}:</strong> {a.message}
                                {idx < announcements.length - 1 && ' | '}
                            </span>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                        transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                    aria-label="Close announcements"
                >
                    <X size={18} />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default AnnouncementTicker;
