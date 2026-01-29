import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, ClipboardList, UserPlus, Search, Menu, X, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkStyle = ({ isActive }) => ({
        color: isActive ? 'var(--accent-color)' : 'var(--text-primary)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
        fontWeight: '500',
        fontSize: '0.95rem',
        position: 'relative',
        background: isActive ? 'var(--accent-glow)' : 'transparent'
    });

    const navLinks = (
        <>
            <NavLink to="/" style={navLinkStyle}>
                <Home size={18} /> Home
            </NavLink>

            {user?.role === 'student' && (
                <NavLink to="/dashboard" style={navLinkStyle}>
                    <ClipboardList size={18} /> My Issues
                </NavLink>
            )}

            {user && (
                <>
                    <NavLink to="/announcements" style={navLinkStyle}>
                        <Megaphone size={18} /> News
                    </NavLink>
                    <NavLink to="/lost-and-found" style={navLinkStyle}>
                        <Search size={18} /> Lost & Found
                    </NavLink>
                </>
            )}

            {user?.role === 'admin' && (
                <>
                    <NavLink to="/admin" style={navLinkStyle}>
                        <ClipboardList size={18} /> Manage Issues
                    </NavLink>
                    <NavLink to="/admin/students" style={navLinkStyle}>
                        <UserPlus size={18} /> Register User
                    </NavLink>
                </>
            )}
        </>
    );

    return (
        <nav
            className="glass-card"
            style={{
                borderRadius: '0 0 16px 16px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 40px',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'var(--card-bg)',
                backdropFilter: 'var(--glass-blur)'
            }}
        >
            {/* Logo */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}
                onClick={() => navigate('/')}
            >
                HostelFlow
            </motion.div>

            {/* Desktop Navigation */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="desktop-nav">
                {navLinks}

                <ThemeToggle />

                {user ? (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="btn btn-primary btn-sm"
                        style={{ marginLeft: '8px' }}
                    >
                        <LogOut size={16} /> Logout
                    </motion.button>
                ) : (
                    <NavLink to="/login" className="btn btn-primary btn-sm" style={{ marginLeft: '8px', textDecoration: 'none' }}>
                        Login
                    </NavLink>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div style={{ display: 'none' }} className="mobile-menu-btn">
                <ThemeToggle />
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '8px'
                    }}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mobile-nav"
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'var(--card-bg)',
                            backdropFilter: 'var(--glass-blur)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '0 0 16px 16px',
                            padding: '16px',
                            display: 'none',
                            flexDirection: 'column',
                            gap: '8px',
                            marginTop: '1px'
                        }}
                    >
                        {navLinks}
                        {user ? (
                            <button onClick={handleLogout} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        ) : (
                            <NavLink to="/login" className="btn btn-primary btn-sm" style={{ width: '100%', textDecoration: 'none' }}>
                                Login
                            </NavLink>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Responsive Styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: flex !important;
                        align-items: center;
                    }
                    .mobile-nav {
                        display: flex !important;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
