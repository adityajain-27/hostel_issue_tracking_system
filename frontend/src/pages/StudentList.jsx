import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, MapPin, Building2, Loader } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import EmptyState from '../components/EmptyState';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredStudents(students);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = students.filter(
                student =>
                    student.name.toLowerCase().includes(query) ||
                    student.email.toLowerCase().includes(query) ||
                    (student.hostel_name && student.hostel_name.toLowerCase().includes(query)) ||
                    (student.room_number && student.room_number.toLowerCase().includes(query))
            );
            setFilteredStudents(filtered);
        }
    }, [searchQuery, students]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await api.get('/students');
            setStudents(response.data);
            setFilteredStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const handleStudentClick = (studentId) => {
        navigate(`/admin/students/${studentId}`);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader className="animate-spin" size={48} color="var(--primary-color)" />
            </div>
        );
    }

    return (
        <div className="student-list-page" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                    👨‍🎓 Registered Students
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Manage all registered students in the hostel
                </p>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{
                    position: 'relative',
                    maxWidth: '500px'
                }}>
                    <Search
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-secondary)'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search by name, email, hostel, or room..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 12px 12px 40px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            fontSize: '14px',
                            background: 'var(--input-bg)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>
            </div>

            {/* Students Count */}
            <div style={{ marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
            </div>

            {/* Students Grid */}
            {filteredStudents.length === 0 ? (
                <EmptyState
                    icon={User}
                    title="No students found"
                    description={searchQuery ? 'Try adjusting your search criteria' : 'No registered students yet'}
                />
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '16px'
                }}>
                    {filteredStudents.map((student, index) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleStudentClick(student.id)}
                            style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                padding: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: '600'
                                }}>
                                    {student.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                                        {student.name}
                                    </h3>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {student.email}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {student.hostel_name && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                        <Building2 size={16} color="var(--text-secondary)" />
                                        <span>{student.hostel_name}</span>
                                    </div>
                                )}
                                {student.block_name && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                        <MapPin size={16} color="var(--text-secondary)" />
                                        <span>Block {student.block_name}, Room {student.room_number || 'N/A'}</span>
                                    </div>
                                )}
                                {!student.hostel_name && !student.block_name && (
                                    <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                                        No hostel information available
                                    </p>
                                )}
                            </div>

                            <div style={{
                                marginTop: '12px',
                                paddingTop: '12px',
                                borderTop: '1px solid var(--border-color)',
                                fontSize: '12px',
                                color: 'var(--text-tertiary)'
                            }}>
                                Joined {new Date(student.created_at).toLocaleDateString()}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentList;
