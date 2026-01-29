import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Send, MessageCircle } from 'lucide-react';

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
            setNewComment('');
            fetchComments(); // Refresh list
        } catch (err) {
            toast.error('Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--card-border)' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageCircle size={14} /> Discussion
            </h4>

            {/* Comments List */}
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px' }}>
                {comments.length > 0 ? (
                    comments.map((c) => (
                        <div key={c.id} style={{
                            background: 'var(--card-highlight)',
                            padding: '10px',
                            borderRadius: '8px',
                            borderLeft: c.author_role === 'admin' ? '3px solid var(--accent-color)' : '3px solid var(--text-secondary)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: c.author_role === 'admin' ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                                    {c.author_name} {c.author_role === 'admin' && '(Admin)'}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    {new Date(c.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>{c.content}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No comments yet.</p>
                )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type a message..."
                    className="input-field"
                    style={{ flex: 1, marginBottom: 0 }}
                />
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ padding: '0 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};

export default CommentSection;
