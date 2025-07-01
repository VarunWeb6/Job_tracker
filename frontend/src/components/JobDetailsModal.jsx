import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Building2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog'; // Named
import Badge from './ui/Badge'; // Default
import Button from './ui/Button'; // Default

const JobDetailsModal = ({ job, open, onClose }) => {
    // ... component logic remains the same
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
    if (!job) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />{job.role} at {job.company}</DialogTitle>
                </DialogHeader>
                <div className="p-6 pt-2 space-y-6">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">AI Resume Suggestions</h4>
                        <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">
                            {suggestions ? <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none">{suggestions}</div> : 
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                <Sparkles className="h-8 w-8 mb-2" />
                                <p>Get AI-powered suggestions to tailor your resume for this job.</p>
                                <Button className="mt-3" size="sm" onClick={handleGetSuggestions} disabled={loadingSuggestions}>{loadingSuggestions ? 'Generating...' : 'Get Suggestions'}</Button>
                            </div>}
                            {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default JobDetailsModal;