import React, { useState, useEffect } from "react";
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
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  MapPin,
  Calendar,
  User,
  Trash2,
  RefreshCw,
  Loader2,
  AlertCircle,
  Tag,
  Shield,
  Globe,
  ExternalLink
} from "lucide-react";
import axios from "axios";
import { jobCategories } from "@/constants/jobEnums";

const CompanyManagement = () => {
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [actionLoading, setActionLoading] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    deleted: 0,
    verified: 0,
  });

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api_domain}/api/admin/companies`, {
        withCredentials: true,
      });

      const companyData = response.data.companies || [];
      setCompanies(companyData);
      setFilteredCompanies(companyData);

      const statsData = {
        total: companyData.length,
        pending: companyData.filter((c) => c.status === "pending").length,
        approved: companyData.filter((c) => c.status === "approved").length,
        rejected: companyData.filter((c) => c.status === "rejected").length,
        deleted: companyData.filter((c) => c.isDeleted).length,
        verified: companyData.filter((c) => c.verified).length,
      };
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = companies;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (company) =>
          company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      if (selectedStatus === "deleted") {
        filtered = filtered.filter((company) => company.isDeleted);
      } else {
        filtered = filtered.filter(
          (company) => company.status === selectedStatus && !company.isDeleted
        );
      }
    }

    if (selectedIndustry !== "all") {
      filtered = filtered.filter(
        (company) => company.industry === selectedIndustry
      );
    }

    if (activeTab !== "all") {
      if (activeTab === "deleted") {
        filtered = filtered.filter((company) => company.isDeleted);
      } else {
        filtered = filtered.filter(
          (company) => company.status === activeTab && !company.isDeleted
        );
      }
    }

    setFilteredCompanies(filtered);
  }, [companies, searchQuery, selectedStatus, selectedIndustry, activeTab]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCompanyAction = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [id]: action }));
    setError(null);

    try {
      await axios.put(
        `${api_domain}/api/company/${id}/${action}`,
        {},
        { withCredentials: true }
      );

      await fetchCompanies();
    } catch (error) {
      console.error(`Error ${action}ing job:`, error);
      setError(`Failed to ${action} job`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleVerifyAndDelete = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [id]: action }));
    setError(null);

    try {
      await axios.patch(
        `${api_domain}/api/admin/companies/${id}/${action}`,
        {},
        { withCredentials: true }
      );

      await fetchCompanies();
    } catch (error) {
      console.error(`Error ${action}ing job:`, error);
      setError(`Failed to ${action} job`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const getStatusBadge = (company) => {
    if (company.isDeleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Deleted
        </span>
      );
    }

    switch (company.status) {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StatsCard = ({
    title,
    value,
    icon: Icon,
    bgColor = "bg-blue-100",
    textColor = "text-blue-600",
  }) => (
    <Card>
      <CardContent className="p-6">
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
          <p className="text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold ">Company Management</h1>
              <p className="text-gray-600">
                Manage all companies on the platform
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={fetchCompanies}>
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
            title="Total Companies"
            value={stats.total}
            icon={Building2}
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
            icon={Shield}
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

        <Card>
          <CardContent>
            <div className="rounded-lg border p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies by name, location, or industry..."
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
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                >
                  <option value="all" className="bg-muted">
                    All Industries
                  </option>
                  {jobCategories.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                      className="bg-muted"
                    >
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
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
              All Companies
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
              <CardTitle>Companies ({filteredCompanies.length})</CardTitle>
              <CardDescription>
                Review and manage company registrations
              </CardDescription>
            </CardHeader>

            <CardContent>
              {filteredCompanies.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 ">
                    No companies found
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery ||
                    selectedStatus !== "all" ||
                    selectedIndustry !== "all"
                      ? "Try adjusting your search or filters"
                      : "No companies have been registered yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company._id}
                      className="flex items-start justify-between p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4 flex-1">
                        <div className="flex-shrink-0">
                          {company.logoUrl?.url ? (
                            <img
                              src={company.logoUrl.url}
                              alt={company.name}
                              className="w-16 h-16 rounded-lg object-contain border"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border">
                              <Building2 className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold ">
                                  {company.name}
                                </h3>
                                {getStatusBadge(company)}
                                {company.verified && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Verified
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                {company.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {company.location}
                                  </div>
                                )}
                                {company.industry && (
                                  <div className="flex items-center gap-1">
                                    <Tag className="h-4 w-4" />
                                    {company.industry}
                                  </div>
                                )}
                                {company.website && (
                                  <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                  >
                                    <Globe className="h-4 w-4" />
                                    Website
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Created {formatDate(company.createdAt)}
                                </div>
                                {company.createdBy && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    By {company.createdBy.name}
                                  </div>
                                )}
                                {company.recruiters &&
                                  company.recruiters.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {company.recruiters.length}{" "}
                                      {company.recruiters.length === 1
                                        ? "Recruiter"
                                        : "Recruiters"}
                                    </div>
                                  )}
                              </div>

                              {company.description && (
                                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                  {company.description}
                                </p>
                              )}

                              {company.verified && company.verifiedAt && (
                                <div className="text-xs text-gray-500">
                                  Verified on {formatDate(company.verifiedAt)}
                                  {company.verifiedBy &&
                                    ` by ${company.verifiedBy.name}`}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!company.isDeleted && company.status === "pending" && (
                          <>
                            <Button
                              onClick={() =>
                                handleCompanyAction(company._id, "approve")
                              }
                              disabled={actionLoading[company._id]}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {actionLoading[company._id] === "approve" ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              )}
                              Approve
                            </Button>
                            <Button
                              onClick={() =>
                                handleCompanyAction(company._id, "reject")
                              }
                              disabled={actionLoading[company._id]}
                              variant="destructive"
                            >
                              {actionLoading[company._id] === "reject" ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-1" />
                              )}
                              Reject
                            </Button>
                          </>
                        )}

                        {!company.isDeleted &&
                          company.status === "approved" &&
                          !company.verified && (
                            <Button
                              onClick={() =>
                                handleVerifyAndDelete(company._id, "verify")
                              }
                              disabled={actionLoading[company._id]}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              {actionLoading[company._id] === "verify" ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <Shield className="h-4 w-4 mr-1" />
                              )}
                              Verify
                            </Button>
                          )}

                        {!company.isDeleted && (
                          <Button
                            onClick={() =>
                              handleVerifyAndDelete(company._id, "soft-delete")
                            }
                            disabled={actionLoading[company._id]}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {actionLoading[company._id] === "soft-delete" ? (
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

export default CompanyManagement;
