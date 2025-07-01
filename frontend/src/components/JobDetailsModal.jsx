import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Building2, Sparkles, MapPin, Calendar, Clock, DollarSign, ExternalLink, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import Badge from './ui/Badge';
import Button from './ui/Button';

const JobDetailsModal = ({ job, open, onClose }) => {
    const { user } = useAuth();
    const [suggestions, setSuggestions] = useState('');
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (job) {
            setSuggestions(job.aiSuggestions || '');
            setError('');
        }
    }, [job]);

    const handleGetSuggestions = async () => {
        if (!user.resume) {
            setError("Please add your resume text in your profile to get AI suggestions.");
            return;
        }
        setLoadingSuggestions(true);
        setError('');
        try {
            const { data } = await api.post('/resume/suggest', {
                resumeText: user.resume,
                jobId: job._id,
            });
            setSuggestions(data.suggestions);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get AI suggestions.');
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Applied': 'bg-gray-100 text-gray-800',
            'Interview Scheduled': 'bg-yellow-100 text-yellow-800',
            'Interview Completed': 'bg-blue-100 text-blue-800',
            'Rejected': 'bg-red-100 text-red-800',
            'Offer Received': 'bg-green-100 text-green-800',
            'Accepted': 'bg-green-200 text-green-900'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Low': 'bg-gray-100 text-gray-700',
            'Medium': 'bg-orange-100 text-orange-700',
            'High': 'bg-red-100 text-red-700'
        };
        return colors[priority] || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (dateString) => 
        dateString ? new Date(dateString).toLocaleDateString() : 'Not specified';

    if (!job) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Building2 className="h-6 w-6" />
                        {job.role} at {job.company}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="p-6 pt-2 space-y-6">
                    {/* Status and Priority Badges */}
                    <div className="flex gap-2 flex-wrap">
                        <Badge className={getPriorityColor(job.priority)}>
                            {job.priority} Priority
                        </Badge>
                        <Badge className={getStatusColor(job.status)}>
                            {job.status}
                        </Badge>
                    </div>

                    {/* Job Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 border-b pb-2">Job Information</h4>
                            
                            {job.location && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <MapPin className="h-4 w-4" />
                                    <span>{job.location}</span>
                                    {job.workType && <span className="text-gray-500">• {job.workType}</span>}
                                </div>
                            )}

                            {job.salary && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <DollarSign className="h-4 w-4" />
                                    <span>
                                        {typeof job.salary === 'object' 
                                            ? `${job.salary.min} - ${job.salary.max} ${job.salary.currency}`
                                            : job.salary
                                        }
                                    </span>
                                </div>
                            )}

                            {job.applicationDate && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="h-4 w-4" />
                                    <span>Applied: {formatDate(job.applicationDate)}</span>
                                </div>
                            )}

                            {job.datePosted && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Clock className="h-4 w-4" />
                                    <span>Posted: {formatDate(job.datePosted)}</span>
                                </div>
                            )}

                            {job.contactPerson && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <User className="h-4 w-4" />
                                    <span>{job.contactPerson}</span>
                                </div>
                            )}

                            {job.jobUrl && (
                                <div className="flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    <a 
                                        href={job.jobUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        View Job Posting
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 border-b pb-2">Additional Details</h4>
                            
                            {job.skills && job.skills.length > 0 && (
                                <div>
                                    <span className="text-sm font-medium text-gray-700 block mb-2">Required Skills:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {job.skills.map((skill, index) => (
                                            <Badge key={index} className="bg-blue-50 text-blue-700 text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {job.interviewDate && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="h-4 w-4" />
                                    <span>Interview: {formatDate(job.interviewDate)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Job Description */}
                    {job.description && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {job.notes && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                            <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-200">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* AI Suggestions */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">AI Resume Suggestions</h4>
                        <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">
                            {suggestions ? (
                                <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none">
                                    {suggestions}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                    <Sparkles className="h-8 w-8 mb-2" />
                                    <p>Get AI-powered suggestions to tailor your resume for this job.</p>
                                    <Button 
                                        className="mt-3" 
                                        size="sm" 
                                        onClick={handleGetSuggestions} 
                                        disabled={loadingSuggestions}
                                    >
                                        {loadingSuggestions ? 'Generating...' : 'Get Suggestions'}
                                    </Button>
                                </div>
                            )}
                            {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JobDetailsModal;