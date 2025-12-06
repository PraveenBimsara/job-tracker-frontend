import { useState } from "react";
import { Plus, Search, Briefcase } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import { useJobs } from "../hooks/useJobs";
import Loader from "../components/common/Loader";
import { KANBAN_COLUMNS } from "../utils/constnats";
import Modal from "../components/common/Modal";
import JobForm from "../components/job/JobForm";
import JobDetails from "../components/job/JobDetails";
import ConfirmDialog from "../components/common/ConfirmDialog";

const Dashboard = () => {
  const { jobs, loading, createJob, updateJob, deleteJob } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState("form");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleAddJob = () => {
    setSelectedJob(null);
    setViewMode("form");
    setShowJobModal(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setViewMode("details");
    setShowJobModal(true);
  };

  const handleEditFromDetails = () => {
    setViewMode("form");
  };

  const handleDeleteClick = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteJob(jobToDelete);
      setShowDeleteConfirm(false);
      setShowJobModal(false);
      setJobToDelete(null);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setJobToDelete(null);
  };

  const handleCloseModal = () => {
    setShowJobModal(false);
    setSelectedJob(null);
    setViewMode("form");
  };

  const handleSubmitJob = async (jobData) => {
    setSubmitting(true);
    try {
      if (selectedJob) {
        await updateJob(selectedJob._id, jobData);
      } else {
        await createJob(jobData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting job:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getJobsByStatus = (status) => {
    return jobs.filter(
      (job) =>
        job.status === status &&
        (searchTerm === "" ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.position.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Job Applications
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage your job search
            </p>
          </div>
          <Button variant="primary" className="gap-2" onClick={handleAddJob}>
            <Plus size={20} />
            Add New Job
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search companies or positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {KANBAN_COLUMNS.map((column) => {
            const count = getJobsByStatus(column.id).length;
            return (
              <div
                key={column.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: column.color }}
                  ></div>
                  <h3 className="text-sm font-medium text-gray-600">
                    {column.title}
                  </h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {KANBAN_COLUMNS.map((column) => {
            const columnJobs = getJobsByStatus(column.id);
            return (
              <div
                key={column.id}
                className="bg-gray-100 rounded-lg p-4 min-h-[400px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    ></div>
                    {column.title}
                    <span className="text-gray-500 text-sm">
                      ({columnJobs.length})
                    </span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {columnJobs.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                      No jobs yet
                    </p>
                  ) : (
                    columnJobs.map((job) => (
                      <div
                        key={job._id}
                        onClick={() => handleEditJob(job)}
                        className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                      >
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {job.company}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {job.position}
                        </p>
                        {job.location && (
                          <p className="text-xs text-gray-500 mb-3">
                            {job.location}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          {job.priority && (
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                job.priority === "High"
                                  ? "bg-red-100 text-red-700"
                                  : job.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {job.priority}
                            </span>
                          )}
                          {job.jobType && (
                            <span className="text-xs px-2 py-1 rounded bg-primary-100 text-primary-700">
                              {job.jobType}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
              <Briefcase className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No jobs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start tracking your job applications
            </p>
            <Button variant="primary" className="gap-2">
              <Plus size={20} />
              Add Your First Job
            </Button>
          </div>
        )}
      </div>

      {/* Job Modal */}
      <Modal
        isOpen={showJobModal}
        onClose={handleCloseModal}
        title={
          viewMode === "details"
            ? "Job Application Details"
            : selectedJob
            ? "Edit Job Application"
            : "Add New Job Application"
        }
        size="large"
      >
        {viewMode === "details" ? (
          <JobDetails
            job={selectedJob}
            onEdit={handleEditFromDetails}
            onDelete={handleDeleteClick}
            onClose={handleCloseModal}
          />
        ) : (
          <JobForm
            job={selectedJob}
            onSubmit={handleSubmitJob}
            onClose={handleCloseModal}
            onDelete={handleDeleteClick}
            loading={submitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Job Application"
        message="Are you sure you want to delete this job application? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleting}
      />
    </div>
  );
};

export default Dashboard;
