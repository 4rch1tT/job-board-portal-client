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
  Users,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  UserCheck,
  Mail,
  Calendar,
  Briefcase,
  Building2,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  UserX,
  Shield,
  Download,
  RefreshCw,
  Plus,
} from "lucide-react";
import axios from "axios";

const UserManagement = () => {
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [actionLoading, setActionLoading] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    candidates: 0,
    recruiters: 0,
    admins: 0,
    active: 0,
    suspended: 0,
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api_domain}/api/admin/`, {
        withCredentials: true,
      });

      const usersData = response.data.users || [];
      setUsers(usersData);
      setFilteredUsers(usersData);

      const statsData = {
        total: usersData.length,
        candidates: usersData.filter((u) => u.role === "candidate").length,
        recruiters: usersData.filter((u) => u.role === "recruiter").length,
        admins: usersData.filter((u) => u.role === "admin").length,
        active: usersData.filter((u) => !u.isDeleted).length,
      };
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = users;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    if (selectedStatus !== "all") {
      if (selectedStatus === "active") {
        filtered = filtered.filter(
          (user) => !user.isSuspended && !user.isDeleted
        );
      } else if (selectedStatus === "suspended") {
        filtered = filtered.filter((user) => user.isSuspended);
      } else if (selectedStatus === "deleted") {
        filtered = filtered.filter((user) => user.isDeleted);
      }
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((user) => user.role === activeTab);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, selectedRole, selectedStatus, activeTab]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAction = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [id]: action }));
    setError(null);

    try {
      await axios.put(
        `${api_domain}/api/admin/${id}/${action}`,
        {},
        { withCredentials: true }
      );

      await fetchUsers();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      setError(`Failed to ${action} user`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const getUserStatusBadge = (user) => {
    if (user.isDeleted) {
      return <Badge variant="destructive">Deleted</Badge>;
    }
    if (user.isSuspended) {
      return <Badge variant="destructive">Suspended</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { variant: "default", className: "bg-purple-100 text-purple-800" },
      recruiter: { variant: "default", className: "bg-blue-100 text-blue-800" },
      candidate: {
        variant: "secondary",
        className: "bg-gray-100 text-gray-800",
      },
    };

    const config = roleConfig[role] || roleConfig.candidate;
    return (
      <Badge variant={config.variant} className={config.className}>
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </Badge>
    );
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
      <div className="min-h-screen  p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#b3ee6d]" />
          <p className="text-gray-600">Loading users...</p>
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
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-gray-600">Manage all platform users</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={fetchUsers}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.total}
            icon={Users}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <StatsCard
            title="Candidates"
            value={stats.candidates}
            icon={UserCheck}
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          <StatsCard
            title="Recruiters"
            value={stats.recruiters}
            icon={Briefcase}
            bgColor="bg-purple-100"
            textColor="text-purple-600"
          />
          <StatsCard
            title="Admins"
            value={stats.admins}
            icon={Shield}
            bgColor="bg-red-100"
            textColor="text-red-600"
          />
          <StatsCard
            title="Active"
            value={stats.active}
            icon={CheckCircle}
            bgColor="bg-emerald-100"
            textColor="text-emerald-600"
          />
          <StatsCard
            title="Suspended"
            value={stats.suspended}
            icon={UserX}
            bgColor="bg-orange-100"
            textColor="text-orange-600"
          />
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="candidate">Candidates</option>
                <option value="recruiter">Recruiters</option>
                <option value="admin">Admins</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All Users
              <Badge variant="secondary" className="ml-2">
                {stats.total}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="candidate">
              Candidates
              <Badge variant="secondary" className="ml-2">
                {stats.candidates}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="recruiter">
              Recruiters
              <Badge variant="secondary" className="ml-2">
                {stats.recruiters}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="admin">
              Admins
              <Badge variant="secondary" className="ml-2">
                {stats.admins}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No users found</h3>
                  <p className="text-gray-500">
                    {searchQuery ||
                    selectedRole !== "all" ||
                    selectedStatus !== "all"
                      ? "Try adjusting your search or filters"
                      : "No users have been created yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                          {!user.isSuspended && !user.isDeleted && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold ">{user.name}</h4>
                            {getRoleBadge(user.role)}
                            {getUserStatusBadge(user)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {formatDate(user.createdAt)}
                            </div>
                            {user.company && (
                              <div className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {user.company.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!user.isDeleted &&
                          !user.isSuspended &&
                          user.role !== "admin" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleUserAction(user._id, "suspend")
                              }
                              disabled={actionLoading[user._id]}
                            >
                              {actionLoading[user._id] === "suspend" ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <Ban className="h-4 w-4 mr-1" />
                              )}
                              Suspend
                            </Button>
                          )}

                        {user.isSuspended && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleUserAction(user._id, "unsuspend")
                            }
                            disabled={actionLoading[user._id]}
                          >
                            {actionLoading[user._id] === "unsuspend" ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            Reactivate
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

export default UserManagement;
