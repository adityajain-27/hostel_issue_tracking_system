import React from 'react';
import { useAuth } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';

const StudentChat = () => {
    const { user } = useAuth();

    // Get first admin ID (in a real app, you might have a specific admin assigned)
    // For now, we'll hardcode admin ID as 1 or fetch from an API
    const adminId = 1; // This should ideally come from an API call to get the admin

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                💬 Chat with Admin
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Send messages to the hostel administration
            </p>

            <ChatBox recipientId={adminId} recipientName="Admin" />
        </div>
    );
};

export default StudentChat;
