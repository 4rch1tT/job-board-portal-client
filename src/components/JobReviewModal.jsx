import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  AlertCircle,
  Loader2,
  User,
  Briefcase,
  X,
} from "lucide-react";
import axios from "axios";

const JobReviewModal = ({ isOpen, onClose, jobId, onJobAction }) => {
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobDetails();
    }
  }, [isOpen, jobId]);

  useEffect(() => {
    if (!isOpen) {
      setJob(null);
      setError(null);
    }
  }, [isOpen]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${api_domain}/api/job/${jobId}`, {
        withCredentials: true,
      });
      setJob(response.data.job);
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (action) => {
    setActionLoading(true);
    setError(null);

    try {
      await axios.put(
        `${api_domain}/api/job/admin/${jobId}/verify`,
        {
          action,
        },
        { withCredentials: true }
      );

      if (onJobAction) {
        onJobAction(jobId, action);
      }

      onClose();
    } catch (error) {
      console.error(`Error ${action}ing job:`, error);
      setError(`Failed to ${action} job. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const getJobStatusBadge = (job) => {
    if (!job) return null;

    if (job.isDeleted) {
      return <Badge variant="destructive">Deleted</Badge>;
    }
    if (job.status === "rejected") {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    if (job.isVerified) {
      return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";

    const formatNumber = (num) => {
      return new Intl.NumberFormat("en-US").format(num);
    };

    if (salary.min && salary.max) {
      return `INR${formatNumber(salary.min)} - INR${formatNumber(salary.max)}`;
    } else if (salary.min) {
      return `INR${formatNumber(salary.min)}+`;
    } else {
      return "Not specified";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-muted rounded-lg shadow-xl max-w-4xl w-full max-h-[100vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Review
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Review job details and approve or reject the listing
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#b3ee6d]" />
              <span className="ml-3">Loading job details...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-500">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          ) : job ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{job.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {job.company?.name || "Unknown Company"}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.jobType}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getJobStatusBadge(job)}
                  <span className="text-sm text-gray-400">
                    Posted: {formatDate(job.createdAt)}
                  </span>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Salary
                    </h3>
                    <p className="text-gray-500">{formatSalary(job.salary)}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Posted By
                    </h3>
                    <div className="flex items-center gap-2">
                      {job.postedBy?.profilePic && (
                        <img
                          src={job.postedBy.profilePic}
                          alt={job.postedBy.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-gray-500">
                          {job.postedBy?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {job.postedBy?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {job.category && (
                    <div>
                      <h3 className="font-semibold mb-2">Category</h3>
                      <Badge variant="outline">{job.category}</Badge>
                    </div>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Skills Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {job.company && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Company Details
                      </h3>
                      <div className="flex items-center gap-2">
                        {job.company.logoUrl && (
                          <img
                            src={job.company.logoUrl.url}
                            alt={job.company.name}
                            className="w-10 h-10 rounded-lg object-contain"
                          />
                        )}
                        <div>
                          <p className="text-gray-500 font-medium">
                            {job.company.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {job.company.verified
                              ? "Verified Company"
                              : "Unverified Company"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold  mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Timeline
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        Posted: {formatDate(job.createdAt)}
                      </p>
                      {job.updatedAt && job.updatedAt !== job.createdAt && (
                        <p className="text-gray-600">
                          Updated: {formatDate(job.updatedAt)}
                        </p>
                      )}
                      {job.verifiedAt && (
                        <p className="text-gray-600">
                          {job.isVerified ? "Verified" : "Reviewed"}:{" "}
                          {formatDate(job.verifiedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h3 className="font-semibold  mb-3">Job Description</h3>
                <div className=" p-4 rounded-lg">
                  <p className="text-gray-500 whitespace-pre-wrap leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </div>

              {job.requirements && (
                <div>
                  <h3 className="font-semibold mb-3">Requirements</h3>
                  <div className=" p-4 rounded-lg">
                    <p className="text-gray-500 whitespace-pre-wrap leading-relaxed">
                      {job.requirements}
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="border-t p-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {job && !job.isDeleted && (
              <div className="flex gap-2">
                {!job.isVerified && job.status !== "rejected" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => handleJobAction("reject")}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleJobAction("approve")}
                      disabled={actionLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                  </>
                )}

                {job.isVerified && (
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">
                    Already Approved
                  </Badge>
                )}

                {job.status === "rejected" && (
                  <Badge variant="destructive" className="px-3 py-1">
                    Already Rejected
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobReviewModal;
