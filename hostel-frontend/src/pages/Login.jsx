import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnnouncementCard from '../components/AnnouncementCard';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('student'); // 'student' or 'admin'
    const navigate = useNavigate();
    const { login } = useAuth();

    // Hardcoded admin credentials for prototype
    // const ADMIN_EMAIL = 'admin@hostelfix.com';

    // const handleLogin = (e) => {
    //     e.preventDefault();
    //     setLoading(true);
const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await login(email, password);

    if (!result.success) {
        alert(result.message);
        setLoading(false);
        return;
    }

    // Role-based redirect (from backend)
    if (result.user?.role === "admin") {
        navigate("/admin-dashboard");
    } else {
        navigate("/student-dashboard");
    }

    setLoading(false);





    
};

    


        // Simulate login delay

    

    return (
        <div className="min-h-[calc(100vh-4rem)] flex relative overflow-hidden">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 relative z-10 bg-slate-950">
                {/* Background Blobs for Form Side */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl mix-blend-screen animate-blob" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000" />

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-slate-400">Sign in to access your dashboard</p>
                    </div>

                    {/* Role Toggle */}
                    <div className="bg-slate-900/50 p-1 rounded-xl flex mb-8 border border-slate-800">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${role === 'student'
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <User size={18} />
                            Student
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${role === 'admin'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Shield size={18} />
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                                    placeholder={role === 'admin' ? "admin@hostelfix.com" : "student@university.edu"}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-slate-400 hover:text-slate-300 cursor-pointer">
                                {/* <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-offset-slate-900" /> */}
                                {/* <span className="ml-2">Remember me</span> */}
                            </label>
                            {/* <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a> */}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${role === 'admin'
                                    ? 'bg-purple-600 hover:bg-purple-500 focus:ring-purple-500 shadow-purple-500/20'
                                    : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500 shadow-indigo-500/20'
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Sign In as {role === 'admin' ? 'Admin' : 'Student'} <ArrowRight className="ml-2" size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* <div className="mt-8 text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Register now
                        </Link>
                    </div> */}
                </motion.div>
            </div>

            {/* Right Side - Announcements (Hidden on Mobile) */}
            <div className="hidden lg:block w-1/2 p-8 bg-slate-900/50 border-l border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-slate-900/50 backdrop-blur-sm z-0" />

                <div className="relative z-10 h-full flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white mb-1">Notice Board</h3>
                        <p className="text-slate-400 text-sm">Latest updates from the hostel office</p>
                    </div>

                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        <AnnouncementCard
                            title="Water Supply Maintenance"
                            date="Tomorrow, 10:00 AM"
                            type="maintenance"
                            content="Main water tank cleaning scheduled. Supply will be interrupted for 2 hours."
                        />
                        <AnnouncementCard
                            title="Mess Menu Update"
                            date="Today, 09:00 AM"
                            type="general" // or 'food' if supported
                            content="New diverse menu options added for weekend dinner including local specialties."
                        />
                        <AnnouncementCard
                            title="WiFi Upgrade Completed"
                            date="Yesterday"
                            type="success"
                            content="High-speed fiber connection is now active in Block A and B common rooms."
                        />
                        <AnnouncementCard
                            title="Quiet Hours Reminder"
                            date="2 days ago"
                            type="warning"
                            content="Please observe quiet hours during exam week starting from next Monday."
                        />
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 text-slate-500 text-sm">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs border-2 border-slate-900">AB</div>
                                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs border-2 border-slate-900">JD</div>
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs border-2 border-slate-900">+5</div>
                            </div>
                            <p>Active Wardens on duty</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
