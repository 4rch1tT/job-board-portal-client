import React, { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Download,
  Eye,
  ArrowLeft,
  DollarSign,
  Clock,
} from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ViewApplications = () => {
  const api_domain = import.meta.env.VITE_API_DOMAIN;
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async (jobId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${api_domain}/api/application/job/${jobId}`,
        {
          withCredentials: true,
        }
      );

      setApplications(response.data.applications || []);

      const jobResponse = await axios.get(`${api_domain}/api/job/${jobId}`, {
        withCredentials: true,
      });
      setJobDetails(jobResponse.data.job);
    } catch (error) {
      console.error("Failed to fetch applications", error);

      if (error.response?.status === 403 || error.response?.status === 401) {
        navigate("/recruiter/manage-jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchApplications(jobId);
    } else {
      navigate("/recruiter/manage-jobs");
    }
  }, [jobId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    const { min, max, currency = "INR" } = salary;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
    return "Not specified";
  };

  const handleDownloadResume = (resumeUrl, candidateName) => {
    if (resumeUrl) {
      const link = document.createElement("a");
      link.href = resumeUrl;
      link.download = `${candidateName.replace(/\s+/g, "_")}_resume.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("Resume not available");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b3ee6d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <button
                onClick={() => navigate("/recruiter/manage-jobs")}
                className="group flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-[#b3ee6d] hover:to-[#b3ee5d] border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Jobs</span>
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Applications Overview
                </h1>
                {jobDetails && (
                  <p className="text-gray-600 text-sm mt-1">
                    {jobDetails.title} • {applications.length} Application
                    {applications.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {jobDetails && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {jobDetails.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{jobDetails.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>{jobDetails.jobType}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>{formatSalary(jobDetails.salary)}</span>
              </div>
            </div>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md">
            <div className="text-center py-16">
              <Users className="mx-auto h-24 w-24 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No applications yet
              </h3>
              <p className="mt-2 text-gray-500">
                No candidates have applied for this position yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Candidate Applications
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0">
                        {application.candidate.profilePic ? (
                          <img
                            src={application.candidate.profilePic}
                            alt={application.candidate.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#b3ee6d] to-[#a8e55a] flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {application.candidate.name
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {application.candidate.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {application.candidate.email}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Applied{" "}
                              {formatDate(
                                application.createdAt || application.appliedAt
                              )}
                            </span>
                          </div>
                          {application.status && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="capitalize">
                                {application.status}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {application.resume?.url && (
                        <button
                          onClick={() =>
                            handleDownloadResume(
                              application.resume.url,
                              application.candidate.name
                            )
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#b3ee6d] hover:bg-[#a8e55a] text-sm font-medium text-gray-800 rounded-lg transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Resume
                        </button>
                      )}
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Cover Letter:
                      </h5>
                      <p className="text-sm text-gray-700">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplications;
