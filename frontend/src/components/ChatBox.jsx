import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader } from 'lucide-react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ChatBox = ({ recipientId, recipientName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const { socket } = useSocket();
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch chat history
    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/messages/history/${recipientId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load chat history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (recipientId) {
            fetchMessages();
        }
    }, [recipientId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Listen for real-time messages
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message) => {
            // Only add message if it's part of this conversation
            if (message.sender_id === recipientId || message.receiver_id === recipientId) {
                setMessages(prev => [...prev, message]);
            }
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [socket, recipientId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const response = await api.post('/messages', {
                receiver_id: recipientId,
                content: newMessage.trim()
            });

            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
                <Loader className="animate-spin" size={32} color="var(--primary-color)" />
            </div>
        );
    }

    return (
        <div className="chat-box" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '500px',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'var(--card-bg)'
        }}>
            {/* Chat Header */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--primary-color)',
                color: 'white'
            }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>
                    💬 Chat with {recipientName}
                </h3>
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isOwnMessage = message.sender_id === user.id;
                        return (
                            <motion.div
                                key={message.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    background: isOwnMessage ? 'var(--primary-color)' : 'var(--secondary-bg)',
                                    color: isOwnMessage ? 'white' : 'var(--text-primary)'
                                }}>
                                    <p style={{ margin: 0, fontSize: '14px', wordBreak: 'break-word' }}>
                                        {message.content}
                                    </p>
                                    <p style={{
                                        margin: '4px 0 0 0',
                                        fontSize: '11px',
                                        opacity: 0.7,
                                        textAlign: 'right'
                                    }}>
                                        {formatTime(message.created_at)}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} style={{
                padding: '16px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                gap: '8px'
            }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    style={{
                        flex: 1,
                        padding: '10px 14px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)'
                    }}
                />
                <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    style={{
                        padding: '10px 16px',
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: sending ? 'not-allowed' : 'pointer',
                        opacity: sending || !newMessage.trim() ? 0.5 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    {sending ? (
                        <Loader className="animate-spin" size={18} />
                    ) : (
                        <>
                            <Send size={18} />
                            Send
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
