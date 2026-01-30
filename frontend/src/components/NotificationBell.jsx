import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { socket } = useSocket();

    // Fetch notifications and unread count
    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications?limit=10');
            setNotifications(response.data);

            const countResponse = await api.get('/notifications/unread-count');
            setUnreadCount(countResponse.data.count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Listen for real-time notifications
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (data) => {
            toast.success(data.message || 'New notification');
            fetchNotifications();
        };

        socket.on('notification', handleNewNotification);

        return () => {
            socket.off('notification', handleNewNotification);
        };
    }, [socket]);

    const markAsRead = async (notificationId) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            fetchNotifications();
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark all as read');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'issue_resolved':
                return '✅';
            case 'issue_updated':
                return '🔄';
            case 'message':
                return '💬';
            case 'note':
                return '📝';
            default:
                return '🔔';
        }
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="notification-bell-container" style={{ position: 'relative' }}>
            <button
                className="notification-bell-button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '8px'
                }}
            >
                <Bell size={24} color="var(--text-primary)" />
                {unreadCount > 0 && (
                    <span
                        className="notification-badge"
                        style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: '#ef4444',
                            color: 'white',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold'
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="notification-panel"
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            marginTop: '8px',
                            width: '360px',
                            maxHeight: '500px',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            zIndex: 1000,
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            className="notification-header"
                            style={{
                                padding: '16px',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                                Notifications
                            </h3>
                            {notifications.some(n => !n.is_read) && (
                                <button
                                    onClick={markAllAsRead}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--primary-color)',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <Check size={14} />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div
                            className="notification-list"
                            style={{
                                maxHeight: '400px',
                                overflowY: 'auto'
                            }}
                        >
                            {notifications.length === 0 ? (
                                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No notifications yet
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => !notification.is_read && markAsRead(notification.id)}
                                        style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            background: notification.is_read ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = notification.is_read ? 'transparent' : 'rgba(99, 102, 241, 0.05)'}
                                    >
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                                            <span style={{ fontSize: '20px' }}>{getNotificationIcon(notification.type)}</span>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.is_read && (
                                                        <div
                                                            style={{
                                                                width: '8px',
                                                                height: '8px',
                                                                borderRadius: '50%',
                                                                background: '#6366f1',
                                                                marginTop: '4px'
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                    {notification.content}
                                                </p>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                                                    {getTimeAgo(notification.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
