import React from 'react';
import { Building2, MapPin, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

const JobCard = ({ job, onEdit, onDelete, onViewDetails }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-gray-700 text-gray-300',
      'Interview Scheduled': 'bg-yellow-900 text-yellow-300',
      'Interview Completed': 'bg-blue-900 text-blue-300',
      'Rejected': 'bg-red-900 text-red-300',
      'Offer Received': 'bg-green-900 text-green-300',
      'Accepted': 'bg-green-800 text-green-200'
    };
    return colors[status] || 'bg-gray-700 text-gray-300';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-gray-800 text-gray-400',
      'Medium': 'bg-orange-900 text-orange-300',
      'High': 'bg-red-800 text-red-300'
    };
    return colors[priority] || 'bg-gray-800 text-gray-400';
  };

  const formatDate = (dateString) => 
    dateString ? new Date(dateString).toLocaleDateString() : null;

  if (!job) {
    return null;
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-all duration-200 hover:bg-gray-850 group">
      {/* Header with badges */}
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(job.priority)}`}>
          {job.priority}
        </span>
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(job.status)}`}>
          {job.status}
        </span>
      </div>

      {/* Job title */}
      <h3 className="text-white font-semibold text-lg mb-1 truncate">
        {job.role}
      </h3>

      {/* Company */}
      <div className="flex items-center gap-2 text-gray-400 mb-4">
        <Building2 className="h-4 w-4 flex-shrink-0" />
        <span className="truncate text-sm">{job.company}</span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {job.location && (
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <MapPin className="h-3 w-3" />
            <span>{job.location}{job.workType ? ` • ${job.workType}` : ''}</span>
          </div>
        )}
        {formatDate(job.applicationDate) && (
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Calendar className="h-3 w-3" />
            <span>Applied: {formatDate(job.applicationDate)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1 pt-3 border-t border-gray-800">
        <button 
          onClick={() => onViewDetails?.(job)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
        >
          <Eye className="h-3 w-3" />
          View
        </button>
        <button 
          onClick={() => onEdit?.(job)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
        >
          <Edit className="h-3 w-3" />
        </button>
        <button 
          onClick={() => onDelete?.(job._id)}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default JobCard;