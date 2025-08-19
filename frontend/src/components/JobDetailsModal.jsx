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
            // Optionally, save suggestions back to the job record
            // await api.put(`/jobs/${job._id}`, { aiSuggestions: data.suggestions });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get AI suggestions.');
        } finally {
            setLoadingSuggestions(false);
        }
    };

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
        dateString ? new Date(dateString).toLocaleDateString() : 'Not specified';

    if (!job) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 text-slate-200 border border-slate-700">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                        <Building2 className="h-6 w-6 text-slate-400" />
                        <span className="text-white">{job.role} at {job.company}</span>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="p-6 pt-2 space-y-6">
                    {/* Status and Priority Badges */}
                    <div className="flex gap-2 flex-wrap">
                        <Badge className={`rounded-full px-3 py-1 text-xs border ${getPriorityStyle(job.priority)}`}>
                            {job.priority} Priority
                        </Badge>
                        <Badge className={`rounded-full px-3 py-1 text-xs border ${getStatusStyle(job.status)}`}>
                            {job.status}
                        </Badge>
                    </div>

                    {/* Job Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-200 border-b border-slate-700 pb-2">Job Information</h4>
                            
                            {job.location && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                    <span>{job.location}</span>
                                    {job.workType && <span className="text-slate-500">• {job.workType}</span>}
                                </div>
                            )}

                            {job.salary && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <DollarSign className="h-4 w-4 text-slate-500" />
                                    <span>
                                        {typeof job.salary === 'object' 
                                            ? `${job.salary.min} - ${job.salary.max} ${job.salary.currency}`
                                            : job.salary
                                        }
                                    </span>
                                </div>
                            )}

                            {job.applicationDate && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <span>Applied: {formatDate(job.applicationDate)}</span>
                                </div>
                            )}

                            {job.datePosted && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Clock className="h-4 w-4 text-slate-500" />
                                    <span>Posted: {formatDate(job.datePosted)}</span>
                                </div>
                            )}

                            {job.contactPerson && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <User className="h-4 w-4 text-slate-500" />
                                    <span>{job.contactPerson}</span>
                                </div>
                            )}

                            {job.jobUrl && (
                                <div className="flex items-center gap-2 text-sm">
                                    <ExternalLink className="h-4 w-4 text-blue-400" />
                                    <a 
                                        href={job.jobUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                        View Job Posting
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-200 border-b border-slate-700 pb-2">Additional Details</h4>
                            
                            {job.skills && job.skills.length > 0 && (
                                <div>
                                    <span className="text-sm font-medium text-slate-400 block mb-2">Required Skills:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <Badge key={index} className="bg-blue-900/50 text-blue-300 text-xs border border-blue-800/50">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {job.interviewDate && (
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <span>Interview: {formatDate(job.interviewDate)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Job Description */}
                    {job.description && (
                        <div>
                            <h4 className="font-semibold text-slate-200 mb-2">Job Description</h4>
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                                <p className="text-sm text-slate-300 whitespace-pre-wrap">{job.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {job.notes && (
                        <div>
                            <h4 className="font-semibold text-slate-200 mb-2">Notes</h4>
                            <div className="bg-orange-900/20 rounded-lg p-4 border-l-4 border-orange-500">
                                <p className="text-sm text-orange-300 whitespace-pre-wrap">{job.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* AI Suggestions */}
                    <div>
                        <h4 className="font-semibold text-slate-200 mb-2">AI Resume Suggestions</h4>
                        <div className="border border-slate-700 rounded-lg p-4 min-h-[200px] bg-slate-800/50">
                            {suggestions ? (
                                <div className="text-sm text-slate-300 whitespace-pre-wrap prose prose-sm max-w-none">
                                    {suggestions}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                                    <Sparkles className="h-8 w-8 mb-2 text-slate-600" />
                                    <p>Get AI-powered suggestions to tailor your resume for this job.</p>
                                    <Button 
                                        className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-800 hover:from-cyan-700 hover:to-blue-900 text-white rounded-xl px-6 h-10 shadow-lg hover:shadow-2xl transition-all duration-300" 
                                        size="sm" 
                                        onClick={handleGetSuggestions} 
                                        disabled={loadingSuggestions}
                                    >
                                        {loadingSuggestions ? 'Generating...' : 'Get Suggestions'}
                                    </Button>
                                </div>
                            )}
                            {error && <p className="text-red-400 text-xs text-center mt-2">{error}</p>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-4 border-t border-slate-700">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            className="text-slate-300 hover:bg-slate-800 border-slate-700 hover:text-white"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JobDetailsModal;