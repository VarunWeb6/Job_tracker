import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/Card';

const JobCard = ({ job, onEdit, onDelete, onViewDetails }) => {
  const getStatusStyle = (status) => {
    const styles = {
      'Applied': 'bg-blue-900/50 text-blue-300 border-blue-800/50',
      'Interview Scheduled': 'bg-yellow-900/50 text-yellow-300 border-yellow-800/50',
      'Interview Completed': 'bg-cyan-900/50 text-cyan-300 border-cyan-800/50',
      'Rejected': 'bg-red-900/50 text-red-300 border-red-800/50',
      'Offer Received': 'bg-green-900/50 text-green-300 border-green-800/50',
      'Accepted': 'bg-emerald-900/50 text-emerald-300 border-emerald-800/50'
    };
    return styles[status] || 'bg-slate-700/50 text-slate-300 border-slate-600/50';
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      'Low': 'bg-slate-800 text-slate-400 border-slate-700',
      'Medium': 'bg-orange-900/50 text-orange-300 border-orange-800/50',
      'High': 'bg-red-900/50 text-red-300 border-red-800/50'
    };
    return styles[priority] || 'bg-slate-800 text-slate-400 border-slate-700';
  };

  const formatDate = (dateString) => 
    dateString ? new Date(dateString).toLocaleDateString() : null;

  if (!job) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Header with badges */}
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityStyle(job.priority)}`}>
              {job.priority}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(job.status)}`}>
              {job.status}
            </span>
          </div>

          {/* Job title */}
          <h3 className="text-white font-bold text-lg mb-1 truncate">
            {job.role}
          </h3>

          {/* Company */}
          <div className="flex items-center gap-2 text-slate-400 mb-4">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate text-sm">{job.company}</span>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4 text-sm text-slate-500">
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{job.location}{job.workType ? ` • ${job.workType}` : ''}</span>
              </div>
            )}
            {formatDate(job.applicationDate) && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Applied: {formatDate(job.applicationDate)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-800">
            <button 
              onClick={() => onViewDetails?.(job)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="font-medium">View</span>
            </button>
            <button 
              onClick={() => onEdit?.(job)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete?.(job._id)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobCard;