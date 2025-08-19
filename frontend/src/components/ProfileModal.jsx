import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import Input from './ui/Input';
import Button from './ui/Button';
import Textarea from './ui/Textarea';

const ProfileModal = ({ onCancel }) => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        resume: user?.resume || '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const { data } = await api.put('/user/profile', formData);
            setUser(data.user);
            setMessage('Profile updated successfully!');
            setTimeout(() => {
                setMessage('');
                onCancel();
            }, 1500);
        } catch (error) {
            setMessage('Failed to update profile. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <DialogContent className="max-w-2xl bg-slate-900 text-slate-200 border border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-white">My Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-400">Full Name</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-400">Your Resume</label>
                        <p className="text-xs text-slate-500 mb-2">
                            Paste your full resume text here. This will be used by the AI to generate suggestions for each job application.
                        </p>
                        <Textarea
                            name="resume"
                            value={formData.resume}
                            onChange={handleChange}
                            className="min-h-[300px] bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                            placeholder="Paste your resume here..."
                        />
                    </div>
                    
                    {message && <p className={`text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                        <Button type="button" variant="outline" onClick={onCancel} className="text-slate-300 hover:bg-slate-800 border-slate-700 hover:text-white">
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="bg-gradient-to-r from-cyan-600 to-blue-800 hover:from-cyan-700 hover:to-blue-900 text-white rounded-xl px-6 font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </motion.div>
    );
};

export default ProfileModal;