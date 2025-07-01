import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import { Briefcase, MessageSquare, CheckCircle, XCircle, Award, TrendingUp } from 'lucide-react';

const DashboardStats = ({ jobs }) => {
    const stats = {
        total: jobs.length,
        applied: jobs.filter(j => j.status === 'Applied').length,
        interviews: jobs.filter(j => j.status.includes('Interview')).length,
        offers: jobs.filter(j => j.status === 'Offer Received').length,
        rejected: jobs.filter(j => j.status === 'Rejected').length
    };

    const statItems = [
        { 
            label: 'Total Applications', 
            value: stats.total, 
            icon: Briefcase, 
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            textColor: 'text-blue-400'
        },
        { 
            label: 'Interviews Scheduled', 
            value: stats.interviews, 
            icon: MessageSquare, 
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
            textColor: 'text-purple-400'
        },
        { 
            label: 'Offers Received', 
            value: stats.offers, 
            icon: Award, 
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/20',
            textColor: 'text-green-400'
        },
        { 
            label: 'Active Applications', 
            value: stats.applied, 
            icon: CheckCircle, 
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/20',
            textColor: 'text-yellow-400'
        },
        { 
            label: 'Rejected', 
            value: stats.rejected, 
            icon: XCircle, 
            color: 'from-red-500 to-rose-500',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/20',
            textColor: 'text-red-400'
        },
    ];
    
    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 10
            } 
        }
    };

    const containerVariants = {
        visible: { 
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.2
            } 
        }
    };

    return (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 my-8"
            initial="hidden" 
            animate="visible"
            variants={containerVariants}
        >
            {statItems.map((item, index) => (
                <motion.div 
                    key={item.label} 
                    variants={cardVariants}
                    whileHover={{ 
                        y: -8, 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                    }}
                    className="group"
                >
                    <Card className={`
                        relative overflow-hidden h-full
                        bg-slate-800/50 backdrop-blur-sm
                        border ${item.borderColor} 
                        hover:border-opacity-50
                        transition-all duration-300
                        shadow-lg hover:shadow-2xl
                        hover:shadow-${item.textColor.split('-')[1]}-500/20
                    `}>
                        <CardContent className="p-6 relative">
                            {/* Background Gradient */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-br ${item.color} 
                                opacity-5 group-hover:opacity-10 transition-opacity duration-300
                            `} />
                            
                            {/* Icon Background */}
                            <div className={`
                                absolute top-4 right-4 p-3 rounded-2xl ${item.bgColor}
                                group-hover:scale-110 transition-transform duration-300
                            `}>
                                <item.icon className={`h-6 w-6 ${item.textColor}`} />
                            </div>
                            
                            {/* Stats Content */}
                            <div className="relative z-10">
                                <div className="mb-3">
                                    <div className={`
                                        text-3xl font-bold bg-gradient-to-r ${item.color} 
                                        bg-clip-text text-transparent
                                        group-hover:scale-105 transition-transform duration-300
                                    `}>
                                        {item.value}
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-300">
                                        {item.label}
                                    </div>
                                    
                                    {/* Progress indicator */}
                                    <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                                        <motion.div 
                                            className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (item.value / Math.max(stats.total, 1)) * 100)}%` }}
                                            transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-tl from-white/5 to-transparent rounded-full" />
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-white/5 to-transparent rounded-full" />
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default DashboardStats;