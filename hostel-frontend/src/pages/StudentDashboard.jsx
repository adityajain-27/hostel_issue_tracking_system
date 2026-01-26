import { motion } from 'framer-motion';
import { Plus, Clock, CheckCircle2, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Total Issues', value: '12', icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Pending', value: '3', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        { label: 'Resolved', value: '9', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    ];

    const recentIssues = [
        { id: 101, title: 'Fan not working in Room 302', status: 'Pending', date: '2024-03-10' },
        { id: 102, title: 'Water leakage in bathroom', status: 'Resolved', date: '2024-03-08' },
        { id: 103, title: 'Network connectivity request', status: 'In Progress', date: '2024-03-05' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
                        <p className="text-slate-400">Welcome back, {user?.name || 'Student'}. Here's what's happening.</p>
                    </div>
                    <Link
                        to="/my-issues"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <Plus size={18} className="mr-2" />
                        Report New Issue
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                                    <Icon size={80} />
                                </div>
                                <div className="relative z-10">
                                    <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                                        <Icon size={24} />
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Issues List */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white">Recent Issues</h2>
                            <Link to="/my-issues" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                View all <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentIssues.map((issue) => (
                                <div key={issue.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
                                    <div>
                                        <h4 className="font-medium text-slate-200">{issue.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1">Reported on {issue.date}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                                ${issue.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            issue.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                        {issue.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Tips or Announcements */}
                    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <h2 className="text-lg font-semibold text-white mb-4 relative z-10">Hostel Announcements</h2>
                        <div className="space-y-4 relative z-10">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <TrendingUp size={16} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-slate-200 font-medium">Weekly Maintenance Schedule</h4>
                                    <p className="text-sm text-slate-400 mt-1">Regular maintenance checks for Block A will be conducted this Saturday from 10 AM to 2 PM.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                            <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors">
                                View All Notices
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default StudentDashboard;
