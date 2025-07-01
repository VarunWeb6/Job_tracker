import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import { Briefcase, MessageSquare, CheckCircle, XCircle, Award } from 'lucide-react';

const DashboardStats = ({ jobs }) => {
    // ... stats calculation logic is the same ...
    const stats = {
        total: jobs.length,
        applied: jobs.filter(j => j.status === 'Applied').length,
        interviews: jobs.filter(j => j.status.includes('Interview')).length,
        offers: jobs.filter(j => j.status === 'Offer Received').length,
        rejected: jobs.filter(j => j.status === 'Rejected').length
    };


    const statItems = [
        { label: 'Total Apps', value: stats.total, icon: Briefcase, color: 'text-accent' },
        { label: 'Interviews', value: stats.interviews, icon: MessageSquare, color: 'text-purple-500' },
        { label: 'Offers', value: stats.offers, icon: Award, color: 'text-green-500' },
        { label: 'Active', value: stats.applied, icon: CheckCircle, color: 'text-yellow-500' },
        { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-500' },
    ];
    
    // ANIMATION: Variants for staggered animation
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div 
            className="grid grid-cols-2 md:grid-cols-5 gap-4 my-8"
            initial="hidden" animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.1 } }
            }}
        >
            {statItems.map(item => (
                <motion.div key={item.label} variants={cardVariants}>
                    <Card className="hover:shadow-lg transition-shadow border-l-4" style={{borderColor: item.color.replace('text-', '').replace('-500', '')}}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold text-primary">{item.value}</div>
                                <div className="text-sm text-muted-foreground">{item.label}</div>
                            </div>
                            <item.icon className={`h-8 w-8 ${item.color}`} />
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default DashboardStats;