import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Trash2,
  RefreshCw,
  Loader2,
  AlertCircle,
  Tag,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

const JobManagement = () => {
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [actionLoading, setActionLoading] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    deleted: 0,
    verified: 0,
  });

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api_domain}/api/job/admin/all`, {
        withCredentials: true,
      });

      const jobsData = response.data.jobs || [];
      setJobs(jobsData);
      setFilteredJobs(jobsData);

      const statsData = {
        total: jobsData.length,
        pending: jobsData.filter((j) => j.status === "pending").length,
        approved: jobsData.filter((j) => j.status === "approved").length,
        rejected: jobsData.filter((j) => j.status === "rejected").length,
        deleted: jobsData.filter((j) => j.isDeleted).length,
        verified: jobsData.filter((j) => j.isVerified).length,
      };
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = jobs;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      if (selectedStatus === "deleted") {
        filtered = filtered.filter((job) => job.isDeleted);
      } else {
        filtered = filtered.filter(
          (job) => job.status === selectedStatus && !job.isDeleted
        );
      }
    }

    if (selectedJobType !== "all") {
      filtered = filtered.filter((job) => job.jobType === selectedJobType);
    }

    if (activeTab !== "all") {
      if (activeTab === "deleted") {
        filtered = filtered.filter((job) => job.isDeleted);
      } else {
        filtered = filtered.filter(
          (job) => job.status === activeTab && !job.isDeleted
        );
      }
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, selectedStatus, selectedJobType, activeTab]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobAction = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [id]: action }));
    setError(null);

    try {
      await axios.put(
        `${api_domain}/api/job/admin/${id}/verify`,
        { action },
        { withCredentials: true }
      );

      await fetchJobs();
    } catch (error) {
      console.error(`Error ${action}ing job:`, error);
      setError(`Failed to ${action} job`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleDeleteJob = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [id]: action }));
    setError(null);

    try {
      await axios.put(
        `${api_domain}/api/job/${id}/${action}`,
        {},
        { withCredentials: true }
      );

      await fetchJobs();
    } catch (error) {
      console.error("Error deleting job", error);
      setError("Failed to delete job");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const getStatusBadge = (job) => {
    if (job.isDeleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Deleted
        </span>
      );
    }

    switch (job.status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const getJobTypeBadge = (jobType) => {
    const colors = {
      "full-time": "bg-blue-100 text-blue-800",
      "part-time": "bg-purple-100 text-purple-800",
      contract: "bg-orange-100 text-orange-800",
      internship: "bg-green-100 text-green-800",
      freelance: "bg-pink-100 text-pink-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[jobType] || "bg-gray-100 text-gray-800"
        }`}
      >
        {jobType?.charAt(0).toUpperCase() + jobType?.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Not specified";

    const formatAmount = (amount) => {
      if (amount >= 100000) {
        return `${(amount / 100000).toFixed(1)}L`;
      }
      if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`;
      }
      return amount.toString();
    };

    const currency = salary.currency || "INR";

    if (salary.min && salary.max) {
      return `${currency} ${formatAmount(salary.min)} - ${formatAmount(
        salary.max
      )}`;
    }
    if (salary.min) {
      return `${currency} ${formatAmount(salary.min)}+`;
    }
    if (salary.max) {
      return `Up to ${currency} ${formatAmount(salary.max)}`;
    }

    return "Not specified";
  };

  const StatsCard = ({
    title,
    value,
    icon: Icon,
    bgColor = "bg-blue-100",
    textColor = "text-blue-600",
  }) => (
    <Card>
      <CardContent className=" p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value?.toLocaleString()}</p>
          </div>
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`h-6 w-6 ${textColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#b3ee6d]" />
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold ">Job Management</h1>
              <p className="text-gray-600">
                Manage all job listings on the platform
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={fetchJobs}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <StatsCard
            title="Total Jobs"
            value={stats.total}
            icon={Briefcase}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            bgColor="bg-yellow-100"
            textColor="text-yellow-600"
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle}
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            bgColor="bg-red-100"
            textColor="text-red-600"
          />
          <StatsCard
            title="Verified"
            value={stats.verified}
            icon={TrendingUp}
            bgColor="bg-purple-100"
            textColor="text-purple-600"
          />
          <StatsCard
            title="Deleted"
            value={stats.deleted}
            icon={Trash2}
            bgColor="bg-gray-100"
            textColor="text-gray-600"
          />
        </div>

        <Card className="mb-6">
          <CardContent className=" p-6 ">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all" className="bg-muted">
                  All Status
                </option>
                <option value="pending" className="bg-muted">
                  Pending
                </option>
                <option value="approved" className="bg-muted">
                  Approved
                </option>
                <option value="rejected" className="bg-muted">
                  Rejected
                </option>
                <option value="deleted" className="bg-muted">
                  Deleted
                </option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
              >
                <option value="all" className="bg-muted">
                  All Job Types
                </option>
                <option value="full-time" className="bg-muted">
                  Full Time
                </option>
                <option value="part-time" className="bg-muted">
                  Part Time
                </option>
                <option value="contract" className="bg-muted">
                  Contract
                </option>
                <option value="internship" className="bg-muted">
                  Internship
                </option>
                <option value="freelance" className="bg-muted">
                  Freelance
                </option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All Jobs
              <Badge variant="secondary" className="ml-2">
                {stats.total}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-2">
                {stats.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              <Badge variant="secondary" className="ml-2">
                {stats.approved}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              <Badge variant="secondary" className="ml-2">
                {stats.rejected}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="deleted">
              Deleted
              <Badge variant="secondary" className="ml-2">
                {stats.deleted}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <Card>
            <CardHeader>
              <CardTitle>Jobs ({filteredJobs.length})</CardTitle>
              <CardDescription>
                Review and manage job listings, approve or reject applications
              </CardDescription>
            </CardHeader>

            <CardContent>
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                  <p className="text-gray-500">
                    {searchQuery ||
                    selectedStatus !== "all" ||
                    selectedJobType !== "all"
                      ? "Try adjusting your search or filters"
                      : "No jobs have been posted yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job._id}
                      className="flex items-start justify-between p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">
                                {job.title}
                              </h3>
                              {getStatusBadge(job)}
                              {getJobTypeBadge(job.jobType)}
                              {job.isVerified && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {job.company?.name || "Unknown Company"}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                {formatSalary(job.salary)}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Posted {formatDate(job.createdAt)}
                              </div>
                              {job.deadline && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Deadline {formatDate(job.deadline)}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                By {job.postedBy?.name || "Unknown"}
                              </div>
                              {job.category && (
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {job.category}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {job.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {job.description}
                          </p>
                        )}

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {job.skills.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 5 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
                                +{job.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!job.isDeleted && job.status === "pending" && (
                          <>
                            <Button
                              onClick={() =>
                                handleJobAction(job._id, "approve")
                              }
                              disabled={actionLoading[job._id]}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {actionLoading[job._id] === "approve" ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleJobAction(job._id, "reject")}
                              disabled={actionLoading[job._id]}
                            >
                              {actionLoading[job._id] === "reject" ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              Reject
                            </Button>
                          </>
                        )}

                        {!job.isDeleted && (
                          <Button
                            onClick={() =>
                              handleDeleteJob(job._id, "soft-delete")
                            }
                            disabled={actionLoading[job._id]}
                          >
                            {actionLoading[job._id] === "soft-delete" ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Trash2 className="h-4 w-4 mr-1" />
                            )}
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default JobManagement;
