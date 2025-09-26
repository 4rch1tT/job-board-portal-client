import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  MapPin,
  Building2,
  FileText,
  ExternalLink,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";

const MyApplications = () => {
  const navigate = useNavigate();
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api_domain}/api/application/user`, {
          withCredentials: true,
        });

        setApplications(response.data.applications || []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        setError("Failed to load applications");
        toast.error("Failed to load applications");

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [api_domain, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewing: "bg-blue-100 text-blue-800",
      shortlisted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      accepted: "bg-emerald-100 text-emerald-800",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "reviewing":
        return <AlertCircle className="h-4 w-4" />;
      case "shortlisted":
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Salary not disclosed";
    const { min, max, currency = "₹" } = salary;
    if (min && max) {
      return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
    }
    if (min) return `${currency}${min.toLocaleString()}+`;
    if (max) return `Up to ${currency}${max.toLocaleString()}`;
    return "Salary not disclosed";
  };

  const handleViewJob = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b3ee6d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className=" border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold  flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#b3ee6d]" />
              My Applications
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="text-center py-16">
            <XCircle className="mx-auto h-24 w-24 text-red-300" />
            <h3 className="mt-4 text-xl font-semibold ">
              Error Loading Applications
            </h3>
            <p className="mt-2 text-gray-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {!error && applications.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="mx-auto h-24 w-24 text-gray-300" />
            <h3 className="mt-4 text-xl font-semibold ">
              No Applications Yet
            </h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              You haven't applied to any jobs yet. Start exploring opportunities
              and apply to jobs that interest you.
            </p>
            <Button onClick={() => navigate("/jobs")} className="mt-6">
              Browse Jobs
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {applications.length} application
                {applications.length !== 1 ? "s" : ""}
              </p>
            </div>

            {applications.map((application) => {
              const job = application.job;
              if (!job) return null;

              return (
                <Card
                  key={application._id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewJob(job._id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={job.company?.logoUrl}
                            alt={job.company?.name || "Company"}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-[#b3ee6d] to-[#b3ee5d] text-white font-semibold">
                            {(job.company?.name || job.company || "C")
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold mb-1">
                            {job.title}
                          </CardTitle>
                          <div className="flex items-center text-sm text-gray-600">
                            <Building2 className="h-3 w-3 mr-1" />
                            <span>{job.company?.name || job.company}</span>
                          </div>
                        </div>
                      </div>

                      <Badge
                        className={`${getStatusColor(
                          application.status
                        )} flex items-center gap-1`}
                      >
                        {getStatusIcon(application.status)}
                        {application.status || "Pending"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                      </div>

                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span className="capitalize">{job.jobType}</span>
                      </div>

                      <div className="flex items-center">
                        <span>{formatSalary(job.salary)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Applied on:</span>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">
                            {formatDate(
                              application.appliedAt || application.createdAt
                            )}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-500">Resume:</span>
                        <div className="mt-1">
                          {application.resume?.fileName ? (
                            <a
                              href={application.resume.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center text-[#427703] hover:text-[#b3ee5d]"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              {application.resume.fileName}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          ) : (
                            <span className="text-gray-400">
                              No resume attached
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {application.coverLetter && (
                      <div className="border-t pt-4">
                        <span className="text-gray-500 text-sm">
                          Cover Letter:
                        </span>
                        <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded-md">
                          {application.coverLetter.length > 200
                            ? `${application.coverLetter.substring(0, 200)}...`
                            : application.coverLetter}
                        </p>
                      </div>
                    )}

                    <div className="border-t pt-4 flex justify-end">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewJob(job._id);
                        }}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Job Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
