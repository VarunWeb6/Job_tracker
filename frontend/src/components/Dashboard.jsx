import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
// --- UPDATE: Added the 'User' icon for the profile button ---
import { PlusCircle, Search, LogOut, Target, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { Dialog } from './ui/Dialog';
import DashboardStats from './DashboardStats';
import JobCard from './JobCard';
import JobForm from './JobForm';
import JobDetailsModal from './JobDetailsModal';
// --- UPDATE: Import the ProfileModal component ---
import ProfileModal from './ProfileModal';

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

    // --- UPDATE: Added state for the Profile Modal ---
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        api.get('/jobs').then(res => setJobs(res.data)).catch(console.error).finally(() => setLoading(false));
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
        if (window.confirm('Delete this job application?')) {
            try {
                await api.delete(`/jobs/${jobId}`);
                setJobs(jobs.filter(job => job._id !== jobId));
            } catch (error) { alert("Could not delete job."); }
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
        } catch (error) { alert("Could not save job."); }
    };

    return (
        <div className="min-h-screen bg-transparent">
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Target className="h-8 w-8 text-accent" />
                            <h1 className="text-xl font-bold text-primary">JobTracker AI</h1>
                        </div>
                        {/* --- UPDATE: Restored the header with the Profile button --- */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground hidden sm:block">
                                Welcome, {user?.name}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsProfileModalOpen(true)}
                                className="rounded-full"
                            >
                                <User className="h-5 w-5" />
                                <span className="sr-only">Open Profile</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h2>
                    <p className="text-muted-foreground mt-1">Here's an overview of your job applications.</p>
                </motion.div>
                
                <DashboardStats jobs={jobs} />

                <div className="my-8 p-4 bg-white rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center ">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Search by company or role..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 !bg-secondary"/>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="!bg-secondary"><option value="">All Statuses</option><option>Applied</option><option>Interview Scheduled</option><option>Rejected</option><option>Offer Received</option></Select>
                        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="!bg-secondary"><option value="">All Priorities</option><option>Low</option><option>Medium</option><option>High</option></Select>
                    </div>
                    <Button onClick={handleAddJob} className="bg-accent rounded-lg px-2 hover:bg-accent/90 text-accent-foreground flex-shrink-0 w-full md:w-auto flex flex-row h-10 items-center justify-center">
                        <PlusCircle className="h-4 w-4 mr-2" />Add Job
                    </Button>
                </div>

                {/* --- UPDATE: Removed AnimatePresence from here. It only belongs around conditionally rendered items like modals. --- */}
                {loading ? <p className="text-center py-16">Loading jobs...</p> : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 red"
                        initial="hidden" animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    >
                        {filteredJobs.map((job) => <JobCard key={job._id} job={job} onEdit={handleEditJob} onDelete={handleDeleteJob} onViewDetails={handleViewDetails}/>)}
                    </motion.div>
                )}

                 {!loading && filteredJobs.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border">
                        <h3 className="text-lg font-medium text-primary">No jobs found</h3>
                        <p className="text-muted-foreground mt-2">Try adjusting your filters or add a new job application.</p>
                    </div>
                 )}
            </main>

            {/* --- UPDATE: This is the CORRECT and ONLY place for the modal AnimatePresence wrapper --- */}
            <AnimatePresence>
                {/* Job Form Modal */}
                {isJobFormOpen && (
                     <Dialog open={isJobFormOpen} onOpenChange={setIsJobFormOpen}>
                        <JobForm job={editingJob} onSubmit={handleJobSubmit} onCancel={() => setIsJobFormOpen(false)} />
                    </Dialog>
                )}
                {/* Job Details Modal */}
                {isDetailsModalOpen && (
                     <JobDetailsModal job={selectedJob} open={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}/>
                )}
                {/* Profile Modal */}
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