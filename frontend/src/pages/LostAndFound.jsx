import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, CheckCircle, Phone, Tag } from 'lucide-react';

const LostAndFound = () => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('All'); // 'All', 'Lost', 'Found'
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Lost',
        contact_info: ''
    });

    const fetchItems = async () => {
        try {
            const res = await api.get('/lost-found');
            setItems(res.data);
        } catch (err) {
            toast.error('Failed to load items');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loading = toast.loading('Posting item...');
        try {
            await api.post('/lost-found', formData);
            toast.success('Item posted successfully!', { id: loading });
            setFormData({ title: '', description: '', category: 'Lost', contact_info: '' });
            setShowForm(false);
            fetchItems();
        } catch (err) {
            toast.error('Failed to post item', { id: loading });
        }
    };

    const handleClaim = async (id) => {
        if (!window.confirm("Mark this item as Claimed/Found?")) return;
        try {
            await api.put(`/lost-found/${id}/claim`);
            toast.success('Status updated');
            fetchItems();
        } catch (err) {
            toast.error('Failed to update status. You may not be authorized.');
        }
    };

    const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Search color="var(--accent-color)" /> Lost & Found
                </h2>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle size={18} /> {showForm ? 'Cancel' : 'Post Item'}
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', marginBottom: '30px' }}
                    >
                        <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'grid', gap: '15px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <input
                                    type="text"
                                    placeholder="Item Name (e.g., Blue Umbrella)"
                                    className="input-field"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                                <select
                                    className="input-field"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Lost">Lost (I lost something)</option>
                                    <option value="Found">Found (I found something)</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                placeholder="Contact-Info (Room No / Phone)"
                                className="input-field"
                                value={formData.contact_info}
                                onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description (Color, distinct marks, location found/lost...)"
                                className="input-field"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            <button type="submit" className="btn btn-primary">Post</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                {['All', 'Lost', 'Found'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            background: filter === f ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                <AnimatePresence>
                    {filteredItems.map(item => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card"
                            style={{ position: 'relative', borderLeft: `4px solid ${item.category === 'Lost' ? 'var(--error)' : 'var(--success)'}` }}
                        >
                            <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                                <span style={{
                                    background: item.category === 'Lost' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                    color: item.category === 'Lost' ? 'var(--error)' : 'var(--success)',
                                    padding: '4px 10px',
                                    borderRadius: '10px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold'
                                }}>
                                    {item.category.toUpperCase()}
                                </span>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', paddingRight: '60px' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px', minHeight: '40px' }}>
                                {item.description}
                            </p>

                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag size={14} /> <span>Posted by: {item.reported_by}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Phone size={14} /> <span>Contact: {item.contact_info}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleClaim(item.id)}
                                style={{
                                    marginTop: '15px',
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--card-border)',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <CheckCircle size={14} /> Mark as Claimed
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    <p>No valid items found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default LostAndFound;
