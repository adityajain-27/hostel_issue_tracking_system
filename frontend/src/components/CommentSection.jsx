import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Send, MessageCircle, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from './EmptyState';

const CommentSection = ({ issueId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await api.get(`/comments/${issueId}`);
            setComments(res.data);
        } catch (err) {
            console.error("Failed to load comments");
        }
    };

    useEffect(() => {
        if (issueId) {
            fetchComments();
        }
    }, [issueId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            await api.post(`/comments/${issueId}`, { content: newComment });
            toast.success('Comment posted');
            setNewComment('');
            fetchComments();
        } catch (err) {
            toast.error('Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const commentDate = new Date(date);
        const seconds = Math.floor((now - commentDate) / 1000);

        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return commentDate.toLocaleDateString();
    };

    return (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid var(--card-border)' }}>
            <h4 style={{
                fontSize: '1rem',
                color: 'var(--text-primary)',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <MessageCircle size={18} style={{ color: 'var(--accent-color)' }} />
                Discussion {comments.length > 0 && `(${comments.length})`}
            </h4>

            {/* Comments List */}
            <div style={{
                maxHeight: '250px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '16px',
                paddingRight: '8px'
            }}>
                <AnimatePresence>
                    {comments.length > 0 ? (
                        comments.map((c, idx) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{
                                    background: c.author_role === 'admin' ? 'var(--accent-glow)' : 'var(--card-highlight)',
                                    padding: '12px',
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: `3px solid ${c.author_role === 'admin' ? 'var(--accent-color)' : 'var(--text-tertiary)'}`,
                                    position: 'relative'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: c.author_role === 'admin' ? 'var(--gradient-primary)' : 'var(--card-border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {c.author_role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                                        </div>
                                        <div>
                                            <span style={{
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                color: c.author_role === 'admin' ? 'var(--accent-color)' : 'var(--text-primary)'
                                            }}>
                                                {c.author_name}
                                            </span>
                                            {c.author_role === 'admin' && (
                                                <span className="badge badge-primary" style={{
                                                    marginLeft: '6px',
                                                    fontSize: '0.6rem',
                                                    padding: '2px 6px'
                                                }}>
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                        {formatTimeAgo(c.created_at)}
                                    </span>
                                </div>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--text-primary)',
                                    margin: 0,
                                    lineHeight: '1.5',
                                    paddingLeft: '36px'
                                }}>
                                    {c.content}
                                </p>
                            </motion.div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                            <MessageCircle size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                            <p>No comments yet. Start the discussion!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="input-field"
                    style={{ flex: 1, marginBottom: 0 }}
                    disabled={loading}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={loading || !newComment.trim()}
                    style={{
                        padding: '0 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: loading || !newComment.trim() ? 0.5 : 1
                    }}
                >
                    {loading ? (
                        <div className="spinner spinner-sm"></div>
                    ) : (
                        <Send size={16} />
                    )}
                </motion.button>
            </form>
        </div>
    );
};

export default CommentSection;
