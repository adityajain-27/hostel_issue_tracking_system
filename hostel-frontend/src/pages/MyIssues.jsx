import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Search, MoreVertical, MapPin, Calendar, Camera } from 'lucide-react';
import { useIssues } from '../context/IssueContext';

const MyIssues = () => {
    const { issues, addIssue } = useIssues();
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newIssue, setNewIssue] = useState({ title: '', location: '', room: '', description: '', priority: 'Medium' });

    const filteredIssues = activeTab === 'all'
        ? issues
        : issues.filter(issue => issue.status.toLowerCase().replace(' ', '-') === activeTab);

    const handleAddIssue = (e) => {
        e.preventDefault();
        addIssue({
            title: newIssue.title,
            location: `${newIssue.location} ${newIssue.room}`,
            description: newIssue.description,
            priority: 'Medium'
        });
        setIsModalOpen(false);
        setNewIssue({ title: '', location: '', room: '', description: '', priority: 'Medium' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Issues</h1>
                    <p className="text-slate-400">Track and manage your maintenance requests</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus size={18} className="mr-2" />
                    Report Issue
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-slate-800/50 rounded-lg p-1 overflow-x-auto max-w-full">
                    {['all', 'pending', 'in-progress', 'resolved'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize whitespace-nowrap
                        ${activeTab === tab
                                    ? 'bg-indigo-500 text-white shadow-md'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search issues..."
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
            </div>

            {/* Issues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredIssues.map((issue) => (
                        <motion.div
                            key={issue.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                            ${issue.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        issue.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                    {issue.status}
                                </span>
                                <button className="text-slate-500 hover:text-white transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-2">{issue.title}</h3>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">{issue.description}</p>

                            <div className="space-y-2 pt-4 border-t border-slate-800/50">
                                <div className="flex items-center text-sm text-slate-500">
                                    <MapPin size={14} className="mr-2 text-indigo-400" />
                                    {issue.location}
                                </div>
                                <div className="flex items-center text-sm text-slate-500">
                                    <Calendar size={14} className="mr-2 text-indigo-400" />
                                    {issue.date}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Report Issue Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Report New Issue</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Issue Title</label>
                                    <input
                                        type="text"
                                        value={newIssue.title}
                                        onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                        placeholder="e.g., Leaking Tap"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                                        <select
                                            value={newIssue.location}
                                            onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                        >
                                            <option value="">Select Location</option>
                                            <option value="Room">Room</option>
                                            <option value="Bathroom">Bathroom</option>
                                            <option value="Corridor">Corridor</option>
                                            <option value="Common Area">Common Area</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Room Number</label>
                                        <input
                                            type="text"
                                            value={newIssue.room}
                                            onChange={(e) => setNewIssue({ ...newIssue, room: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                            placeholder="e.g., 302"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        value={newIssue.description}
                                        onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                        placeholder="Describe the issue in detail..."
                                    ></textarea>
                                </div>

                                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all cursor-pointer">
                                    <Camera size={24} className="mb-2" />
                                    <span className="text-sm">Upload Photo (Optional)</span>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-800 flex gap-3 justify-end bg-slate-900/50">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white font-medium hover:bg-slate-800 transition-colors">Cancel</button>
                                <button onClick={handleAddIssue} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">Submit Report</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyIssues;
