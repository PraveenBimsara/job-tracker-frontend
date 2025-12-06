import { useState, useEffect } from "react";
import {
  Trash2,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import { JOB_TYPES, PRIORITY_LEVELS, JOB_STATUS } from "../../utils/constnats";

const JobForm = ({ job, onSubmit, onClose, onDelete, loading }) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    jobType: "Full-time",
    status: "Wishlist",
    priority: "Medium",
    salaryMin: "",
    salaryMax: "",
    jobUrl: "",
    notes: "",
    contactPerson: {
      name: "",
      email: "",
      phone: "",
    },
    applicationDate: "",
    interviewDate: "",
  });

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company || "",
        position: job.position || "",
        location: job.location || "",
        jobType: job.jobType || "Full-time",
        status: job.status || "Wishlist",
        priority: job.priority || "Medium",
        salaryMin: job.salary?.min || "",
        salaryMax: job.salary?.max || "",
        jobUrl: job.jobUrl || "",
        notes: job.notes || "",
        contactPerson: {
          name: job.contactPerson?.name || "",
          email: job.contactPerson?.email || "",
          phone: job.contactPerson?.phone || "",
        },
        applicationDate: job.applicationDate
          ? new Date(job.applicationDate).toISOString().split("T")[0]
          : "",
        interviewDate: job.interviewDate
          ? new Date(job.interviewDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact_")) {
      const field = name.replace("contact_", "");
      setFormData({
        ...formData,
        contactPerson: {
          ...formData.contactPerson,
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const jobData = {
      company: formData.company,
      position: formData.position,
      location: formData.location,
      jobType: formData.jobType,
      status: formData.status,
      priority: formData.priority,
      jobUrl: formData.jobUrl,
      notes: formData.notes,
      salary: {
        min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
      },
      contactPerson: {
        name: formData.contactPerson.name,
        email: formData.contactPerson.email,
        phone: formData.contactPerson.phone,
      },
      applicationDate: formData.applicationDate || undefined,
      interviewDate: formData.interviewDate || undefined,
    };

    onSubmit(jobData);
  };

  const handleDelete = () => {
    onDelete(job._id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {job && onDelete && (
        <div className="flex justify-end -mt-2 mb-4">
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <Trash2 size={16} />
            Delete Application
          </button>
        </div>
      )}
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Company Name *"
          name="company"
          placeholder="Google"
          icon={Briefcase}
          value={formData.company}
          onChange={handleChange}
          required
        />

        <Input
          label="Position *"
          name="position"
          placeholder="Software Engineer"
          icon={Briefcase}
          value={formData.position}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Location"
          name="location"
          placeholder="San Francisco, CA"
          icon={MapPin}
          value={formData.location}
          onChange={handleChange}
        />

        <Input
          label="Job URL"
          name="jobUrl"
          type="url"
          placeholder="https://careers.company.com/job/123"
          icon={LinkIcon}
          value={formData.jobUrl}
          onChange={handleChange}
        />
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Type
          </label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            {Object.values(JOB_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            {PRIORITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Minimum Salary"
          name="salaryMin"
          type="number"
          placeholder="50000"
          icon={DollarSign}
          value={formData.salaryMin}
          onChange={handleChange}
        />

        <Input
          label="Maximum Salary"
          name="salaryMax"
          type="number"
          placeholder="80000"
          icon={DollarSign}
          value={formData.salaryMax}
          onChange={handleChange}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Application Date"
          name="applicationDate"
          type="date"
          icon={Calendar}
          value={formData.applicationDate}
          onChange={handleChange}
        />

        <Input
          label="Interview Date"
          name="interviewDate"
          type="date"
          icon={Calendar}
          value={formData.interviewDate}
          onChange={handleChange}
        />
      </div>

      {/* Contact Person */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Contact Person (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Name"
            name="contact_name"
            placeholder="John Doe"
            value={formData.contactPerson.name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="contact_email"
            type="email"
            placeholder="john@company.com"
            value={formData.contactPerson.email}
            onChange={handleChange}
          />

          <Input
            label="Phone"
            name="contact_phone"
            type="tel"
            placeholder="+1 234 567 8900"
            value={formData.contactPerson.phone}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          placeholder="Add any additional notes about this application..."
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {job ? "Update Job" : "Add Job"}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
