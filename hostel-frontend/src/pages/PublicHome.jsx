import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const PublicHome = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 md:pt-32 md:pb-24">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen animate-blob" />
                    <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-4000" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-3xl mx-auto space-y-8"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            <span className="text-sm font-medium text-slate-300">Live Issue Tracking System</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400 pb-2">
                            Report Issues with <br />
                            <span className="text-indigo-400">Zero Friction</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Streamline your hostel maintenance requests. Real-time updates, transparent tracking, and faster resolutions for a better living experience.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link to="/login" className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-indigo-600 rounded-lg overflow-hidden transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25">
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <a href="#features" className="px-8 py-3.5 text-base font-medium text-slate-300 hover:text-white transition-colors">
                                Learn more
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Lightning Fast", desc: "Submit issues in seconds. Smart categorization ensures your request reaches the right team immediately." },
                            { icon: ShieldCheck, title: "Transparent Process", desc: "Track every step of your request. Get real-time notifications when status changes." },
                            { icon: CheckCircle2, title: "Resolved & Verified", desc: "Requests are only closed after your confirmation. Quality service guaranteed." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            {/* <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to improve your hostel experience?</h2>
                    <p className="text-slate-400 mb-8">Join thousands of students who trust HostelFix for quick and reliable issue resolution.</p>
                    <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors">
                        Create an Account
                    </Link>
                </div>
            </section> */}
        </div>
    );
};

export default PublicHome;
