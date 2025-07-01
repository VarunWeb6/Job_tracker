import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from './ui/Dialog'; // Named
import Input from './ui/Input';     // Default
import Button from './ui/Button';   // Default
import Select from './ui/Select';   // Default
import Textarea from './ui/Textarea'; // Default

const JobForm = ({ job, onSubmit, onCancel }) => {
    // ... component logic remains the same
    const [formData, setFormData] = useState({
        company: job?.company || '', role: job?.role || '', status: job?.status || 'Applied',
        location: job?.location || '', workType: job?.workType || 'Remote', jobUrl: job?.jobUrl || '',
        salary: { min: job?.salary?.min || '', max: job?.salary?.max || '', currency: job?.salary?.currency || 'USD' },
        deadline: job?.deadline ? job.deadline.split('T')[0] : '',
        jdText: job?.jdText || '', notes: job?.notes || '', priority: job?.priority || 'Medium'
    });
    const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleSalaryChange = (e) => { setFormData(prev => ({ ...prev, salary: { ...prev.salary, [e.target.name]: e.target.value } })); };
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...formData };
        if (data.salary.min === '') delete data.salary.min;
        if (data.salary.max === '') delete data.salary.max;
        if (data.deadline === '') delete data.deadline;
        onSubmit(data);
    };

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{job ? 'Edit Job Application' : 'Add New Job'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium">Company *</label><Input name="company" value={formData.company} onChange={handleChange} required /></div>
                    <div><label className="text-sm font-medium">Role *</label><Input name="role" value={formData.role} onChange={handleChange} required /></div>
                </div>
                <div><label className="text-sm font-medium">Job Description</label><Textarea name="jdText" value={formData.jdText} onChange={handleChange} className="min-h-[100px]"/></div>
                <div className="flex gap-3 pt-4"><Button type="submit" className="flex-1">{job ? 'Update Job' : 'Add Job'}</Button><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></div>
            </form>
        </DialogContent>
    );
};
export default JobForm;