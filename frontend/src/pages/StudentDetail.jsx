import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Building2, Calendar, Trash2, Loader, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import ChatBox from '../components/ChatBox';
import Badge from '../components/Badge';

const StudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchStudentDetails();
    }, [id]);

    const fetchStudentDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/students/${id}`);
            setStudent(response.data);
        } catch (error) {
            console.error('Error fetching student details:', error);
            toast.error('Failed to fetch student details');
            navigate('/admin/students');
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivateStudent = async () => {
        setDeleting(true);
        try {
            await api.put(`/students/${id}/deactivate`);
            toast.success('Student deactivated successfully');
            navigate('/admin/students');
        } catch (error) {
            console.error('Error deactivating student:', error);
            toast.error('Failed to deactivate student');
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved':
                return 'success';
            case 'in_progress':
                return 'warning';
            case 'reported':
                return 'danger';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader className="animate-spin" size={48} color="var(--primary-color)" />
            </div>
        );
    }

    if (!student) {
        return null;
    }

    return (
        <div className="student-detail-page" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header with Back Button */}
            <button
                onClick={() => navigate('/admin/students')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginBottom: '24px',
                    padding: '8px'
                }}
            >
                <ArrowLeft size={18} />
                Back to Students
            </button>

            {/* Student Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: '600'
                        }}>
                            {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
                                {student.name}
                            </h1>
                            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
                                {student.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        style={{
                            padding: '10px 16px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px'
                        }}
                    >
                        <Trash2 size={16} />
                        Unregister Student
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    {student.hostel_name ? (
                        <>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                                    <Building2 size={16} />
                                    <span style={{ fontSize: '13px' }}>Hostel</span>
                                </div>
                                <p style={{ margin: 0, fontWeight: '600' }}>{student.hostel_name}</p>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                                    <MapPin size={16} />
                                    <span style={{ fontSize: '13px' }}>Block & Room</span>
                                </div>
                                <p style={{ margin: 0, fontWeight: '600' }}>
                                    Block {student.block_name}, Room {student.room_number || 'N/A'}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                                No hostel information available
                            </p>
                        </div>
                    )}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                            <Calendar size={16} />
                            <span style={{ fontSize: '13px' }}>Joined</span>
                        </div>
                        <p style={{ margin: 0, fontWeight: '600' }}>
                            {new Date(student.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Issue History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '24px'
                    }}
                >
                    <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
                        📋 Issue History ({student.issues?.length || 0})
                    </h2>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {!student.issues || student.issues.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '32px 0' }}>
                                No issues reported yet
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {student.issues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        style={{
                                            padding: '12px',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            background: 'var(--secondary-bg)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
                                                {issue.title}
                                            </h3>
                                            <Badge variant={getStatusColor(issue.status)}>
                                                {issue.status}
                                            </Badge>
                                        </div>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            {issue.description.substring(0, 100)}
                                            {issue.description.length > 100 ? '...' : ''}
                                        </p>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                            <span>{issue.category}</span>
                                            <span>•</span>
                                            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {issue.admin_note && (
                                            <div style={{ marginTop: '8px', padding: '8px', background: 'var(--info-bg)', borderRadius: '4px', fontSize: '13px' }}>
                                                <strong>Admin Note:</strong> {issue.admin_note}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Chat Interface */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <ChatBox recipientId={parseInt(id)} recipientName={student.name} />
                </motion.div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => !deleting && setShowDeleteConfirm(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--card-bg)',
                            padding: '24px',
                            borderRadius: '12px',
                            maxWidth: '400px',
                            width: '90%'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <AlertTriangle size={24} color="#ef4444" />
                            <h3 style={{ margin: 0, fontSize: '18px' }}>Confirm Unregister</h3>
                        </div>
                        <p style={{ margin: '0 0 20px 0', color: 'var(--text-secondary)' }}>
                            Are you sure you want to unregister <strong>{student.name}</strong>?
                            This will deactivate their account but preserve their issue history.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                style={{
                                    padding: '10px 20px',
                                    background: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeactivateStudent}
                                disabled={deleting}
                                style={{
                                    padding: '10px 20px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {deleting ? (
                                    <>
                                        <Loader className="animate-spin" size={16} />
                                        Unregistering...
                                    </>
                                ) : (
                                    'Unregister'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default StudentDetail;
