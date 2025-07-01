import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

const JobCard = ({ job, onEdit, onDelete, onViewDetails }) => {
    // ... color and formatting functions are the same ...
    const getStatusColor = (status) => ({ 'Applied': 'default', 'Interview Scheduled': 'warning', 'Interview Completed': 'secondary', 'Rejected': 'destructive', 'Offer Received': 'success', 'Accepted': 'success' }[status] || 'default');
    const getPriorityColor = (priority) => ({ 'Low': 'secondary', 'Medium': 'warning', 'High': 'destructive' }[priority] || 'default');
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : null;

    // ANIMATION: Variants for card entrance
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div layout variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Card className="h-full flex flex-col justify-between py-4">
                <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <Badge variant={getPriorityColor(job.priority)}>{job.priority}</Badge>
                        <Badge variant={getStatusColor(job.status)}>{job.status}</Badge>
                    </div>
                    <h3 className="font-bold text-lg text-primary truncate">{job.role}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm">
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{job.company}</span>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-2 mt-4">
                        {job.location && <div className="flex items-center gap-2"><MapPin className="h-3 w-3" /><span>{job.location} • {job.workType}</span></div>}
                        {formatDate(job.applicationDate) && <div className="flex items-center gap-2"><Calendar className="h-3 w-3" /><span>Applied: {formatDate(job.applicationDate)}</span></div>}
                    </div>
                </CardContent>

                <div className="border-t p-3 flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onViewDetails(job)} className="flex-1"><Eye className="h-4 w-4 mr-2" />View</Button>
                    <Button size="sm" variant="ghost" onClick={() => onEdit(job)}><Edit className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(job._id)} className="text-red-500 hover:bg-red-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                </div>
            </Card>
        </motion.div>
    );
};

export default JobCard;