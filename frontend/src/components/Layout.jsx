import React from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '0 40px 40px 40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                {children}
            </main>
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--card-border)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }
            }} />
        </div>
    );
};

export default Layout;
