import React from 'react';
import Navbar from './Navbar';
import AnnouncementTicker from './AnnouncementTicker';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AnnouncementTicker />
            <Navbar />
            <main style={{ flex: 1, padding: '0 40px 40px 40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                {children}
            </main>
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: '#18181b',
                    color: '#fff',
                    border: '1px solid var(--card-border)',
                    backdropFilter: 'blur(10px)'
                }
            }} />
        </div>
    );
};

export default Layout;
