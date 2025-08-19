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
        gradient: 'from-blue-600 to-blue-800',
        borderColor: 'border-blue-700/50',
        textColor: 'text-blue-400'
    },
    { 
        label: 'Interviews Scheduled', 
        value: stats.interviews, 
        icon: MessageSquare, 
        gradient: 'from-purple-600 to-fuchsia-800',
        borderColor: 'border-purple-700/50',
        textColor: 'text-purple-400'
    },
    { 
        label: 'Offers Received', 
        value: stats.offers, 
        icon: Award, 
        gradient: 'from-green-600 to-emerald-800',
        borderColor: 'border-green-700/50',
        textColor: 'text-green-400'
    },
    { 
        label: 'Active Applications', 
        value: stats.applied, 
        icon: CheckCircle, 
        gradient: 'from-amber-600 to-orange-800',
        borderColor: 'border-amber-700/50',
        textColor: 'text-amber-400'
    },
    { 
        label: 'Rejected', 
        value: stats.rejected, 
        icon: XCircle, 
        gradient: 'from-rose-600 to-red-800',
        borderColor: 'border-rose-700/50',
        textColor: 'text-rose-400'
    },
];

    
    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                duration: 0.5,
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
                        y: -5,
                        transition: { duration: 0.2 }
                    }}
                    className="group"
                >
                    <Card className={`
                        relative overflow-hidden h-full
                        bg-slate-800/50 backdrop-blur-sm
                        border ${item.borderColor} 
                        transition-all duration-300
                        shadow-lg
                        hover:bg-slate-700/50
                        hover:border-slate-600
                    `}>
                        {/* Background Gradient */}
                        <div className={`
                            absolute inset-0 bg-gradient-to-br ${item.gradient} 
                            opacity-5 group-hover:opacity-10 transition-opacity duration-300
                        `} />
                        
                        <CardContent className="p-6 relative">
                            {/* Icon Background */}
                            <div className={`
                                absolute top-4 right-4 p-3 rounded-2xl bg-slate-700/50
                                group-hover:scale-110 transition-transform duration-300
                            `}>
                                <item.icon className={`h-6 w-6 ${item.textColor}`} />
                            </div>
                            
                            {/* Stats Content */}
                            <div className="relative z-10">
                                <div className="mb-3">
                                    <div className={`
                                        text-4xl font-bold bg-gradient-to-r ${item.gradient} 
                                        bg-clip-text text-transparent
                                    `}>
                                        {item.value}
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-300">
                                        {item.label}
                                    </div>
                                    
                                    {/* Progress indicator */}
                                    <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                        <motion.div 
                                            className={`h-full bg-gradient-to-r ${item.gradient} rounded-full`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (item.value / Math.max(stats.total, 1)) * 100)}%` }}
                                            transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default DashboardStats;