import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PlusCircle, Search, LogOut, Target, User, Bell, Settings, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { Dialog } from './ui/Dialog';
import DashboardStats from './DashboardStats';
import JobCard from './JobCard';
import JobForm from './JobForm';
import JobDetailsModal from './JobDetailsModal';
import ProfileModal from './ProfileModal';

// Skeleton card for loading state
const JobCardSkeleton = () => (
    <div className="rounded-xl p-6 bg-slate-800/50 border border-slate-700/50 animate-pulse h-[200px]">
        <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-1/4 mb-6"></div>
        <div className="h-8 bg-slate-700 rounded w-full"></div>
    </div>
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [isJobFormOpen, setIsJobFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/jobs');
                setJobs(res.data);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const filtered = jobs
            .filter(job => job.company.toLowerCase().includes(searchTerm.toLowerCase()) || job.role.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(job => statusFilter ? job.status === statusFilter : true)
            .filter(job => priorityFilter ? job.priority === priorityFilter : true);
        setFilteredJobs(filtered);
    }, [jobs, searchTerm, statusFilter, priorityFilter]);

    const handleAddJob = () => { setEditingJob(null); setIsJobFormOpen(true); };
    const handleEditJob = (job) => { setEditingJob(job); setIsJobFormOpen(true); };
    const handleViewDetails = (job) => { setSelectedJob(job); setIsDetailsModalOpen(true); };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job application?')) {
            try {
                await api.delete(`/jobs/${jobId}`);
                setJobs(jobs.filter(job => job._id !== jobId));
            } catch (error) { alert("Could not delete job. Please try again."); }
        }
    };

    const handleJobSubmit = async (formData) => {
        try {
            if (editingJob) {
                const { data: updatedJob } = await api.put(`/jobs/${editingJob._id}`, formData);
                setJobs(jobs.map(job => (job._id === editingJob._id ? updatedJob : job)));
            } else {
                const { data: newJob } = await api.post('/jobs', formData);
                setJobs([newJob, ...jobs]);
            }
            setIsJobFormOpen(false);
        } catch (error) { alert("Could not save job. Please try again."); }
    };

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
            {/* Professional Header */}
            <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-xl">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-xl shadow-lg">
                                    <Target className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                        JobTracker Pro
                                    </h1>
                                    <p className="text-xs text-slate-400 -mt-1">Professional Edition</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-slate-300">Welcome, {user?.name}</span>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsProfileModalOpen(true)}
                                className="rounded-full bg-slate-800 hover:bg-slate-700/50 border border-slate-700 text-slate-300 hover:text-white transition-all duration-200"
                            >
                                <User className="h-4 w-4" />
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="bg-slate-800 hover:bg-red-900/50 border border-slate-700 text-slate-300 hover:text-red-300 transition-all duration-200 flex flex-row items-center"
                            >
                                <LogOut className="h-4 w-4 sm:mr-2 flex"/>
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Professional Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">
                                Job Application Dashboard
                            </h2>
                            <p className="text-slate-400 text-lg">
                                Track, manage, and optimize your job search journey
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm">Last updated: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </motion.div>
                
                <DashboardStats jobs={jobs} />

                {/* Enhanced Search and Filter Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="my-8 p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-2xl"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <Input 
                                placeholder="Search by company, role, or keywords..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                className="pl-12 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12 focus:border-cyan-500 transition-colors"
                            />
                        </div>
                        
                        <div className="flex gap-3 flex-wrap lg:flex-nowrap">
                            <Select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)} 
                                className="bg-slate-900 border-slate-700 text-white rounded-xl min-w-[140px]"
                            >
                                <option value="">All Statuses</option>
                                <option value="Applied">Applied</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Offer Received">Offer Received</option>
                            </Select>
                            
                            <Select 
                                value={priorityFilter} 
                                onChange={(e) => setPriorityFilter(e.target.value)} 
                                className="bg-slate-900 border-slate-700 text-white rounded-xl min-w-[140px]"
                            >
                                <option value="">All Priorities</option>
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </Select>
                            
                            <Button 
                                onClick={handleAddJob} 
                                className="bg-gradient-to-r from-cyan-600 to-blue-800 hover:from-cyan-700 hover:to-blue-900 text-white rounded-xl px-6 h-12 w-full lg:w-56 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <PlusCircle className="h-5 w-5" />
                                Add Application
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Jobs Grid */}
                {loading ? (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 }}}}
                    >
                        {Array.from({ length: 8 }).map((_, index) => (
                            <JobCardSkeleton key={index} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        initial="hidden" 
                        animate="visible"
                        variants={{ 
                            visible: { 
                                transition: { 
                                    staggerChildren: 0.05,
                                    delayChildren: 0.1
                                } 
                            } 
                        }}
                    >
                        {filteredJobs.map((job) => (
                            <JobCard 
                                key={job._id} 
                                job={job} 
                                onEdit={handleEditJob} 
                                onDelete={handleDeleteJob} 
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && filteredJobs.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700 backdrop-blur-sm"
                    >
                        <div className="p-4 bg-slate-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Target className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No applications found</h3>
                        <p className="text-slate-400 mb-6">
                            {searchTerm || statusFilter || priorityFilter 
                                ? "Try adjusting your filters to see more results" 
                                : "Start tracking your job applications to see them here."
                            }
                        </p>
                        <Button 
                            onClick={handleAddJob}
                            className="bg-gradient-to-r from-cyan-600 to-blue-800 hover:from-cyan-700 hover:to-blue-900 text-white rounded-xl px-6 py-3"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Add Your First Application
                        </Button>
                    </motion.div>
                )}
            </main>

            {/* Modals */}
            <AnimatePresence>
                {isJobFormOpen && (
                    <Dialog open={isJobFormOpen} onOpenChange={setIsJobFormOpen}>
                        <JobForm job={editingJob} onSubmit={handleJobSubmit} onCancel={() => setIsJobFormOpen(false)} />
                    </Dialog>
                )}
                {isDetailsModalOpen && (
                    <JobDetailsModal job={selectedJob} open={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}/>
                )}
                {isProfileModalOpen && (
                    <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                        <ProfileModal onCancel={() => setIsProfileModalOpen(false)} />
                    </Dialog>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;