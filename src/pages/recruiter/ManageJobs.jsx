import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  Users,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageJobs = () => {
  const api_domain = import.meta.env.VITE_API_DOMAIN;
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${api_domain}/api/job/recruiter/me`, {
          withCredentials: true,
        });
        const jobsData = res.data.jobs || [];
        setJobs(jobsData || []);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error("Failed to load jobs");
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  const handleEdit = async (jobId) => {
    navigate(`/recruiter/post-job?edit=${jobId}`);
  };

  const handleDelete = async (jobId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoading(jobId);
    try {
      await axios.put(
        `${api_domain}/api/job/${jobId}/soft-delete`,
        {},
        {
          withCredentials: true,
        }
      );

      const updatedJobs = jobs.filter((job) => job._id !== jobId);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);

      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to delete job");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleViewApplications = (jobId) => {
    navigate(`/recruiter/view-applications/${jobId}`);
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    const { min, max, currency = "INR" } = salary;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
    return "Not specified";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">
                Job Management
              </h1>
              <p className="text-sm mt-1 text-gray-600">
                Manage your jobs and track your applications
              </p>
            </div>
            <Button
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3"
              variant="outline"
              onClick={() => navigate("/recruiter/post-job")}
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Add New Job</span>
              <span className="sm:hidden">Add Job</span>
            </Button>
          </div>
        </div>
        <div className="rounded-2xl shadow-xl shadow-black/5 border border-white/20 p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search jobs..."
                className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b3ee6d] focus:border-[#b3ee6d] outline-0 transition-all duration-200  bg-gray-50/50 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <p>
                Showing {filteredJobs.length} of {jobs.length}
                {""} jobs
              </p>
              {isLoading && (
                <div className="text-sm text-gray-500">Loading...</div>
              )}
            </div>
            <div className="backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              {filteredJobs.length === 0 && !isLoading ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium  mb-2">
                    {searchTerm ? "No jobs match your search" : "No jobs found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Start by creating your first job posting"}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => navigate("/recruiter/post-job")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Job
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 ">
                      <thead className="">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Job Details
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Posted
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Applicants
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className=" divide-y divide-gray-200">
                        {filteredJobs.map((job) => (
                          <tr
                            key={job._id}
                            className="hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <div className="text-sm font-semibold mb-1 ">
                                  {job.title}
                                </div>
                                <div className="text-xs text-gray-500 mb-2">
                                  {job.company?.name}
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <span className="flex items-center text-gray-500">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {job.location}
                                  </span>
                                  <span className="flex items-center text-gray-500">
                                    {formatSalary(job.salary)}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(job.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:bg-blue-50 px-2 py-1 rounded-lg">
                                <Users className="w-4 h-4 mr-1" />
                                {job.applicantCount || 0}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  job.isVerified
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {job.isVerified ? "Active" : "Pending"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-1">
                                <button
                                  className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                  onClick={() =>
                                    handleViewApplications(job._id)
                                  }
                                  title="View Applications"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  className="text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                                  onClick={() => handleEdit(job._id)}
                                  title="Edit Job"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(job._id)}
                                  disabled={deleteLoading === job._id}
                                  className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                                  title="Delete Job"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="lg:hidden">
                    <div className="divide-y divide-gray-200">
                      {filteredJobs.map((job) => (
                        <div key={job._id} className="p-4 sm:p-6">
                          <div className="flex flex-col space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                  {job.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  {job.company?.name}
                                </p>
                              </div>
                              <span
                                className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  job.isVerified
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {job.isVerified ? "Active" : "Pending"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span className="truncate">{job.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{formatDate(job.createdAt)}</span>
                              </div>
                              <div className="flex items-center col-span-2">
                                <span className="truncate">
                                  {formatSalary(job.salary)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                                <Users className="w-4 h-4 mr-1" />
                                {job.applicantCount || 0} Applicants
                              </button>

                              <div className="flex space-x-1">
                                <button
                                  className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                  onClick={() =>
                                    handleViewApplications(job._id)
                                  }
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  className="text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                                  onClick={() => handleEdit(job._id)}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(job._id)}
                                  disabled={deleteLoading === job._id}
                                  className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
