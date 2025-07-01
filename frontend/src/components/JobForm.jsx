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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{job ? 'Edit Job Application' : 'Add New Job'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium">Company *</label><Input name="company" value={formData.company} onChange={handleChange} required /></div>
                    <div><label className="text-sm font-medium">Role *</label><Input name="role" value={formData.role} onChange={handleChange} required /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="text-sm font-medium">Status</label><Select name="status" value={formData.status} onChange={handleChange}><option>Applied</option><option>Interview Scheduled</option><option>Interview Completed</option><option>Rejected</option><option>Offer Received</option><option>Accepted</option></Select></div>
                    <div><label className="text-sm font-medium">Work Type</label><Select name="workType" value={formData.workType} onChange={handleChange}><option>Remote</option><option>On-site</option><option>Hybrid</option></Select></div>
                    <div><label className="text-sm font-medium">Priority</label><Select name="priority" value={formData.priority} onChange={handleChange}><option>Low</option><option>Medium</option><option>High</option></Select></div>
                </div>
                <div><label className="text-sm font-medium">Location</label><Input name="location" value={formData.location} onChange={handleChange} /></div>
                <div><label className="text-sm font-medium">Application Deadline</label><Input name="deadline" type="date" value={formData.deadline} onChange={handleChange} /></div>
                <div><label className="text-sm font-medium">Job URL</label><Input name="jobUrl" type="url" value={formData.jobUrl} onChange={handleChange} /></div>
                <div><label className="text-sm font-medium">Salary Range</label><div className="grid grid-cols-3 gap-2"><Input name="min" type="number" placeholder="Min" value={formData.salary.min} onChange={handleSalaryChange}/><Input name="max" type="number" placeholder="Max" value={formData.salary.max} onChange={handleSalaryChange}/><Select name="currency" value={formData.salary.currency} onChange={handleSalaryChange}><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option></Select></div></div>
                <div><label className="text-sm font-medium">Job Description</label><Textarea name="jdText" value={formData.jdText} onChange={handleChange} className="min-h-[100px]"/></div>
                <div><label className="text-sm font-medium">Notes</label><Textarea name="notes" value={formData.notes} onChange={handleChange} className="min-h-[80px]"/></div>
                <div className="flex gap-3 pt-4"><Button type="submit" className="flex-1">{job ? 'Update Job' : 'Add Job'}</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></div>
            </form>
        </DialogContent>
    );
};

export default JobForm;