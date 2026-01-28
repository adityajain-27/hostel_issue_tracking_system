import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const RegisterStudent = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Registering student...');
        try {
            await api.post('/admin/create-student', formData);
            toast.success('Student registered successfully!', { id: loadingToast });
            setFormData({ name: '', email: '', password: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed', { id: loadingToast });
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ maxWidth: '600px', margin: '40px auto' }}>
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><UserPlus color="var(--accent-color)" /> Register New Student</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="input-field"
                        style={{ paddingLeft: '40px' }}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="input-field"
                        style={{ paddingLeft: '40px' }}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
                    <input
                        type="password"
                        placeholder="Default Password"
                        className="input-field"
                        style={{ paddingLeft: '40px' }}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn-primary">Create Account</button>
            </form>
        </motion.div>
    );
};

export default RegisterStudent;
