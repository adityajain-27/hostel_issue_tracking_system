import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, Search, Filter, MoreVertical, X, Check } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { issues, getStats } = useIssues(); // In real app, might need a function to get ALL issues
    const { total, pending, resolved } = getStats();

    // Admin Guard
    if (user?.role !== 'admin') {
        return <Navigate to="/student-dashboard" replace />;
    }

    const [activeFilter, setActiveFilter] = useState('all');

    // Derived stats for admin might be different if we were filtering user specific data
    // Assuming context provides global issues for now.

    const filteredIssues = activeFilter === 'all'
        ? issues
        : issues.filter(issue => issue.status.toLowerCase().replace(' ', '-') === activeFilter);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400">Overview of all hostel maintenance requests</p>
            </div>

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Tickets</p>
                            <h3 className="text-2xl font-bold text-white">{total}</h3>
                        </div>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Pending</p>
                            <h3 className="text-2xl font-bold text-white">{pending}</h3>
                        </div>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Resolved</p>
                            <h3 className="text-2xl font-bold text-white">{resolved}</h3>
                        </div>
                    </div>
                </div>
                {/* Placeholder for critical ones */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 text-red-400 rounded-lg">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Critical</p>
                            <h3 className="text-2xl font-bold text-white">2</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and List */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <div className="flex bg-slate-800/50 rounded-lg p-1">
                        {['all', 'pending', 'in-progress', 'resolved'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveFilter(tab)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize
                                ${activeFilter === tab
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
                            placeholder="Search tickets..."
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400 text-sm">
                                <th className="pb-4 pl-4 font-medium">Issue</th>
                                <th className="pb-4 font-medium">Location</th>
                                <th className="pb-4 font-medium">Date</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium text-right pr-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            <AnimatePresence>
                                {filteredIssues.map((issue) => (
                                    <motion.tr
                                        key={issue.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="py-4 pl-4">
                                            <p className="text-white font-medium">{issue.title}</p>
                                            <p className="text-xs text-slate-500">{issue.description.substring(0, 40)}...</p>
                                        </td>
                                        <td className="py-4 text-slate-300 text-sm">{issue.location}</td>
                                        <td className="py-4 text-slate-400 text-sm">{issue.date}</td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                                                ${issue.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    issue.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <button className="text-slate-400 hover:text-white transition-colors">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {filteredIssues.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No issues found matching your filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
