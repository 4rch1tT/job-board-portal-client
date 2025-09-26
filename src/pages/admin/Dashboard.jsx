import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Users,
  Building2,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Eye,
  UserCheck,
  Settings,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import axios from "axios";
import JobReviewModal from "@/components/JobReviewModal";

const Dashboard = () => {
  const api_domain = import.meta.env.VITE_API_DOMAIN;
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    pendingCompanies: 0,
    pendingJobs: 0,
    verifiedCompanies: 0,
    verifiedJobs: 0,
    deletedJobs: 0,
    rejectedJobs: 0,
    activeJobs: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const fetchStats = async () => {
    try {
      const usersResponse = await axios.get(`${api_domain}/api/admin/`, {
        withCredentials: true,
      });
      const totalUsers = usersResponse.data.count || 0;

      const companiesResponse = await axios.get(
        `${api_domain}/api/admin/companies`,
        { withCredentials: true }
      );
      const companies = companiesResponse.data.companies;
      const totalCompanies = companies.length;
      const verifiedCompanies = companies.filter((c) => c.verified).length;
      const pendingCompanies = companies.filter(
        (c) => c.status === "pending"
      ).length;

      const jobStatsResponse = await axios.get(
        `${api_domain}/api/job/admin/stats`,
        {
          withCredentials: true,
        }
      );
      const jobStats = jobStatsResponse.data.stats;

      const allJobsResponse = await axios.get(
        `${api_domain}/api/job/admin/all?includeDeleted=true&limit=1000`,
        {
          withCredentials: true,
        }
      );
      const jobs = allJobsResponse.data.jobs || [];
      setAllJobs(jobs);

      const recentActivityResponse = await axios.get(
        `${api_domain}/api/admin/recent-activity`,
        { withCredentials: true }
      );
      const recentActivities = recentActivityResponse.data.activities || [];
      setRecentActivity(recentActivities);

      setStats({
        totalUsers,
        totalCompanies,
        totalJobs: jobStats.totalJobs,
        pendingCompanies,
        pendingJobs: jobStats.pendingJobs,
        verifiedCompanies,
        verifiedJobs: jobStats.verifiedJobs,
        deletedJobs: jobStats.deletedJobs,
        rejectedJobs: jobStats.rejectedJobs,
        activeJobs: jobStats.activeJobs,
      });

      const pending = [
        ...companies
          .filter((c) => c.status === "pending")
          .map((c) => ({
            id: c._id,
            type: "company",
            name: c.name || c.displayName,
            submitted: c.createdAt,
            status: c.status,
          })),
        ...jobs
          .filter((j) => j.status === "pending" || (!j.isVerified && !j.status))
          .map((j) => ({
            id: j._id,
            type: "job",
            title: j.title,
            company: j.company?.name,
            submitted: j.createdAt,
            status: j.status || "pending",
          })),
      ];

      setPendingApprovals(pending);
    } catch (error) {
      setError("Failed to load dashboard data");
      console.error("Stats fetch error:", error);
    }
  };

  const handleJobAction = async (jobId, action) => {
    try {
      await axios.put(
        `${api_domain}/api/job/admin/${jobId}/verify`,
        { action },
        { withCredentials: true }
      );

      await fetchStats();

      // Show success message
      console.log(`Job ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing job:`, error);
      setError(`Failed to ${action} job`);
    }
  };

  const openJobReviewModal = (jobId) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const closeJobReviewModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };

  const handleModalJobAction = async (jobId, action) => {
    await fetchStats();
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        await fetchStats();
      } catch (error) {
        console.log(error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4" />;
      case "company":
        return <Building2 className="h-4 w-4" />;
      case "job":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case "registered":
        return "bg-blue-500";
      case "submitted":
        return "bg-yellow-500";
      case "posted":
        return "bg-green-500";
      case "approved":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    loading,
    variant = "default",
  }) => (
    <Card
      className={
        variant === "warning"
          ? "border-yellow-300"
          : variant === "danger"
          ? "border-red-300"
          : ""
      }
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-500">Loading...</span>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value?.toLocaleString()}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  const getJobStatusBadge = (job) => {
    if (job.isDeleted) {
      return <Badge variant="destructive">Deleted</Badge>;
    }
    if (job.status === "rejected") {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    if (job.isVerified) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Verified
        </Badge>
      );
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#b3ee6d]" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage users, companies, and job listings
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            description="Candidates & Recruiters"
            loading={loading}
          />
          <StatCard
            title="Total Companies"
            value={stats.totalCompanies}
            icon={Building2}
            description={`${stats.verifiedCompanies} verified`}
            loading={loading}
          />
          <StatCard
            title="All Jobs"
            value={stats.totalJobs}
            icon={Briefcase}
            description={`${stats.activeJobs} active, ${stats.deletedJobs} deleted`}
            loading={loading}
          />
          <StatCard
            title="Pending Reviews"
            value={stats.pendingCompanies + stats.pendingJobs}
            icon={Clock}
            description={`${stats.pendingCompanies} companies, ${stats.pendingJobs} jobs`}
            loading={loading}
            variant={
              stats.pendingCompanies + stats.pendingJobs > 20
                ? "warning"
                : "default"
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Verified Jobs"
            value={stats.verifiedJobs}
            icon={CheckCircle}
            description="Currently active"
            loading={loading}
          />
          <StatCard
            title="Rejected Jobs"
            value={stats.rejectedJobs}
            icon={XCircle}
            description="Not approved"
            loading={loading}
            variant="danger"
          />
          <StatCard
            title="Deleted Jobs"
            value={stats.deletedJobs}
            icon={Trash2}
            description="Soft deleted"
            loading={loading}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">
              All Jobs
              <Badge variant="secondary" className="ml-2">
                {stats.totalJobs}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approvals">
              Pending Approvals
              {stats.pendingCompanies + stats.pendingJobs > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {stats.pendingCompanies + stats.pendingJobs}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="mr-2 h-4 w-4" />
                    Manage Companies
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Manage Jobs
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>System status overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Companies Verified
                    </span>
                    <div className="flex items-center">
                      <Badge
                        variant="success"
                        className="bg-green-100 text-green-800"
                      >
                        {stats.totalCompanies > 0
                          ? Math.round(
                              (stats.verifiedCompanies / stats.totalCompanies) *
                                100
                            )
                          : 0}
                        %
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Jobs Verified</span>
                    <div className="flex items-center">
                      <Badge
                        variant="success"
                        className="bg-green-100 text-green-800"
                      >
                        {stats.totalJobs > 0
                          ? Math.round(
                              (stats.verifiedJobs / stats.totalJobs) * 100
                            )
                          : 0}
                        %
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Jobs Active</span>
                    <div className="flex items-center">
                      <Badge
                        variant="success"
                        className="bg-blue-100 text-blue-800"
                      >
                        {stats.totalJobs > 0
                          ? Math.round(
                              (stats.activeJobs / stats.totalJobs) * 100
                            )
                          : 0}
                        %
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pending Reviews</span>
                    <div className="flex items-center">
                      <Badge
                        variant={
                          stats.pendingCompanies + stats.pendingJobs > 20
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {stats.pendingCompanies + stats.pendingJobs} items
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>All Jobs</CardTitle>
                <CardDescription>
                  Complete list of all jobs in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allJobs.map((job) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Briefcase className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-gray-500">
                            {job.company?.name} • {job.location} • {job.jobType}
                          </p>
                          <p className="text-xs text-gray-400">
                            Posted:{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                            {job.applicantCount !== undefined && (
                              <span> • {job.applicantCount} applications</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getJobStatusBadge(job)}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openJobReviewModal(job._id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {!job.isVerified &&
                          !job.isDeleted &&
                          job.status !== "rejected" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() =>
                                  handleJobAction(job._id, "approve")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleJobAction(job._id, "reject")
                                }
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                      </div>
                    </div>
                  ))}
                  {allJobs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No jobs found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Items requiring your review</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApprovals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No pending approvals
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApprovals.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {item.type === "company" ? (
                            <Building2 className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Briefcase className="h-5 w-5 text-green-500" />
                          )}
                          <div>
                            <p className="font-medium">
                              {item.type === "company" ? item.name : item.title}
                            </p>
                            {item.company && (
                              <p className="text-sm text-gray-500">
                                {item.company}
                              </p>
                            )}
                            <p className="text-xs text-gray-400">
                              Submitted:{" "}
                              {new Date(item.submitted).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (item.type === "job") {
                                openJobReviewModal(item.id);
                              }
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            view
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              if (item.type === "job") {
                                handleJobAction(item.id, "approve");
                              }
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (item.type === "job") {
                                handleJobAction(item.id, "reject");
                              }
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No recent activity
                    </div>
                  ) : (
                    recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4"
                      >
                        <div
                          className={`p-2 rounded-full ${getActivityColor(
                            activity.action
                          )}`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">
                            {activity.type === "user" &&
                              `User ${activity.action}`}
                            {activity.type === "company" &&
                              `Company ${activity.action}`}
                            {activity.type === "job" &&
                              `Job ${activity.action}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.name}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <JobReviewModal
          isOpen={isModalOpen}
          onClose={closeJobReviewModal}
          jobId={selectedJobId}
          onJobAction={handleModalJobAction}
        />
      </div>
    </div>
  );
};

export default Dashboard;
