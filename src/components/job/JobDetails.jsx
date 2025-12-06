import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Link as LinkIcon,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
} from "lucide-react";
import Button from "../common/Button";
import { formatDate, formatSalary } from "../../utils/helpers";

const JobDetails = ({ job, onEdit, onDelete, onClose }) => {
  const handleDelete = () => {
    onDelete(job._id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{job.company}</h2>
          <p className="text-lg text-gray-600 mt-1">{job.position}</p>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.priority === "High"
                ? "bg-red-100 text-red-700"
                : job.priority === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {job.priority} Priority
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700">
            {job.status}
          </span>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {job.location && (
          <div className="flex items-start gap-3">
            <MapPin className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-gray-900 font-medium">{job.location}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <Briefcase className="text-gray-400 mt-1" size={20} />
          <div>
            <p className="text-sm text-gray-600">Job Type</p>
            <p className="text-gray-900 font-medium">{job.jobType}</p>
          </div>
        </div>

        {(job.salary?.min || job.salary?.max) && (
          <div className="flex items-start gap-3">
            <DollarSign className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Salary Range</p>
              <p className="text-gray-900 font-medium">
                {formatSalary(job.salary.min, job.salary.max)}
              </p>
            </div>
          </div>
        )}

        {job.jobUrl && (
          <div className="flex items-start gap-3">
            <LinkIcon className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Job Posting</p>
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View Posting →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Dates */}
      {(job.applicationDate || job.interviewDate) && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Important Dates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.applicationDate && (
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Application Date</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(job.applicationDate)}
                  </p>
                </div>
              </div>
            )}

            {job.interviewDate && (
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Interview Date</p>
                  <p className="text-gray-900 font-medium">
                    {formatDate(job.interviewDate)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Person */}
      {(job.contactPerson?.name ||
        job.contactPerson?.email ||
        job.contactPerson?.phone) && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Contact Person
          </h3>
          <div className="space-y-3">
            {job.contactPerson.name && (
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={20} />
                <p className="text-gray-900">{job.contactPerson.name}</p>
              </div>
            )}
            {job.contactPerson.email && (
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />
                <a
                  href={`mailto:${job.contactPerson.email}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {job.contactPerson.email}
                </a>
              </div>
            )}
            {job.contactPerson.phone && (
              <div className="flex items-center gap-3">
                <Phone className="text-gray-400" size={20} />
                <a
                  href={`tel:${job.contactPerson.phone}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {job.contactPerson.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {job.notes && (
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Notes</h3>
          <p className="text-gray-900 whitespace-pre-wrap">{job.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-between pt-6 border-t">
        <Button variant="danger" onClick={handleDelete} className="gap-2">
          <Trash2 size={16} />
          Delete
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onEdit} className="gap-2">
            <Edit size={16} />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
