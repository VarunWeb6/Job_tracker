// frontend/src/components/ProfileModal.jsx

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
            // Update the user in our global auth context
            setUser(data.user);
            setMessage('Profile updated successfully!');
            setTimeout(() => {
                setMessage('');
                onCancel(); // Close modal on success
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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>My Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-primary">Full Name</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-primary">Your Resume</label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Paste your full resume text here. This will be used by the AI to generate suggestions for each job application.
                        </p>
                        <Textarea
                            name="resume"
                            value={formData.resume}
                            onChange={handleChange}
                            className="min-h-[300px] font-mono text-xs"
                            placeholder="Paste your resume here..."
                        />
                    </div>
                    
                    {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-muted-foreground hover:bg-accent/90 text-accent-foreground rounded-xl px-2 ">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </motion.div>
    );
};

export default ProfileModal;