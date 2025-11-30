import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchAnalytics();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/jobs/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const createJob = async (jobData) => {
    try {
      const { data } = await api.post('/jobs', jobData);
      setJobs([data, ...jobs]);
      toast.success('Job added successfully!');
      fetchAnalytics();
      return data;
    } catch (error) {
      toast.error('Failed to create job');
      throw error;
    }
  };

  const updateJob = async (id, jobData) => {
    try {
      const { data } = await api.put(`/jobs/${id}`, jobData);
      setJobs(jobs.map((job) => (job._id === id ? data : job)));
      toast.success('Job updated successfully!');
      fetchAnalytics();
      return data;
    } catch (error) {
      toast.error('Failed to update job');
      throw error;
    }
  };

  const deleteJob = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
      toast.success('Job deleted successfully!');
      fetchAnalytics();
    } catch (error) {
      toast.error('Failed to delete job');
      throw error;
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        analytics,
        fetchJobs,
        createJob,
        updateJob,
        deleteJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};