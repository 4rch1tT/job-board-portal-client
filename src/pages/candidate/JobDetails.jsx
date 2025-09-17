import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Building2,
  Users,
  Clock,
  Share2,
  Heart,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Bookmark,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api_domain}/api/job/${jobId}`, {
          withCredentials: true,
        });
        setJob(response.data.job);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
        setError("Failed to load job details");
        if (error.response?.status === 404) {
          navigate("/jobs", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, navigate, api_domain]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await axios.get(
          `${api_domain}/api/candidate/profile`,
          { withCredentials: true }
        );
        setUserProfile(profileResponse.data);

        const wishlist = profileResponse.data.wishlist || [];
        setIsInWishlist(
          wishlist.some(
            (item) => (typeof item === "object" ? item._id : item) === jobId
          )
        );

        const applicationsResponse = await axios.get(
          `${api_domain}/api/application/user`,
          { withCredentials: true }
        );
        const applications = applicationsResponse.data.applications || [];
        setHasApplied(
          applications.some(
            (app) =>
              (typeof app.job === "object" ? app.job._id : app.job) === jobId
          )
        );
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [jobId, api_domain]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      "full-time": "bg-blue-100 text-blue-800",
      "part-time": "bg-green-100 text-green-800",
      contract: "bg-orange-100 text-orange-800",
      internship: "bg-purple-100 text-purple-800",
      remote: "bg-indigo-100 text-indigo-800",
    };
    return colors[jobType?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return <div>JobDetails</div>;
};

export default JobDetails;
