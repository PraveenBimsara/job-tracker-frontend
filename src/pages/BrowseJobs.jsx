import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  ExternalLink,
  Plus,
  Briefcase,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import JobForm from "../components/job/JobForm";
import api from "../utils/api";
import { useJobs } from "../hooks/useJobs";
import toast from "react-hot-toast";
import { formatSalary } from "../utils/helpers";

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("software engineer");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const { createJob } = useJobs();

  const searchExternalJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/job-search", {
        params: {
          query: searchQuery,
        },
      });
      setJobs(data.data);
      toast.success(`Found ${data.count} jobs!`);
    } catch (error) {
      toast.error("Failed to search jobs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchExternalJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchExternalJobs();
  };

  const handleImportJob = (job) => {
    setSelectedJob(job);
    setShowImportModal(true);
  };

  const handleImportSubmit = async (jobData) => {
    setImporting(true);
    try {
      await createJob(jobData);
      setShowImportModal(false);
      setSelectedJob(null);
      toast.success("Job imported to your tracker!");
    } catch (error) {
      toast.error("Failed to import job");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="text-gray-600 mt-1">
            Search real remote job opportunities and import them to your tracker
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for jobs (e.g., React Developer, Python Engineer, DevOps)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <Button type="submit" variant="primary" loading={loading}>
              Search
            </Button>
          </div>
        </form>

        {/* Results Count */}
        {!loading && jobs.length > 0 && (
          <div className="mb-4 text-gray-600">
            Found{" "}
            <span className="font-semibold text-gray-900">{jobs.length}</span>{" "}
            remote jobs
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="large" />
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center py-20">
                <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600">
                  Try searching with different keywords like "React", "Python",
                  "Full Stack"
                </p>
              </div>
            ) : (
              jobs.map((job, index) => (
                <div
                  key={`${job.source}-${job.externalId}-${index}`}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                          {job.source}
                        </span>
                      </div>

                      <p className="text-gray-700 font-medium mb-3">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span>{job.location}</span>
                          </div>
                        )}

                        {(job.salary_min || job.salary_max) && (
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} />
                            <span>
                              {formatSalary(job.salary_min, job.salary_max)}
                            </span>
                          </div>
                        )}

                        {job.created && (
                          <span className="text-gray-500">
                            Posted {new Date(job.created).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {job.tags && job.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.tags.slice(0, 8).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors whitespace-nowrap"
                      >
                        <ExternalLink size={16} />
                        View Job
                      </a>
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => handleImportJob(job)}
                        className="gap-2 whitespace-nowrap"
                      >
                        <Plus size={16} />
                        Import
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Job to Tracker"
        size="large"
      >
        {selectedJob && (
          <JobForm
            job={{
              company: selectedJob.company,
              position: selectedJob.title,
              location: selectedJob.location,
              jobUrl: selectedJob.url,
              salary: {
                min: selectedJob.salary_min,
                max: selectedJob.salary_max,
              },
              notes: `Imported from ${selectedJob.source}`,
              status: "Wishlist",
              priority: "Medium",
              jobType: "Full-time",
            }}
            onSubmit={handleImportSubmit}
            onClose={() => setShowImportModal(false)}
            loading={importing}
          />
        )}
      </Modal>
    </div>
  );
};

export default BrowseJobs;
