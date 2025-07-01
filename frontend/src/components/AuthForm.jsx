import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Target, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Alert, AlertDescription } from './ui/Alert';
import Input from './ui/Input';
import Button from './ui/Button';
import { motion } from 'framer-motion';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, register, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = isLogin
            ? await login(formData.email, formData.password)
            : await register(formData.name, formData.email, formData.password);
        if (!result.success) {
            setError(result.error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const formVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                delay: 0.2,
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-md"
            >
                <Card className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                            className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-fit shadow-lg"
                        >
                            <Target className="h-8 w-8 text-white" />
                        </motion.div>
                        
                        <CardTitle className="text-2xl font-bold text-white mb-2">
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                JobTracker Pro
                            </span>
                        </CardTitle>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-400"
                        >
                            {isLogin ? 'Welcome back to your career journey' : 'Start your professional journey today'}
                        </motion.p>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                        <motion.form 
                            onSubmit={handleSubmit} 
                            className="space-y-6"
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {!isLogin && (
                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Full Name
                                    </label>
                                    <Input 
                                        type="text" 
                                        placeholder="Enter your full name" 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                        required 
                                        disabled={loading}
                                        className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl h-12"
                                    />
                                </motion.div>
                            )}
                            
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </label>
                                <Input 
                                    type="email" 
                                    placeholder="Enter your email address" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                    required 
                                    disabled={loading}
                                    className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl h-12"
                                />
                            </motion.div>
                            
                            <motion.div variants={itemVariants} className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Password
                                </label>
                                <div className="relative">
                                    <Input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password" 
                                        value={formData.password} 
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                        required 
                                        disabled={loading}
                                        className="bg-slate-900/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl h-12 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </motion.div>
                            
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert className="bg-red-900/50 border-red-500/50 backdrop-blur-sm">
                                        <AlertDescription className="text-red-300">{error}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                            
                            <motion.div variants={itemVariants}>
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Please wait...
                                        </div>
                                    ) : (
                                        isLogin ? 'Sign In to Dashboard' : 'Create Professional Account'
                                    )}
                                </Button>
                            </motion.div>
                        </motion.form>
                        
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-6 text-center"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-slate-800/50 text-slate-400">or</span>
                                </div>
                            </div>
                            
                            <button 
                                type="button" 
                                onClick={() => setIsLogin(!isLogin)} 
                                className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium" 
                                disabled={loading}
                            >
                                {isLogin 
                                    ? "Don't have an account? Create one now" 
                                    : "Already have an account? Sign in here"
                                }
                            </button>
                        </motion.div>
                        
                        {/* Professional Footer */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-6 pt-4 border-t border-slate-700/50 text-center"
                        >
                            <p className="text-xs text-slate-500">
                                Secure • Professional • Reliable
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AuthForm;