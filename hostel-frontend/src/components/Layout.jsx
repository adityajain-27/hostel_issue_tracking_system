import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Home, LayoutDashboard, LogIn, UserPlus, AlertCircle, LogOut, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import CustomCursor from './CustomCursor';
import Magnetic from './Magnetic';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, login } = useAuth();

    const handleQuickSwitch = () => {
        if (!user) return;
        const newRole = user.role === 'student' ? 'admin' : 'student';
        // Update user state with new role
        login({ ...user, role: newRole });
        // Redirect to appropriate dashboard
        navigate(newRole === 'admin' ? '/admin-dashboard' : '/student-dashboard');
    };

    const navItems = [
        { name: 'Home', path: '/', icon: Home, public: true },
        // Dashboard and My Issues appear for everyone, but will redirect if not logged in
        { name: 'Dashboard', path: user ? (user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard') : '/login', icon: LayoutDashboard, public: true },
        { name: 'My Issues', path: user ? '/my-issues' : '/login', icon: AlertCircle, public: true },
    ];

    const authItems = user ? [
        { name: 'Switch Role', action: handleQuickSwitch, icon: RefreshCw, public: true },
        { name: 'Logout', action: logout, icon: LogOut, public: true }
    ] : [
        { name: 'Login', path: '/login', icon: LogIn, public: true },
        // { name: 'Register', path: '/register', icon: UserPlus, public: true },
    ];

    const allItems = [...navItems, ...authItems];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 cursor-none">
            <CustomCursor />
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Magnetic>
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
                                    <span className="font-bold text-white">H</span>
                                </div>
                                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                    HostelFix
                                </span>
                            </Link>
                        </Magnetic>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {allItems.map((item, idx) => {
                                const isActive = item.path && location.pathname === item.path;
                                const Icon = item.icon;

                                const content = (
                                    <div className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2
                                        ${isActive
                                            ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/5'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}>
                                        <Icon size={16} />
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-pill"
                                                className="absolute inset-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </div>
                                );

                                return (
                                    <Magnetic key={idx}>
                                        {item.action ? (
                                            <button onClick={item.action}>
                                                {content}
                                            </button>
                                        ) : (
                                            <Link to={item.path}>
                                                {content}
                                            </Link>
                                        )}
                                    </Magnetic>
                                );
                            })}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <motion.div
                    initial={false}
                    animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                    className="md:hidden overflow-hidden bg-slate-900 border-b border-slate-800"
                >
                    <div className="px-4 py-4 space-y-2">
                        {allItems.map((item, idx) => {
                            const isActive = item.path && location.pathname === item.path;
                            const Icon = item.icon;

                            const className = `block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3
                                ${isActive
                                    ? 'text-white bg-indigo-500/10 border border-indigo-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`;

                            if (item.action) {
                                return (
                                    <button key={idx} onClick={() => { item.action(); setIsMenuOpen(false); }} className={className}>
                                        <Icon size={18} />
                                        {item.name}
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={idx}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={className}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>
                </motion.div>
            </nav>

            {/* Main Content */}
            <main className="pt-16 min-h-[calc(100vh-4rem)]">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-slate-900 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-600 text-sm">
                    <p>© 2024 Hostel Issue Tracking System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
