import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, User, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [selectedRole, setSelectedRole] = useState(null); // 'student' or 'admin'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Authenticating...');
        try {
            const res = await api.post('/auth/login', { email, password });

            // Verify role matches selection
            // Backend returns user: { id, name, role }
            if (res.data.user.role !== selectedRole) {
                toast.error(`This account is not a ${selectedRole}. Please use the correct portal.`, { id: loadingToast });
                return;
            }

            login(res.data);

            toast.success(`Welcome back, ${res.data.user.name}!`, { id: loadingToast });
            if (res.data.user.role === 'admin') navigate('/admin');
            else navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed', { id: loadingToast });
        }
    };

    if (!selectedRole) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: '40px' }}>
                <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '2.5rem' }}>Select Your Portal</motion.h1>
                <div style={{ display: 'flex', gap: '30px' }}>
                    <motion.div
                        whileHover={{ scale: 1.05, borderColor: 'var(--accent-color)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRole('student')}
                        className="glass-card"
                        style={{ width: '250px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}
                    >
                        <div style={{ background: 'var(--accent-glow)', padding: '20px', borderRadius: '50%' }}>
                            <User size={40} color="var(--accent-color)" />
                        </div>
                        <h3>Student Portal</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Report issues & track status</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, borderColor: 'var(--accent-color)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRole('admin')}
                        className="glass-card"
                        style={{ width: '250px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}
                    >
                        <div style={{ background: 'var(--accent-glow)', padding: '20px', borderRadius: '50%' }}>
                            <ShieldCheck size={40} color="var(--accent-color)" />
                        </div>
                        <h3>Admin Portal</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage records & announcements</p>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <button
                    onClick={() => setSelectedRole(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginBottom: '10px', fontSize: '0.9rem', padding: 0 }}
                >
                    ← Back to portal selection
                </button>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '1.8rem' }}>
                    {selectedRole === 'admin' ? 'Admin Login' : 'Student Login'}
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <LogIn size={20} /> Access {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
