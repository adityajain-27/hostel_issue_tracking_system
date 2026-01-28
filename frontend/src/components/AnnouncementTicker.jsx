import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AnnouncementTicker = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get('/announcements');
                setAnnouncements(res.data);
            } catch (err) {
                console.error('Failed to fetch announcements', err);
            }
        };
        fetchAnnouncements();
    }, []);

    return (
        <div className="ticker-container">
            <div className="ticker-text">
                {announcements.length > 0
                    ? announcements.map(a => `📢 ${a.title}: ${a.message}`).join(' | ')
                    : "Welcome to Hostel Issue Tracking System | No new announcements | Stay updated!"}
            </div>
        </div>
    );
};

export default AnnouncementTicker;
