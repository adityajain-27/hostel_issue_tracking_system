import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ShieldCheck, MessageSquare, TrendingUp, Users, CheckCircle2, Search } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';

const Home = () => {
    const [publicIssues, setPublicIssues] = useState([]);
    const [expandedIssue, setExpandedIssue] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchPublicIssues = async () => {
            try {
                const res = await api.get('/issues/public');
                setPublicIssues(res.data);
            } catch (err) {
                console.error('Failed to fetch public issues');
            }
        };
        fetchPublicIssues();
    }, []);

    const categories = ['all', ...new Set(publicIssues.map(i => i.category || 'Other'))];

    const filteredIssues = publicIssues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const stats = {
        total: publicIssues.length,
        resolved: publicIssues.filter(i => i.status?.toLowerCase() === 'resolved').length,
        pending: publicIssues.filter(i => i.status?.toLowerCase() !== 'resolved').length
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    padding: '80px 20px',
                    textAlign: 'center',
                    background: 'var(--gradient-mesh)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: '40px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'var(--bg-gradient-mesh)',
                    opacity: 0.5,
                    zIndex: 0
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: '800',
                            marginBottom: '16px',
                            lineHeight: '1.1'
                        }}
                    >
                        Hostel<span className="text-gradient-blue">Flow</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                            maxWidth: '700px',
                            margin: '0 auto 32px',
                            lineHeight: '1.6'
                        }}
                    >
                        Transparent, fast, and efficient hostel issue management.
                        <br />Track, report, and resolve hostel issues seamlessly.
                    </motion.p>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '20px',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                            <MessageSquare size={32} style={{ color: 'var(--accent-color)', margin: '0 auto 8px' }} />
                            <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>{stats.total}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Total Issues</p>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                            <CheckCircle2 size={32} style={{ color: 'var(--success-600)', margin: '0 auto 8px' }} />
                            <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>{stats.resolved}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Resolved</p>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
                            <TrendingUp size={32} style={{ color: 'var(--warning-600)', margin: '0 auto 8px' }} />
                            <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>{stats.pending}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>In Progress</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Community Board Section */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.75rem', margin: 0 }}>
                        <ShieldCheck size={32} style={{ color: 'var(--accent-color)' }} />
                        Community Issue Board
                    </h2>

                    {/* Search & Filter */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', minWidth: '250px' }}>
                            <Search size={18} style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-tertiary)'
                            }} />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                className="input-field"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                        <select
                            className="input-field"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ minWidth: '150px' }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Issues Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {filteredIssues && filteredIssues.length > 0 ? (
                        Object.entries(filteredIssues.reduce((acc, issue) => {
                            const cat = issue.category || 'Other';
                            acc[cat] = acc[cat] || [];
                            acc[cat].push(issue);
                            return acc;
                        }, {})).map(([category, catIssues]) => (
                            <div key={category}>
                                <h3 style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--accent-color)',
                                    letterSpacing: '2px',
                                    marginBottom: '16px',
                                    opacity: 0.9,
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    borderBottom: '2px solid var(--card-border)',
                                    paddingBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--accent-color)'
                                    }}></span>
                                    {category}
                                </h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                    gap: '16px'
                                }}>
                                    {catIssues.map((issue, idx) => (
                                        <motion.div
                                            key={issue.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            layout
                                            className="glass-card"
                                            style={{
                                                cursor: 'pointer',
                                                border: expandedIssue === issue.id ? '2px solid var(--accent-color)' : '1px solid var(--card-border)',
                                                padding: '20px',
                                                transition: 'all 0.3s ease',
                                                background: expandedIssue === issue.id ? 'var(--card-highlight)' : 'var(--card-bg)'
                                            }}
                                            onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                                        >
                                            <div style={{ marginBottom: expandedIssue === issue.id ? '16px' : '0' }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                                                    <MessageSquare size={18} style={{
                                                        color: 'var(--accent-color)',
                                                        flexShrink: 0,
                                                        marginTop: '2px'
                                                    }} />
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{
                                                            fontSize: '1.05rem',
                                                            fontWeight: '600',
                                                            marginBottom: '8px',
                                                            color: 'var(--text-primary)'
                                                        }}>
                                                            {issue.title}
                                                        </h3>
                                                        <Badge variant={issue.status?.toLowerCase() === 'resolved' ? 'success' : 'warning'}>
                                                            {issue.status?.toUpperCase() || 'REPORTED'}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {expandedIssue === issue.id && (
                                                    <div style={{
                                                        paddingTop: '16px',
                                                        marginTop: '16px',
                                                        borderTop: '1px solid var(--card-border)'
                                                    }}>
                                                        <p style={{
                                                            color: 'var(--text-secondary)',
                                                            fontSize: '0.9rem',
                                                            marginBottom: '16px',
                                                            lineHeight: '1.6'
                                                        }}>
                                                            {issue.description}
                                                        </p>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            borderTop: '1px solid var(--card-border)',
                                                            paddingTop: '12px',
                                                            fontSize: '0.8rem',
                                                            color: 'var(--text-tertiary)'
                                                        }}>
                                                            <span>
                                                                <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                                                {issue.student_name || 'Student'}
                                                            </span>
                                                            <span style={{ fontSize: '0.75rem' }}>
                                                                {new Date(issue.created_at).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState
                            icon={MessageSquare}
                            title={searchQuery || selectedCategory !== 'all' ? 'No issues found' : 'No public issues yet'}
                            message={searchQuery || selectedCategory !== 'all' ?
                                'Try adjusting your search or filter criteria.' :
                                'Public issues will appear here once reported by students.'
                            }
                        />
                    )}
                </div>
            </div >
        </div >
    );
};

export default Home;
