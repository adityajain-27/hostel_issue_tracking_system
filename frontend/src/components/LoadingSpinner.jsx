import React from 'react';

const LoadingSpinner = ({ size = 'default', centered = false }) => {
    const sizeClass = size === 'small' ? 'spinner-sm' : '';

    const spinner = <div className={`spinner ${sizeClass}`}></div>;

    if (centered) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
                width: '100%'
            }}>
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
