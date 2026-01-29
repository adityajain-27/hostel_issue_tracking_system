import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Authenticating...');
        try {
            const res = await api.post('/auth/login', { email, password });

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
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '75vh',
                gap: '50px',
                padding: '20px'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center' }}
                >
                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        marginBottom: '12px'
                    }}>
                        Welcome to Hostel<span className="text-gradient-blue">Flow</span>
                    </h1>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem',
                        maxWidth: '500px'
                    }}>
                        Select your portal to continue
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '30px',
                    maxWidth: '700px',
                    width: '100%'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole('student')}
                        className="glass-card"
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '40px 30px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: 'var(--gradient-blue)'
                        }}></div>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                            padding: '24px',
                            borderRadius: '50%',
                            marginBottom: '8px'
                        }}>
                            <User size={48} style={{ color: 'var(--accent-color)' }} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Student Portal</h3>
                        <p style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5'
                        }}>
                            Report issues, track status, and stay updated with announcements
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole('admin')}
                        className="glass-card"
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '40px 30px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: 'var(--gradient-purple)'
                        }}></div>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(124, 58, 237, 0.1))',
                            padding: '24px',
                            borderRadius: '50%',
                            marginBottom: '8px'
                        }}>
                            <ShieldCheck size={48} style={{ color: 'var(--primary-500)' }} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Portal</h3>
                        <p style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.5'
                        }}>
                            Manage issues, assign staff, and create announcements
                        </p>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '75vh',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '40px'
                }}
            >
                <button
                    onClick={() => setSelectedRole(null)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-color)',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        fontSize: '0.95rem',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: '500',
                        transition: 'gap var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.gap = '8px'}
                    onMouseLeave={(e) => e.currentTarget.style.gap = '4px'}
                >
                    ← Back to portal selection
                </button>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 16px',
                        background: selectedRole === 'admin' ? 'var(--gradient-purple)' : 'var(--gradient-blue)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        {selectedRole === 'admin' ?
                            <ShieldCheck size={40} color="white" /> :
                            <User size={40} color="white" />
                        }
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
                        {selectedRole === 'admin' ? 'Admin Login' : 'Student Login'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Enter your credentials to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{
                            position: 'absolute',
                            left: '14px',
                            top: '15px',
                            color: 'var(--text-tertiary)'
                        }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field"
                            style={{ paddingLeft: '44px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{
                            position: 'absolute',
                            left: '14px',
                            top: '15px',
                            color: 'var(--text-tertiary)'
                        }} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="input-field"
                            style={{ paddingLeft: '44px', paddingRight: '44px' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-tertiary)',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn btn-primary btn-lg"
                        style={{
                            width: '100%',
                            marginTop: '8px'
                        }}
                    >
                        <LogIn size={20} />
                        Sign In to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
