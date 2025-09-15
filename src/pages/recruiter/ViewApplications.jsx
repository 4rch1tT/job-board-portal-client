import React, { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ViewApplications = () => {
  const api_domain = import.meta.env.VITE_API_DOMAIN;
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplications = async (jobId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${api_domain}/application/job/${jobId}`
      );
      setApplications(response.data);
    } catch (error) {
      console.log("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect((jobId) => {
    if (jobId) fetchApplications();
    else navigate("/recruiter/manage-jobs");
  }, []);

  return (
    <>
      {!loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b3ee6d] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <button
                onClick={() => navigate("recruiter/manage-jobs")}
                className="group flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-[#b3ee6d] hover:to-[#b3ee5d] border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Back</span>
              </button>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                Applications Overview
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 pb-8">
          {applications.length === 0 ? (
            <div className="text-center py-16">
              <Users className="mx-auto h-24 w-24 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No applications available
              </h3>
              <p className="mt-2 text-gray-500">
                No applications found at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {applications.map(({ job, applications }) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold ">{job.title}</h2>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span className="text-sm">{job.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{job.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                        <span className="text-sm font-medium">
                          {applications.length} Application
                          {applications.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div
                          key={application._id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              {application.candidate.profilePic ? (
                                <img
                                  src={application.candidate.profilePic}
                                  alt={application.candidate.name}
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-[#b3ee6d] font-semibold">
                                    {applications.candidate.name[0]}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {application.candidate.name}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {application.candidate.email}
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                                <Calendar className="h-3 w-3" />
                                <span>Applied {application.createdAt}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-4 md:m-0">
                            <button className="inline-flex items-center gap-2 px-3 py-2 bg-[#b3ee6d] text-sm font-medium rounded-lg hover:bg-[#b3ee5d] transition-colors">
                              <Download className="h-4 w-4" />
                              Resume
                            </button>
                            
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewApplications;
