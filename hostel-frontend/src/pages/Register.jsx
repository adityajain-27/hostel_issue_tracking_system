// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Mail, Lock, User, Hash, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Register = () => {
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const navigate = useNavigate();
//     const { register } = useAuth();

//     const [formData, setFormData] = useState({
//         name: '',
//         admission: '',
//         email: '',
//         password: ''
//     });

//     const [errors, setErrors] = useState({});

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//         // Clear error when user types
//         if (errors[e.target.name] || errors.submit) {
//             setErrors({ ...errors, [e.target.name]: '', submit: '' });
//         }
//     };

//     const validate = () => {
//         const newErrors = {};

//         // Name Constraints
//         if (formData.name.trim().length < 3) {
//             newErrors.name = 'Name must be at least 3 characters long';
//         }

//         // Admission Constraints
//         if (!formData.admission.trim()) {
//             newErrors.admission = 'Admission Number is required';
//         }

//         // Email Constraints
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email address';
//         }

//         // Password Constraints
//         if (formData.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters long';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleRegister = (e) => {
//         e.preventDefault();

//         if (!validate()) return;

//         setLoading(true);
//         // Simulate register delay
//         setTimeout(() => {
//             const result = register({
//                 name: formData.name,
//                 email: formData.email,
//                 admission: formData.admission,
//                 password: formData.password
//             });

//             if (result.success) {
//                 setLoading(false);
//                 navigate('/student-dashboard');
//             } else {
//                 setLoading(false);
//                 setErrors({ ...errors, submit: result.message });
//             }
//         }, 1500);
//     };

//     return (
//         <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
//             {/* Background Blobs */}
//             <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen animate-blob" />
//             <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000" />

//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="w-full max-w-md relative z-10"
//             >
//                 <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
//                     <div className="text-center mb-8">
//                         <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Join HostelFix</h2>
//                         <p className="text-slate-400 mt-2">Create your student account</p>
//                         {errors.submit && (
//                             <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
//                                 {errors.submit}
//                             </div>
//                         )}
//                     </div>

//                     <form onSubmit={handleRegister} className="space-y-5">
//                         <div className="relative group">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
//                                 <User size={20} />
//                             </div>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 required
//                                 className={`w-full bg-slate-800/50 border ${errors.name ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500`}
//                                 placeholder="Full Name"
//                             />
//                             {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
//                         </div>

//                         <div className="relative group">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
//                                 <Hash size={20} />
//                             </div>
//                             <input
//                                 type="text"
//                                 name="admission"
//                                 value={formData.admission}
//                                 onChange={handleChange}
//                                 required
//                                 className={`w-full bg-slate-800/50 border ${errors.admission ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500`}
//                                 placeholder="Admission Number"
//                             />
//                             {errors.admission && <p className="text-red-500 text-xs mt-1 ml-1">{errors.admission}</p>}
//                         </div>

//                         <div className="relative group">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
//                                 <Mail size={20} />
//                             </div>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 required
//                                 className={`w-full bg-slate-800/50 border ${errors.email ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500`}
//                                 placeholder="Email Address"
//                             />
//                             {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
//                         </div>

//                         <div className="relative group">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
//                                 <Lock size={20} />
//                             </div>
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                                 className={`w-full bg-slate-800/50 border ${errors.password ? 'border-red-500' : 'border-slate-700'} text-white rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500`}
//                                 placeholder="Password"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
//                             >
//                                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                             </button>
//                             {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
//                         >
//                             {loading ? (
//                                 <Loader2 className="animate-spin" size={20} />
//                             ) : (
//                                 <>
//                                     Create Account <ArrowRight className="ml-2" size={18} />
//                                 </>
//                             )}
//                         </button>
//                     </form>

//                     <div className="mt-8 text-center text-sm text-slate-400">
//                         Already have an account?{' '}
//                         <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
//                             Sign in
//                         </Link>
//                     </div>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default Register;
