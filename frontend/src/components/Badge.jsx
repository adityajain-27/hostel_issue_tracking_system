import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Badge = ({ variant = 'primary', children, icon = false, size = 'default' }) => {
    const variantClass = `badge-${variant}`;
    const sizeStyle = size === 'small' ? { fontSize: '0.65rem', padding: '2px 8px' } : {};

    const icons = {
        success: <CheckCircle size={12} />,
        error: <AlertCircle size={12} />,
        warning: <AlertTriangle size={12} />,
        info: <Info size={12} />
    };

    return (
        <span className={`badge ${variantClass}`} style={sizeStyle}>
            {icon && icons[variant]}
            {children}
        </span>
    );
};

export default Badge;
