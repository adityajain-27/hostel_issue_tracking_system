import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const RegisterStudent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        hostel_name: '',
        block_name: '',
        room_number: '',
        role: 'student',
        staff_specialty: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Creating account...');
        try {
            await api.post('/admin/create-student', formData);
            toast.success(`${formData.role === 'staff' ? 'Staff' : 'Student'} registered successfully!`, { id: loadingToast });
            setFormData({
                name: '',
                email: '',
                password: '',
                hostel_name: '',
                block_name: '',
                room_number: '',
                role: 'student',
                staff_specialty: ''
            });
        } catch (err) {
            const errorMsg = err.response?.data?.details || err.response?.data?.message || err.response?.data?.error || 'Registration failed';
            toast.error(errorMsg, { id: loadingToast });
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ maxWidth: '600px', margin: '40px auto' }}>
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><UserPlus color="var(--accent-color)" /> Register New User</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
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
                    <select
                        className="input-field"
                        style={{ width: '150px' }}
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                    </select>
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

                {formData.role === 'staff' ? (
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>Department / Specialty</label>
                        <select
                            className="input-field"
                            value={formData.staff_specialty}
                            onChange={(e) => setFormData({ ...formData, staff_specialty: e.target.value })}
                            required
                        >
                            <option value="">Select Specialty...</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Carpentry">Carpentry</option>
                            <option value="Other">Other Staff</option>
                        </select>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                        <input
                            type="text"
                            placeholder="Hostel Name"
                            className="input-field"
                            value={formData.hostel_name}
                            onChange={(e) => setFormData({ ...formData, hostel_name: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Block"
                            className="input-field"
                            value={formData.block_name}
                            onChange={(e) => setFormData({ ...formData, block_name: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Room No"
                            className="input-field"
                            value={formData.room_number}
                            onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                            required
                        />
                    </div>
                )}
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
                <button type="submit" className="btn btn-primary">Create Account</button>
            </form>
        </motion.div>
    );
};

export default RegisterStudent;
