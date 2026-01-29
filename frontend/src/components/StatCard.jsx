import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, trend, color = 'primary' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '4px',
                        fontWeight: '500'
                    }}>
                        {title}
                    </p>
                    <h3 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        lineHeight: '1'
                    }}>
                        {value}
                    </h3>
                    {trend && (
                        <p style={{
                            fontSize: '0.75rem',
                            color: trend.positive ? 'var(--success-600)' : 'var(--error-600)',
                            marginTop: '8px',
                            fontWeight: '600'
                        }}>
                            {trend.positive ? '↑' : '↓'} {trend.value}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div style={{
                        background: `var(--${color}-100)`,
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        color: `var(--${color}-600)`
                    }}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StatCard;
