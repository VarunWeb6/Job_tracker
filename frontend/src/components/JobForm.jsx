import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import Input from './ui/Input';
import Button from './ui/Button';
import Select from './ui/Select';
import Textarea from './ui/Textarea';

const JobForm = ({ job, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        company: job?.company || '', role: job?.role || '', status: job?.status || 'Applied',
        location: job?.location || '', workType: job?.workType || 'Remote', jobUrl: job?.jobUrl || '',
        salary: { min: job?.salary?.min || '', max: job?.salary?.max || '', currency: job?.salary?.currency || 'USD' },
        deadline: job?.deadline ? job.deadline.split('T')[0] : '',
        jdText: job?.jdText || '', notes: job?.notes || '', priority: job?.priority || 'Medium'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, salary: { ...prev.salary, [name]: value } }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = { ...formData };
        if (submissionData.salary.min === '') delete submissionData.salary.min;
        if (submissionData.salary.max === '') delete submissionData.salary.max;
        if (submissionData.deadline === '') delete submissionData.deadline;
        onSubmit(submissionData);
    };

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 text-slate-200 border border-slate-700">
            <DialogHeader><DialogTitle className="text-white">{job ? 'Edit Job Application' : 'Add New Job'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-400">Company <span className="text-red-500">*</span></label>
                        <Input name="company" value={formData.company} onChange={handleChange} required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400">Role <span className="text-red-500">*</span></label>
                        <Input name="role" value={formData.role} onChange={handleChange} required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium text-slate-400">Status</label>
                        <Select name="status" value={formData.status} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white">
                            <option>Applied</option><option>Interview Scheduled</option><option>Interview Completed</option><option>Rejected</option><option>Offer Received</option><option>Accepted</option>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400">Work Type</label>
                        <Select name="workType" value={formData.workType} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white">
                            <option>Remote</option><option>On-site</option><option>Hybrid</option>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400">Priority</label>
                        <Select name="priority" value={formData.priority} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white">
                            <option>Low</option><option>Medium</option><option>High</option>
                        </Select>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-400">Location</label>
                    <Input name="location" value={formData.location} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-400">Application Deadline</label>
                    <Input name="deadline" type="date" value={formData.deadline} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-400">Job URL</label>
                    <Input name="jobUrl" type="url" value={formData.jobUrl} onChange={handleChange} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-400">Salary Range</label>
                    <div className="grid grid-cols-3 gap-2">
                        <Input name="min" type="number" placeholder="Min" value={formData.salary.min} onChange={handleSalaryChange} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                        <Input name="max" type="number" placeholder="Max" value={formData.salary.max} onChange={handleSalaryChange} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                        <Select name="currency" value={formData.salary.currency} onChange={handleSalaryChange} className="bg-slate-800 border-slate-700 text-white">
                            <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option>
                        </Select>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-400">Job Description</label>
                    <Textarea name="jdText" value={formData.jdText} onChange={handleChange} className="min-h-[100px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-400">Notes</label>
                    <Textarea name="notes" value={formData.notes} onChange={handleChange} className="min-h-[80px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                    <Button type="button" variant="outline" onClick={onCancel} className="text-slate-300 hover:bg-slate-800 border-slate-700 hover:text-white">
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-cyan-600 to-blue-800 hover:from-cyan-700 hover:to-blue-900 text-white rounded-xl px-6 font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        {job ? 'Update Job' : 'Add Job'}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default JobForm;