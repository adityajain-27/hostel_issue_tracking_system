import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, message, action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--text-secondary)'
            }}
        >
            {Icon && (
                <div style={{
                    marginBottom: '20px',
                    opacity: 0.5
                }}>
                    <Icon size={64} strokeWidth={1.5} />
                </div>
            )}
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '8px'
            }}>
                {title}
            </h3>
            <p style={{
                fontSize: '0.95rem',
                marginBottom: '24px',
                maxWidth: '400px',
                margin: '0 auto'
            }}>
                {message}
            </p>
            {action && (
                <div style={{ marginTop: '24px' }}>
                    {action}
                </div>
            )}
        </motion.div>
    );
};

export default EmptyState;
