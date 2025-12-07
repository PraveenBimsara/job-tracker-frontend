import { useState, useEffect } from "react";
import { ExternalLink, Plus, Sparkles } from "lucide-react";
import Button from "../common/Button";
import Loader from "../common/Loader";
import api from "../../utils/api";
import toast from "react-hot-toast";

const RecommendedJobs = ({ onImport }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const { data } = await api.get("/job-search/recommendations");
      setJobs(data.data);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <div className="flex justify-center">
          <Loader size="medium" />
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-6 shadow-sm border border-primary-200 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-primary-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Recommended For You</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Based on your applications, here are some jobs you might like
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job, index) => (
          <div
            key={`${job.externalId}-${index}`}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{job.company}</p>

            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {job.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 border border-primary-600 rounded hover:bg-primary-50 transition-colors"
              >
                <ExternalLink size={14} />
                View
              </a>
              <Button
                variant="primary"
                size="small"
                onClick={() => onImport(job)}
                className="flex-1 gap-1 text-xs"
              >
                <Plus size={14} />
                Import
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;
