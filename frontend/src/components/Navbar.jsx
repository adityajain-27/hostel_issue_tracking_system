import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, ClipboardList, UserPlus, Bell, Search } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-card" style={{ borderRadius: '0 0 16px 16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                HostelFlow
            </div>

            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                <NavLink to="/" style={({ isActive }) => ({ color: isActive ? 'var(--accent-color)' : 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' })}>
                    <Home size={18} /> Home
                </NavLink>

                {user?.role === 'student' && (
                    <NavLink to="/dashboard" style={({ isActive }) => ({ color: isActive ? 'var(--accent-color)' : 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' })}>
                        <ClipboardList size={18} /> My Issues
                    </NavLink>
                )}

                {user && (
                    <NavLink to="/lost-and-found" style={({ isActive }) => ({ color: isActive ? 'var(--accent-color)' : 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' })}>
                        <Search size={18} /> Lost & Found
                    </NavLink>
                )}

                {user?.role === 'admin' && (
                    <>
                        <NavLink to="/admin" style={({ isActive }) => ({ color: isActive ? 'var(--accent-color)' : 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' })}>
                            <ClipboardList size={18} /> Manage Issues
                        </NavLink>
                        <NavLink to="/admin/students" style={({ isActive }) => ({ color: isActive ? 'var(--accent-color)' : 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' })}>
                            <UserPlus size={18} /> Register New User
                        </NavLink>
                    </>
                )}

                {user ? (
                    <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <LogOut size={18} /> Logout
                    </button>
                ) : (
                    <NavLink to="/login" className="btn-primary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
                        Login
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
